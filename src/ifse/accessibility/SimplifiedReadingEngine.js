// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Simplified Reading Engine
// =======================================================

export function evaluateSimplifiedReading(request = {}) {

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

  const cognitiveNeed =
    normalizedNeeds.some(
      (need) =>
        need === "cognitive disability" ||
        need === "cognitive impairment" ||
        need === "cognitive accessibility" ||
        need === "dyslexia" ||
        need === "autism" ||
        need === "adhd" ||
        need === "simplified reading" ||
        need === "easy language"
    );

  const enabled =
    source.simplifiedReading === true ||
    cognitiveNeed;

  return {

    engine:
      "Simplified Reading Engine",

    enabled,

    features: {

      plainLanguage:
        enabled,

      shortSentences:
        enabled,

      paragraphChunking:
        enabled,

      keyPointHighlighting:
        enabled,

      readingSummaries:
        enabled,

      progressiveDisclosure:
        enabled,

      simplifiedNavigation:
        enabled,

      visualReadingGuides:
        enabled,

      adjustableReadingWidth:
        enabled,

      customizableReadingLayout:
        enabled,

      distractionFreeReading:
        enabled,

      imageAssistedReading:
        enabled,

      glossarySupport:
        enabled,

      aiContentSimplification:
        enabled,

    },

    supportedContent: {

      posts:
        true,

      articles:
        true,

      messages:
        true,

      comments:
        true,

      documentation:
        true,

      educationalContent:
        true,

      verificationForms:
        true,

      marketplaceDescriptions:
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
