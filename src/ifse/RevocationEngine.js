// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Revocation Engine
// =======================================================

export function evaluateRevocation(request) {

  let revoked = false;

  const reasons = [];

  if (request.fraudDetected) {
    revoked = true;
    reasons.push("Fraud detected");
  }

  if (request.policyViolation) {
    revoked = true;
    reasons.push("Policy violation");
  }

  if (request.complianceFailed) {
    revoked = true;
    reasons.push("Compliance failure");
  }

  return {

    engine: "Revocation Engine",

    revoked,

    reasons,

    reviewed: false,

  };

}
