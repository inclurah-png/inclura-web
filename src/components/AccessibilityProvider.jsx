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
  noDisability: false,
};

function buildAccessibilityProfile(
  accessibilityNeeds = [],
  existingProfile = {}
) {
  const needs = Array.isArray(
    accessibilityNeeds
  )
    ? accessibilityNeeds.map((need) =>
        String(need).toLowerCase()
      )
    : [];

  const profile = {
    ...DEFAULT_ACCESSIBILITY_PROFILE,
    ...existingProfile,
  };

  if (
    needs.some(
      (need) =>
        need.includes("visual") ||
        need.includes("blind") ||
        need.includes("low vision")
    )
  ) {
    profile.blindLowVision = true;
  }

  if (
    needs.some(
      (need) =>
        need.includes("hearing") ||
        need.includes("deaf")
    )
  ) {
    profile.deaf = true;
  }

  if (
    needs.some(
      (need) =>
        need.includes("mobility") ||
        need.includes("wheelchair") ||
        need.includes("motor")
    )
  ) {
    profile.wheelchair = true;
    profile.motorImpaired = true;
  }

  if (
    needs.some(
      (need) =>
        need.includes("speech") ||
        need.includes("non-verbal") ||
        need.includes("nonverbal")
    )
  ) {
    profile.nonVerbal = true;
  }

  if (needs.length === 0) {
    profile.noDisability = true;
  } else {
    profile.noDisability = false;
  }

  return profile;
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
    if (!userProfile) return;

    // Restore language
    if (userProfile.language) {
      setLanguage(
        userProfile.language
      );
    }

    // Restore font size
    if (userProfile.fontScale) {
      setFontScale(
        userProfile.fontScale
      );
    }

    // Restore high contrast
    if (
      userProfile.highContrast !==
      undefined
    ) {
      setHighContrast(
        userProfile.highContrast
      );
    }

    // Restore reduced motion
    if (
      userProfile.reducedMotion !==
      undefined
    ) {
      setReducedMotion(
        userProfile.reducedMotion
      );
    }

    // Restore voice guidance
    if (
      userProfile.voiceEnabled !==
      undefined
    ) {
      setVoiceEnabled(
        userProfile.voiceEnabled
      );
    }

    /*
     * Restore the existing accessibilityNeeds
     * array used by EditProfile.
     */
    const savedNeeds =
      Array.isArray(
        userProfile.accessibilityNeeds
      )
        ? userProfile.accessibilityNeeds
        : [];

    setAccessibilityNeeds(
      savedNeeds
    );

    /*
     * Preserve an existing accessibility
     * profile when present, while also
     * deriving its flags from accessibilityNeeds.
     */
    const savedProfile =
      userProfile.accessibility &&
      typeof userProfile.accessibility ===
        "object"
        ? userProfile.accessibility
        : {};

    setAccessibilityProfile(
      buildAccessibilityProfile(
        savedNeeds,
        savedProfile
      )
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
