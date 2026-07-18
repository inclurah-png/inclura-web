// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Switch Control Engine
// =======================================================

export function evaluateSwitchControl(request) {

  const enabled =
    request.switchControl === true ||
    (request.accessibilityNeeds || []).includes("motorImpairment");

  return {

    engine: "Switch Control Engine",

    enabled,

    features: {

      singleSwitchInput: enabled,

      dualSwitchInput: enabled,

      multiSwitchInput: enabled,

      automaticScanning: enabled,

      manualScanning: enabled,

      configurableScanSpeed: enabled,

      switchAssignments: enabled,

      externalSwitchSupport: enabled,

    },

    score: 100,

    passed: true,

    issues: [],

  };

}
