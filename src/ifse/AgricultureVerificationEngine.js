// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Agriculture Verification Engine
// =======================================================

export function evaluateAgriculture(request) {

  let verified = false;

  const issues = [];

  if (
    request.agricultureLicense &&
    request.agricultureAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Agriculture verification information incomplete"
    );

  }

  return {

    engine: "Agriculture Verification Engine",

    verified,

    agricultureLicense:
      request.agricultureLicense || null,

    agricultureAuthority:
      request.agricultureAuthority || null,

    agricultureType:
      request.agricultureType || null,

    issues,

  };

}
