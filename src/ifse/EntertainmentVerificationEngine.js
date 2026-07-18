// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Entertainment Verification Engine
// =======================================================

export function evaluateEntertainment(request) {

  let verified = false;

  const issues = [];

  if (
    request.entertainmentLicense &&
    request.entertainmentAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Entertainment verification information incomplete"
    );

  }

  return {

    engine: "Entertainment Verification Engine",

    verified,

    entertainmentLicense:
      request.entertainmentLicense || null,

    entertainmentAuthority:
      request.entertainmentAuthority || null,

    entertainmentCategory:
      request.entertainmentCategory || null,

    issues,

  };

}
