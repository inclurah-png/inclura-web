// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Tourism Verification Engine
// =======================================================

export function evaluateTourism(request) {

  let verified = false;

  const issues = [];

  if (
    request.tourismLicense &&
    request.tourismAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Tourism verification information incomplete"
    );

  }

  return {

    engine: "Tourism Verification Engine",

    verified,

    tourismLicense:
      request.tourismLicense || null,

    tourismAuthority:
      request.tourismAuthority || null,

    tourismType:
      request.tourismType || null,

    issues,

  };

}
