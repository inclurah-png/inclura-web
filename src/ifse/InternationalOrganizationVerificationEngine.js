// =======================================================
// Inclura Fortress Security Engine (IFSE)
// International Organization Verification Engine
// =======================================================

export function evaluateInternationalOrganization(request) {

  let verified = false;

  const issues = [];

  if (
    request.internationalRegistration &&
    request.internationalAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "International organization verification information incomplete"
    );

  }

  return {

    engine: "International Organization Verification Engine",

    verified,

    internationalRegistration:
      request.internationalRegistration || null,

    internationalAuthority:
      request.internationalAuthority || null,

    organizationScope:
      request.organizationScope || null,

    issues,

  };

}
