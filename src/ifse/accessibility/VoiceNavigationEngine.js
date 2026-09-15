// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Voice Navigation Engine
// =======================================================

export function evaluateVoiceNavigation(request = {}) {

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

  const explicitVoiceNavigation =
    source.voiceNavigation === true ||
    (
      typeof source.voiceNavigation === "string" &&
      [
        "true",
        "yes",
        "enabled",
        "on",
      ].includes(
        source.voiceNavigation
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
    explicitVoiceNavigation ||
    motorNeed ||
    blindNeed;

  return {

    engine:
      "Voice Navigation Engine",

    enabled,

    features: {

      voiceCommands:
        enabled,

      voiceSearch:
        enabled,

      voiceSelection:
        enabled,

      voiceScrolling:
        enabled,

      voiceActivation:
        enabled,

      voiceConfirmation:
        enabled,

      multilingualRecognition:
        enabled,

      offlineRecognition:
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
