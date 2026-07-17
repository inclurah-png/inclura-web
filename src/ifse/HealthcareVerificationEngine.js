// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Healthcare Verification Engine
// =======================================================

export function evaluateHealthcare(request) {

  let verified = false;

  const issues = [];

  if (
    request.healthcareLicense &&
    request.healthcareAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Healthcare verification information incomplete"
    );

  }

  return {

    engine: "Healthcare Verification Engine",

    verified,

    healthcareLicense:
      request.healthcareLicense || null,

    healthcareAuthority:
      request.healthcareAuthority || null,

    facilityType:
      request.facilityType || null,

    issues,

  };

}
