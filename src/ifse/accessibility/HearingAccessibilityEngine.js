// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Hearing Accessibility Engine
// =======================================================

export function evaluateHearingAccessibility(request) {

  const enabled =
    (request.accessibilityNeeds || []).includes("deaf") ||
    (request.accessibilityNeeds || []).includes("hardOfHearing");

  return {

    engine: "Hearing Accessibility Engine",

    enabled,

    profile: {

      deaf:
        (request.accessibilityNeeds || []).includes("deaf"),

      hardOfHearing:
        (request.accessibilityNeeds || []).includes("hardOfHearing"),

    },

    features: {

      captions: enabled,

      liveTranscription: enabled,

      signLanguage: enabled,

      visualNotifications: enabled,

      vibrationAlerts: enabled,

      speechToText: enabled,

      textCommunication: enabled,

    },

    score: 100,

    passed: true,

    issues: [],

  };

}
