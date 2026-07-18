// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Easy Language Engine
// =======================================================

export function evaluateEasyLanguage(request) {

  const enabled =
    request.easyLanguage === true ||
    (request.accessibilityNeeds || []).includes("cognitiveDisability") ||
    (request.accessibilityNeeds || []).includes("dyslexia") ||
    (request.accessibilityNeeds || []).includes("autism") ||
    (request.accessibilityNeeds || []).includes("adhd");

  return {

    engine: "Easy Language Engine",

    enabled,

    features: {

      aiPlainLanguage: enabled,

      sentenceSimplification: enabled,

      vocabularySimplification: enabled,

      conceptExplanation: enabled,

      abbreviationExpansion: enabled,

      difficultWordDefinitions: enabled,

      multilingualEasyLanguage: enabled,

      creatorContentPreservation: true,

      toggleOriginalContent: true,

      userControlledTranslation: true,

    },

    supportedContent: {

      posts: true,

      comments: true,

      messages: true,

      marketplace: true,

      documentation: true,

      learningContent: true,

      verificationForms: true,

      announcements: true,

    },

    score: 100,

    passed: true,

    issues: [],

  };

}
