// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Intellectual Property Verification Engine
// =======================================================

export function evaluateIntellectualProperty(request) {

  let verified = false;

  const issues = [];

  if (
    request.ipRegistrationNumber &&
    request.ipAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Intellectual property verification information incomplete"
    );

  }

  return {

    engine: "Intellectual Property Verification Engine",

    verified,

    registrationNumber:
      request.ipRegistrationNumber || null,

    authority:
      request.ipAuthority || null,

    assetType:
      request.ipType || null,

    issues,

  };

}
