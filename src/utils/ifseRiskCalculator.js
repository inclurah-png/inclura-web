// =======================================================
// IFSE Risk Calculator
// =======================================================

import { IFSE_RISK_WEIGHTS } from "../config/ifseRiskWeights";

export function calculateIFSERiskScore(data = {}) {

  let score = 0;

  if (data.identityVerified) {
    score += IFSE_RISK_WEIGHTS.identityVerification;
  }

  if (data.documentVerified) {
    score += IFSE_RISK_WEIGHTS.documentAuthentication;
  }

  if (data.duplicateChecked) {
    score += IFSE_RISK_WEIGHTS.duplicateDetection;
  }

  if (data.fraudChecked) {
    score += IFSE_RISK_WEIGHTS.aiFraudDetection;
  }

  if (data.businessValidated) {
    score += IFSE_RISK_WEIGHTS.businessValidation;
  }

  if (data.governmentValidated) {
    score += IFSE_RISK_WEIGHTS.governmentValidation;
  }

  if (data.accessibilityValidated) {
    score += IFSE_RISK_WEIGHTS.accessibilityCompliance;
  }

  if (data.paymentVerified) {
    score += IFSE_RISK_WEIGHTS.paymentVerification;
  }

  return score;

}
