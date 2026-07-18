// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Mining Verification Engine
// =======================================================

export function evaluateMining(request) {

  let verified = false;

  const issues = [];

  if (
    request.miningLicense &&
    request.miningAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Mining verification information incomplete"
    );

  }

  return {

    engine: "Mining Verification Engine",

    verified,

    miningLicense:
      request.miningLicense || null,

    miningAuthority:
      request.miningAuthority || null,

    mineralType:
      request.mineralType || null,

    issues,

  };

}
