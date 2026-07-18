// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Manufacturing Verification Engine
// =======================================================

export function evaluateManufacturing(request) {

  let verified = false;

  const issues = [];

  if (
    request.manufacturingLicense &&
    request.manufacturingAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Manufacturing verification information incomplete"
    );

  }

  return {

    engine: "Manufacturing Verification Engine",

    verified,

    manufacturingLicense:
      request.manufacturingLicense || null,

    manufacturingAuthority:
      request.manufacturingAuthority || null,

    industryType:
      request.industryType || null,

    issues,

  };

}
