// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Generic Organization Verification Engine
// =======================================================

export function evaluateGenericOrganization(request) {

  let verified = false;

  const issues = [];

  if (
    request.organizationName &&
    request.registrationNumber &&
    request.registrationAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Organization verification information incomplete"
    );

  }

  return {

    engine: "Generic Organization Verification Engine",

    verified,

    organizationName:
      request.organizationName || null,

    organizationCategory:
      request.organizationCategory || null,

    registrationNumber:
      request.registrationNumber || null,

    registrationAuthority:
      request.registrationAuthority || null,

    country:
      request.country || null,

    website:
      request.website || null,

    officialEmail:
      request.officialEmail || null,

    officialPhone:
      request.officialPhone || null,

    issues,

  };

}
