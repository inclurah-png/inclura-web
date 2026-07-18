// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Transportation Verification Engine
// =======================================================

export function evaluateTransportation(request) {

  let verified = false;

  const issues = [];

  if (
    request.transportLicense &&
    request.transportAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Transportation verification information incomplete"
    );

  }

  return {

    engine: "Transportation Verification Engine",

    verified,

    transportLicense:
      request.transportLicense || null,

    transportAuthority:
      request.transportAuthority || null,

    transportType:
      request.transportType || null,

    issues,

  };

}
