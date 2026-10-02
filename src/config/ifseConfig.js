/**
 * Inclura Fortress Security Engine (IFSE)
 *
 * Global IFSE security configuration.
 *
 * IMPORTANT:
 * - This file defines capability configuration only.
 * - Security implementations belong to their respective IFSE services.
 * - No credentials, API keys, or sensitive user data should be stored here.
 */

export const IFSE_CONFIG = Object.freeze({
  engine: "Inclura Fortress Security Engine",

  version: "1.0",

  enabled: true,

  auditLogs: true,

  aiFraudDetection: true,

  malwareScanning: true,

  identityVerification: true,

  accessibilityVerification: true,

  paymentVerification: true,

  documentVerification: true,

  executiveApproval: true,

  continuousMonitoring: true,

  riskScoring: true,

  threatIntelligence: true,

  anomalyDetection: true,

  accountProtection: true,

  enterpriseProtection: true,

  governmentProtection: true,

  corporateProtection: true,

  mediaProtection: true,

  healthcareProtection: true,

  accessibilityCertification: true,
});

/**
 * Check whether IFSE itself is enabled.
 *
 * @returns {boolean}
 */
export function isIFSEEnabled() {
  return IFSE_CONFIG.enabled === true;
}

/**
 * Check whether a specific IFSE capability is enabled.
 *
 * @param {string} capability
 * @returns {boolean}
 */
export function isIFSECapabilityEnabled(capability) {
  if (!capability || typeof capability !== "string") {
    return false;
  }

  return IFSE_CONFIG[capability] === true;
}

/**
 * Get all enabled IFSE capabilities.
 *
 * @returns {string[]}
 */
export function getEnabledIFSECapabilities() {
  return Object.entries(IFSE_CONFIG)
    .filter(([, value]) => value === true)
    .map(([key]) => key);
}

export default IFSE_CONFIG;
