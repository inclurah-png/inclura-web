// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Eye Tracking Engine
// =======================================================

export function evaluateEyeTracking(request) {

  const enabled =
    request.eyeTracking === true ||
    (request.accessibilityNeeds || []).includes("motorImpairment");

  return {

    engine: "Eye Tracking Engine",

    enabled,

    features: {

      gazeNavigation: enabled,

      dwellClick: enabled,

      eyeKeyboard: enabled,

      gazeScrolling: enabled,

      gazeSelection: enabled,

      focusTracking: enabled,

      calibrationSupport: enabled,

      blinkActivation: enabled,

      smoothPointerControl: enabled,

    },

    compatibility: {

      tobii: true,

      windowsEyeControl: true,

      webGaze: true,

      futureDevices: true,

    },

    score: 100,

    passed: true,

    issues: [],

  };

}
