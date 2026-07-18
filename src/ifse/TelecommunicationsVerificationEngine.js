// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Telecommunications Verification Engine
// =======================================================

export function evaluateTelecommunications(request) {

  let verified = false;

  const issues = [];

  if (
    request.telecomLicense &&
    request.telecomAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Telecommunications verification information incomplete"
    );

  }

  return {

    engine: "Telecommunications Verification Engine",

    verified,

    telecomLicense:
      request.telecomLicense || null,

    telecomAuthority:
      request.telecomAuthority || null,

    serviceType:
      request.telecomServiceType || null,

    issues,

  };

}
