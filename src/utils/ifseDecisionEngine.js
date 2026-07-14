// =======================================================
// IFSE Decision Engine
// =======================================================

export function getIFSEDecision(score) {

  if (score >= 90) {
    return {
      status: "approved",
      badge: true,
      executiveReview: false,
      message: "Verification Approved",
    };
  }

  if (score >= 70) {
    return {
      status: "manual_review",
      badge: false,
      executiveReview: true,
      message: "Executive Review Required",
    };
  }

  if (score >= 50) {
    return {
      status: "additional_documents",
      badge: false,
      executiveReview: false,
      message: "Additional Documents Required",
    };
  }

  return {
    status: "rejected",
    badge: false,
    executiveReview: false,
    message: "Verification Rejected",
  };

}
