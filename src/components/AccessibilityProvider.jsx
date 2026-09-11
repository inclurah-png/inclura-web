import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { useAuth } from "./AuthContext";

const AccessibilityContext =
  createContext();

const DEFAULT_ACCESSIBILITY_PROFILE = {
  deaf: false,
  blindLowVision: false,
  wheelchair: false,
  nonVerbal: false,
  motorImpaired: false,
  neurodivergent: false,
  noDisability: true,
};

function normalizeAccessibilityNeeds(
  accessibilityNeeds
) {
  if (
    Array.isArray(
      accessibilityNeeds
    )
  ) {
    return accessibilityNeeds
      .filter(
        (need) =>
          need !== null &&
          need !== undefined
      )
      .map((need) =>
        String(need).trim()
      )
      .filter(Boolean);
  }

  if (
    typeof accessibilityNeeds ===
    "string"
  ) {
    return accessibilityNeeds
      .split(",")
      .map((need) =>
        need.trim()
      )
      .filter(Boolean);
  }

  return [];
}

function buildAccessibilityProfile(
  accessibilityNeeds
) {
  const needs =
    normalizeAccessibilityNeeds(
      accessibilityNeeds
    ).map((need) =>
      need.toLowerCase()
    );

  const hasNeed = (patterns) =>
    needs.some((need) =>
      patterns.some((pattern) =>
        need.includes(pattern)
      )
    );

  const blindLowVision =
    hasNeed([
      "visual impairment",
      "visually impaired",
      "blind",
      "blindness",
      "low vision",
    ]);

  const deaf =
    hasNeed([
      "hearing impairment",
      "hearing impaired",
      "hard of hearing",
      "deaf",
      "deafness",
    ]);

  const wheelchair =
    hasNeed([
      "wheelchair",
    ]);

  const motorImpaired =
    hasNeed([
      "mobility impairment",
      "mobility impaired",
      "motor impairment",
      "motor impaired",
      "physical disability",
      "wheelchair",
    ]);

  const nonVerbal =
    hasNeed([
      "speech impairment",
      "speech impaired",
      "non-verbal",
      "nonverbal",
      "unable to speak",
    ]);

  const neurodivergent =
    hasNeed([
      "dyslexia",
      "adhd",
      "autism",
      "autistic",
      "neurodivergent",
      "neurodivers",
    ]);

  const noDisability =
    needs.length === 0 ||
    hasNeed([
      "no disability",
      "no accessibility needs",
      "none",
    ]);

  return {
    deaf,

    blindLowVision,

    wheelchair,

    nonVerbal,

    motorImpaired,

    neurodivergent,

    noDisability:
      noDisability &&
      !blindLowVision &&
      !deaf &&
      !motorImpaired &&
      !nonVerbal &&
      !neurodivergent,
  };
}

export function AccessibilityProvider({
  children,
}) {
  /*
   * AuthProvider is the parent provider,
   * so useAuth() is available here.
   *
   * Keep this defensive so a temporary
   * unavailable auth context cannot crash
   * the entire application.
   */
  const authContext =
    useAuth();

  const userProfile =
    authContext?.userProfile ||
    null;

  const [language, setLanguage] =
    useState("en");

  const [fontScale, setFontScale] =
    useState(1);

  const [highContrast, setHighContrast] =
    useState(false);

  const [reducedMotion, setReducedMotion] =
    useState(false);

  const [voiceEnabled, setVoiceEnabled] =
    useState(false);

  const [
    accessibilityNeeds,
    setAccessibilityNeeds,
  ] = useState([]);

  const [
    accessibilityProfile,
    setAccessibilityProfile,
  ] = useState(
    DEFAULT_ACCESSIBILITY_PROFILE
  );

  useEffect(() => {
    /*
     * No authenticated profile yet.
     *
     * Reset only the accessibility
     * profile data. AuthContext remains
     * responsible for authentication.
     */
    if (!userProfile) {
      setAccessibilityNeeds([]);
      setAccessibilityProfile(
        DEFAULT_ACCESSIBILITY_PROFILE
      );

      return;
    }

    /*
     * Restore saved language.
     */
    if (
      typeof userProfile.language ===
      "string" &&
      userProfile.language.trim()
    ) {
      setLanguage(
        userProfile.language
      );
    }

    /*
     * Restore saved font scale.
     */
    if (
      typeof userProfile.fontScale ===
      "number" &&
      Number.isFinite(
        userProfile.fontScale
      ) &&
      userProfile.fontScale > 0
    ) {
      setFontScale(
        userProfile.fontScale
      );
    }

    /*
     * Restore high contrast.
     */
    if (
      typeof userProfile.highContrast ===
      "boolean"
    ) {
      setHighContrast(
        userProfile.highContrast
      );
    }

    /*
     * Restore reduced motion.
     */
    if (
      typeof userProfile.reducedMotion ===
      "boolean"
    ) {
      setReducedMotion(
        userProfile.reducedMotion
      );
    }

    /*
     * Restore voice guidance.
     */
    if (
      typeof userProfile.voiceEnabled ===
      "boolean"
    ) {
      setVoiceEnabled(
        userProfile.voiceEnabled
      );
    }

    /*
     * Edit Profile / Firestore
     * accessibilityNeeds is the source
     * of truth for the user's selected
     * accessibility requirements.
     */
    const savedNeeds =
      normalizeAccessibilityNeeds(
        userProfile.accessibilityNeeds
      );

    setAccessibilityNeeds(
      savedNeeds
    );

    /*
     * Convert the saved requirements
     * into capabilities used throughout
     * Inclura.
     */
    const nextProfile =
      buildAccessibilityProfile(
        savedNeeds
      );

    setAccessibilityProfile(
      nextProfile
    );
  }, [userProfile]);

  const value = {
    language,
    setLanguage,

    fontScale,
    setFontScale,

    highContrast,
    setHighContrast,

    reducedMotion,
    setReducedMotion,

    voiceEnabled,
    setVoiceEnabled,

    accessibilityNeeds,
    setAccessibilityNeeds,

    accessibilityProfile,
    setAccessibilityProfile,
  };

  return (
    <AccessibilityContext.Provider
      value={value}
    >
      <div
        style={{
          fontSize: `${fontScale}rem`,
          background: highContrast
            ? "#000000"
            : "#020617",
          color: highContrast
            ? "#ffffff"
            : "inherit",
          minHeight: "100%",
          transition: reducedMotion
            ? "none"
            : "all 0.3s ease",
        }}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context =
    useContext(
      AccessibilityContext
    );

  if (!context) {
    throw new Error(
      "useAccessibility must be used inside AccessibilityProvider."
    );
  }

  return context;
}
