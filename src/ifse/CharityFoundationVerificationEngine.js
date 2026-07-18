// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Charity Foundation Verification Engine
// =======================================================

export function evaluateCharityFoundation(request) {

  let verified = false;

  const issues = [];

  if (
    request.charityRegistration &&
    request.charityAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Charity foundation verification information incomplete"
    );

  }

  return {

    engine: "Charity Foundation Verification Engine",

    verified,

    charityRegistration:
      request.charityRegistration || null,

    charityAuthority:
      request.charityAuthority || null,

    charityType:
      request.charityType || null,

    issues,

  };

}
