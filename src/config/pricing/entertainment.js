const entertainment = {
  title: "Entertainment Venue Verification",

  description:
    "Verify entertainment venues, event centres, cinemas, theatres, amusement parks and entertainment companies protected by IFSE.",

  verificationTypes: [
    {
      id: "event_hall",
      name: "Verified Event Hall",
      yearlyUSD: 300,
      badge: "Verified Event Hall",
      renewal: "Yearly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "event_center",
      name: "Verified Event Center",
      yearlyUSD: 600,
      badge: "Verified Event Center",
      renewal: "Yearly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "theatre",
      name: "Verified Theatre",
      yearlyUSD: 3000,
      badge: "Verified Theatre",
      renewal: "Yearly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "cinema",
      name: "Verified Cinema",
      yearlyUSD: 3000,
      badge: "Verified Cinema",
      renewal: "Yearly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "concert_arena",
      name: "Verified Concert Arena",
      yearlyUSD: 3000,
      badge: "Verified Concert Arena",
      renewal: "Yearly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "theme_park",
      name: "Verified Theme Park",
      yearlyUSD: 2500,
      badge: "Verified Theme Park",
      renewal: "Yearly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "stadium",
      name: "Verified Stadium",
      pricing: "Enterprise Negotiation",
      enterprise: true,
      contractRequired: true,
      renewal: "Contract",
      badge: "Verified Stadium",
      premium: true,
      ifseProtection: true,
      redirect: "/enterprise-partnership",
    },

    {
      id: "entertainment_company",
      name: "International Entertainment Company",
      pricing: "Enterprise Negotiation",
      enterprise: true,
      contractRequired: true,
      renewal: "Contract",
      badge: "Entertainment Partner",
      premium: true,
      ifseProtection: true,
      redirect: "/enterprise-partnership",
    },
  ],
};

export default entertainment;
