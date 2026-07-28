const tourism = {
  title: "Tourism Verification",

  description:
    "Verify tourism operators, travel organisations and tourism service providers protected by IFSE.",

  verificationTypes: [
    {
      id: "tourism_operator",
      name: "Verified Tourism Operator",
      monthlyUSD: 150,
      badge: "Verified Tourism",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },
  ],
};

export default tourism;
