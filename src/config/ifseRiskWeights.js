// =======================================================
// IFSE Risk Weight Configuration
// =======================================================
//
// Risk contribution weights used by IFSE risk-scoring
// systems.
//
// The configured weights intentionally total 100%.
// Actual risk scoring logic belongs in the appropriate
// IFSE risk engine.
// =======================================================

export const IFSE_RISK_WEIGHTS = Object.freeze({
  identityVerification: 20,

  documentAuthentication: 20,

  duplicateDetection: 10,

  aiFraudDetection: 20,

  businessValidation: 10,

  governmentValidation: 10,

  accessibilityCompliance: 5,

  paymentVerification: 5,
});

/**
 * Expected total risk weight.
 */
export const IFSE_RISK_WEIGHT_TOTAL = 100;

/**
 * Calculate the configured total risk weight.
 *
 * @returns {number}
 */
export function getIFSERiskWeightTotal() {
  return Object.values(IFSE_RISK_WEIGHTS).reduce(
    (total, weight) => total + weight,
    0
  );
}

/**
 * Check whether the configured risk weights
 * equal the required 100%.
 *
 * @returns {boolean}
 */
export function areIFSERiskWeightsValid() {
  return getIFSERiskWeightTotal() === IFSE_RISK_WEIGHT_TOTAL;
}

/**
 * Get the configured weight for a specific risk factor.
 *
 * @param {string} riskFactor
 * @returns {number}
 */
export function getIFSERiskWeight(riskFactor) {
  if (!riskFactor || typeof riskFactor !== "string") {
    return 0;
  }

  return IFSE_RISK_WEIGHTS[riskFactor] ?? 0;
}

export default IFSE_RISK_WEIGHTS;
