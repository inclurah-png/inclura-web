// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Partnership Engine
// =======================================================

export function evaluatePartnership(request) {

  let approved = false;

  const issues = [];

  if (
    request.organizationName &&
    request.partnershipType
  ) {

    approved = true;

  } else {

    issues.push(
      "Partnership information incomplete"
    );

  }

  return {

    engine: "Partnership Engine",

    approved,

    partnershipType:
      request.partnershipType || null,

    organization:
      request.organizationName || null,

    level:
      request.partnershipLevel || "Standard",

    issues,

  };

}
