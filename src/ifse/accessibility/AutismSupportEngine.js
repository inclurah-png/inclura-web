// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Autism Support Engine
// =======================================================

export function evaluateAutismSupport(request = {}) {

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

  const autismNeed =
    normalizedNeeds.some(
      (need) =>
        need === "autism" ||
        need === "autism spectrum" ||
        need === "autism spectrum disorder" ||
        need === "autistic" ||
        need === "autism support"
    );

  const enabled =
    source.autismSupport === true ||
    source.autism === true ||
    autismNeed;

  return {

    engine:
      "Autism Support Engine",

    enabled,

    features: {

      predictableNavigation:
        enabled,

      simplifiedInterface:
        enabled,

      reducedAnimations:
        enabled,

      sensoryFriendlyMode:
        enabled,

      consistentLayouts:
        enabled,

      customizableColors:
        enabled,

      lowStimulusMode:
        enabled,

      focusMode:
        enabled,

      visualSchedules:
        enabled,

      routineReminders:
        enabled,

      socialCommunicationSupport:
        enabled,

      emotionRecognitionAssistance:
        enabled,

      visualInstructions:
        enabled,

      stepByStepGuidance:
        enabled,

      customizableNotifications:
        enabled,

    },

    sensorySupport: {

      flashingContentReduction:
        enabled,

      soundReduction:
        enabled,

      vibrationControl:
        enabled,

      brightnessAdjustment:
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
