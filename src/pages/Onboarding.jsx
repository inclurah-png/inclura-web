import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import DashboardLayout from "../components/DashboardLayout";

import { auth, db } from "../firebase";

import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { VERIFICATION_PLANS } from "../config";

function Onboarding() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const categories = useMemo(
    () => Object.keys(VERIFICATION_PLANS),
    []
  );

  const availableAccessibilityNeeds = [
    { value: "Screen Reader", label: t("screenReader") },
    { value: "Braille", label: t("braille") },
    { value: "Large Text", label: t("largeText") },
    { value: "High Contrast", label: t("highContrast") },
    { value: "Voice Navigation", label: t("voiceNavigation") },
    { value: "Keyboard Navigation", label: t("keyboardNavigation") },
    { value: "Captions", label: t("captions") },
    { value: "Sign Language", label: t("signLanguage") },
    { value: "Color Blind Support", label: t("colorBlindSupport") },
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

      const savedLanguage = data.language || "English";
      setLanguage(savedLanguage);

      const languageCodeMap = {
        English: "en",
        French: "fr",
        Spanish: "es",
        Arabic: "ar",
        Portuguese: "pt",
        Swahili: "sw",
        "Yorùbá": "yo",
        Yoruba: "yo",
        Igbo: "ig",
        Hausa: "ha",
      };

      const savedLanguageCode = languageCodeMap[savedLanguage];
      if (savedLanguageCode && i18n.language !== savedLanguageCode) {
        await i18n.changeLanguage(savedLanguageCode);
      }

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

      // Add this member to the safe discovery directory used by Messages.
      // Email, phone number and private accessibility settings are excluded.
      try {
        const profileSnapshot = await getDoc(doc(db, "users", user.uid));
        const profile = profileSnapshot.exists() ? profileSnapshot.data() : {};
        await setDoc(doc(db, "memberDirectory", user.uid), {
          uid: user.uid,
          fullName: typeof profile.fullName === "string" ? profile.fullName : (user.displayName || ""),
          photoURL: typeof profile.photoURL === "string" ? profile.photoURL : (user.photoURL || ""),
          location: typeof location === "string" ? location : "",
          category: typeof verificationCategory === "string" ? verificationCategory : "",
          accountType: typeof accountType === "string" ? accountType : "individual",
          bio: typeof bio === "string" ? bio : "",
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (directoryError) {
        console.warn("Member directory setup failed:", directoryError);
      }

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
          onChange={(e) => {
            const selectedLanguage = e.target.value;
            setLanguage(selectedLanguage);

            const languageCodeMap = {
              English: "en",
              French: "fr",
              Spanish: "es",
              Arabic: "ar",
              Portuguese: "pt",
              Swahili: "sw",
              "Yorùbá": "yo",
              Igbo: "ig",
              Hausa: "ha",
            };

            const selectedCode = languageCodeMap[selectedLanguage];
            if (selectedCode) {
              i18n.changeLanguage(selectedCode);
            }
          }}
          style={inputStyle}
        >
          <option value="English">English</option>
          <option value="French">Français</option>
          <option value="Spanish">Español</option>
          <option value="Arabic">العربية</option>
          <option value="Portuguese">Português</option>
          <option value="Swahili">Kiswahili</option>
          <option value="Yorùbá">Yorùbá</option>
          <option value="Igbo">Igbo</option>
          <option value="Hausa">Hausa</option>
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
          {t("accessibilityNeeds")}
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
                key={need.value}
                type="button"
                aria-pressed={accessibilityNeeds.includes(need.value)}
                onClick={() =>
                  toggleAccessibilityNeed(
                    need.value
                  )
                }
                style={{
                  padding: "12px 18px",
                  borderRadius: "30px",
                  border:
                    accessibilityNeeds.includes(
                      need.value
                    )
                      ? "2px solid #22c55e"
                      : "1px solid #334155",
                  background:
                    accessibilityNeeds.includes(
                      need.value
                    )
                      ? "#14532d"
                      : "#1e293b",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {need.label}
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
          {t("completeOnboarding")}
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
