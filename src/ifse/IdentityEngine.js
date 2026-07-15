// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Identity Verification Engine
// =======================================================

export function evaluateIdentity(request) {

  let score = 0;

  const issues = [];

  // Full Name
  if (request.fullName) {
    score += 20;
  } else {
    issues.push("Full name missing");
  }

  // Email
  if (request.email) {
    score += 20;
  } else {
    issues.push("Email missing");
  }

  // Phone Number
  if (request.phone) {
    score += 20;
  } else {
    issues.push("Phone number missing");
  }

  // Official Email
  if (request.officialEmail) {
    score += 20;
  }

  // Organization
  if (request.organizationName) {
    score += 20;
  }

  return {

    engine: "Identity Engine",

    score,

    passed: score >= 60,

    issues,

  };

}
