// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Compliance Engine
// =======================================================

export function evaluateCompliance(request) {

  let score = 100;

  const issues = [];

  // Organization name
  if (!request.organizationName) {
    score -= 20;
    issues.push("Organization name missing");
  }

  // Official email
  if (!request.officialEmail) {
    score -= 20;
    issues.push("Official email missing");
  }

  // Website
  if (!request.website) {
    score -= 10;
    issues.push("Official website missing");
  }

  // Document uploaded
  if (!request.documentName) {
    score -= 30;
    issues.push("Verification document missing");
  }

  // Country
  if (!request.country) {
    score -= 10;
    issues.push("Country not specified");
  }

  // Prevent negative score
  score = Math.max(score, 0);

  return {

    engine: "Compliance Engine",

    score,

    passed: score >= 60,

    issues,

  };

}
