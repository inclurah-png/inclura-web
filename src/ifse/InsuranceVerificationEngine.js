// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Insurance Verification Engine
// =======================================================

export function evaluateInsurance(request) {

  let verified = false;

  const issues = [];

  if (
    request.insuranceLicense &&
    request.insuranceAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Insurance verification information incomplete"
    );

  }

  return {

    engine: "Insurance Verification Engine",

    verified,

    insuranceLicense:
      request.insuranceLicense || null,

    insuranceAuthority:
      request.insuranceAuthority || null,

    providerType:
      request.providerType || null,

    issues,

  };

}
