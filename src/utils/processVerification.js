// Deprecated client-side verification scoring is intentionally non-authoritative.
// All approval decisions must come from the protected IFSE administrator workflow.

export function processVerification() {
  return {
    score: null,
    scoreSource: "not_server_verified",
    status: "PENDING_SERVER_REVIEW",
    badge: false,
    executiveReview: true,
    message: "Awaiting trusted server-side checks and authorized administrator review.",
    processedAt: new Date().toISOString(),
  };
}
