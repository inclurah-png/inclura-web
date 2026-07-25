// =======================================================
// Verification Types
// =======================================================

export const VERIFICATION_TYPES = {

  // =======================================================
// Creator Verification
// =======================================================

creator: [

{
id: "verified_creator",
title: "Verified Creator",
badge: "🎥",
category: "creator",
premium: false,
ifseProtected: true,
renewalRequired: true,
},

{
id: "creator_pro",
title: "Creator Pro",
badge: "🥈",
category: "creator",
premium: true,
ifseProtected: true,
renewalRequired: true,
},

{
id: "creator_elite",
title: "Creator Elite",
badge: "🥇",
category: "creator",
premium: true,
ifseProtected: true,
renewalRequired: true,
},

],


// =======================================================
// Group Verification
// =======================================================

group: [

{
id: "verified_group",
title: "Verified Group",
badge: "👥",
category: "group",
premium: false,
ifseProtected: true,
renewalRequired: true,
},

{
id: "community",
title: "Community",
badge: "👥",
category: "group",
premium: true,
ifseProtected: true,
renewalRequired: true,
},

{
id: "fan_club",
title: "Fan Club",
badge: "🎭",
category: "group",
premium: true,
ifseProtected: true,
renewalRequired: true,
},

{
id: "support_group",
title: "Support Group",
badge: "❤️",
category: "group",
premium: true,
ifseProtected: true,
renewalRequired: true,
},

],


// =======================================================
// Institution Verification
// =======================================================

institution: [

{
id: "verified_institution",
title: "Verified Institution",
badge: "🎓",
category: "institution",
premium: false,
ifseProtected: true,
renewalRequired: true,
},

{
id: "institution_pro",
title: "Institution Pro",
badge: "🏫",
category: "institution",
premium: true,
ifseProtected: true,
renewalRequired: true,
},

],


// =======================================================
// Organisation Verification
// =======================================================

  organization: [

{
id: "verified_organization",
title: "Verified Organization",
badge: "🏢",
category: "organization",
premium: false,
ifseProtected: true,
renewalRequired: true,
},

{
id: "organization_pro",
title: "Organization Pro",
badge: "🏬",
category: "organization",
premium: true,
ifseProtected: true,
renewalRequired: true,
},

],

  // =======================================================
// Healthcare Verification
// =======================================================

healthcare: [

{
id: "verified_healthcare",
title: "Verified Healthcare",
badge: "🏥",
category: "healthcare",
premium: false,
ifseProtected: true,
renewalRequired: true,
},

{
id: "healthcare_pro",
title: "Healthcare Pro",
badge: "⚕️",
category: "healthcare",
premium: true,
ifseProtected: true,
renewalRequired: true,
},

],


// =======================================================
// Government Verification
// =======================================================

government: [

{
id: "verified_government",
title: "Verified Government",
badge: "🏛️",
category: "government",
premium: false,
ifseProtected: true,
renewalRequired: true,
},

{
id: "government_agency",
title: "Government Agency",
badge: "🛡️",
category: "government",
premium: true,
ifseProtected: true,
renewalRequired: true,
},

],


// =======================================================
// Media Verification
// =======================================================

media: [

{
id: "verified_media",
title: "Verified Media",
badge: "📰",
category: "media",
premium: false,
ifseProtected: true,
renewalRequired: true,
},

{
id: "media_pro",
title: "Media Pro",
badge: "🎙️",
category: "media",
premium: true,
ifseProtected: true,
renewalRequired: true,
},

],


// =======================================================
// Religious Verification
// =======================================================

religious: [

{
id: "verified_religious",
title: "Verified Religious Organization",
badge: "⛪",
category: "religious",
premium: false,
ifseProtected: true,
renewalRequired: true,
},

{
id: "religious_pro",
title: "Religious Pro",
badge: "🕊️",
category: "religious",
premium: true,
ifseProtected: true,
renewalRequired: true,
},

],


// =======================================================
// Financial Verification
// =======================================================

financial: [

{
id: "verified_financial",
title: "Verified Financial Institution",
badge: "🏦",
category: "financial",
premium: false,
ifseProtected: true,
renewalRequired: true,
},

{
id: "financial_pro",
title: "Financial Pro",
badge: "💰",
category: "financial",
premium: true,
ifseProtected: true,
renewalRequired: true,
},

],


// =======================================================
// Emergency Services Verification
// =======================================================

emergency_services: [
{
  id: "verified_emergency_service",
  title: "Verified Emergency Service",
  badge: "🚑",
  category: "emergency_services",
  premium: false,
  ifseProtected: true,

  pricing: {
  amount: 0,
  currency: "USD",
  billingCycle: "none",
},

  renewal: {
  enabled: false,
  billingCycle: "none",
  interval: 0,
  autoRenew: false,
},
},

],
  };

  // =======================================================
// Verification Badge Registry
// =======================================================

export const VERIFICATION_BADGES = {

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

};


// =======================================================
// Premium Badge Registry
// =======================================================

export const PREMIUM_BADGES = {

  creator_pro: "🥈",

  creator_elite: "🥇",

  institution_pro: "🏫",

  organization_pro: "🏬",

  healthcare_pro: "⚕️",

  government_agency: "🛡️",

  media_pro: "🎙️",

  religious_pro: "🕊️",

  financial_pro: "💰",

  emergency_services: "🚑",

  enterprise_partner: "🏆",

};

// =======================================================
// Verification Metadata Registry
// =======================================================

export const VERIFICATION_METADATA = {

  creator: {
    trustLevel: 2,
    riskLevel: "medium",
    renewal: {
      enabled: true,
      billingCycle: "monthly",
      interval: 1,
      autoRenew: true,
    },
  },

  group: {
    trustLevel: 2,
    riskLevel: "medium",
    renewal: {
      enabled: true,
      billingCycle: "monthly",
      interval: 1,
      autoRenew: true,
    },
  },

  institution: {
  trustLevel: 4,
  riskLevel: "high",
  renewal: {
    enabled: true,
    billingCycle: "monthly",
    interval: 1,
    autoRenew: true,
  },
  },

  organization: {
    trustLevel: 4,
    riskLevel: "high",
    renewal: {
      enabled: true,
      billingCycle: "monthly",
      interval: 1,
      autoRenew: true,
    },
  },

  healthcare: {
  trustLevel: 5,
  riskLevel: "critical",
  renewal: {
    enabled: true,
    billingCycle: "monthly",
    interval: 1,
    autoRenew: true,
  },
  },

  government: {
    trustLevel: 5,
    riskLevel: "critical",
    renewal: {
      enabled: true,
      billingCycle: "yearly",
      interval: 1,
      autoRenew: true,
    },
  },

  media: {
  trustLevel: 4,
  riskLevel: "high",
  renewal: {
    enabled: true,
    billingCycle: "monthly",
    interval: 1,
    autoRenew: true,
  },
  },

  religious: {
  trustLevel: 3,
  riskLevel: "medium",
  renewal: {
    enabled: true,
    billingCycle: "monthly",
    interval: 1,
    autoRenew: true,
  },
  },

  financial: {
    trustLevel: 5,
    riskLevel: "critical",
    renewal: {
      enabled: true,
      billingCycle: "yearly",
      interval: 1,
      autoRenew: true,
    },
  },

  emergency_services: {
  trustLevel: 5,
  riskLevel: "critical",

  priorityAccess: true,
  publicSafety: true,

  renewal: {
    enabled: false,
    billingCycle: "none",
    interval: 0,
    autoRenew: false,
  },
},
  };
// =======================================================
// Verification Helper Functions
// =======================================================

export function getVerificationType(type) {
  return VERIFICATION_TYPES[type] || [];
}

export function getVerificationBadge(type) {
  return VERIFICATION_BADGES[type] || "✅";
}

export function getPremiumBadge(type) {
  return PREMIUM_BADGES[type] || "⭐";
}

export function getVerificationMetadata(type) {
  return (
    VERIFICATION_METADATA[type] || {
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
