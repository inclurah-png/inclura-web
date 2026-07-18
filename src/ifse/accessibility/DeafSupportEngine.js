// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Deaf Support Engine
// =======================================================

export function evaluateDeafSupport(request) {

  const enabled =
    (request.accessibilityNeeds || []).includes("deaf");

  return {

    engine: "Deaf Support Engine",

    enabled,

    features: {

      captions: enabled,

      liveTranscription: enabled,

      signLanguage: enabled,

      speechToText: enabled,

      visualNotifications: enabled,

      vibrationAlerts: enabled,

      textMessagingPriority: enabled,

      mediaCaptionRequired: enabled,

    },

    score: 100,

    passed: true,

    issues: [],

  };

}
