// =======================================================
// IFSE Company Classification Engine
// =======================================================

export const IFSE_COMPANY_CLASSIFICATION = {

  tier1: {
    id: "tier1",
    title: "Micro Business",
    verificationMode: "fixed",
    description:
      "Very small registered businesses with limited operations.",
  },

  tier2: {
    id: "tier2",
    title: "Small Company",
    verificationMode: "fixed",
    description:
      "Small limited liability companies with relatively low operational scale.",
  },

  tier3: {
    id: "tier3",
    title: "Medium Company",
    verificationMode: "fixed-premium",
    description:
      "Growing companies requiring enhanced IFSE verification.",
  },

  tier4: {
    id: "tier4",
    title: "Large Company",
    verificationMode: "review",
    description:
      "Large organizations requiring IFSE due diligence before pricing.",
  },

  tier5: {
    id: "tier5",
    title: "National Corporation",
    verificationMode: "contract",
    description:
      "Corporations operating nationally under executive IFSE review.",
  },

  tier6: {
    id: "tier6",
    title: "International Corporation",
    verificationMode: "contract",
    description:
      "Organizations operating across multiple countries.",
  },

  tier7: {
    id: "tier7",
    title: "Multinational Enterprise",
    verificationMode: "enterprise-contract",
    description:
      "Global corporations requiring enterprise partnership agreements.",
  },

};
