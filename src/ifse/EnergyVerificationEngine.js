// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Energy Verification Engine
// =======================================================

export function evaluateEnergy(request) {

  let verified = false;

  const issues = [];

  if (
    request.energyLicense &&
    request.energyAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Energy verification information incomplete"
    );

  }

  return {

    engine: "Energy Verification Engine",

    verified,

    energyLicense:
      request.energyLicense || null,

    energyAuthority:
      request.energyAuthority || null,

    energyType:
      request.energyType || null,

    issues,

  };

}
