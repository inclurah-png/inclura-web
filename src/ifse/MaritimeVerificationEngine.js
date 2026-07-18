// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Maritime Verification Engine
// =======================================================

export function evaluateMaritime(request) {

  let verified = false;

  const issues = [];

  if (
    request.maritimeLicense &&
    request.maritimeAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Maritime verification information incomplete"
    );

  }

  return {

    engine: "Maritime Verification Engine",

    verified,

    maritimeLicense:
      request.maritimeLicense || null,

    maritimeAuthority:
      request.maritimeAuthority || null,

    vesselType:
      request.vesselType || null,

    issues,

  };

}
