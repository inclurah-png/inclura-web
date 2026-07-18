// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Diplomatic Organization Verification Engine
// =======================================================

export function evaluateDiplomaticOrganization(request) {

  let verified = false;

  const issues = [];

  if (
    request.diplomaticRegistration &&
    request.diplomaticAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Diplomatic organization verification information incomplete"
    );

  }

  return {

    engine: "Diplomatic Organization Verification Engine",

    verified,

    diplomaticRegistration:
      request.diplomaticRegistration || null,

    diplomaticAuthority:
      request.diplomaticAuthority || null,

    missionType:
      request.missionType || null,

    issues,

  };

}
