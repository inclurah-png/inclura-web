const media = {
  title: "Media Verification",

  description:
    "Verify media organizations, broadcasting companies, newspapers, magazines, digital media platforms and podcast networks protected by IFSE.",

  verificationTypes: [
    {
      id: "news_agency",
      name: "Verified News Agency",
      yearlyUSD: 500,
      badge: "Verified News Agency",
      renewal: "Yearly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "radio_station",
      name: "Verified Radio Station",
      yearlyUSD: 400,
      badge: "Verified Radio",
      renewal: "Yearly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "television_station",
      name: "Verified Television Station",
      yearlyUSD: 1200,
      badge: "Verified Television",
      renewal: "Yearly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "digital_media",
      name: "Verified Digital Media Platform",
      yearlyUSD: 800,
      badge: "Verified Digital Media",
      renewal: "Yearly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "newspaper",
      name: "Verified Newspaper",
      yearlyUSD: 600,
      badge: "Verified Newspaper",
      renewal: "Yearly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "magazine",
      name: "Verified Magazine",
      yearlyUSD: 500,
      badge: "Verified Magazine",
      renewal: "Yearly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "podcast_network",
      name: "Verified Podcast Network",
      yearlyUSD: 700,
      badge: "Verified Podcast",
      renewal: "Yearly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "international_media",
      name: "International Media Organization",
      pricing: "Enterprise Negotiation",
      enterprise: true,
      contractRequired: true,
      renewal: "Contract",
      badge: "Media Partner",
      premium: true,
      ifseProtection: true,
      redirect: "/enterprise-partnership",
    },
  ],
};

export default media;
