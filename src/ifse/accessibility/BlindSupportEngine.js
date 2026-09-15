// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Blind Support Engine
// =======================================================

export function evaluateBlindSupport(request = {}) {

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

  const enabled =
    normalizedNeeds.some(
      (need) =>
        need === "blind" ||
        need === "blindness" ||
        need === "blind support" ||
        need === "blind user" ||
        need === "blind users" ||
        need === "visually blind" ||
        need === "visual blindness" ||
        need === "total blindness"
    );

  return {

    engine:
      "Blind Support Engine",

    enabled,

    features: {

      screenReader:
        enabled,

      braille:
        enabled,

      voiceNavigation:
        enabled,

      imageDescriptions:
        enabled,

      audioFeedback:
        enabled,

      keyboardNavigation:
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
