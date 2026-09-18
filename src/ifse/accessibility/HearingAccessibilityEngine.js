// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Hearing Accessibility Engine
// =======================================================

export function evaluateHearingAccessibility(
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

  const deaf =
    source.deaf === true ||
    source.deafSupport === true ||
    normalizedNeeds.some(
      (need) =>
        need === "deaf" ||
        need === "deafness" ||
        need === "deaf support" ||
        need === "hearing impaired" ||
        need === "hearing impairment" ||
        need === "deaf or hard of hearing"
    );

  const hardOfHearing =
    source.hardOfHearing === true ||
    source.hardOfHearingSupport === true ||
    normalizedNeeds.some(
      (need) =>
        need === "hardofhearing" ||
        need === "hard of hearing" ||
        need === "hearing loss" ||
        need === "hearing difficulty" ||
        need === "hearing difficulties"
    );

  const enabled =
    deaf ||
    hardOfHearing;

  return {

    engine:
      "Hearing Accessibility Engine",

    enabled,

    profile: {

      deaf,

      hardOfHearing,

    },

    features: {

      captions:
        enabled,

      liveTranscription:
        enabled,

      signLanguage:
        enabled,

      visualNotifications:
        enabled,

      vibrationAlerts:
        enabled,

      speechToText:
        enabled,

      textCommunication:
        enabled,

    },

    score:
      100,

    passed:
      true,

    issues: [],

  };

}
