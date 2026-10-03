/**
 * Verification Types
 *
 * Central registry for Inclura verification types, badges,
 * premium badges, and verification metadata.
 *
 * IMPORTANT:
 * - Existing verification IDs are preserved.
 * - Existing badge identifiers are preserved.
 * - Existing pricing and renewal behavior is preserved.
 * - Existing trust and risk levels are preserved.
 * - Security decisions belong to IFSE.
 * - User-facing labels should be localized at the UI layer.
 */

// =======================================================
// Verification Types
// =======================================================

export const VERIFICATION_TYPES = Object.freeze({
  // =======================================================
  // Creator Verification
  // =======================================================

  creator: Object.freeze([
    Object.freeze({
      id: "verified_creator",
      title: "Verified Creator",
      badge: "🎥",
      category: "creator",
      premium: false,
      ifseProtected: true,
      renewalRequired: true,
    }),

    Object.freeze({
      id: "creator_pro",
      title: "Creator Pro",
      badge: "🥈",
      category: "creator",
      premium: true,
      ifseProtected: true,
      renewalRequired: true,
    }),

    Object.freeze({
      id: "creator_elite",
      title: "Creator Elite",
      badge: "🥇",
      category: "creator",
      premium: true,
      ifseProtected: true,
      renewalRequired: true,
    }),
  ]),

  // =======================================================
  // Group Verification
  // =======================================================

  group: Object.freeze([
    Object.freeze({
      id: "verified_group",
      title: "Verified Group",
      badge: "👥",
      category: "group",
      premium: false,
      ifseProtected: true,
      renewalRequired: true,
    }),

    Object.freeze({
      id: "community",
      title: "Community",
      badge: "👥",
      category: "group",
      premium: true,
      ifseProtected: true,
      renewalRequired: true,
    }),

    Object.freeze({
      id: "fan_club",
      title: "Fan Club",
      badge: "🎭",
      category: "group",
      premium: true,
      ifseProtected: true,
      renewalRequired: true,
    }),

    Object.freeze({
      id: "support_group",
      title: "Support Group",
      badge: "❤️",
      category: "group",
      premium: true,
      ifseProtected: true,
      renewalRequired: true,
    }),
  ]),

  // =======================================================
  // Institution Verification
  // =======================================================

  institution: Object.freeze([
    Object.freeze({
      id: "verified_institution",
      title: "Verified Institution",
      badge: "🎓",
      category: "institution",
      premium: false,
      ifseProtected: true,
      renewalRequired: true,
    }),

    Object.freeze({
      id: "institution_pro",
      title: "Institution Pro",
      badge: "🏫",
      category: "institution",
      premium: true,
      ifseProtected: true,
      renewalRequired: true,
    }),
  ]),

  // =======================================================
  // Organisation Verification
  // =======================================================

  organization: Object.freeze([
    Object.freeze({
      id: "verified_organization",
      title: "Verified Organization",
      badge: "🏢",
      category: "organization",
      premium: false,
      ifseProtected: true,
      renewalRequired: true,
    }),

    Object.freeze({
      id: "organization_pro",
      title: "Organization Pro",
      badge: "🏬",
      category: "organization",
      premium: true,
      ifseProtected: true,
      renewalRequired: true,
    }),
  ]),

  // =======================================================
  // Healthcare Verification
  // =======================================================

  healthcare: Object.freeze([
    Object.freeze({
      id: "verified_healthcare",
      title: "Verified Healthcare",
      badge: "🏥",
      category: "healthcare",
      premium: false,
      ifseProtected: true,
      renewalRequired: true,
    }),

    Object.freeze({
      id: "healthcare_pro",
      title: "Healthcare Pro",
      badge: "⚕️",
      category: "healthcare",
      premium: true,
      ifseProtected: true,
      renewalRequired: true,
    }),
  ]),

  // =======================================================
  // Government Verification
  // =======================================================

  government: Object.freeze([
    Object.freeze({
      id: "verified_government",
      title: "Verified Government",
      badge: "🏛️",
      category: "government",
      premium: false,
      ifseProtected: true,
      renewalRequired: true,
    }),

    Object.freeze({
      id: "government_agency",
      title: "Government Agency",
      badge: "🛡️",
      category: "government",
      premium: true,
      ifseProtected: true,
      renewalRequired: true,
    }),
  ]),

  // =======================================================
  // Media Verification
  // =======================================================

  media: Object.freeze([
    Object.freeze({
      id: "verified_media",
      title: "Verified Media",
      badge: "📰",
      category: "media",
      premium: false,
      ifseProtected: true,
      renewalRequired: true,
    }),

    Object.freeze({
      id: "media_pro",
      title: "Media Pro",
      badge: "🎙️",
      category: "media",
      premium: true,
      ifseProtected: true,
      renewalRequired: true,
    }),
  ]),

  // =======================================================
  // Religious Verification
  // =======================================================

  religious: Object.freeze([
    Object.freeze({
      id: "verified_religious",
      title: "Verified Religious Organization",
      badge: "⛪",
      category: "religious",
      premium: false,
      ifseProtected: true,
      renewalRequired: true,
    }),

    Object.freeze({
      id: "religious_pro",
      title: "Religious Pro",
      badge: "🕊️",
      category: "religious",
      premium: true,
      ifseProtected: true,
      renewalRequired: true,
    }),
  ]),

  // =======================================================
  // Financial Verification
  // =======================================================

  financial: Object.freeze([
    Object.freeze({
      id: "verified_financial",
      title: "Verified Financial Institution",
      badge: "🏦",
      category: "financial",
      premium: false,
      ifseProtected: true,
      renewalRequired: true,
    }),

    Object.freeze({
      id: "financial_pro",
      title: "Financial Pro",
      badge: "💰",
      category: "financial",
      premium: true,
      ifseProtected: true,
      renewalRequired: true,
    }),
  ]),

  // =======================================================
  // Emergency Services Verification
  // =======================================================

  emergency_services: Object.freeze([
    Object.freeze({
      id: "verified_emergency_service",
      title: "Verified Emergency Service",
      badge: "🚑",
      category: "emergency_services",
      premium: false,
      ifseProtected: true,

      pricing: Object.freeze({
        amount: 0,
        currency: "USD",
        billingCycle: "none",
      }),

      renewal: Object.freeze({
        enabled: false,
        billingCycle: "none",
        interval: 0,
        autoRenew: false,
      }),
    }),
  ]),
});

// =======================================================
// Verification Badge Registry
// =======================================================

export const VERIFICATION_BADGES = Object.freeze({
  creator: "🎥",
  group: "👥",
  institution: "🎓",
  organization: "🏢",
  healthcare: "🏥",
  government: "🏛️",
  media: "📰",
  religious: "⛪",
  financial: "🏦",
  emergency_services: "🚑",
});

// =======================================================
// Premium Badge Registry
// =======================================================

export const PREMIUM_BADGES = Object.freeze({
  creator_pro: "🥈",
  creator_elite: "🥇",
  institution_pro: "🏫",
  organization_pro: "🏬",
  healthcare_pro: "⚕️",
  government_agency: "🛡️",
  media_pro: "🎙️",
  religious_pro: "🕊️",
  financial_pro: "💰",
  enterprise_partner: "🏆",
});

// =======================================================
// Verification Metadata Registry
// =======================================================

export const VERIFICATION_METADATA = Object.freeze({
  creator: Object.freeze({
    trustLevel: 2,
    riskLevel: "medium",
    renewal: Object.freeze({
      enabled: true,
      billingCycle: "monthly",
      interval: 1,
      autoRenew: true,
    }),
  }),

  group: Object.freeze({
    trustLevel: 2,
    riskLevel: "medium",
    renewal: Object.freeze({
      enabled: true,
      billingCycle: "monthly",
      interval: 1,
      autoRenew: true,
    }),
  }),

  institution: Object.freeze({
    trustLevel: 4,
    riskLevel: "high",
    renewal: Object.freeze({
      enabled: true,
      billingCycle: "monthly",
      interval: 1,
      autoRenew: true,
    }),
  }),

  organization: Object.freeze({
    trustLevel: 4,
    riskLevel: "high",
    renewal: Object.freeze({
      enabled: true,
      billingCycle: "monthly",
      interval: 1,
      autoRenew: true,
    }),
  }),

  healthcare: Object.freeze({
    trustLevel: 5,
    riskLevel: "critical",
    renewal: Object.freeze({
      enabled: true,
      billingCycle: "monthly",
      interval: 1,
      autoRenew: true,
    }),
  }),

  government: Object.freeze({
    trustLevel: 5,
    riskLevel: "critical",
    renewal: Object.freeze({
      enabled: true,
      billingCycle: "yearly",
      interval: 1,
      autoRenew: true,
    }),
  }),

  media: Object.freeze({
    trustLevel: 4,
    riskLevel: "high",
    renewal: Object.freeze({
      enabled: true,
      billingCycle: "monthly",
      interval: 1,
      autoRenew: true,
    }),
  }),

  religious: Object.freeze({
    trustLevel: 3,
    riskLevel: "medium",
    renewal: Object.freeze({
      enabled: true,
      billingCycle: "monthly",
      interval: 1,
      autoRenew: true,
    }),
  }),

  financial: Object.freeze({
    trustLevel: 5,
    riskLevel: "critical",
    renewal: Object.freeze({
      enabled: true,
      billingCycle: "yearly",
      interval: 1,
      autoRenew: true,
    }),
  }),

  emergency_services: Object.freeze({
    trustLevel: 5,
    riskLevel: "critical",
    priorityAccess: true,
    publicSafety: true,

    renewal: Object.freeze({
      enabled: false,
      billingCycle: "none",
      interval: 0,
      autoRenew: false,
    }),
  }),
});

// =======================================================
// Verification Helper Functions
// =======================================================

/**
 * Get all verification types for a category.
 */
export function getVerificationType(type) {
  if (!type || typeof type !== "string") {
    return [];
  }

  return VERIFICATION_TYPES[type.toLowerCase()] || [];
}

/**
 * Get a specific verification type by ID.
 */
export function getVerificationTypeById(category, verificationId) {
  if (
    !category ||
    typeof category !== "string" ||
    !verificationId ||
    typeof verificationId !== "string"
  ) {
    return null;
  }

  const verificationTypes = getVerificationType(category);

  return (
    verificationTypes.find(
      (verificationType) => verificationType.id === verificationId
    ) || null
  );
}

/**
 * Check whether a verification category exists.
 */
export function hasVerificationTypeCategory(category) {
  if (!category || typeof category !== "string") {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(
    VERIFICATION_TYPES,
    category.toLowerCase()
  );
}

/**
 * Check whether a verification type exists.
 */
export function isValidVerificationType(category, verificationId) {
  return Boolean(getVerificationTypeById(category, verificationId));
}

/**
 * Get the badge for a verification category.
 */
export function getVerificationBadge(type) {
  if (!type || typeof type !== "string") {
    return "✅";
  }

  return VERIFICATION_BADGES[type.toLowerCase()] || "✅";
}

/**
 * Get the badge for a premium verification type.
 */
export function getPremiumBadge(type) {
  if (!type || typeof type !== "string") {
    return "⭐";
  }

  return PREMIUM_BADGES[type] || "⭐";
}

/**
 * Get verification metadata for a category.
 */
export function getVerificationMetadata(type) {
  if (!type || typeof type !== "string") {
    return {
      trustLevel: 1,
      riskLevel: "low",
      renewal: {
        enabled: false,
        billingCycle: "none",
        interval: 0,
        autoRenew: false,
      },
    };
  }

  return (
    VERIFICATION_METADATA[type.toLowerCase()] || {
      trustLevel: 1,
      riskLevel: "low",
      renewal: {
        enabled: false,
        billingCycle: "none",
        interval: 0,
        autoRenew: false,
      },
    }
  );
}

/**
 * Get all verification categories.
 */
export function getVerificationTypeCategories() {
  return Object.keys(VERIFICATION_TYPES);
}

/**
 * Get all verification types across all categories.
 */
export function getAllVerificationTypes() {
  return Object.values(VERIFICATION_TYPES).flat();
}

/**
 * Get all premium verification types.
 */
export function getPremiumVerificationTypes() {
  return getAllVerificationTypes().filter(
    (verificationType) => verificationType.premium === true
  );
}

/**
 * Get all IFSE-protected verification types.
 */
export function getIFSEProtectedVerificationTypes() {
  return getAllVerificationTypes().filter(
    (verificationType) => verificationType.ifseProtected === true
  );
}

export default VERIFICATION_TYPES;
