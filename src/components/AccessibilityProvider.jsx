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
  accessibilityNeeds = []
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

  const mobilityImpaired =
    hasNeed([
      "mobility impairment",
      "mobility impaired",
      "wheelchair",
      "motor impairment",
      "motor impaired",
      "physical disability",
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
      "none",
      "no accessibility needs",
    ]);

  return {
    ...DEFAULT_ACCESSIBILITY_PROFILE,

    deaf,

    blindLowVision,

    wheelchair: hasNeed([
      "wheelchair",
    ]),

    nonVerbal,

    motorImpaired:
      mobilityImpaired,

    neurodivergent,

    noDisability:
      noDisability &&
      !blindLowVision &&
      !deaf &&
      !mobilityImpaired &&
      !nonVerbal &&
      !neurodivergent,
  };
}

export function AccessibilityProvider({
  children,
}) {
  const { userProfile } =
    useAuth();

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
     * AuthContext is the source of truth
     * for the signed-in user's profile.
     *
     * When the user signs out or the
     * profile is unavailable, reset all
     * accessibility profile information.
     */
    if (!userProfile) {
      setAccessibilityNeeds([]);
      setAccessibilityProfile(
        DEFAULT_ACCESSIBILITY_PROFILE
      );

      setLanguage("en");
      setFontScale(1);
      setHighContrast(false);
      setReducedMotion(false);
      setVoiceEnabled(false);

      return;
    }

    /*
     * Restore saved language preference.
     */
    if (
      userProfile.language
    ) {
      setLanguage(
        userProfile.language
      );
    }

    /*
     * Restore saved font scale.
     */
    if (
      userProfile.fontScale !==
      undefined &&
      userProfile.fontScale !==
      null
    ) {
      setFontScale(
        userProfile.fontScale
      );
    }

    /*
     * Restore saved high contrast
     * preference.
     */
    if (
      userProfile.highContrast !==
      undefined &&
      userProfile.highContrast !==
      null
    ) {
      setHighContrast(
        Boolean(
          userProfile.highContrast
        )
      );
    }

    /*
     * Restore saved reduced motion
     * preference.
     */
    if (
      userProfile.reducedMotion !==
      undefined &&
      userProfile.reducedMotion !==
      null
    ) {
      setReducedMotion(
        Boolean(
          userProfile.reducedMotion
        )
      );
    }

    /*
     * Restore saved voice guidance
     * preference.
     */
    if (
      userProfile.voiceEnabled !==
      undefined &&
      userProfile.voiceEnabled !==
      null
    ) {
      setVoiceEnabled(
        Boolean(
          userProfile.voiceEnabled
        )
      );
    }

    /*
     * accessibilityNeeds comes directly
     * from Edit Profile / Firestore
     * through AuthContext.
     *
     * This is the authoritative source
     * for the user's accessibility needs.
     */
    const savedNeeds =
      normalizeAccessibilityNeeds(
        userProfile.accessibilityNeeds
      );

    setAccessibilityNeeds(
      savedNeeds
    );

    /*
     * Build the active accessibility
     * capabilities from the user's
     * currently selected needs.
     *
     * We deliberately do NOT allow an
     * older stored accessibility object
     * to override these values.
     */
    const nextAccessibilityProfile =
      buildAccessibilityProfile(
        savedNeeds
      );

    setAccessibilityProfile(
      nextAccessibilityProfile
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
            : "all .3s ease",
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
