// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Research Institution Verification Engine
// =======================================================

export function evaluateResearchInstitution(request) {

  let verified = false;

  const issues = [];

  if (
    request.researchLicense &&
    request.researchAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Research institution verification information incomplete"
    );

  }

  return {

    engine: "Research Institution Verification Engine",

    verified,

    researchLicense:
      request.researchLicense || null,

    researchAuthority:
      request.researchAuthority || null,

    researchField:
      request.researchField || null,

    issues,

  };

}
