import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
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

const LANGUAGE_MAP = {
  en: "en-US",
  yo: "yo-NG",
  ig: "ig-NG",
  ha: "ha-NG",
  pcm: "en-NG",
  fr: "fr-FR",
  es: "es-ES",
  pt: "pt-PT",
  sw: "sw-KE",
  ar: "ar-SA",
  zh: "zh-CN",
  "zh-TW": "zh-TW",
  ja: "ja-JP",
  de: "de-DE",
  hi: "hi-IN",
  ru: "ru-RU",
  it: "it-IT",
  nl: "nl-NL",
  ko: "ko-KR",
  vi: "vi-VN",
  th: "th-TH",
  id: "id-ID",
  ms: "ms-MY",
  bn: "bn-BD",
  tr: "tr-TR",
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

function normalizeNeed(need) {
  return String(need)
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

export function AccessibilityProvider({
  children,
}) {
  const {
    userProfile,
  } = useAuth();

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

  const [speaking, setSpeaking] =
    useState(false);

  const [
    ifseAccessibilityRuntime,
    setIfseAccessibilityRuntime,
  ] = useState(
    () =>
      getAccessibilityRuntime()
  );

  /*
   * AuthContext remains the source
   * of truth for saved accessibility
   * requirements.
   */
  const accessibilityNeeds =
    useMemo(() => {
      return normalizeAccessibilityNeeds(
        userProfile?.accessibilityNeeds
      );
    }, [
      userProfile?.accessibilityNeeds,
    ]);

  /*
   * Normalize accessibility requirements
   * so different capitalization,
   * separators, and wording can be
   * interpreted consistently.
   */
  const normalizedNeeds =
    useMemo(() => {
      return accessibilityNeeds.map(
        normalizeNeed
      );
    }, [
      accessibilityNeeds,
    ]);

  const hasNeed = (
    ...keywords
  ) => {
    return normalizedNeeds.some(
      (need) =>
        keywords.some((keyword) =>
          need.includes(
            normalizeNeed(keyword)
          )
        )
    );
  };

  /*
   * Application-facing accessibility
   * profile.
   *
   * The detailed IFSE engines remain
   * responsible for deeper accessibility
   * evaluation. This profile preserves
   * the existing React API used by
   * application components.
   */
  const accessibilityProfile =
    useMemo(() => {
      return {
        blind: hasNeed(
          "blind",
          "blindness"
        ),

        lowVision: hasNeed(
          "low vision",
          "visual impairment",
          "visual impairment",
          "low-vision"
        ),

        deaf: hasNeed(
          "deaf",
          "deafness"
        ),

        hardOfHearing: hasNeed(
          "hard of hearing",
          "hearing impairment",
          "hearing impaired"
        ),

        wheelchair: hasNeed(
          "wheelchair"
        ),

        motorImpaired: hasNeed(
          "mobility impairment",
          "mobility impaired",
          "motor impairment",
          "motor impaired",
          "physical disability",
          "wheelchair"
        ),

        speechImpairment: hasNeed(
          "speech impairment",
          "speech impaired",
          "speech disability",
          "non-verbal",
          "nonverbal",
          "unable to speak",
          "communication impairment"
        ),

        dyslexia: hasNeed(
          "dyslexia",
          "dyslexic"
        ),

        adhd: hasNeed(
          "adhd",
          "attention deficit"
        ),

        autism: hasNeed(
          "autism",
          "autistic",
          "neurodivergent",
          "neurodivers"
        ),
      };
    }, [
      normalizedNeeds,
    ]);

  /*
   * Synchronize React with the live
   * IFSE accessibility runtime.
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
   * Restore saved accessibility
   * preferences from AuthContext.
   *
   * AuthContext remains the single
   * persistence source. This provider
   * does not create another Firestore
   * listener.
   */
  useEffect(() => {
    if (!userProfile) {
      setAccessibilityNeeds([]);

      setLanguage("en");
      setFontScale(1);
      setHighContrast(false);
      setReducedMotion(false);
      setVoiceEnabled(false);

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
  }, [
    userProfile,
  ]);

  /*
   * Connect the application-facing
   * accessibility state to IFSE.
   *
   * IFSE receives the complete current
   * accessibility request so its
   * specialized engines can evaluate
   * and activate the appropriate
   * modules.
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

  /*
   * Browser speech support.
   *
   * This remains the application's
   * immediate Android/browser speech
   * accessibility service.
   */
  const speechSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in
      window;

  /*
   * Cancel active browser speech
   * when the provider unmounts.
   */
  useEffect(() => {
    return () => {
      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /*
   * Keep speaking state synchronized
   * with browser speech events where
   * the browser exposes them.
   */
  useEffect(() => {
    if (
      !speechSupported ||
      typeof window === "undefined"
    ) {
      return undefined;
    }

    const handleSpeechStart = () => {
      setSpeaking(true);
    };

    const handleSpeechEnd = () => {
      setSpeaking(false);
    };

    const handleSpeechError = () => {
      setSpeaking(false);
    };

    window.speechSynthesis.addEventListener(
      "start",
      handleSpeechStart
    );

    window.speechSynthesis.addEventListener(
      "end",
      handleSpeechEnd
    );

    window.speechSynthesis.addEventListener(
      "error",
      handleSpeechError
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "start",
        handleSpeechStart
      );

      window.speechSynthesis.removeEventListener(
        "end",
        handleSpeechEnd
      );

      window.speechSynthesis.removeEventListener(
        "error",
        handleSpeechError
      );
    };
  }, [
    speechSupported,
  ]);

  /*
   * Central browser speech service.
   *
   * It does not automatically speak
   * every message or notification.
   * User-facing accessibility controls
   * explicitly invoke this function.
   */
  function speakText(
    text,
    options = {}
  ) {
    if (
      !text ||
      !speechSupported ||
      typeof window === "undefined"
    ) {
      return false;
    }

    const cleanText =
      String(text).trim();

    if (!cleanText) {
      return false;
    }

    const requestedLanguage =
      options.language ||
      language;

    const speechLanguage =
      LANGUAGE_MAP[
        requestedLanguage
      ] ||
      "en-US";

    try {
      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(
          cleanText
        );

      utterance.lang =
        speechLanguage;

      utterance.rate =
        typeof options.rate ===
          "number"
          ? options.rate
          : 1;

      utterance.pitch =
        typeof options.pitch ===
          "number"
          ? options.pitch
          : 1;

      utterance.volume =
        typeof options.volume ===
          "number"
          ? options.volume
          : 1;

      utterance.onstart = () => {
        setSpeaking(true);
      };

      utterance.onend = () => {
        setSpeaking(false);
      };

      utterance.onerror = () => {
        setSpeaking(false);
      };

      window.speechSynthesis.speak(
        utterance
      );

      return true;
    } catch (error) {
      console.error(
        "Inclura Accessibility Speech Error:",
        error
      );

      setSpeaking(false);

      return false;
    }
  }

  function stopSpeaking() {
    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);
  }

  /*
   * Users with blindness or low vision
   * receive effective voice capability
   * even when the manual voice toggle
   * has not been enabled.
   */
  const effectiveVoiceEnabled =
    voiceEnabled ||
    accessibilityProfile.blind ||
    accessibilityProfile.lowVision;

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

    effectiveVoiceEnabled,

    speaking,
    speechSupported,
    speakText,
    stopSpeaking,

    accessibilityNeeds,

    accessibilityProfile,
    setAccessibilityProfile,

    /*
     * Live IFSE accessibility state.
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

          background:
            highContrast
              ? "#000000"
              : undefined,

          color:
            highContrast
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
