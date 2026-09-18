// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Dyslexia Support Engine
// =======================================================

export function evaluateDyslexiaSupport(
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
    source.dyslexiaSupport === true ||
    source.dyslexia === true ||
    normalizedNeeds.some(
      (need) =>
        need === "dyslexia" ||
        need === "dyslexic" ||
        need === "dyslexia support" ||
        need === "reading difficulty" ||
        need === "reading difficulties"
    );

  return {

    engine:
      "Dyslexia Support Engine",

    enabled,

    features: {

      dyslexiaFriendlyFonts:
        enabled,

      adjustableLetterSpacing:
        enabled,

      adjustableWordSpacing:
        enabled,

      adjustableLineSpacing:
        enabled,

      readingRuler:
        enabled,

      syllableHighlighting:
        enabled,

      wordHighlighting:
        enabled,

      sentenceHighlighting:
        enabled,

      synchronizedTextToSpeech:
        enabled,

      aiReadingAssistant:
        enabled,

      readingProgressTracking:
        enabled,

      pronunciationSupport:
        enabled,

      simplifiedLayout:
        enabled,

      customizableReadingTheme:
        enabled,

    },

    recommendations: {

      font:
        "OpenDyslexic",

      spacing:
        "comfortable",

      theme:
        "highContrast",

    },

    score:
      100,

    passed:
      true,

    issues: [],

  };

}
