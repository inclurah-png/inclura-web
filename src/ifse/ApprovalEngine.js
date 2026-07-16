// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Approval Engine
// =======================================================

export function evaluateApproval(request) {

  let status = "approved";

  let level = "automatic";

  const reasons = [];

  if (request.executiveReview === true) {

    status = "executive_review";

    level = "executive";

    reasons.push("Executive review required.");

  }

  else if (request.manualReview === true) {

    status = "manual_review";

    level = "manual";

    reasons.push("Manual review required.");

  }

  return {

    engine: "Approval Engine",

    status,

    level,

    approved: status === "approved",

    reasons,

  };

}
