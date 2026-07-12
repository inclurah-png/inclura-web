const entertainment = {
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
};

export default entertainment;
