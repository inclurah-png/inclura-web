// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Legal Verification Engine
// =======================================================

export function evaluateLegal(request) {

  let verified = false;

  const issues = [];

  if (
    request.legalLicense &&
    request.legalAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Legal verification information incomplete"
    );

  }

  return {

    engine: "Legal Verification Engine",

    verified,

    legalLicense:
      request.legalLicense || null,

    legalAuthority:
      request.legalAuthority || null,

    organizationType:
      request.organizationType || null,

    issues,

  };

}
