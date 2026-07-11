// =======================================================
// Inclura Master Pricing & Verification Configuration
// Powered by IFSE (Inclura Fortress Security Engine)
// =======================================================

export const CURRENCY = "USD";

export const money = (usd) => ({
  usd,
  ngn: null,
});

export const REQUEST_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  PAYMENT_PENDING: "payment_pending",
  DOCUMENT_REVIEW: "document_review",
  SECURITY_REVIEW: "security_review",
  ACCESSIBILITY_REVIEW: "accessibility_review",
  COMPLIANCE_REVIEW: "compliance_review",
  MANUAL_REVIEW: "manual_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  ACTIVE: "active",
  SUSPENDED: "suspended",
};
// =======================================================
// IFSE (Inclura Fortress Security Engine)
// =======================================================

export const IFSE = {

  version: "1.0",

  engine: "Inclura Fortress Security Engine",

  mandatory: true,

  defaultThreatLevel: "Low",

  riskLevels: [
    "Low",
    "Medium",
    "High",
    "Critical",
  ],

  reviewStages: [

    "Identity Verification",

    "Document Verification",

    "AI Fraud Detection",

    "Accessibility Compliance",

    "Compliance Review",

    "Security Review",

    "Manual Administrator Review",

    "Final Approval",

  ],

  protectedAccounts: [

    "Creator",

    "Business",

    "Organization",

    "NGO",

    "Institution",

    "Healthcare",

    "Media",

    "Corporate",

    "Government",

    "Enterprise",

    "Administrator",

  ],

  securityChecks: [

    "Identity Verification",

    "Government ID Validation",

    "Business Registration Validation",

    "AI Document Analysis",

    "Forgery Detection",

    "Duplicate Detection",

    "Device Fingerprinting",

    "IP Reputation",

    "VPN Detection",

    "TOR Detection",

    "Bot Detection",

    "Fraud Detection",

    "Accessibility Compliance",

    "Threat Assessment",

    "Risk Scoring",

    "Manual Review",

    "Audit Logging",

  ],

};
// =======================================================
// Verification Categories
// =======================================================

export const VERIFICATION_CATEGORIES = {

  creator: {
    title: "Creator Verification",
    premium: true,
    ifseProtected: true,
  },

  group: {
    title: "Group Verification",
    premium: true,
    ifseProtected: true,
  },

  organization: {
    title: "Organization Verification",
    premium: true,
    ifseProtected: true,
  },

  ngo: {
    title: "NGO Verification",
    premium: true,
    ifseProtected: true,
  },

  institution: {
    title: "Institution Verification",
    premium: true,
    ifseProtected: true,
  },

  healthcare: {
    title: "Healthcare Verification",
    premium: true,
    ifseProtected: true,
  },

  media: {
    title: "Media Verification",
    premium: true,
    ifseProtected: true,
  },

  corporate: {
    title: "Corporate Partnership",
    premium: true,
    ifseProtected: true,
  },

  government: {
    title: "Government Partnership",
    premium: true,
    ifseProtected: true,
  },

  enterprise: {
    title: "Enterprise Partnership",
    premium: true,
    ifseProtected: true,
  },

};
// =======================================================
// Verification Plans
// =======================================================

export const VERIFICATION_PLANS = {

  creator: {

    title: "Creator Verification",

    verification: {

      id: "creator_verification",

      name: "Verified Creator",

      monthlyUSD: 35,

      badge: "Verified Creator",

      renewal: "Monthly",

      premium: true,

      ifseProtection: true,

    },

    premiumPlans: [

      {

        id: "creator_pro",

        name: "Creator Pro",

        monthlyUSD: 20,

      },

      {

        id: "creator_elite",

        name: "Creator Elite",

        monthlyUSD: 35,

      },
],

},

group: {

  title: "Group Verification",

  verification: {

    id: "group_verification",

    name: "Verified Community",

    monthlyUSD: 75,

    badge: "Verified Community",

    renewal: "Monthly",

    premium: true,

    ifseProtection: true,

  },
  premiumPlans: [

    {

      id: "community_pro",

      name: "Community Pro",

      monthlyUSD: 30,

    },

    {

      id: "community_enterprise",

      name: "Community Enterprise",

      monthlyUSD: 45,

    },

  ],

},

};
organization: {

  title: "Organization Verification",

  verification: {

    id: "organization_verification",

    name: "Verified Organization",

    monthlyUSD: 150,

    badge: "Verified Organization",

    renewal: "Monthly",

    premium: true,

    ifseProtection: true,

  },

  premiumPlans: [

    {

      id: "business_pro",

      name: "Business Pro",

      monthlyUSD: 70,

    },

    {

      id: "business_enterprise",

      name: "Business Enterprise",

      monthlyUSD: 350,

    },

  ],

},
      ngo: {

  title: "NGO Verification",

  verification: {

    id: "ngo_verification",

    name: "Verified NGO",

    monthlyUSD: 60,

    badge: "Verified NGO",

    renewal: "Monthly",

    premium: true,

    ifseProtection: true,

  },

  premiumPlans: [

    {

      id: "ngo_pro",

      name: "NGO Pro",

      monthlyUSD: 35,

    },

  ],

},
      institution: {

  title: "Institution Verification",

  verificationTypes: [

    {
      id: "primary_school",
      name: "Verified Primary School",
      monthlyUSD: 40,
      badge: "Verified Primary School",
    },

    {
      id: "secondary_school",
      name: "Verified Secondary School",
      monthlyUSD: 60,
      badge: "Verified Secondary School",
    },

    {
      id: "technical_college",
      name: "Verified Technical College",
      monthlyUSD: 80,
      badge: "Verified Technical College",
    },

    {
      id: "training_center",
      name: "Verified Training Centre",
      monthlyUSD: 90,
      badge: "Verified Training Centre",
    },

    {
      id: "nursing_school",
      name: "Verified Nursing School",
      monthlyUSD: 100,
      badge: "Verified Nursing School",
    },

    {
      id: "college",
      name: "Verified College",
      monthlyUSD: 120,
      badge: "Verified College",
    },

    {
      id: "polytechnic",
      name: "Verified Polytechnic",
      monthlyUSD: 140,
      badge: "Verified Polytechnic",
    },

    {
      id: "university",
      name: "Verified University",
      monthlyUSD: 180,
      badge: "Verified University",
    },

    {
      id: "research_institute",
      name: "Verified Research Institute",
      monthlyUSD: 220,
      badge: "Verified Research Institute",
    },

  ],

  premiumPlans: [

    {
      id: "institution_pro",
      name: "Institution Pro",
      monthlyUSD: 50,
    },

    {
      id: "institution_enterprise",
      name: "Institution Enterprise",
      monthlyUSD: 300,
    },

  ],

  ifseProtection: true,

},
    religious: {

  title: "Religious Organization Verification",

  verificationTypes: [

    {
      id: "church",
      name: "Verified Church",
      monthlyUSD: 40,
      badge: "Verified Church",
    },

    {
      id: "mosque",
      name: "Verified Mosque",
      monthlyUSD: 40,
      badge: "Verified Mosque",
    },

    {
      id: "temple",
      name: "Verified Temple",
      monthlyUSD: 40,
      badge: "Verified Temple",
    },

    {
      id: "synagogue",
      name: "Verified Synagogue",
      monthlyUSD: 40,
      badge: "Verified Synagogue",
    },

    {
      id: "religious_ministry",
      name: "Verified Religious Ministry",
      monthlyUSD: 40,
      badge: "Verified Ministry",
    },

  ],

  ifseProtection: true,

},
    healthcare: {

  title: "Healthcare Verification",

  verificationTypes: [

    {
      id: "community_pharmacy",
      name: "Verified Community Pharmacy",
      monthlyUSD: 60,
      badge: "Verified Community Pharmacy",
    },

    {
      id: "hospital_pharmacy",
      name: "Verified Hospital Pharmacy",
      monthlyUSD: 80,
      badge: "Verified Hospital Pharmacy",
    },

    {
      id: "clinic",
      name: "Verified Clinic",
      monthlyUSD: 75,
      badge: "Verified Clinic",
    },

    {
      id: "specialist_clinic",
      name: "Verified Specialist Clinic",
      monthlyUSD: 100,
      badge: "Verified Specialist Clinic",
    },

    {
      id: "medical_center",
      name: "Verified Medical Center",
      monthlyUSD: 120,
      badge: "Verified Medical Center",
    },

    {
      id: "diagnostic_center",
      name: "Verified Diagnostic Center",
      monthlyUSD: 200,
      badge: "Verified Diagnostic Center",
    },

    {
      id: "medical_laboratory",
      name: "Verified Medical Laboratory",
      monthlyUSD: 120,
      badge: "Verified Medical Laboratory",
    },

    {
      id: "rehabilitation_center",
      name: "Verified Rehabilitation Center",
      monthlyUSD: 120,
      badge: "Verified Rehabilitation Center",
    },

    {
      id: "maternity_center",
      name: "Verified Maternity Center",
      monthlyUSD: 150,
      badge: "Verified Maternity Center",
    },

    {
      id: "dental_clinic",
      name: "Verified Dental Clinic",
      monthlyUSD: 100,
      badge: "Verified Dental Clinic",
    },

    {
      id: "eye_clinic",
      name: "Verified Eye Clinic",
      monthlyUSD: 100,
      badge: "Verified Eye Clinic",
    },

    {
      id: "mental_health_center",
      name: "Verified Mental Health Center",
      monthlyUSD: 120,
      badge: "Verified Mental Health Center",
    },

    {
      id: "general_hospital",
      name: "Verified General Hospital",
      monthlyUSD: 75,
      badge: "Verified General Hospital",
    },

    {
  id: "specialist_hospital",
  name: "Verified Specialist Hospital",
  monthlyUSD: 300,
  badge: "Verified Specialist Hospital",
},

    {
      id: "pharmaceutical_company",
      name: "Verified Pharmaceutical Company",
      enterprise: true,
      pricing: "Enterprise Negotiation",
      badge: "Verified Pharmaceutical Company",
    },

    {
      id: "medical_equipment_manufacturer",
      name: "Verified Medical Equipment Manufacturer",
      enterprise: true,
      pricing: "Enterprise Negotiation",
    },

    {
      id: "healthcare_group",
      name: "Healthcare Group",
      enterprise: true,
      pricing: "Enterprise Negotiation",
    },

  ],

  ifseProtection: true,

},
    museum: {

  title: "Museum Verification",

  verificationTypes: [

    {
      id: "museum",
      name: "Verified Museum",
      monthlyUSD: 150,
      badge: "Verified Museum",
    },

  ],

  ifseProtection: true,

},
    tourism: {

  title: "Tourism Verification",

  verificationTypes: [

    {
      id: "tourism_operator",
      name: "Verified Tourism Operator",
      monthlyUSD: 150,
      badge: "Verified Tourism",
    },

  ],

  ifseProtection: true,

},
    entertainment: {

  title: "Entertainment Venue Verification",

  verificationTypes: [

    {
      id: "event_hall",
      name: "Verified Event Hall",
      yearlyUSD: 300,
      badge: "Verified Event Hall",
    },

    {
      id: "event_center",
      name: "Verified Event Center",
      yearlyUSD: 600,
      badge: "Verified Event Center",
    },

    {
      id: "theatre",
      name: "Verified Theatre",
      yearlyUSD: 800,
      badge: "Verified Theatre",
    },

    {
      id: "cinema",
      name: "Verified Cinema",
      yearlyUSD: 1000,
      badge: "Verified Cinema",
    },

    {
      id: "concert_arena",
      name: "Verified Concert Arena",
      yearlyUSD: 2500,
      badge: "Verified Concert Arena",
    },

    {
      id: "theme_park",
      name: "Verified Theme Park",
      yearlyUSD: 3000,
      badge: "Verified Theme Park",
    },

    {
      id: "stadium",
      name: "Verified Stadium",
      pricing: "Enterprise Negotiation",
      enterprise: true,
      badge: "Verified Stadium",
    },

    {
      id: "entertainment_company",
      name: "International Entertainment Company",
      pricing: "Enterprise Negotiation",
      enterprise: true,
      badge: "Entertainment Partner",
    },

  ],

  ifseProtection: true,

},
    media: {

  title: "Media Verification",

  verificationTypes: [

    {
      id: "blogger",
      name: "Independent Blogger / Podcast",
      monthlyUSD: 35,
      renewal: "Monthly",
      badge: "Verified Media",
    },

    {
      id: "newspaper",
      name: "Local Newspaper",
      monthlyUSD: 150,
      renewal: "Monthly",
      badge: "Verified Newspaper",
    },

    {
      id: "radio",
      name: "Local Radio Station",
      monthlyUSD: 200,
      renewal: "Monthly",
      badge: "Verified Radio",
    },

    {
      id: "regional_tv",
      name: "Regional TV Station",
      monthlyUSD: 350,
      renewal: "Monthly",
      badge: "Verified TV",
    },

    {
      id: "national_newspaper",
      name: "National Newspaper",
      monthlyUSD: 500,
      renewal: "Monthly",
      badge: "Verified National Media",
    },

    {
      id: "national_tv",
      name: "National TV Network",
      monthlyUSD: 750,
      renewal: "Monthly",
      badge: "Verified National TV",
    },

    {
      id: "international_media",
      name: "International Media",
      monthlyUSD: 1000,
      renewal: "Monthly",
      badge: "International Media",
      enterprise: true,
    },

    {
      id: "cable_network",
      name: "Cable Network",
      pricing: "Enterprise Negotiation",
      renewal: "Negotiated",
      badge: "Media Partner",
      enterprise: true,
    },

    {
      id: "streaming_platform",
      name: "Streaming Platform",
      pricing: "Enterprise Negotiation",
      renewal: "Negotiated",
      badge: "Verified Streaming Platform",
      enterprise: true,
    },

  ],

  ifseProtection: true,

},
    accessibility: {

  title: "Accessibility Certification",

  certification: [

    {
      id: "bronze",
      name: "Bronze Certified",
      yearlyUSD: 1500,
      badge: "Bronze Certified",
      renewal: "Annual",
    },

    {
      id: "silver",
      name: "Silver Certified",
      yearlyUSD: 2000,
      badge: "Silver Certified",
      renewal: "Annual",
    },

    {
      id: "gold",
      name: "Gold Certified",
      yearlyUSD: 2500,
      badge: "Gold Certified",
      renewal: "Annual",
    },

    {
      id: "platinum",
      name: "Platinum Certified",
      pricing: "Enterprise Negotiation",
      badge: "Platinum Certified",
      renewal: "Negotiated",
      enterprise: true,
    },

  ],

  ifseProtection: true,

  accessibilityAudit: true,

},
    addons: [

  {
    id: "extra30days",
    name: "Extra 30 Days Verification Extension",
    priceUSD: 1000,
  },

  {
    id: "additionalCountry",
    name: "Additional Country Verification",
    monthlyUSD: 29750,
  },

  {
    id: "additionalState",
    name: "Additional State Verification",
    monthlyUSD: 6000,
  },

  {
    id: "fasttrack",
    name: "Fast-track Verification",
    priceUSD: 300,
  },

  {
    id: "badgeReplacement",
    name: "Badge Replacement",
    multiplier: 2,
    dynamic: true,
  },

  {
    id: "representative",
    name: "Additional Verified Representative",
    monthlyUSD: 250,
  },

  {
    id: "aiAudience",
    name: "AI Audience Optimization",
    priceUSD: 500,
  },

  {
    id: "homepage",
    name: "Homepage Featured Placement",
    priceUSD: 57000,
  },

  {
    id: "creatorMarketplace",
    name: "Creator Collaboration Marketplace",
    priceUSD: 300,
  },

 {
  id: "accessibilityServices",
  name: "Accessibility Content Services",
  pricing: "Custom Quote",

  includes: [
    "Video Auto-Captioning",
    "Manual Caption Quality Review",
    "Audio Transcription",
    "Sign Language Integration (Future)",
    "High-Contrast Graphic Optimization",
    "Alt Text Writing",
    "Accessibility Copywriting",
    "Screen Reader Optimization",
    "Keyboard Navigation Review",
    "Accessibility Compliance Review",
    "WCAG Audit",
    "Accessible PDF & Document Review",
  ],
},
    advertising: [

  {
    id: "small",
    name: "Small Campaign",
    usd: 250,
    duration: "7 Days",
  },

  {
    id: "local",
    name: "Local Campaign",
    usd: 3500,
    duration: "30 Days",
    coverage: "1 State",
  },

  {
    id: "regional",
    name: "Regional Campaign",
    usd: 24000,
    duration: "60 Days",
    coverage: "4 States",
  },

  {
    id: "national",
    name: "National Campaign",
    usd: 80000,
    duration: "90 Days",
    coverage: "1 Country",
  },

  {
    id: "continental",
    name: "Continental Campaign",
    usd: 500000,
    duration: "6 Months",
    coverage: "4 Countries",
  },

  {
    id: "global",
    name: "Global Campaign",
    pricing: "Enterprise Negotiation",
    suggestedBudgetUSD: 1000000000,
    enterprise: true,
  },

],
    transactionFees: {

  eventTickets: 8,

  marketplace: 7,

  digitalProducts: 10,

  courses: 8,

  donations: 2,

  grants: 3,

  communityMembership: 8,

  sponsorship: 7,

  mentorship: 7,

},
    partnerships: {

  enterprise: {

    title: "Enterprise Partnership",

    pricing: "Private Enterprise Negotiation",

    renewal: "Annual Enterprise Contract",

    badge: "Enterprise Partner",

    enterprise: true,

    ifseProtection: true,

    designedFor: [

  "Multinational Corporations",

  "Global Brands",

  "Manufacturers",

  "Telecommunications Providers",

  "Financial Institutions",

  "Airlines",

  "Pharmaceutical Companies",

  "Consumer Goods Companies",

  "Technology Companies",

  "Sports Brands",

  "Automobile Manufacturers",

  "Energy Companies",

  "Betting Companies",

  "Fashion Companies",

  "Luxury Brands",

  "Beverage Companies",

  "Media Conglomerates",

  "Logistics Companies",

  "Insurance Providers",

  "Industrial Companies",

  "Retail Chains",

  "Shopping Mall Operators",

  "Supermarket Chains",

  "Hospitality Groups",

  "Healthcare Networks",

  "Educational Networks",

  "Construction Companies",

  "Mining Companies",

  "Agricultural Companies",

  "Real Estate Developers",

  "Transportation Companies",

  "Aviation Companies",

  "Shipping Companies",

  "Entertainment Companies",

  "Tourism Companies",

  "Sports Organizations",

  "International NGOs",

  "Research Organizations",

  "Artificial Intelligence Companies",

  "Cloud Computing Providers",

  "Cybersecurity Companies",

  "Data Center Operators",

  "Payment Service Providers",

  "FinTech Companies",

  "Blockchain Companies",

  "and other eligible enterprises worldwide.",

],

  },

  corporate: {

    title: "Corporate Partnership",

    pricing: "Private Enterprise Negotiation",

    renewal: "Annual Enterprise Contract",

    badge: "Corporate Partner",

    enterprise: true,

    ifseProtection: true,

  },

  government: {

    title: "Government Partnership",

    pricing: "Private Negotiation",

    renewal: "Enterprise Contract",

    badge: "Government Partner",

    enterprise: true,

    ifseProtection: true,

  },

},
    export const IFSE_CONFIG = {

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

};
