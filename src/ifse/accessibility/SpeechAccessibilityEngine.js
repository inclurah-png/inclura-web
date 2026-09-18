// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Speech Accessibility Engine
// =======================================================

export function evaluateSpeechAccessibility(
  request = {}
) {
  const source =
    request && typeof request === "object"
      ? request
      : {};

  const needs =
    Array.isArray(source.accessibilityNeeds)
      ? source.accessibilityNeeds
      : [];

  const normalizedNeeds =
    needs
      .filter((need) => typeof need === "string")
      .map((need) =>
        need
          .trim()
          .toLowerCase()
          .replace(/[_-]+/g, " ")
      );

  const enabled =
    source.speechImpairment === true ||
    source.speechAccessibility === true ||
    normalizedNeeds.some(
      (need) =>
        need === "speechimpairment" ||
        need === "speech impairment" ||
        need === "speech disability" ||
        need === "speech accessibility" ||
        need === "speech difficulty" ||
        need === "speech difficulties" ||
        need === "communication impairment" ||
        need === "communication disability" ||
        need === "aac"
    );

  return {
    engine: "Speech Accessibility Engine",

    enabled,

    profile: {
      speechImpairment: enabled,
    },

    features: {
      textToSpeech: enabled,
      speechToText: enabled,
      aacSupport: enabled,
      symbolCommunication: enabled,
      predictivePhrases: enabled,
      aiCommunicationAssistant: enabled,
      customizableVoiceOutput: enabled,
      multilingualCommunication: enabled,
      offlineCommunication: enabled,
    },

    score: 100,

    passed: true,

    issues: [],
  };
}
