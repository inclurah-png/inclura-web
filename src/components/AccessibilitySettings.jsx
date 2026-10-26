
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
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

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import i18n from "../i18n";

const AccessibilityContext = createContext();

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

function normalizeAccessibilityNeeds(accessibilityNeeds) {
  if (Array.isArray(accessibilityNeeds)) {
    return accessibilityNeeds
      .filter((need) => need !== null && need !== undefined)
      .map((need) => String(need).trim())
      .filter(Boolean);
  }

  if (typeof accessibilityNeeds === "string") {
    return accessibilityNeeds
      .split(",")
      .map((need) => need.trim())
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

function getReadableFirestoreError(error) {
  const code =
    typeof error?.code === "string"
      ? error.code
      : "unknown";

  const message =
    typeof error?.message === "string" && error.message.trim()
      ? error.message.trim()
      : "No additional error message was provided.";

  return `Error code: ${code}. Details: ${message}`;
}

export function AccessibilityProvider({ children }) {
  const { user, userProfile } = useAuth();

  const [language, setLanguageState] = useState("en");
  const [fontScale, setFontScaleState] = useState(1);
  const [highContrast, setHighContrastState] = useState(false);
  const [reducedMotion, setReducedMotionState] = useState(false);
  const [voiceEnabled, setVoiceEnabledState] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const [ifseAccessibilityRuntime, setIfseAccessibilityRuntime] =
    useState(() => getAccessibilityRuntime());

  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const saveSequenceRef = useRef(0);
  const localOverridesRef = useRef({});
  const currentUidRef = useRef(user?.uid || null);

  /*
   * RESET LOCAL OVERRIDES WHEN THE SIGNED-IN USER CHANGES
   */
  useEffect(() => {
    const nextUid = user?.uid || null;

    if (currentUidRef.current !== nextUid) {
      currentUidRef.current = nextUid;
      localOverridesRef.current = {};
      saveSequenceRef.current += 1;
      setSaveStatus("idle");
      setSaveMessage("");
    }
  }, [user?.uid]);

  /*
   * ACCESSIBILITY NEEDS
   */
  const accessibilityNeeds = useMemo(
    () =>
      normalizeAccessibilityNeeds(
        userProfile?.accessibilityNeeds
      ),
    [userProfile?.accessibilityNeeds]
  );

  const normalizedNeeds = useMemo(
    () => accessibilityNeeds.map(normalizeNeed),
    [accessibilityNeeds]
  );

  const hasNeed = useCallback(
    (...keywords) =>
      normalizedNeeds.some((need) =>
        keywords.some((keyword) =>
          need.includes(normalizeNeed(keyword))
        )
      ),
    [normalizedNeeds]
  );

  /*
   * ACCESSIBILITY PROFILE
   */
  const accessibilityProfile = useMemo(
    () => ({
      blind: hasNeed("blind", "blindness"),

      lowVision: hasNeed(
        "low vision",
        "visual impairment",
        "low-vision"
      ),

      deaf: hasNeed("deaf", "deafness"),

      hardOfHearing: hasNeed(
        "hard of hearing",
        "hearing impairment",
        "hearing impaired"
      ),

      wheelchair: hasNeed("wheelchair"),

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

      dyslexia: hasNeed("dyslexia", "dyslexic"),

      adhd: hasNeed("adhd", "attention deficit"),

      autism: hasNeed(
        "autism",
        "autistic",
        "neurodivergent",
        "neurodivers"
      ),
    }),
    [hasNeed]
  );

  /*
   * FIRESTORE SAVE WITH DIAGNOSTIC ERROR REPORTING
   *
   * Settings take effect immediately. Failed writes keep a local
   * override and expose the actual Firestore error to the UI.
   */
  const saveAccessibilitySettings = useCallback(
    async (settings) => {
      const uid = user?.uid;
      const sequence = ++saveSequenceRef.current;

      if (!uid) {
        localOverridesRef.current = {
          ...localOverridesRef.current,
          ...settings,
        };

        setSaveStatus("error");
        setSaveMessage(
          "You are not signed in. The setting is active temporarily, but cannot be saved to your account until you sign in."
        );

        return false;
      }

      localOverridesRef.current = {
        ...localOverridesRef.current,
        ...settings,
      };

      setSaveStatus("saving");
      setSaveMessage("Saving accessibility settings…");

      try {
        await updateDoc(
          doc(db, "users", uid),
          settings
        );

        const remainingOverrides = {
          ...localOverridesRef.current,
        };

        Object.entries(settings).forEach(([key, value]) => {
          if (Object.is(remainingOverrides[key], value)) {
            delete remainingOverrides[key];
          }
        });

        localOverridesRef.current = remainingOverrides;

        if (saveSequenceRef.current === sequence) {
          setSaveStatus("saved");
          setSaveMessage(
            "Accessibility settings saved to your account."
          );
        }

        return true;
      } catch (error) {
        console.error(
          "Unable to save accessibility settings:",
          error
        );

        if (saveSequenceRef.current === sequence) {
          setSaveStatus("error");
          setSaveMessage(
            "Your setting is active on this device, but could not be saved. " +
              getReadableFirestoreError(error)
          );
        }

        return false;
      }
    },
    [user?.uid]
  );

  /*
   * LANGUAGE
   */
  const setLanguage = useCallback(
    (value) => {
      const normalizedLanguage =
        typeof value === "string" && value.trim()
          ? value.trim()
          : "en";

      setLanguageState(normalizedLanguage);

      void i18n.changeLanguage(normalizedLanguage).catch((error) => {
        console.error(
          "Unable to change application language:",
          error
        );
      });

      void saveAccessibilitySettings({
        language: normalizedLanguage,
        preferredLanguage: normalizedLanguage,
      });
    },
    [saveAccessibilitySettings]
  );

  /*
   * FONT SCALE
   */
  const setFontScale = useCallback(
    (value) => {
      const numericValue = Number(value);

      if (!Number.isFinite(numericValue)) {
        return;
      }

      const normalizedValue = Math.min(
        1.6,
        Math.max(0.8, numericValue)
      );

      setFontScaleState(normalizedValue);

      void saveAccessibilitySettings({
        fontScale: normalizedValue,
      });
    },
    [saveAccessibilitySettings]
  );

  /*
   * HIGH CONTRAST
   */
  const setHighContrast = useCallback(
    (value) => {
      const normalizedValue = Boolean(value);

      setHighContrastState(normalizedValue);

      void saveAccessibilitySettings({
        highContrast: normalizedValue,
      });
    },
    [saveAccessibilitySettings]
  );

  /*
   * REDUCED MOTION
   */
  const setReducedMotion = useCallback(
    (value) => {
      const normalizedValue = Boolean(value);

      setReducedMotionState(normalizedValue);

      void saveAccessibilitySettings({
        reducedMotion: normalizedValue,
      });
    },
    [saveAccessibilitySettings]
  );

  /*
   * VOICE GUIDANCE
   */
  const setVoiceEnabled = useCallback(
    (value) => {
      const normalizedValue = Boolean(value);

      setVoiceEnabledState(normalizedValue);

      void saveAccessibilitySettings({
        voiceEnabled: normalizedValue,
      });
    },
    [saveAccessibilitySettings]
  );

  /*
   * ACCESSIBILITY PROFILE UPDATE
   */
  const setAccessibilityProfile = useCallback(
    async (profileUpdate = {}) => {
      if (
        !profileUpdate ||
        typeof profileUpdate !== "object"
      ) {
        return false;
      }

      const nextNeeds = [...accessibilityNeeds];

      const mappings = [
        { key: "blind", values: ["Blind"] },
        { key: "lowVision", values: ["Low Vision"] },
        { key: "deaf", values: ["Deaf"] },
        { key: "hardOfHearing", values: ["Hard of Hearing"] },
        { key: "wheelchair", values: ["Wheelchair"] },
        {
          key: "motorImpaired",
          values: ["Mobility Impairment"],
        },
        {
          key: "speechImpairment",
          values: ["Speech Impairment"],
        },
        { key: "dyslexia", values: ["Dyslexia"] },
        { key: "adhd", values: ["ADHD"] },
        { key: "autism", values: ["Autism"] },
      ];

      mappings.forEach(({ key, values }) => {
        if (typeof profileUpdate[key] !== "boolean") {
          return;
        }

        values.forEach((needValue) => {
          const existingIndex = nextNeeds.findIndex(
            (need) =>
              normalizeNeed(need) === normalizeNeed(needValue)
          );

          if (profileUpdate[key]) {
            if (existingIndex < 0) {
              nextNeeds.push(needValue);
            }
          } else if (existingIndex >= 0) {
            nextNeeds.splice(existingIndex, 1);
          }
        });
      });

      return saveAccessibilitySettings({
        accessibilityNeeds: nextNeeds,
      });
    },
    [accessibilityNeeds, saveAccessibilitySettings]
  );

  /*
   * IFSE RUNTIME SUBSCRIPTION
   */
  useEffect(() => {
    const unsubscribe = subscribeAccessibility((runtimeState) => {
      setIfseAccessibilityRuntime(runtimeState);
    });

    setIfseAccessibilityRuntime(getAccessibilityRuntime());

    return unsubscribe;
  }, []);

  /*
   * RESTORE SAVED SETTINGS WITHOUT OVERRIDING LOCAL CHANGES
   */
  useEffect(() => {
    if (!userProfile) {
      setLanguageState("en");
      setFontScaleState(1);
      setHighContrastState(false);
      setReducedMotionState(false);
      setVoiceEnabledState(false);

      if (!user?.uid) {
        shutdownAccessibilityRuntime();
      }

      return;
    }

    const overrides = localOverridesRef.current;

    const savedLanguage =
      overrides.language ??
      overrides.preferredLanguage ??
      (typeof userProfile.language === "string" &&
      userProfile.language.trim()
        ? userProfile.language
        : typeof userProfile.preferredLanguage === "string" &&
          userProfile.preferredLanguage.trim()
        ? userProfile.preferredLanguage
        : "en");

    setLanguageState(savedLanguage);

    if (i18n.language !== savedLanguage) {
      void i18n.changeLanguage(savedLanguage).catch((error) => {
        console.error(
          "Unable to restore application language:",
          error
        );
      });
    }

    const savedFontScale =
      overrides.fontScale ?? userProfile.fontScale;

    setFontScaleState(
      typeof savedFontScale === "number" &&
        Number.isFinite(savedFontScale) &&
        savedFontScale > 0
        ? Math.min(1.6, Math.max(0.8, savedFontScale))
        : 1
    );

    const savedHighContrast =
      overrides.highContrast ?? userProfile.highContrast;

    setHighContrastState(
      typeof savedHighContrast === "boolean"
        ? savedHighContrast
        : false
    );

    const savedReducedMotion =
      overrides.reducedMotion ?? userProfile.reducedMotion;

    setReducedMotionState(
      typeof savedReducedMotion === "boolean"
        ? savedReducedMotion
        : false
    );

    const savedVoiceEnabled =
      overrides.voiceEnabled ?? userProfile.voiceEnabled;

    setVoiceEnabledState(
      typeof savedVoiceEnabled === "boolean"
        ? savedVoiceEnabled
        : false
    );
  }, [userProfile, user?.uid]);

  /*
   * SEND COMPLETE ACCESSIBILITY STATE TO IFSE
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

    void initializeUserAccessibility(runtimeRequest);
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
   * BROWSER SPEECH SUPPORT
   */
  const speechSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

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

  useEffect(() => {
    if (
      !speechSupported ||
      typeof window === "undefined"
    ) {
      return undefined;
    }

    const handleSpeechStart = () => setSpeaking(true);
    const handleSpeechEnd = () => setSpeaking(false);
    const handleSpeechError = () => setSpeaking(false);

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
  }, [speechSupported]);

  /*
   * SPEECH SERVICE
   */
  function speakText(text, options = {}) {
    if (
      !text ||
      !speechSupported ||
      typeof window === "undefined"
    ) {
      return false;
    }

    const cleanText = String(text).trim();

    if (!cleanText) {
      return false;
    }

    const requestedLanguage = options.language || language;

    const speechLanguage =
      LANGUAGE_MAP[requestedLanguage] || "en-US";

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(
        cleanText
      );

      utterance.lang = speechLanguage;
      utterance.rate =
        typeof options.rate === "number" ? options.rate : 1;
      utterance.pitch =
        typeof options.pitch === "number" ? options.pitch : 1;
      utterance.volume =
        typeof options.volume === "number" ? options.volume : 1;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);

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
   * EFFECTIVE VOICE ACCESSIBILITY
   */
  const effectiveVoiceEnabled =
    voiceEnabled ||
    accessibilityProfile.blind ||
    accessibilityProfile.lowVision;

  /*
   * CONTEXT VALUE
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

    ifseAccessibilityRuntime,

    saveStatus,
    saveMessage,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      <div
        style={{
          fontSize: `${fontScale}rem`,
          background: highContrast ? "#000000" : undefined,
          color: highContrast ? "#ffffff" : undefined,
          minHeight: "100%",
          transition: reducedMotion ? "none" : "all 0.3s ease",
        }}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error(
      "useAccessibility must be used inside AccessibilityProvider."
    );
  }

  return context;
}
