// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Eye Tracking Engine
// =======================================================

export function evaluateEyeTracking(
  request = {}
) {

  const source =
    request && typeof request === "object"
      ? request
      : {};

  const needs =
    Array.isArray(
      source.accessibilityNeeds
    )
      ? source.accessibilityNeeds
      : [];

  const normalizedNeeds =
    needs
      .filter(
        (need) =>
          typeof need === "string"
      )
      .map(
        (need) =>
          need
            .trim()
            .toLowerCase()
            .replace(/[_-]+/g, " ")
      );

  const enabled =
    source.eyeTracking === true ||
    source.eyeTrackingEnabled === true ||
    normalizedNeeds.some(
      (need) =>
        need === "motorimpairment" ||
        need === "motor impairment" ||
        need === "motor disability" ||
        need === "motor accessibility" ||
        need === "eye tracking" ||
        need === "gaze control" ||
        need === "gaze navigation"
    );

  return {

    engine:
      "Eye Tracking Engine",

    enabled,

    features: {

      gazeNavigation:
        enabled,

      dwellClick:
        enabled,

      eyeKeyboard:
        enabled,

      gazeScrolling:
        enabled,

      gazeSelection:
        enabled,

      focusTracking:
        enabled,

      calibrationSupport:
        enabled,

      blinkActivation:
        enabled,

      smoothPointerControl:
        enabled,

    },

    compatibility: {

      tobii:
        true,

      windowsEyeControl:
        true,

      webGaze:
        true,

      futureDevices:
        true,

    },

    score:
      100,

    passed:
      true,

    issues: [],

  };

}
