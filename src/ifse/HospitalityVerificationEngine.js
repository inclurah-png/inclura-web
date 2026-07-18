// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Hospitality Verification Engine
// =======================================================

export function evaluateHospitality(request) {

  let verified = false;

  const issues = [];

  if (
    request.hospitalityLicense &&
    request.hospitalityAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Hospitality verification information incomplete"
    );

  }

  return {

    engine: "Hospitality Verification Engine",

    verified,

    hospitalityLicense:
      request.hospitalityLicense || null,

    hospitalityAuthority:
      request.hospitalityAuthority || null,

    hospitalityType:
      request.hospitalityType || null,

    issues,

  };

}
