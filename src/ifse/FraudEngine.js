// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Fraud Detection Engine
// =======================================================

export function evaluateFraud(request) {

  let score = 100;

  const issues = [];

  if (!request.email) {
    score -= 20;
    issues.push("Missing email");
  }

  if (!request.phone) {
    score -= 20;
    issues.push("Missing phone number");
  }

  if (!request.officialEmail && request.accountType !== "creator") {
    score -= 20;
    issues.push("Missing official organization email");
  }

  if (!request.documentName) {
    score -= 20;
    issues.push("Missing verification document");
  }

  if (!request.organizationName &&
      request.accountType !== "creator") {
    score -= 20;
    issues.push("Organization name missing");
  }

  return {
    engine: "Fraud Engine",
    score,
    passed: score >= 60,
    issues,
  };

}
