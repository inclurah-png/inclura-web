// Deprecated: a browser-calculated score must never approve or reject identity.
// Keep the export for compatibility, but always require trusted server review.

export function getIFSEDecision() {
  return {
    status: "PENDING_SERVER_REVIEW",
    badge: false,
    executiveReview: true,
    message: "Awaiting trusted server-side checks and authorized administrator review.",
  };
}
