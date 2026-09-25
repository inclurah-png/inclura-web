import { useEffect, useState } from "react";

import { auth, db, storage } from "../firebase";

import {
  doc,
  getDoc,
  updateDoc,
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

    const postsSnapshot =
      await getDocs(postsQuery);

    let recoveredName = "";

    let latestTimestamp = -Infinity;

    postsSnapshot.forEach((postDoc) => {
      const post = postDoc.data();

      const postName =
        getValidName(post?.userName);

      if (!postName) {
        return;
      }

      let timestamp = 0;

      if (
        post?.createdAt &&
        typeof post.createdAt.toMillis ===
          "function"
      ) {
        timestamp =
          post.createdAt.toMillis();
      } else if (
        post?.createdAt instanceof Date
      ) {
        timestamp =
          post.createdAt.getTime();
      }

      if (
        !recoveredName ||
        timestamp >= latestTimestamp
      ) {
        recoveredName = postName;
        latestTimestamp = timestamp;
      }
    });

    return recoveredName;
  } catch (error) {
    console.log(
      "Unable to recover profile name from posts:",
      error
    );

    return "";
  }
}

function EditProfile() {
  const [fullName, setFullName] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [
    preferredLanguage,
    setPreferredLanguage,
  ] = useState("en");

  const [photoURL, setPhotoURL] =
    useState("");

  const [
    accessibilityNeeds,
    setAccessibilityNeeds,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  useEffect(() => {
    async function loadProfile() {
      try {
        const user =
          auth.currentUser;

        if (!user) {
          return;
        }

        const profileRef =
          doc(
            db,
            "users",
            user.uid
          );

        const snap =
          await getDoc(profileRef);

        let data = {};

        if (snap.exists()) {
          data = snap.data() || {};
        }

        /*
         * --------------------------------------------------
         * STEP 1
         * Try the authoritative users.fullName field.
         * --------------------------------------------------
         */

        let resolvedName =
          getValidName(
            data?.fullName
          );

        /*
         * --------------------------------------------------
         * STEP 2
         * If users.fullName is missing, recover the name
         * from an existing post created by this user.
         *
         * Existing posts already contain:
         *
         * userName: "ADEBAMIJI ADEOKUN"
         *
         * This allows us to restore the profile without
         * hard-coding a personal name into the application.
         * --------------------------------------------------
         */

        if (!resolvedName) {
          resolvedName =
            await recoverNameFromPosts(
              user.uid
            );
        }

        /*
         * --------------------------------------------------
         * STEP 3
         * If the name was not found in posts, use Firebase
         * Authentication's displayName if it is real.
         * --------------------------------------------------
         */

        if (!resolvedName) {
          resolvedName =
            getValidName(
              user.displayName
            );
        }

        /*
         * --------------------------------------------------
         * STEP 4
         * Final fallback to the email username.
         *
         * We deliberately do NOT use "Inclura User" here
         * because that would hide the actual missing-name
         * problem again.
         * --------------------------------------------------
         */

        if (!resolvedName) {
          const email =
            user.email ||
            data?.email ||
            "";

          if (email) {
            resolvedName =
              email
                .split("@")[0]
                .trim();
          }
        }

        setFullName(
          resolvedName
        );

        setLocation(
          data?.location || ""
        );

        setPhoneNumber(
          data?.phoneNumber || ""
        );

        setBio(
          data?.bio || ""
        );

        setCategory(
          data?.category || ""
        );

        setPreferredLanguage(
          data?.preferredLanguage ||
            "en"
        );

        setPhotoURL(
          data?.photoURL ||
            data?.profilePhoto ||
            user.photoURL ||
            ""
        );

        setAccessibilityNeeds(
          Array.isArray(
            data?.accessibilityNeeds
          )
            ? data.accessibilityNeeds
            : []
        );
      } catch (error) {
        console.log(
          "Load profile error:",
          error
        );
      }
    }

    loadProfile();
  }, []);

  async function handlePhotoUpload(
    e
  ) {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const user =
        auth.currentUser;

      if (!user) {
        alert(
          "Please login again."
        );
        return;
      }

      const storageRef =
        ref(
          storage,
          `profilePhotos/${user.uid}`
        );

      await uploadBytes(
        storageRef,
        file
      );

      const url =
        await getDownloadURL(
          storageRef
        );

      setPhotoURL(url);

      alert(
        "Photo uploaded successfully"
      );
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleSave() {
    try {
      setLoading(true);

      const user =
        auth.currentUser;

      if (!user) {
        alert(
          "Please login again."
        );
        return;
      }

      const cleanedName =
        fullName.trim();

      if (!cleanedName) {
        alert(
          "Please enter your full name."
        );
        return;
      }

      const profileRef =
        doc(
          db,
          "users",
          user.uid
        );

      await updateDoc(
        profileRef,
        {
          fullName:
            cleanedName,

          location:
            location.trim(),

          phoneNumber:
            phoneNumber.trim(),

          bio:
            bio.trim(),

          category,

          preferredLanguage,

          accessibilityNeeds,

          photoURL,

          /*
           * Keep profilePhoto synchronized
           * with photoURL because other parts
           * of Inclura currently use profilePhoto.
           */
          profilePhoto:
            photoURL,
        }
      );

      /*
       * Keep Firebase Authentication's
       * displayName synchronized when possible.
       *
       * The Firestore fullName remains the
       * application's authoritative profile name.
       */
      try {
        const {
          updateProfile,
        } = await import(
          "firebase/auth"
        );

        await updateProfile(
          user,
          {
            displayName:
              cleanedName,
          }
        );
      } catch (authError) {
        console.log(
          "Firebase Auth display name sync skipped:",
          authError
        );
      }

      alert(
        "Profile updated successfully"
      );

      navigate("/profile");
    } catch (error) {
      console.log(
        "Save profile error:",
        error
      );

      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleNeed(
    value
  ) {
    if (
      accessibilityNeeds.includes(
        value
      )
    ) {
      setAccessibilityNeeds(
        accessibilityNeeds.filter(
          (item) =>
            item !== value
        )
      );
    } else {
      setAccessibilityNeeds([
        ...accessibilityNeeds,
        value,
      ]);
    }
  }

  return (
    <div
      style={{
        background:
          "#020617",
        minHeight:
          "100vh",
        padding: "24px",
        color: "white",
        fontFamily:
          "Arial",
      }}
    >
      <div
        style={{
          maxWidth:
            "700px",
          margin:
            "0 auto",
          background:
            "#0f172a",
          padding: "30px",
          borderRadius:
            "24px",
        }}
      >
        <h1>
          Edit Profile
        </h1>

        <div
          style={{
            textAlign:
              "center",
            marginBottom:
              "24px",
          }}
        >
          <img
            src={
              photoURL ||
              "https://via.placeholder.com/120"
            }
            alt="Profile"
            style={{
              width:
                "120px",
              height:
                "120px",
              borderRadius:
                "50%",
              objectFit:
                "cover",
              border:
                "4px solid #38bdf8",
            }}
          />

          <br />

          <input
            type="file"
            accept="image/*"
            onChange={
              handlePhotoUpload
            }
            style={{
              marginTop:
                "12px",
            }}
          />
        </div>

        <input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) =>
            setFullName(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) =>
            setLocation(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={
            phoneNumber
          }
          onChange={(e) =>
            setPhoneNumber(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) =>
            setBio(
              e.target.value
            )
          }
          style={{
            ...inputStyle,
            height:
              "120px",
          }}
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          style={{
            width:
              "100%",
            padding:
              "16px",
            marginBottom:
              "16px",
            borderRadius:
              "14px",
            border:
              "1px solid #334155",
            background:
              "#ffffff",
            color:
              "#000000",
            boxSizing:
              "border-box",
          }}
        >
          <option value="">
            Select Category
          </option>

          <option value="Creator">
            Creator
          </option>

          <option value="Caregiver">
            Caregiver
          </option>

          <option value="Employer">
            Employer
          </option>

          <option value="Job Seeker">
            Job Seeker
          </option>

          <option value="Volunteer">
            Volunteer
          </option>

          <option value="Organization">
            Organization
          </option>

          <option value="Advocate">
            Advocate
          </option>
        </select>

        <select
          value={
            preferredLanguage
          }
          onChange={(e) =>
            setPreferredLanguage(
              e.target.value
            )
          }
          style={{
            width:
              "100%",
            padding:
              "16px",
            marginBottom:
              "16px",
            borderRadius:
              "14px",
            border:
              "1px solid #334155",
            background:
              "#ffffff",
            color:
              "#000000",
            boxSizing:
              "border-box",
          }}
        >
          <option value="en">
            English
          </option>

          <option value="fr">
            French
          </option>

          <option value="es">
            Spanish
          </option>

          <option value="pt">
            Portuguese
          </option>

          <option value="ar">
            Arabic
          </option>

          <option value="sw">
            Swahili
          </option>

          <option value="ha">
            Hausa
          </option>

          <option value="yo">
            Yoruba
          </option>

          <option value="ig">
            Igbo
          </option>
        </select>

        <div
          style={{
            marginBottom:
              "20px",
          }}
        >
          <h3>
            Accessibility
            Needs
          </h3>

          {[
            "Visual Impairment",
            "Hearing Impairment",
            "Mobility Impairment",
            "Speech Impairment",
          ].map(
            (need) => (
              <div
                key={need}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={accessibilityNeeds.includes(
                      need
                    )}
                    onChange={() =>
                      toggleNeed(
                        need
                      )
                    }
                  />

                  {" "}

                  {need}
                </label>
              </div>
            )
          )}
        </div>

        <button
          onClick={
            handleSave
          }
          disabled={
            loading
          }
          style={
            buttonStyle
          }
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width:
    "100%",
  padding:
    "16px",
  marginBottom:
    "16px",
  borderRadius:
    "14px",
  border:
    "1px solid #334155",
  background:
    "#1e293b",
  color:
    "white",
  boxSizing:
    "border-box",
};

const buttonStyle = {
  width:
    "100%",
  padding:
    "16px",
  borderRadius:
    "14px",
  border:
    "none",
  background:
    "#38bdf8",
  color:
    "white",
  fontWeight:
    "700",
  cursor:
    "pointer",
};

export default EditProfile;
