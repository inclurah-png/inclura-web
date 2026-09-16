// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Live Transcription Engine
// =======================================================

export function evaluateLiveTranscription(request = {}) {

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
        need === "live transcription" ||
        need === "transcription"
    );

  const enabled =
    source.liveTranscription === true ||
    hearingNeed;

  return {

    engine:
      "Live Transcription Engine",

    enabled,

    features: {

      realtimeSpeechToText:
        enabled,

      multilingualTranscription:
        enabled,

      speakerIdentification:
        enabled,

      punctuationRestoration:
        enabled,

      timestampSupport:
        enabled,

      transcriptDownload:
        enabled,

      transcriptSearch:
        enabled,

      transcriptHistory:
        enabled,

      offlineTranscription:
        enabled,

    },

    supportedSources: {

      voiceCalls:
        true,

      videoCalls:
        true,

      liveStreams:
        true,

      audioPosts:
        true,

      meetings:
        true,

      podcasts:
        true,

      voiceMessages:
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
