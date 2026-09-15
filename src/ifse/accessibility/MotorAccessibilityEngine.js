// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Motor Accessibility Engine
// =======================================================

export function evaluateMotorAccessibility(request = {}) {

  const source =
    request && typeof request === "object"
      ? request
      : {};

  const rawNeeds =
    source.accessibilityNeeds;

  const needs = Array.isArray(rawNeeds)
    ? rawNeeds
    : typeof rawNeeds === "string"
      ? rawNeeds.split(",")
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
            .replace(/[-_]+/g, " ")
            .replace(/\s+/g, " ")
      );

  const motorNeed =
    normalizedNeeds.some(
      (need) =>
        need === "motor impairment" ||
        need === "motorimpairment" ||
        need === "motor disability" ||
        need === "motor accessibility" ||
        need === "mobility impairment" ||
        need === "mobility disability" ||
        need === "physical disability"
    );

  const enabled =
    motorNeed;

  return {

    engine:
      "Motor Accessibility Engine",

    enabled,

    profile: {

      motorImpairment:
        enabled,

    },

    features: {

      keyboardNavigation:
        enabled,

      voiceNavigation:
        enabled,

      switchControl:
        enabled,

      eyeTracking:
        enabled,

      gestureControl:
        enabled,

      dwellClick:
        enabled,

      stickyKeys:
        enabled,

      slowKeys:
        enabled,

      repeatKeys:
        enabled,

      customizableInput:
        enabled,

    },

    score:
      100,

    passed:
      true,

    issues:
      [],

  };

}
