// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Logistics Verification Engine
// =======================================================

export function evaluateLogistics(request) {

  let verified = false;

  const issues = [];

  if (
    request.logisticsLicense &&
    request.logisticsAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Logistics verification information incomplete"
    );

  }

  return {

    engine: "Logistics Verification Engine",

    verified,

    logisticsLicense:
      request.logisticsLicense || null,

    logisticsAuthority:
      request.logisticsAuthority || null,

    logisticsType:
      request.logisticsType || null,

    issues,

  };

}
