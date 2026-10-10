import { useEffect, useState } from "react";

import { auth, db, storage } from "../firebase";

import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

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
            setProfileError("Please log in to edit your profile.");
          }
          return;
        }

        const profileRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(profileRef);

        if (!isCurrent) {
          return;
        }

        const data = snap.exists() ? snap.data() || {} : {};

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
            "Unable to load your profile. Check your connection and Firebase permissions."
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

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      alert("Please choose an image smaller than 5 MB.");
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Please log in again.");
      return;
    }

    setUploadingPhoto(true);

    try {
      const storageRef = ref(
        storage,
        `profilePhotos/${currentUser.uid}`
      );

      await uploadBytes(storageRef, file, {
        contentType: file.type,
      });

      const downloadURL = await getDownloadURL(storageRef);

      setPhotoURL(downloadURL);

      alert(
        "Photo uploaded. Select Save Changes to update your profile."
      );
    } catch (error) {
      console.error("Profile photo upload failed:", error);

      alert(
        "Photo upload failed. Check your internet connection and Firebase Storage permissions."
      );
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
      alert("Please log in again.");
      return;
    }

    const cleanedName = fullName.trim();

    if (!cleanedName || isPlaceholderName(cleanedName)) {
      alert("Please enter your real profile name.");
      return;
    }

    if (cleanedName.length > 100) {
      alert("Your name must be 100 characters or fewer.");
      return;
    }

    if (bio.trim().length > 1000) {
      alert("Your bio must be 1,000 characters or fewer.");
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

      alert("Profile updated successfully.");

      navigate("/profile");
    } catch (error) {
      console.error("Save profile error:", error);

      alert(
        "Profile could not be saved. Check your connection and Firebase Security Rules, then try again."
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
        Loading your profile...
      </div>
    );
  }

  if (profileError) {
    return (
      <div style={pageStyle}>
        <div style={panelStyle}>
          <h1>Profile unavailable</h1>
          <p role="alert">{profileError}</p>

          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            style={buttonStyle}
          >
            Try Again
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            style={secondaryButtonStyle}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={panelStyle}>
        <h1>Edit Profile</h1>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          {photoURL ? (
            <img
              src={photoURL}
              alt="Profile"
              referrerPolicy="no-referrer"
              style={photoStyle}
            />
          ) : (
            <div
              aria-label="No profile photo"
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
              Change profile photo
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
            <p role="status">Uploading photo...</p>
          )}
        </div>

        <label htmlFor="full-name">Full Name</label>
        <input
          id="full-name"
          autoComplete="name"
          maxLength={100}
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          style={inputStyle}
        />

        <label htmlFor="profile-location">Location</label>
        <input
          id="profile-location"
          autoComplete="address-level2"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          style={inputStyle}
        />

        <label htmlFor="phone-number">Phone Number</label>
        <input
          id="phone-number"
          type="tel"
          autoComplete="tel"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          style={inputStyle}
        />

        <label htmlFor="profile-bio">Bio</label>
        <textarea
          id="profile-bio"
          maxLength={1000}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          style={{ ...inputStyle, height: "120px" }}
        />

        <label htmlFor="profile-category">Category</label>
        <select
          id="profile-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          style={selectStyle}
        >
          <option value="">Select Category</option>
          <option value="Creator">Creator</option>
          <option value="Caregiver">Caregiver</option>
          <option value="Employer">Employer</option>
          <option value="Job Seeker">Job Seeker</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Organization">Organization</option>
          <option value="Advocate">Advocate</option>
        </select>

        <label htmlFor="preferred-language">Preferred Language</label>
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
          <h2 id="accessibility-heading">Accessibility Needs</h2>

          <p>
            Choose the accessibility needs you want Inclura to
            remember for your experience.
          </p>

          {[
            "Visual Impairment",
            "Hearing Impairment",
            "Mobility Impairment",
            "Speech Impairment",
          ].map((need) => (
            <div key={need} style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={accessibilityNeeds.includes(need)}
                  onChange={() => toggleNeed(need)}
                />{" "}
                {need}
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
              Share my accessibility needs on my public profile
            </label>

            <p style={{ fontSize: "13px", color: "#cbd5e1" }}>
              When disabled, your accessibility needs will not be
              displayed in the public profile's Accessibility tab.
              This setting controls display in the profile interface;
              it does not replace database access rules.
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
            ? "Saving..."
            : uploadingPhoto
              ? "Wait for Photo Upload..."
              : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={saving}
          style={secondaryButtonStyle}
        >
          Cancel
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

