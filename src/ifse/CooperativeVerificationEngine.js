// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Cooperative Verification Engine
// =======================================================

export function evaluateCooperative(request) {

  let verified = false;

  const issues = [];

  if (
    request.cooperativeRegistration &&
    request.cooperativeAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Cooperative verification information incomplete"
    );

  }

  return {

    engine: "Cooperative Verification Engine",

    verified,

    cooperativeRegistration:
      request.cooperativeRegistration || null,

    cooperativeAuthority:
      request.cooperativeAuthority || null,

    cooperativeType:
      request.cooperativeType || null,

    issues,

  };

}
