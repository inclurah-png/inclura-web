// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Caption Engine
// =======================================================

export function evaluateCaption(request = {}) {

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

  const hearingNeed =
    normalizedNeeds.some(
      (need) =>
        need === "deaf" ||
        need === "deaf support" ||
        need === "hard of hearing" ||
        need === "hearing impairment" ||
        need === "hearing disability" ||
        need === "hearing accessibility" ||
        need === "captions" ||
        need === "caption support"
    );

  const enabled =
    source.captions === true ||
    hearingNeed;

  return {

    engine:
      "Caption Engine",

    enabled,

    features: {

      closedCaptions:
        enabled,

      openCaptions:
        enabled,

      aiGeneratedCaptions:
        enabled,

      multilingualCaptions:
        enabled,

      captionCustomization:
        enabled,

      captionSynchronization:
        enabled,

      downloadableCaptions:
        enabled,

      editableCaptions:
        enabled,

    },

    supportedFormats: {

      srt:
        true,

      vtt:
        true,

      ttml:
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
