import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { useAuth } from "./AuthContext";

import {
  initializeUserAccessibility,
} from "../ifse/accessibility/AccessibilityAuthenticationIntegration";

import {
  getAccessibilityRuntime,
  subscribeAccessibility,
  shutdownAccessibilityRuntime,
} from "../ifse/accessibility/AccessibilityRuntimeEngine";

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

  const [
    ifseAccessibilityRuntime,
    setIfseAccessibilityRuntime,
  ] = useState(
    () => getAccessibilityRuntime()
  );

  /*
   * Keep the React provider synchronized
   * with the IFSE accessibility runtime.
   */
  useEffect(() => {
    const unsubscribe =
      subscribeAccessibility(
        (runtimeState) => {
          setIfseAccessibilityRuntime(
            runtimeState
          );
        }
      );

    setIfseAccessibilityRuntime(
      getAccessibilityRuntime()
    );

    return unsubscribe;
  }, []);

  /*
   * Restore accessibility settings
   * from the authenticated user profile.
   */
  useEffect(() => {
    if (!userProfile) {
      setAccessibilityNeeds([]);
      setAccessibilityProfile(
        DEFAULT_ACCESSIBILITY_PROFILE
      );

      shutdownAccessibilityRuntime();

      return;
    }

    if (
      typeof userProfile.language ===
        "string" &&
      userProfile.language.trim()
    ) {
      setLanguage(
        userProfile.language
      );
    }

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

    if (
      typeof userProfile.highContrast ===
        "boolean"
    ) {
      setHighContrast(
        userProfile.highContrast
      );
    }

    if (
      typeof userProfile.reducedMotion ===
        "boolean"
    ) {
      setReducedMotion(
        userProfile.reducedMotion
      );
    }

    if (
      typeof userProfile.voiceEnabled ===
        "boolean"
    ) {
      setVoiceEnabled(
        userProfile.voiceEnabled
      );
    }

    const savedNeeds =
      normalizeAccessibilityNeeds(
        userProfile.accessibilityNeeds
      );

    setAccessibilityNeeds(
      savedNeeds
    );

    const nextProfile =
      buildAccessibilityProfile(
        savedNeeds
      );

    setAccessibilityProfile(
      nextProfile
    );
  }, [userProfile]);

  /*
   * Synchronize the current React
   * accessibility state with IFSE.
   *
   * The user profile remains the source
   * of truth for persisted requirements,
   * while the current React state supplies
   * the latest runtime preferences.
   */
  useEffect(() => {
    if (!userProfile) {
      return;
    }

    const runtimeRequest = {
      ...userProfile,

      language,

      fontScale,

      highContrast,

      reducedMotion,

      voiceEnabled,

      accessibilityNeeds,
    };

    void initializeUserAccessibility(
      runtimeRequest
    );
  }, [
    userProfile,
    language,
    fontScale,
    highContrast,
    reducedMotion,
    voiceEnabled,
    accessibilityNeeds,
  ]);

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

    /*
     * Expose the live IFSE accessibility
     * runtime to components that need
     * detailed module information.
     */
    ifseAccessibilityRuntime,
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
