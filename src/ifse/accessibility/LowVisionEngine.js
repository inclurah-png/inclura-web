// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Low Vision Engine
// =======================================================

export function evaluateLowVision(request = {}) {

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
        need === "low vision" ||
        need === "lowvision" ||
        need === "low vision support" ||
        need === "visual impairment" ||
        need === "visual impairment support" ||
        need === "partially sighted" ||
        need === "partial sight" ||
        need === "impaired vision"
    );

  return {

    engine:
      "Low Vision Engine",

    enabled,

    features: {

      largeText:
        enabled,

      scalableFonts:
        enabled,

      highContrast:
        enabled,

      zoomSupport:
        enabled,

      colorEnhancement:
        enabled,

      focusHighlight:
        enabled,

      magnification:
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
