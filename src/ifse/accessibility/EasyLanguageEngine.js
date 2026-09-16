// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Easy Language Engine
// =======================================================

export function evaluateEasyLanguage(request = {}) {

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
        need === "easy language" ||
        need === "plain language"
    );

  const enabled =
    source.easyLanguage === true ||
    cognitiveNeed;

  return {

    engine:
      "Easy Language Engine",

    enabled,

    features: {

      aiPlainLanguage:
        enabled,

      sentenceSimplification:
        enabled,

      vocabularySimplification:
        enabled,

      conceptExplanation:
        enabled,

      abbreviationExpansion:
        enabled,

      difficultWordDefinitions:
        enabled,

      multilingualEasyLanguage:
        enabled,

      creatorContentPreservation:
        true,

      toggleOriginalContent:
        true,

      userControlledTranslation:
        true,

    },

    supportedContent: {

      posts:
        true,

      comments:
        true,

      messages:
        true,

      marketplace:
        true,

      documentation:
        true,

      learningContent:
        true,

      verificationForms:
        true,

      announcements:
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
