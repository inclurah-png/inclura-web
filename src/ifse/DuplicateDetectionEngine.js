// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Duplicate Detection Engine
// =======================================================

export function evaluateDuplicates(request) {

  let score = 100;

  const issues = [];

  if (request.duplicateEmail) {
    score -= 30;
    issues.push("Duplicate email detected");
  }

  if (request.duplicatePhone) {
    score -= 30;
    issues.push("Duplicate phone detected");
  }

  if (request.duplicateOrganization) {
    score -= 40;
    issues.push("Duplicate organization detected");
  }

  return {

    engine: "Duplicate Detection Engine",

    score,

    passed: score >= 60,

    issues,

  };

}
