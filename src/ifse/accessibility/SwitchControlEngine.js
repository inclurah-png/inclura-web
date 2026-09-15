// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Switch Control Engine
// =======================================================

export function evaluateSwitchControl(request = {}) {

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

  const motorNeed =
    normalizedNeeds.some(
      (need) =>
        need === "motor impairment" ||
        need === "motorimpairment" ||
        need === "motor disability" ||
        need === "motor accessibility" ||
        need === "mobility impairment" ||
        need === "mobility disability" ||
        need === "physical disability"
    );

  const enabled =
    source.switchControl === true ||
    motorNeed;

  return {

    engine:
      "Switch Control Engine",

    enabled,

    features: {

      singleSwitchInput:
        enabled,

      dualSwitchInput:
        enabled,

      multiSwitchInput:
        enabled,

      automaticScanning:
        enabled,

      manualScanning:
        enabled,

      configurableScanSpeed:
        enabled,

      switchAssignments:
        enabled,

      externalSwitchSupport:
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
