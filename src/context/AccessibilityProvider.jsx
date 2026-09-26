import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
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

import {
  db,
} from "../firebase";

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
    user,
    userProfile,
  } = useAuth();

  const [language, setLanguageState] =
    useState("en");

  const [fontScale, setFontScaleState] =
    useState(1);

  const [
    highContrast,
    setHighContrastState,
  ] = useState(false);

  const [
    reducedMotion,
    setReducedMotionState,
  ] = useState(false);

  const [
    voiceEnabled,
    setVoiceEnabledState,
  ] = useState(false);

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
   * --------------------------------------------------
   * SAVED ACCESSIBILITY NEEDS
   * --------------------------------------------------
   */

  const accessibilityNeeds =
    useMemo(() => {
      return normalizeAccessibilityNeeds(
        userProfile?.accessibilityNeeds
      );
    }, [
      userProfile?.accessibilityNeeds,
    ]);

  const normalizedNeeds =
    useMemo(() => {
      return accessibilityNeeds.map(
        normalizeNeed
      );
    }, [
      accessibilityNeeds,
    ]);

  const hasNeed = useCallback(
    (...keywords) => {
      return normalizedNeeds.some(
        (need) =>
          keywords.some((keyword) =>
            need.includes(
              normalizeNeed(keyword)
            )
          )
      );
    },
    [normalizedNeeds]
  );

  /*
   * --------------------------------------------------
   * APPLICATION ACCESSIBILITY PROFILE
   * --------------------------------------------------
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
      hasNeed,
    ]);

  /*
   * --------------------------------------------------
   * FIRESTORE ACCESSIBILITY PERSISTENCE
   * --------------------------------------------------
   */

  const saveAccessibilitySetting =
    useCallback(
      async (
        field,
        value
      ) => {
        const uid =
          user?.uid;

        if (!uid) {
          return false;
        }

        try {
          await updateDoc(
            doc(
              db,
              "users",
              uid
            ),
            {
              [field]: value,
            }
          );

          return true;
        } catch (error) {
          console.error(
            `Unable to save accessibility setting "${field}":`,
            error
          );

          return false;
        }
      },
      [user?.uid]
    );

  /*
   * --------------------------------------------------
   * ACCESSIBILITY SETTERS
   *
   * These update the interface immediately AND
   * persist the setting to the user's Firestore
   * profile.
   * --------------------------------------------------
   */

  const setLanguage =
    useCallback(
      (value) => {
        const normalizedLanguage =
          typeof value === "string" &&
          value.trim()
            ? value.trim()
            : "en";

        setLanguageState(
          normalizedLanguage
        );

        /*
         * The Edit Profile system historically
         * uses preferredLanguage, while older
         * accessibility data may use language.
         *
         * Keep both synchronized.
         */
        void saveAccessibilitySetting(
          "language",
          normalizedLanguage
        );

        void saveAccessibilitySetting(
          "preferredLanguage",
          normalizedLanguage
        );
      },
      [
        saveAccessibilitySetting,
      ]
    );

  const setFontScale =
    useCallback(
      (value) => {
        const numericValue =
          Number(value);

        if (
          !Number.isFinite(
            numericValue
          )
        ) {
          return;
        }

        const normalizedValue =
          Math.min(
            1.6,
            Math.max(
              0.8,
              numericValue
            )
          );

        setFontScaleState(
          normalizedValue
        );

        void saveAccessibilitySetting(
          "fontScale",
          normalizedValue
        );
      },
      [
        saveAccessibilitySetting,
      ]
    );

  const setHighContrast =
    useCallback(
      (value) => {
        const normalizedValue =
          Boolean(value);

        setHighContrastState(
          normalizedValue
        );

        void saveAccessibilitySetting(
          "highContrast",
          normalizedValue
        );
      },
      [
        saveAccessibilitySetting,
      ]
    );

  const setReducedMotion =
    useCallback(
      (value) => {
        const normalizedValue =
          Boolean(value);

        setReducedMotionState(
          normalizedValue
        );

        void saveAccessibilitySetting(
          "reducedMotion",
          normalizedValue
        );
      },
      [
        saveAccessibilitySetting,
      ]
    );

  const setVoiceEnabled =
    useCallback(
      (value) => {
        const normalizedValue =
          Boolean(value);

        setVoiceEnabledState(
          normalizedValue
        );

        void saveAccessibilitySetting(
          "voiceEnabled",
          normalizedValue
        );
      },
      [
        saveAccessibilitySetting,
      ]
    );

  /*
   * --------------------------------------------------
   * COMPATIBILITY SETTER
   *
   * AccessibilitySettings and older components may
   * expect setAccessibilityProfile to exist.
   *
   * The previous provider exposed this name without
   * defining it, which could cause a runtime error.
   *
   * This implementation converts profile flags into
   * the existing accessibilityNeeds model.
   * --------------------------------------------------
   */

  const setAccessibilityProfile =
    useCallback(
      async (profileUpdate = {}) => {
        if (
          !profileUpdate ||
          typeof profileUpdate !==
            "object"
        ) {
          return;
        }

        const nextNeeds = [
          ...accessibilityNeeds,
        ];

        const mappings = [
          {
            key: "blind",
            values: [
              "Blind",
            ],
          },
          {
            key: "lowVision",
            values: [
              "Low Vision",
            ],
          },
          {
            key: "deaf",
            values: [
              "Deaf",
            ],
          },
          {
            key: "hardOfHearing",
            values: [
              "Hard of Hearing",
            ],
          },
          {
            key: "wheelchair",
            values: [
              "Wheelchair",
            ],
          },
          {
            key: "motorImpaired",
            values: [
              "Mobility Impairment",
            ],
          },
          {
            key: "speechImpairment",
            values: [
              "Speech Impairment",
            ],
          },
          {
            key: "dyslexia",
            values: [
              "Dyslexia",
            ],
          },
          {
            key: "adhd",
            values: [
              "ADHD",
            ],
          },
          {
            key: "autism",
            values: [
              "Autism",
            ],
          },
        ];

        mappings.forEach(
          ({
            key,
            values,
          }) => {
            if (
              typeof profileUpdate[
                key
              ] !== "boolean"
            ) {
              return;
            }

            values.forEach(
              (needValue) => {
                const existingIndex =
                  nextNeeds.findIndex(
                    (need) =>
                      normalizeNeed(
                        need
                      ) ===
                      normalizeNeed(
                        needValue
                      )
                  );

                if (
                  profileUpdate[
                    key
                  ]
                ) {
                  if (
                    existingIndex <
                    0
                  ) {
                    nextNeeds.push(
                      needValue
                    );
                  }
                } else if (
                  existingIndex >=
                  0
                ) {
                  nextNeeds.splice(
                    existingIndex,
                    1
                  );
                }
              }
            );
          }
        );

        if (
          user?.uid
        ) {
          try {
            await updateDoc(
              doc(
                db,
                "users",
                user.uid
              ),
              {
                accessibilityNeeds:
                  nextNeeds,
              }
            );
          } catch (error) {
            console.error(
              "Unable to save accessibility profile:",
              error
            );
          }
        }
      },
      [
        accessibilityNeeds,
        user?.uid,
      ]
    );

  /*
   * --------------------------------------------------
   * IFSE RUNTIME SUBSCRIPTION
   * --------------------------------------------------
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
   * --------------------------------------------------
   * RESTORE SAVED ACCESSIBILITY SETTINGS
   * --------------------------------------------------
   */

  useEffect(() => {
    if (!userProfile) {
      setLanguageState("en");
      setFontScaleState(1);
      setHighContrastState(false);
      setReducedMotionState(false);
      setVoiceEnabledState(false);

      shutdownAccessibilityRuntime();

      return;
    }

    /*
     * Support both language and the existing
     * preferredLanguage profile field.
     */
    const savedLanguage =
      typeof userProfile.language ===
        "string" &&
      userProfile.language.trim()
        ? userProfile.language
        : typeof userProfile.preferredLanguage ===
            "string" &&
          userProfile.preferredLanguage.trim()
        ? userProfile.preferredLanguage
        : "en";

    setLanguageState(
      savedLanguage
    );

    if (
      typeof userProfile.fontScale ===
        "number" &&
      Number.isFinite(
        userProfile.fontScale
      ) &&
      userProfile.fontScale > 0
    ) {
      setFontScaleState(
        Math.min(
          1.6,
          Math.max(
            0.8,
            userProfile.fontScale
          )
        )
      );
    } else {
      setFontScaleState(1);
    }

    if (
      typeof userProfile.highContrast ===
      "boolean"
    ) {
      setHighContrastState(
        userProfile.highContrast
      );
    } else {
      setHighContrastState(false);
    }

    if (
      typeof userProfile.reducedMotion ===
      "boolean"
    ) {
      setReducedMotionState(
        userProfile.reducedMotion
      );
    } else {
      setReducedMotionState(false);
    }

    if (
      typeof userProfile.voiceEnabled ===
      "boolean"
    ) {
      setVoiceEnabledState(
        userProfile.voiceEnabled
      );
    } else {
      setVoiceEnabledState(false);
    }
  }, [
    userProfile,
  ]);

  /*
   * --------------------------------------------------
   * SEND COMPLETE ACCESSIBILITY STATE TO IFSE
   * --------------------------------------------------
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
   * --------------------------------------------------
   * BROWSER SPEECH SUPPORT
   * --------------------------------------------------
   */

  const speechSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in
      window;

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
   * --------------------------------------------------
   * SPEECH SERVICE
   * --------------------------------------------------
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
   * --------------------------------------------------
   * EFFECTIVE VOICE ACCESSIBILITY
   * --------------------------------------------------
   */

  const effectiveVoiceEnabled =
    voiceEnabled ||
    accessibilityProfile.blind ||
    accessibilityProfile.lowVision;

  /*
   * --------------------------------------------------
   * CONTEXT VALUE
   * --------------------------------------------------
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
  };

  return (
    <AccessibilityContext.Provider
      value={value}
    >
      <div
        style={{
          fontSize:
            `${fontScale}rem`,

          background:
            highContrast
              ? "#000000"
              : undefined,

          color:
            highContrast
              ? "#ffffff"
              : undefined,

          minHeight:
            "100%",

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
