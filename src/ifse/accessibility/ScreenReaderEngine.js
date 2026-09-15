// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Screen Reader Engine
// =======================================================

export function evaluateScreenReader(request = {}) {

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

  const explicitScreenReader =
    source.screenReader === true ||
    (
      typeof source.screenReader === "string" &&
      [
        "true",
        "yes",
        "enabled",
        "on",
      ].includes(
        source.screenReader
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

  const lowVisionNeed =
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

  const enabled =
    explicitScreenReader ||
    blindNeed ||
    lowVisionNeed;

  return {

    engine:
      "Screen Reader Engine",

    enabled,

    supportedReaders: {

      talkBack:
        true,

      voiceOver:
        true,

      nvda:
        true,

      jaws:
        true,

      narrator:
        true,

      orca:
        true,

    },

    features: {

      semanticNavigation:
        enabled,

      ariaSupport:
        enabled,

      focusManagement:
        enabled,

      imageDescriptions:
        enabled,

      liveRegionAnnouncements:
        enabled,

      keyboardSupport:
        enabled,

      gestureSupport:
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
