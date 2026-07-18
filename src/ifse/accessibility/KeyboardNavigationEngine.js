// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Keyboard Navigation Engine
// =======================================================

export function evaluateKeyboardNavigation(request) {

  const enabled =
    request.keyboardNavigation === true ||
    (request.accessibilityNeeds || []).includes("motorImpairment") ||
    (request.accessibilityNeeds || []).includes("blind");

  return {

    engine: "Keyboard Navigation Engine",

    enabled,

    features: {

      tabNavigation: enabled,

      skipLinks: enabled,

      focusIndicators: enabled,

      keyboardShortcuts: enabled,

      arrowKeyNavigation: enabled,

      escapeNavigation: enabled,

      enterActivation: enabled,

      spaceActivation: enabled,

      customHotkeys: enabled,

    },

    score: 100,

    passed: true,

    issues: [],

  };

}
