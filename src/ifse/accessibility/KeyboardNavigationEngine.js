// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Keyboard Navigation Engine
// =======================================================

export function evaluateKeyboardNavigation(request = {}) {

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

  const explicitKeyboardNavigation =
    source.keyboardNavigation === true ||
    (
      typeof source.keyboardNavigation === "string" &&
      [
        "true",
        "yes",
        "enabled",
        "on",
      ].includes(
        source.keyboardNavigation
          .trim()
          .toLowerCase()
      )
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

  const enabled =
    explicitKeyboardNavigation ||
    motorNeed ||
    blindNeed;

  return {

    engine:
      "Keyboard Navigation Engine",

    enabled,

    features: {

      tabNavigation:
        enabled,

      skipLinks:
        enabled,

      focusIndicators:
        enabled,

      keyboardShortcuts:
        enabled,

      arrowKeyNavigation:
        enabled,

      escapeNavigation:
        enabled,

      enterActivation:
        enabled,

      spaceActivation:
        enabled,

      customHotkeys:
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
