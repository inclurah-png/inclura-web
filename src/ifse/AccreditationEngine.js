// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Accreditation Engine
// =======================================================

export function evaluateAccreditation(request) {

  let verified = false;

  const issues = [];

  if (
    request.accreditationNumber &&
    request.accreditationAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Accreditation information incomplete"
    );

  }

  return {

    engine: "Accreditation Engine",

    verified,

    accreditationNumber:
      request.accreditationNumber || null,

    accreditationAuthority:
      request.accreditationAuthority || null,

    expiryDate:
      request.accreditationExpiry || null,

    issues,

  };

}
