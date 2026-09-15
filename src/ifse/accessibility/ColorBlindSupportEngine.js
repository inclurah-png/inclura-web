// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Color Blind Support Engine
// =======================================================

export function evaluateColorBlindSupport(request = {}) {

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
        need === "color blind" ||
        need === "colorblind" ||
        need === "color blindness" ||
        need === "color vision deficiency" ||
        need === "colour blind" ||
        need === "colour blindness" ||
        need === "colour vision deficiency"
    );

  return {

    engine:
      "Color Blind Support Engine",

    enabled,

    features: {

      colorSafePalette:
        enabled,

      highContrastMode:
        enabled,

      patternIndicators:
        enabled,

      textLabels:
        enabled,

      iconReinforcement:
        enabled,

      customizableColors:
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
