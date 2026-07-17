// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Government Verification Engine
// =======================================================

export function evaluateGovernment(request) {

  let verified = false;

  const issues = [];

  if (
    request.governmentId &&
    request.governmentAgency
  ) {

    verified = true;

  } else {

    issues.push(
      "Government verification information incomplete"
    );

  }

  return {

    engine: "Government Verification Engine",

    verified,

    governmentId:
      request.governmentId || null,

    governmentAgency:
      request.governmentAgency || null,

    country:
      request.country || null,

    issues,

  };

}
