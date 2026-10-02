// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Verification Rules
// =======================================================
//
// Defines verification requirements for different account
// and organization categories.
//
// IMPORTANT:
// - This file contains configuration only.
// - Actual verification, fraud detection, approvals, and
//   risk calculations belong to their respective engines.
// - Do not store secrets or user data here.
// =======================================================

export const IFSE_RULES = Object.freeze({
  creator: Object.freeze({
    minimumRiskScore: 30,
    requiresFraudCheck: true,
    requiresDuplicateCheck: true,
    requiresIdentityVerification: true,
    requiresAccessibilityCheck: false,
    executiveApproval: false,
  }),

  group: Object.freeze({
    minimumRiskScore: 35,
    requiresFraudCheck: true,
    requiresDuplicateCheck: true,
    requiresIdentityVerification: true,
    executiveApproval: false,
  }),

  organization: Object.freeze({
    minimumRiskScore: 50,
    requiresFraudCheck: true,
    requiresDuplicateCheck: true,
    requiresIdentityVerification: true,
    requiresDocumentAuthentication: true,
    requiresBusinessValidation: true,
    executiveApproval: false,
  }),

  ngo: Object.freeze({
    minimumRiskScore: 60,
    requiresFraudCheck: true,
    requiresDuplicateCheck: true,
    requiresIdentityVerification: true,
    requiresDocumentAuthentication: true,
    requiresBackgroundInvestigation: true,
    executiveApproval: true,
  }),

  institution: Object.freeze({
    minimumRiskScore: 65,
    requiresFraudCheck: true,
    requiresDocumentAuthentication: true,
    requiresGovernmentValidation: true,
    executiveApproval: true,
  }),

  healthcare: Object.freeze({
    minimumRiskScore: 70,
    requiresFraudCheck: true,
    requiresProfessionalLicenseValidation: true,
    requiresGovernmentValidation: true,
    executiveApproval: true,
  }),

  media: Object.freeze({
    minimumRiskScore: 55,
    requiresFraudCheck: true,
    requiresIdentityVerification: true,
    requiresDocumentAuthentication: true,
  }),

  corporate: Object.freeze({
    contractRequired: true,
    executiveApproval: true,
    boardApproval: true,
    ifseLevel: "Corporate",
  }),

  government: Object.freeze({
    contractRequired: true,
    executiveApproval: true,
    governmentApproval: true,
    ifseLevel: "Government",
  }),

  enterprise: Object.freeze({
    contractRequired: true,
    executiveApproval: true,
    boardApproval: true,
    legalApproval: true,
    ifseLevel: "Enterprise",
  }),
});

/**
 * Get the IFSE verification rules for a category.
 *
 * @param {string} category
 * @returns {object|null}
 */
export function getIFSERules(category) {
  if (!category || typeof category !== "string") {
    return null;
  }

  return IFSE_RULES[category.toLowerCase()] || null;
}

/**
 * Check whether an IFSE rule category exists.
 *
 * @param {string} category
 * @returns {boolean}
 */
export function hasIFSERule(category) {
  if (!category || typeof category !== "string") {
    return false;
  }

  return Boolean(IFSE_RULES[category.toLowerCase()]);
}

/**
 * Get all configured IFSE rule categories.
 *
 * @returns {string[]}
 */
export function getIFSRuleCategories() {
  return Object.keys(IFSE_RULES);
}

/**
 * Check whether a rule contains a specific requirement.
 *
 * @param {string} category
 * @param {string} requirement
 * @returns {boolean}
 */
export function requiresIFSECheck(category, requirement) {
  const rules = getIFSERules(category);

  if (!rules || !requirement || typeof requirement !== "string") {
    return false;
  }

  return rules[requirement] === true;
}

export default IFSE_RULES;
