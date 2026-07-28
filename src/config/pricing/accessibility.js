const accessibility = {
  title: "Accessibility Certification",

  description:
    "Accessibility certification for organisations, businesses, platforms and institutions that comply with Inclura accessibility standards and IFSE accessibility protection.",

  certification: [
    {
      id: "bronze",
      name: "Bronze Certified",
      yearlyUSD: 2500,
      badge: "Bronze Certified",
      renewal: "Yearly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "silver",
      name: "Silver Certified",
      yearlyUSD: 3500,
      badge: "Silver Certified",
      renewal: "Yearly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "gold",
      name: "Gold Certified",
      yearlyUSD: 5000,
      badge: "Gold Certified",
      renewal: "Yearly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "platinum",
      name: "Platinum Certified",
      pricing: "Enterprise Negotiation",
      enterprise: true,
      contractRequired: true,
      renewal: "Contract",
      badge: "Platinum Certified",
      premium: true,
      ifseProtection: true,
      redirect: "/enterprise-partnership",
    },
  ],

  accessibilityAudit: true,

  standards: [
    "WCAG 2.2 AA",
    "Screen Reader Compatibility",
    "Keyboard Navigation",
    "High Contrast Support",
    "Alt Text Validation",
    "Caption Verification",
    "Accessible Forms",
    "Accessible Documents",
  ],

  services: [
    "Accessibility Audit",
    "Video Auto Captioning",
    "Manual Caption Review",
    "Audio Transcription",
    "Alt Text Generation",
    "Screen Reader Optimization",
    "Keyboard Navigation Review",
    "Accessibility Compliance Review",
    "Accessible PDF Review",
  ],
};

export default accessibility;
