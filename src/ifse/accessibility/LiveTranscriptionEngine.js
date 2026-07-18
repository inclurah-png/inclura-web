// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Live Transcription Engine
// =======================================================

export function evaluateLiveTranscription(request) {

  const enabled =
    request.liveTranscription === true ||
    (request.accessibilityNeeds || []).includes("deaf") ||
    (request.accessibilityNeeds || []).includes("hardOfHearing");

  return {

    engine: "Live Transcription Engine",

    enabled,

    features: {

      realtimeSpeechToText: enabled,

      multilingualTranscription: enabled,

      speakerIdentification: enabled,

      punctuationRestoration: enabled,

      timestampSupport: enabled,

      transcriptDownload: enabled,

      transcriptSearch: enabled,

      transcriptHistory: enabled,

      offlineTranscription: enabled,

    },

    supportedSources: {

      voiceCalls: true,

      videoCalls: true,

      liveStreams: true,

      audioPosts: true,

      meetings: true,

      podcasts: true,

      voiceMessages: true,

    },

    score: 100,

    passed: true,

    issues: [],

  };

}
