const organization = {
  title: "Organization Verification",

  description:
    "Verify registered businesses, startups, sole proprietorships, cooperatives and medium-sized organizations protected by IFSE. Large private companies (Ltd), PLCs and major corporations are verified through Corporate Partnership contracts.",

  verificationTypes: [
    {
      id: "startup",
      name: "Startup",
      monthlyUSD: 35,
      badge: "Verified Startup",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "business_name",
      name: "Registered Business Name",
      monthlyUSD: 50,
      badge: "Verified Business",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "cooperative_society",
      name: "Cooperative Society",
      monthlyUSD: 60,
      badge: "Verified Cooperative Society",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "sole_proprietorship",
      name: "Sole Proprietorship",
      monthlyUSD: 75,
      badge: "Verified Sole Proprietorship",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "small_business",
      name: "Small Business (SME)",
      monthlyUSD: 100,
      badge: "Verified Small Business",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "medium_business",
      name: "Medium Business",
      monthlyUSD: 250,
      badge: "Verified Medium Business",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "private_limited_company",
      name: "Private Limited Company (Ltd)",
      contractRequired: true,
      badge: "Corporate Partnership Required",
      renewal: "Contract",
      premium: true,
      ifseProtection: true,
      redirect: "/corporate-partnership",
    },

    {
      id: "public_limited_company",
      name: "Public Limited Company (PLC)",
      contractRequired: true,
      badge: "Corporate Partnership Required",
      renewal: "Contract",
      premium: true,
      ifseProtection: true,
      redirect: "/corporate-partnership",
    },
  ],
};

export default organization;
