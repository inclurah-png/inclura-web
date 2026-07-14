// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Verification Rules
// =======================================================

export const IFSE_RULES = {

  creator: {
    minimumRiskScore: 30,
    requiresFraudCheck: true,
    requiresDuplicateCheck: true,
    requiresIdentityVerification: true,
    requiresAccessibilityCheck: false,
    executiveApproval: false,
  },

  group: {
    minimumRiskScore: 35,
    requiresFraudCheck: true,
    requiresDuplicateCheck: true,
    requiresIdentityVerification: true,
    executiveApproval: false,
  },

  organization: {
    minimumRiskScore: 50,
    requiresFraudCheck: true,
    requiresDuplicateCheck: true,
    requiresIdentityVerification: true,
    requiresDocumentAuthentication: true,
    requiresBusinessValidation: true,
    executiveApproval: false,
  },

  ngo: {
    minimumRiskScore: 60,
    requiresFraudCheck: true,
    requiresDuplicateCheck: true,
    requiresIdentityVerification: true,
    requiresDocumentAuthentication: true,
    requiresBackgroundInvestigation: true,
    executiveApproval: true,
  },

  institution: {
    minimumRiskScore: 65,
    requiresFraudCheck: true,
    requiresDocumentAuthentication: true,
    requiresGovernmentValidation: true,
    executiveApproval: true,
  },

  healthcare: {
    minimumRiskScore: 70,
    requiresFraudCheck: true,
    requiresProfessionalLicenseValidation: true,
    requiresGovernmentValidation: true,
    executiveApproval: true,
  },

  media: {
    minimumRiskScore: 55,
    requiresFraudCheck: true,
    requiresIdentityVerification: true,
    requiresDocumentAuthentication: true,
  },

  corporate: {
    contractRequired: true,
    executiveApproval: true,
    boardApproval: true,
    ifseLevel: "Corporate",
  },

  government: {
    contractRequired: true,
    executiveApproval: true,
    governmentApproval: true,
    ifseLevel: "Government",
  },

  enterprise: {
    contractRequired: true,
    executiveApproval: true,
    boardApproval: true,
    legalApproval: true,
    ifseLevel: "Enterprise",
  },

};
