// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Gesture Control Engine
// =======================================================

export function evaluateGestureControl(
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
    source.gestureControl === true ||
    source.gestureControlEnabled === true ||
    normalizedNeeds.some(
      (need) =>
        need === "motorimpairment" ||
        need === "motor impairment" ||
        need === "motor disability" ||
        need === "motor accessibility" ||
        need === "gesture control" ||
        need === "gesture navigation" ||
        need === "hand control"
    );

  return {

    engine:
      "Gesture Control Engine",

    enabled,

    features: {

      handGestureRecognition:
        enabled,

      touchFreeNavigation:
        enabled,

      airGestures:
        enabled,

      facialGestureSupport:
        enabled,

      customGestures:
        enabled,

      gestureShortcuts:
        enabled,

      gestureConfirmation:
        enabled,

      gestureCalibration:
        enabled,

      cameraBasedControl:
        enabled,

      offlineGestureRecognition:
        enabled,

    },

    supportedActions: {

      scroll:
        enabled,

      click:
        enabled,

      select:
        enabled,

      back:
        enabled,

      home:
        enabled,

      zoom:
        enabled,

      mediaControl:
        enabled,

      emergencyShortcut:
        enabled,

    },

    score:
      100,

    passed:
      true,

    issues: [],

  };

}
