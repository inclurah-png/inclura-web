// =======================================================
// Inclura Fortress Security Engine (IFSE)
// ADHD Support Engine
// =======================================================

export function evaluateADHDSupport(request = {}) {

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

  const adhdNeed =
    normalizedNeeds.some(
      (need) =>
        need === "adhd" ||
        need === "adhd support" ||
        need === "attention deficit hyperactivity disorder" ||
        need === "attention deficit" ||
        need === "executive function support"
    );

  const enabled =
    source.adhdSupport === true ||
    source.adhd === true ||
    adhdNeed;

  return {

    engine:
      "ADHD Support Engine",

    enabled,

    features: {

      focusMode:
        enabled,

      distractionReduction:
        enabled,

      notificationFiltering:
        enabled,

      taskBreakdown:
        enabled,

      stepByStepGuidance:
        enabled,

      visualTimers:
        enabled,

      focusSessions:
        enabled,

      reminderScheduling:
        enabled,

      executiveFunctionSupport:
        enabled,

      priorityHighlighting:
        enabled,

      readingFocusTools:
        enabled,

      progressTracking:
        enabled,

      customizableWorkspace:
        enabled,

      quickResume:
        enabled,

      routineBuilder:
        enabled,

    },

    productivitySupport: {

      pomodoroTimer:
        enabled,

      smartReminders:
        enabled,

      habitTracking:
        enabled,

      goalTracking:
        enabled,

      calendarIntegration:
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
