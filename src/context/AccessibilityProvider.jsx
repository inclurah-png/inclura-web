import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const AccessibilityContext =
  createContext();

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

  /*
   * AuthContext is the single source of
   * truth for the user's saved profile.
   *
   * Do NOT create another Firestore
   * listener here.
   */
  const accessibilityNeeds =
    useMemo(() => {
      if (
        !Array.isArray(
          userProfile?.accessibilityNeeds
        )
      ) {
        return [];
      }

      return userProfile.accessibilityNeeds;
    }, [
      userProfile?.accessibilityNeeds,
    ]);

  /*
   * Normalize profile needs so that
   * different wording/capitalization
   * can still activate the correct
   * accessibility capability.
   */
  const normalizedNeeds =
    useMemo(() => {
      return accessibilityNeeds.map(
        (need) =>
          String(need)
            .trim()
            .toLowerCase()
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
            String(keyword)
              .toLowerCase()
          )
        )
    );
  };

  /*
   * Accessibility capabilities derived
   * from the user's saved profile.
   */
  const accessibilityProfile =
    useMemo(() => {
      return {
        blind: hasNeed(
          "blind"
        ),

        lowVision: hasNeed(
          "low vision",
          "visual impairment",
          "visual"
        ),

        deaf: hasNeed(
          "deaf"
        ),

        hardOfHearing: hasNeed(
          "hard of hearing",
          "hearing impairment",
          "hearing"
        ),

        wheelchair: hasNeed(
          "wheelchair",
          "mobility impairment",
          "mobility"
        ),

        speechImpairment: hasNeed(
          "speech impairment",
          "non-verbal",
          "nonverbal",
          "speech"
        ),

        dyslexia: hasNeed(
          "dyslexia"
        ),

        adhd: hasNeed(
          "adhd"
        ),

        autism: hasNeed(
          "autism",
          "neurodivergent",
          "neurodivers"
        ),
      };
    }, [
      normalizedNeeds,
    ]);

  /*
   * Browser speech support.
   *
   * This uses the Android device's available
   * SpeechSynthesis engine. The provider
   * exposes the capability so ChatWindow,
   * Feed, notifications, and other features
   * can use the same accessibility service.
   */
  const speechSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in
      window;

  /*
   * Stop any active speech when the
   * provider is unmounted.
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
   * Keep the speaking state synchronized
   * with the browser speech engine.
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

    /*
     * speechSynthesis does not expose
     * universal global events consistently
     * across browsers, so this listener is
     * intentionally defensive.
     */
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
   * Speak text using the user's active
   * Inclura language.
   *
   * This function deliberately does NOT
   * automatically speak every message.
   *
   * It provides a central, reusable
   * accessibility speech service that
   * user-facing controls can invoke.
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

    const languageMap = {
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

    const requestedLanguage =
      options.language ||
      language;

    const speechLanguage =
      languageMap[
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
   * Voice guidance can be enabled either
   * explicitly through Accessibility
   * Settings or by an accessibility profile
   * that requires stronger visual assistance.
   */
  const effectiveVoiceEnabled =
    voiceEnabled ||
    accessibilityProfile.blind ||
    accessibilityProfile.lowVision;

  /*
   * The provider exposes both the raw
   * preference and the effective capability.
   */
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
