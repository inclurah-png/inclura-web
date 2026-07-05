import { useEffect, useState } from "react";

import { auth, db, storage } from "../firebase";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { useNavigate } from "react-router-dom";

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
      const user =
        auth.currentUser;

      if (!user) return;

      const snap =
        await getDoc(
          doc(
            db,
            "users",
            user.uid
          )
        );

      if (snap.exists()) {
        const data =
          snap.data();

        setFullName(
          data.fullName || ""
        );

        setLocation(
          data.location || ""
        );

        setPhoneNumber(
          data.phoneNumber || ""
        );

        setBio(
          data.bio || ""
        );

        setCategory(
          data.category || ""
        );

        setPreferredLanguage(
  data.preferredLanguage || "en"
);

        setPhotoURL(
          data.photoURL || ""
        );

        setAccessibilityNeeds(
          data.accessibilityNeeds || []
        );
      }
    }

    loadProfile();
  }, []);

  async function handlePhotoUpload(
    e
  ) {
    const file =
      e.target.files[0];

    if (!file) return;

    try {
      const user =
        auth.currentUser;

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

      if (!user) return;

      await updateDoc(
  doc(
    db,
    "users",
    user.uid
  ),
  {
    fullName,
    location,
    phoneNumber,
    bio,
    category,
    preferredLanguage,
    accessibilityNeeds,
    photoURL,
  }
);

      alert(
        "Profile updated successfully"
      );

      navigate("/profile");
    } catch (error) {
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
            height: "120px",
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
            width: "100%",
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

          <option>
            Creator
          </option>

          <option>
            Caregiver
          </option>

          <option>
            Employer
          </option>

          <option>
            Job Seeker
          </option>

          <option>
            Volunteer
          </option>

          <option>
            Organization
          </option>

          <option>
            Advocate
          </option>
        </select>

        <select
  value={preferredLanguage}
  onChange={(e) =>
    setPreferredLanguage(
      e.target.value
    )
  }
  style={{
    width: "100%",
    padding: "16px",
    marginBottom: "16px",
    borderRadius: "14px",
    border: "1px solid #334155",
    background: "#ffffff",
    color: "#000000",
    boxSizing: "border-box",
  }}
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
  width: "100%",
  padding: "16px",
  marginBottom: "16px",
  borderRadius: "14px",
  border:
    "1px solid #334155",
  background:
    "#1e293b",
  color: "white",
  boxSizing:
    "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  border: "none",
  background:
    "#38bdf8",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

export default EditProfile;
