// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Sports Verification Engine
// =======================================================

export function evaluateSports(request) {

  let verified = false;

  const issues = [];

  if (
    request.sportsLicense &&
    request.sportsAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Sports verification information incomplete"
    );

  }

  return {

    engine: "Sports Verification Engine",

    verified,

    sportsLicense:
      request.sportsLicense || null,

    sportsAuthority:
      request.sportsAuthority || null,

    sportsCategory:
      request.sportsCategory || null,

    issues,

  };

}
