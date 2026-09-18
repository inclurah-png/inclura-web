// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Deaf Support Engine
// =======================================================

export function evaluateDeafSupport(
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
    source.deafSupport === true ||
    source.deaf === true ||
    normalizedNeeds.some(
      (need) =>
        need === "deaf" ||
        need === "deafness" ||
        need === "deaf support" ||
        need === "hearing impaired" ||
        need === "hearing impairment" ||
        need === "deaf or hard of hearing"
    );

  return {

    engine:
      "Deaf Support Engine",

    enabled,

    features: {

      captions:
        enabled,

      liveTranscription:
        enabled,

      signLanguage:
        enabled,

      speechToText:
        enabled,

      visualNotifications:
        enabled,

      vibrationAlerts:
        enabled,

      textMessagingPriority:
        enabled,

      mediaCaptionRequired:
        enabled,

    },

    score:
      100,

    passed:
      true,

    issues: [],

  };

}
