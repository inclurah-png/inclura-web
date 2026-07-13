const ngo = {
  title: "NGO Verification",

  description:
    "Verify non-governmental organizations, charities, humanitarian organizations, foundations and non-profit institutions protected by IFSE.",

  verificationTypes: [
    {
      id: "charity",
      name: "Charity Organization",
      monthlyUSD: 60,
      badge: "Verified Charity",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "foundation",
      name: "Foundation",
      monthlyUSD: 70,
      badge: "Verified Foundation",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "humanitarian",
      name: "Humanitarian Organization",
      monthlyUSD: 75,
      badge: "Verified Humanitarian Organization",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "advocacy",
      name: "Advocacy Organization",
      monthlyUSD: 60,
      badge: "Verified Advocacy Organization",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "development",
      name: "Development Organization",
      monthlyUSD: 70,
      badge: "Verified Development Organization",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "community_service",
      name: "Community Service Organization",
      monthlyUSD: 60,
      badge: "Verified Community Service Organization",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "international_ngo",
      name: "International NGO",
      monthlyUSD: 120,
      badge: "Verified International NGO",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "non_profit",
      name: "Non-Profit Organization",
      monthlyUSD: 60,
      badge: "Verified Non-Profit Organization",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },
  ],
};

export default ngo;
