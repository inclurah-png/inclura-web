import {
  createContext,
  useContext,
  useState,
} from "react";

const AccessibilityContext =
  createContext();

export function AccessibilityProvider({
  children,
}) {
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

  const [accessibilityProfile, setAccessibilityProfile] =
    useState({
      blind: false,
      lowVision: false,
      deaf: false,
      hardOfHearing: false,
      wheelchair: false,
      dyslexia: false,
      adhd: false,
      autism: false,
    });

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
            : undefined,
          color: highContrast
            ? "#ffffff"
            : undefined,
          minHeight: "100%",
          transition:
            reducedMotion
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
