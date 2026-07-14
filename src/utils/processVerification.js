// =======================================================
// IFSE Verification Processor
// =======================================================

import { calculateIFSERiskScore } from "./ifseRiskCalculator";
import { getIFSEDecision } from "./ifseDecisionEngine";

export function processVerification(data) {

  const score = calculateIFSERiskScore(data);

  const decision = getIFSEDecision(score);

  return {
    score,
    ...decision,
    processedAt: new Date().toISOString(),
  };

}
