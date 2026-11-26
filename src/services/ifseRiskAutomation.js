// Deprecated browser-side risk queries are not authoritative and cannot
// access private payment records. Preserve the public export for compatibility
// while making the pending-review state explicit.

export async function calculateIFSERisk() {
  return {
    riskScore: null,
    threatLevel: "PENDING",
    executiveReview: true,
    reasons: [
      "No trusted server-side risk assessment has been completed.",
      "Authorized administrator review is required.",
    ],
  };
}
