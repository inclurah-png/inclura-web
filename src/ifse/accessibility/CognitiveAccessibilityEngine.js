// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Cognitive Accessibility Engine
// =======================================================

export function evaluateCognitiveAccessibility(
  request = {}
) {

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

  const cognitiveDisability =
    normalizedNeeds.some(
      (need) =>
        need === "cognitive disability" ||
        need === "cognitive impairment" ||
        need === "cognitive accessibility"
    );

  const dyslexia =
    normalizedNeeds.some(
      (need) =>
        need === "dyslexia" ||
        need === "dyslexia support"
    );

  const autism =
    normalizedNeeds.some(
      (need) =>
        need === "autism" ||
        need === "autism spectrum" ||
        need === "autism spectrum disorder" ||
        need === "autistic"
    );

  const adhd =
    normalizedNeeds.some(
      (need) =>
        need === "adhd" ||
        need === "adhd support" ||
        need === "attention deficit" ||
        need ===
          "attention deficit hyperactivity disorder"
    );

  const enabled =
    cognitiveDisability ||
    dyslexia ||
    autism ||
    adhd;

  return {

    engine:
      "Cognitive Accessibility Engine",

    enabled,

    profile: {

      cognitiveDisability:
        cognitiveDisability,

      dyslexia:
        dyslexia,

      autism:
        autism,

      adhd:
        adhd,

    },

    features: {

      simplifiedReading:
        enabled,

      easyLanguage:
        enabled,

      distractionReduction:
        enabled,

      readingAssistance:
        enabled,

      focusMode:
        enabled,

      memorySupport:
        enabled,

      stepByStepGuidance:
        enabled,

      predictableNavigation:
        enabled,

      visualSchedules:
        enabled,

      personalizedLearningSupport:
        enabled,

    },

    score:
      100,

    passed:
      true,

    issues:
      [],

  };

}
