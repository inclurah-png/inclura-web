// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Dyslexia Support Engine
// =======================================================

export function evaluateDyslexiaSupport(request) {

  const enabled =
    (request.accessibilityNeeds || []).includes("dyslexia");

  return {

    engine: "Dyslexia Support Engine",

    enabled,

    features: {

      dyslexiaFriendlyFonts: enabled,

      adjustableLetterSpacing: enabled,

      adjustableWordSpacing: enabled,

      adjustableLineSpacing: enabled,

      readingRuler: enabled,

      syllableHighlighting: enabled,

      wordHighlighting: enabled,

      sentenceHighlighting: enabled,

      synchronizedTextToSpeech: enabled,

      aiReadingAssistant: enabled,

      readingProgressTracking: enabled,

      pronunciationSupport: enabled,

      simplifiedLayout: enabled,

      customizableReadingTheme: enabled,

    },

    recommendations: {

      font: "OpenDyslexic",

      spacing: "comfortable",

      theme: "highContrast",

    },

    score: 100,

    passed: true,

    issues: [],

  };

}
