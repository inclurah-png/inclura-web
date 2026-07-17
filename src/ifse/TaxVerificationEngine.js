// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Tax Verification Engine
// =======================================================

export function evaluateTax(request) {

  let verified = false;

  const issues = [];

  if (
    request.taxIdentificationNumber &&
    request.taxAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Tax verification information incomplete"
    );

  }

  return {

    engine: "Tax Verification Engine",

    verified,

    taxIdentificationNumber:
      request.taxIdentificationNumber || null,

    taxAuthority:
      request.taxAuthority || null,

    country:
      request.country || null,

    issues,

  };

}
