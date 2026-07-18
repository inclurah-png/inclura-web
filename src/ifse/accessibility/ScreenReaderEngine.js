// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Screen Reader Engine
// =======================================================

export function evaluateScreenReader(request) {

  const enabled =
    request.screenReader === true ||
    (request.accessibilityNeeds || []).includes("blind") ||
    (request.accessibilityNeeds || []).includes("lowVision");

  return {

    engine: "Screen Reader Engine",

    enabled,

    supportedReaders: {

      talkBack: true,

      voiceOver: true,

      nvda: true,

      jaws: true,

      narrator: true,

      orca: true,

    },

    features: {

      semanticNavigation: enabled,

      ariaSupport: enabled,

      focusManagement: enabled,

      imageDescriptions: enabled,

      liveRegionAnnouncements: enabled,

      keyboardSupport: enabled,

      gestureSupport: enabled,

    },

    score: 100,

    passed: true,

    issues: [],

  };

}
