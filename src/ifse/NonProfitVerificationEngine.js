// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Non-Profit Verification Engine
// =======================================================

export function evaluateNonProfit(request) {

  let verified = false;

  const issues = [];

  if (
    request.registrationNumber &&
    request.registrationAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Non-profit verification information incomplete"
    );

  }

  return {

    engine: "Non-Profit Verification Engine",

    verified,

    registrationNumber:
      request.registrationNumber || null,

    registrationAuthority:
      request.registrationAuthority || null,

    organizationType:
      request.organizationType || null,

    issues,

  };

}
