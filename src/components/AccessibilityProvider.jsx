import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { useAuth } from "./AuthContext";

const AccessibilityContext =
  createContext();

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
    accessibilityProfile,
    setAccessibilityProfile,
  ] = useState({
    deaf: false,
    blindLowVision: false,
    wheelchair: false,
    nonVerbal: false,
    motorImpaired: false,
    neurodivergent: false,
    noDisability: false,
  });
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
    userProfile.highContrast !== undefined
  ) {
    setHighContrast(
      userProfile.highContrast
    );
  }

  // Restore reduced motion

  if (
    userProfile.reducedMotion !== undefined
  ) {
    setReducedMotion(
      userProfile.reducedMotion
    );
  }

  // Restore voice guidance

  if (
    userProfile.voiceEnabled !== undefined
  ) {
    setVoiceEnabled(
      userProfile.voiceEnabled
    );
  }

  // Restore accessibility profile

  if (
    userProfile.accessibility
  ) {

    setAccessibilityProfile(
      userProfile.accessibility
    );

  }

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
