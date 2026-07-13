import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import { auth, db } from "../firebase";

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { VERIFICATION_PLANS } from "../config";

function Onboarding() {
  const navigate = useNavigate();

  const categories = useMemo(
    () => Object.keys(VERIFICATION_PLANS),
    []
  );

  const availableAccessibilityNeeds = [
    "Screen Reader",
    "Braille",
    "Large Text",
    "High Contrast",
    "Voice Navigation",
    "Keyboard Navigation",
    "Captions",
    "Sign Language",
    "Color Blind Support",
  ];

  const [accountType, setAccountType] =
    useState("individual");

  const [verificationCategory, setVerificationCategory] =
    useState(categories[0]);

  const [bio, setBio] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [language, setLanguage] =
    useState("English");

  const [interests, setInterests] =
    useState([]);

  const [organizationName, setOrganizationName] =
    useState("");

  const [website, setWebsite] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [groupName, setGroupName] =
    useState("");

  const [groupDescription, setGroupDescription] =
    useState("");

  const [groupCategory, setGroupCategory] =
    useState("Community");

  const [
    accessibilityNeeds,
    setAccessibilityNeeds,
  ] = useState([]);

  useEffect(() => {
    loadUser();
  }, []);
    async function loadUser() {
    const user = auth.currentUser;

    if (!user) return;

    try {
      const snap = await getDoc(
        doc(db, "users", user.uid)
      );

      if (!snap.exists()) return;

      const data = snap.data();

      setAccountType(
        data.accountType || "individual"
      );

      setVerificationCategory(
        data.verificationCategory ||
          categories[0]
      );

      setBio(data.bio || "");

      setLocation(
        data.location || ""
      );

      setLanguage(
        data.language || "English"
      );

      setInterests(
        data.interests || []
      );

      setOrganizationName(
        data.organizationName || ""
      );

      setWebsite(
        data.website || ""
      );

      setPhoneNumber(
        data.phoneNumber || ""
      );

      setGroupName(
        data.groupName || ""
      );

      setGroupDescription(
        data.groupDescription || ""
      );

      setGroupCategory(
        data.groupCategory ||
          "Community"
      );

      setAccessibilityNeeds(
        data.accessibilityNeeds || []
      );
    } catch (error) {
      console.error(error);
    }
  }

  function toggleAccessibilityNeed(
    need
  ) {
    setAccessibilityNeeds(
      (previous) => {
        if (
          previous.includes(need)
        ) {
          return previous.filter(
            (item) =>
              item !== need
          );
        }

        return [
          ...previous,
          need,
        ];
      }
    );
  }

  async function finishOnboarding() {
    try {
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
          accountType,
          verificationCategory,
          bio,
          location,
          language,
          interests,
          organizationName,
          website,
          phoneNumber,
          groupName,
          groupDescription,
          groupCategory,
          accessibilityNeeds,
          onboardingCompleted: true,
          updatedAt:
            serverTimestamp(),
        }
      );

      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <DashboardLayout>
      <div
        style={{
          minHeight: "100vh",
          background: "#020617",
          color: "white",
          padding: "24px",
        }}
      >
                <h1
          style={{
            fontSize: "40px",
            marginBottom: "12px",
          }}
        >
          Welcome to Inclura 👋
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          Complete your profile to personalize
          your Inclura experience.
        </p>

        <h2
          style={{
            marginBottom: "16px",
          }}
        >
          Account Verification Category
        </h2>

        <select
          value={verificationCategory}
          onChange={(e) =>
            setVerificationCategory(
              e.target.value
            )
          }
          style={inputStyle}
        >
          {categories.map((key) => (
            <option
              key={key}
              value={key}
            >
              {
                VERIFICATION_PLANS[key]
                  ?.title
              }
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Organization / Brand / Group Name"
          value={organizationName}
          onChange={(e) =>
            setOrganizationName(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Official Website"
          value={website}
          onChange={(e) =>
            setWebsite(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Business / Contact Phone"
          value={phoneNumber}
          onChange={(e) =>
            setPhoneNumber(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <textarea
          placeholder="Tell people about yourself or your organization..."
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

        <input
          type="text"
          placeholder="City / Country"
          value={location}
          onChange={(e) =>
            setLocation(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <select
          value={language}
          onChange={(e) =>
            setLanguage(
              e.target.value
            )
          }
          style={inputStyle}
        >
          <option>English</option>
          <option>French</option>
          <option>Spanish</option>
          <option>Arabic</option>
          <option>Portuguese</option>
          <option>Swahili</option>
          <option>Yorùbá</option>
          <option>Igbo</option>
          <option>Hausa</option>
        </select>
                {verificationCategory ===
          "creator" && (
          <>
            <h2
              style={{
                marginTop: "30px",
                marginBottom: "16px",
              }}
            >
              Creator Information
            </h2>

            <input
              type="text"
              placeholder="Primary Social Link"
              value={groupName}
              onChange={(e) =>
                setGroupName(
                  e.target.value
                )
              }
              style={inputStyle}
            />

            <textarea
              placeholder="Tell us about your content"
              value={groupDescription}
              onChange={(e) =>
                setGroupDescription(
                  e.target.value
                )
              }
              style={{
                ...inputStyle,
                height: "120px",
              }}
            />
          </>
        )}

        {verificationCategory !==
          "creator" && (
          <>
            <h2
              style={{
                marginTop: "30px",
                marginBottom: "16px",
              }}
            >
              Additional Information
            </h2>

            <textarea
              placeholder="Describe your organization, institution, ministry, company, healthcare facility, media house, museum, tourism centre, NGO or religious body."
              value={groupDescription}
              onChange={(e) =>
                setGroupDescription(
                  e.target.value
                )
              }
              style={{
                ...inputStyle,
                height: "120px",
              }}
            />
          </>
        )}

        <h2
          style={{
            marginTop: "30px",
            marginBottom: "16px",
          }}
        >
          Accessibility Needs
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          {availableAccessibilityNeeds.map(
            (need) => (
              <button
                key={need}
                type="button"
                onClick={() =>
                  toggleAccessibilityNeed(
                    need
                  )
                }
                style={{
                  padding: "12px 18px",
                  borderRadius: "30px",
                  border:
                    accessibilityNeeds.includes(
                      need
                    )
                      ? "2px solid #22c55e"
                      : "1px solid #334155",
                  background:
                    accessibilityNeeds.includes(
                      need
                    )
                      ? "#14532d"
                      : "#1e293b",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {need}
              </button>
            )
          )}
        </div>
                <button
          onClick={finishOnboarding}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "18px",
            border: "none",
            background: "#38bdf8",
            color: "white",
            fontSize: "18px",
            fontWeight: "700",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Complete Onboarding
        </button>
      </div>
    </DashboardLayout>
  );
}

const inputStyle = {
  width: "100%",
  padding: "16px",
  marginBottom: "16px",
  borderRadius: "14px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
  boxSizing: "border-box",
};

export default Onboarding;
