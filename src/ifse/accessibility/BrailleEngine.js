// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Braille Engine
// =======================================================

export function evaluateBraille(request = {}) {

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

  const explicitBraille =
    source.braille === true ||
    (
      typeof source.braille === "string" &&
      [
        "true",
        "yes",
        "enabled",
        "on",
      ].includes(
        source.braille
          .trim()
          .toLowerCase()
      )
    );

  const blindNeed =
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

  const brailleNeed =
    normalizedNeeds.some(
      (need) =>
        need === "braille" ||
        need === "braille support" ||
        need === "braille user" ||
        need === "braille users"
    );

  const enabled =
    explicitBraille ||
    blindNeed ||
    brailleNeed;

  return {

    engine:
      "Braille Engine",

    enabled,

    features: {

      refreshableBrailleDisplay:
        enabled,

      brailleKeyboardInput:
        enabled,

      brailleOutput:
        enabled,

      contractedBraille:
        enabled,

      uncontractedBraille:
        enabled,

      unicodeBrailleSupport:
        enabled,

    },

    supportedStandards: {

      grade1:
        true,

      grade2:
        true,

      unicodeBraille:
        true,

    },

    score:
      100,

    passed:
      true,

    issues:
      [],

  };

}
