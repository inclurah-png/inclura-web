// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Utilities Verification Engine
// =======================================================

export function evaluateUtilities(request) {

  let verified = false;

  const issues = [];

  if (
    request.utilityLicense &&
    request.utilityAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Utilities verification information incomplete"
    );

  }

  return {

    engine: "Utilities Verification Engine",

    verified,

    utilityLicense:
      request.utilityLicense || null,

    utilityAuthority:
      request.utilityAuthority || null,

    utilityType:
      request.utilityType || null,

    issues,

  };

}
