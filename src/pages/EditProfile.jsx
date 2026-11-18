import { useEffect, useState } from "react";

import { auth, db } from "../firebase";
import { uploadProfilePhotoToCloudinary } from "../services/cloudinaryUpload";

import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function isPlaceholderName(value) {
  if (typeof value !== "string") {
    return true;
  }

  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return [
    "inclura user",
    "inclura member",
    "user",
    "member",
    "friend",
  ].includes(normalized);
}

function getValidName(value) {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    isPlaceholderName(value)
  ) {
    return "";
  }

  return value.trim();
}

async function recoverNameFromPosts(userId) {
  try {
    if (!userId) {
      return "";
    }

    const postsQuery = query(
      collection(db, "posts"),
      where("userId", "==", userId)
    );

    const postsSnapshot = await getDocs(postsQuery);

    let recoveredName = "";
    let latestTimestamp = -Infinity;

    postsSnapshot.forEach((postDoc) => {
      const post = postDoc.data();
      const postName = getValidName(post?.userName);

      if (!postName) {
        return;
      }

      let timestamp = 0;

      if (
        post?.createdAt &&
        typeof post.createdAt.toMillis === "function"
      ) {
        timestamp = post.createdAt.toMillis();
      } else if (post?.createdAt instanceof Date) {
        timestamp = post.createdAt.getTime();
      }

      if (!recoveredName || timestamp >= latestTimestamp) {
        recoveredName = postName;
        latestTimestamp = timestamp;
      }
    });

    return recoveredName;
  } catch (error) {
    console.warn(
      "Unable to recover profile name from posts:",
      error
    );

    return "";
  }
}

function EditProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [photoURL, setPhotoURL] = useState("");
  const [accessibilityNeeds, setAccessibilityNeeds] = useState([]);
  const [accessibilityNeedsPublic, setAccessibilityNeedsPublic] =
    useState(false);
  const [accountType, setAccountType] = useState("");
  const [verified, setVerified] = useState(false);

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    async function loadProfile() {
      setProfileLoading(true);
      setProfileError("");

      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          if (isCurrent) {
            setProfileError(t("epLoginRequired"));
          }
          return;
        }

        const profileRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(profileRef);

        if (!isCurrent) {
          return;
        }

        const data = snap.exists() ? snap.data() || {} : {};
        setAccountType(typeof data.accountType === "string" ? data.accountType : "");
        setVerified(data.verified === true);

        let resolvedName = getValidName(data.fullName);

        if (!resolvedName) {
          resolvedName = await recoverNameFromPosts(currentUser.uid);
        }

        if (!isCurrent) {
          return;
        }

        if (!resolvedName) {
          resolvedName = getValidName(currentUser.displayName);
        }

        if (!resolvedName) {
          const email = currentUser.email || data.email || "";
          resolvedName = email ? email.split("@")[0].trim() : "";
        }

        setFullName(resolvedName);
        setLocation(
          typeof data.location === "string" ? data.location : ""
        );
        setPhoneNumber(
          typeof data.phoneNumber === "string" ? data.phoneNumber : ""
        );
        setBio(typeof data.bio === "string" ? data.bio : "");
        setCategory(
          typeof data.category === "string" ? data.category : ""
        );
        setPreferredLanguage(
          typeof data.preferredLanguage === "string"
            ? data.preferredLanguage
            : "en"
        );
        setPhotoURL(
          data.photoURL ||
            data.profilePhoto ||
            currentUser.photoURL ||
            ""
        );
        setAccessibilityNeeds(
          Array.isArray(data.accessibilityNeeds)
            ? data.accessibilityNeeds.filter(
                (need) => typeof need === "string"
              )
            : []
        );
        setAccessibilityNeedsPublic(
          data.accessibilityNeedsPublic === true
        );
      } catch (error) {
        console.error("Load profile error:", error);

        if (isCurrent) {
          setProfileError(
            t("epLoadError")
          );
        }
      } finally {
        if (isCurrent) {
          setProfileLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isCurrent = false;
    };
  }, [reloadKey]);

  async function handlePhotoUpload(event) {
    const file = event.target.files?.[0];

    // Allow the same file to be selected again after an error.
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploadingPhoto(true);

    try {
      const secureUrl = await uploadProfilePhotoToCloudinary(file);
      setPhotoURL(secureUrl);

      alert(
        t("epPhotoUploaded")
      );
    } catch (error) {
      console.error("Profile photo upload failed:", error);
      alert(error.message || t("epPhotoUploadError"));
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSave() {
    if (saving || uploadingPhoto) {
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert(t("epLoginAgain"));
      return;
    }

    const cleanedName = fullName.trim();

    if (!cleanedName || isPlaceholderName(cleanedName)) {
      alert(t("epRealNameRequired"));
      return;
    }

    if (cleanedName.length > 100) {
      alert(t("epNameTooLong"));
      return;
    }

    if (bio.trim().length > 1000) {
      alert(t("epBioTooLong"));
      return;
    }

    setSaving(true);

    try {
      const profileRef = doc(db, "users", currentUser.uid);

      const profileData = {
        fullName: cleanedName,
        location: location.trim(),
        phoneNumber: phoneNumber.trim(),
        bio: bio.trim(),
        category,
        preferredLanguage,
        accessibilityNeeds,
        accessibilityNeedsPublic,
        photoURL,
        profilePhoto: photoURL,
      };

      // Merge preserves existing user fields not edited on this page.
      // Firestore Security Rules must still authorize this write.
      await setDoc(profileRef, profileData, { merge: true });

      // Publish only safe discovery fields for the New Conversation list.
      // Private email, phone number and non-public accessibility needs stay private.
      try {
        await setDoc(doc(db, "memberDirectory", currentUser.uid), {
          uid: currentUser.uid,
          fullName: cleanedName,
          photoURL: photoURL || "",
          location: location.trim(),
          category: typeof category === "string" ? category : "",
          accountType: accountType || "individual",
          bio: bio.trim(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (directoryError) {
        console.warn("Member directory sync failed:", directoryError);
      }

      // Mentor accounts publish only the fields approved for the public directory.
      // Phone number, email and private accessibility preferences are never copied.
      if (accountType === "Mentor") {
        try {
          await setDoc(doc(db, "mentorDirectory", currentUser.uid), {
            uid: currentUser.uid,
            fullName: cleanedName,
            location: location.trim(),
            bio: bio.trim(),
            expertise: category.trim() || "Mentorship and community support",
            photoURL: photoURL || "",
            accessibilityNeeds: accessibilityNeedsPublic ? accessibilityNeeds : [],
            verified,
            updatedAt: serverTimestamp(),
          }, { merge: true });
        } catch (directoryError) {
          // Keep the successful private profile save successful if directory sync is unavailable.
          console.warn("Mentor directory sync failed:", directoryError);
        }
      }

      try {
        await updateProfile(currentUser, {
          displayName: cleanedName,
          photoURL: photoURL || null,
        });
      } catch (authError) {
        // The Firestore save has already succeeded at this point.
        console.warn(
          "Profile saved, but Firebase Auth profile sync failed:",
          authError
        );
      }

      alert(t("epSaved"));

      navigate("/profile");
    } catch (error) {
      console.error("Save profile error:", error);

      alert(
        t("epSaveError")
      );
    } finally {
      setSaving(false);
    }
  }

  function toggleNeed(value) {
    setAccessibilityNeeds((currentNeeds) =>
      currentNeeds.includes(value)
        ? currentNeeds.filter((item) => item !== value)
        : [...currentNeeds, value]
    );
  }

  if (profileLoading) {
    return (
      <div style={pageStyle} role="status" aria-live="polite">
        {t("epLoading")}
      </div>
    );
  }

  if (profileError) {
    return (
      <div style={pageStyle}>
        <div style={panelStyle}>
          <h1>{t("epUnavailable")}</h1>
          <p role="alert">{profileError}</p>

          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            style={buttonStyle}
          >
            {t("retry")}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            style={secondaryButtonStyle}
          >
            {t("back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={panelStyle}>
        <h1>{t("epTitle")}</h1>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          {photoURL ? (
            <img
              src={photoURL}
              alt={t("profile")}
              referrerPolicy="no-referrer"
              style={photoStyle}
            />
          ) : (
            <div
              aria-label={t("epNoPhoto")}
              style={{
                ...photoStyle,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#1e293b",
                color: "white",
                fontSize: "36px",
              }}
            >
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <label
              htmlFor="profile-photo"
              style={{ display: "block", marginTop: "12px" }}
            >
              {t("epChangePhoto")}
            </label>

            <input
              id="profile-photo"
              type="file"
              accept="image/*"
              disabled={uploadingPhoto || saving}
              onChange={handlePhotoUpload}
              style={{ marginTop: "8px", maxWidth: "100%" }}
            />
          </div>

          {uploadingPhoto && (
            <p role="status">{t("epUploadingPhoto")}</p>
          )}
        </div>

        <label htmlFor="full-name">{t("fullName")}</label>
        <input
          id="full-name"
          autoComplete="name"
          maxLength={100}
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          style={inputStyle}
        />

        <label htmlFor="profile-location">{t("epLocation")}</label>
        <input
          id="profile-location"
          autoComplete="address-level2"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          style={inputStyle}
        />

        <label htmlFor="phone-number">{t("epPhone")}</label>
        <input
          id="phone-number"
          type="tel"
          autoComplete="tel"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          style={inputStyle}
        />

        <label htmlFor="profile-bio">{t("epBio")}</label>
        <textarea
          id="profile-bio"
          maxLength={1000}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          style={{ ...inputStyle, height: "120px" }}
        />

        <label htmlFor="profile-category">{t("epCategory")}</label>
        <select
          id="profile-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          style={selectStyle}
        >
          <option value="">{t("epSelectCategory")}</option>
          <option value="Creator">{t("creator")}</option>
          <option value="Caregiver">{t("caregiver")}</option>
          <option value="Employer">{t("employer")}</option>
          <option value="Job Seeker">{t("jobSeeker")}</option>
          <option value="Volunteer">{t("volunteer")}</option>
          <option value="Organization">{t("organization")}</option>
          <option value="Advocate">{t("advocate")}</option>
        </select>

        <label htmlFor="preferred-language">{t("preferredLanguage")}</label>
        <select
          id="preferred-language"
          value={preferredLanguage}
          onChange={(event) =>
            setPreferredLanguage(event.target.value)
          }
          style={selectStyle}
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="pt">Portuguese</option>
          <option value="ar">Arabic</option>
          <option value="sw">Swahili</option>
          <option value="ha">Hausa</option>
          <option value="yo">Yoruba</option>
          <option value="ig">Igbo</option>
        </select>

        <section
          aria-labelledby="accessibility-heading"
          style={{ marginBottom: "20px" }}
        >
          <h2 id="accessibility-heading">{t("epAccessibilityNeeds")}</h2>

          <p>{t("epAccessibilityIntro")}</p>

          {[
            { value: "Visual Impairment", label: t("epVisualImpairment") },
            { value: "Hearing Impairment", label: t("epHearingImpairment") },
            { value: "Mobility Impairment", label: t("epMobilityImpairment") },
            { value: "Speech Impairment", label: t("epSpeechImpairment") },
          ].map((need) => (
            <div key={need.value} style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={accessibilityNeeds.includes(need.value)}
                  onChange={() => toggleNeed(need.value)}
                />{" "}
                {need.label}
              </label>
            </div>
          ))}

          <div
            style={{
              marginTop: "18px",
              padding: "14px",
              border: "1px solid #475569",
              borderRadius: "12px",
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={accessibilityNeedsPublic}
                onChange={(event) =>
                  setAccessibilityNeedsPublic(event.target.checked)
                }
              />{" "}
              {t("epShareNeeds")}
            </label>

            <p style={{ fontSize: "13px", color: "#cbd5e1" }}>
              {t("epShareNeedsDescription")}
            </p>
          </div>
        </section>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || uploadingPhoto}
          style={{
            ...buttonStyle,
            opacity: saving || uploadingPhoto ? 0.65 : 1,
            cursor: saving || uploadingPhoto ? "not-allowed" : "pointer",
          }}
        >
          {saving
            ? t("epSaving")
            : uploadingPhoto
              ? t("epWaitPhoto")
              : t("epSaveChanges")}
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={saving}
          style={secondaryButtonStyle}
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}

const pageStyle = {
  background: "#020617",
  minHeight: "100vh",
  padding: "24px",
  color: "white",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box",
};

const panelStyle = {
  maxWidth: "700px",
  margin: "0 auto",
  background: "#0f172a",
  padding: "30px",
  borderRadius: "24px",
  boxSizing: "border-box",
  overflowWrap: "anywhere",
};

const photoStyle = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "4px solid #38bdf8",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "16px",
  marginTop: "8px",
  marginBottom: "16px",
  borderRadius: "14px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
  boxSizing: "border-box",
};

const selectStyle = {
  ...inputStyle,
  background: "#ffffff",
  color: "#000000",
};

const buttonStyle = {
  display: "block",
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  border: "none",
  background: "#38bdf8",
  color: "#020617",
  fontWeight: "700",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  ...buttonStyle,
  marginTop: "12px",
  background: "#334155",
  color: "white",
};

export default EditProfile;

