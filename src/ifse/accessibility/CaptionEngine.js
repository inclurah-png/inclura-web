// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Caption Engine
// =======================================================

export function evaluateCaption(request) {

  const enabled =
    request.captions === true ||
    (request.accessibilityNeeds || []).includes("deaf") ||
    (request.accessibilityNeeds || []).includes("hardOfHearing");

  return {

    engine: "Caption Engine",

    enabled,

    features: {

      closedCaptions: enabled,

      openCaptions: enabled,

      aiGeneratedCaptions: enabled,

      multilingualCaptions: enabled,

      captionCustomization: enabled,

      captionSynchronization: enabled,

      downloadableCaptions: enabled,

      editableCaptions: enabled,

    },

    supportedFormats: {

      srt: true,

      vtt: true,

      ttml: true,

    },

    score: 100,

    passed: true,

    issues: [],

  };

}
