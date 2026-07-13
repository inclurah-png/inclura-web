const group = {
  title: "Group Verification",

  description:
    "Verify communities, clubs, associations, teams, unions and other groups protected by IFSE.",

  verificationTypes: [
    {
      id: "community",
      name: "Community Group",
      monthlyUSD: 30,
      badge: "Verified Community",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "fan_club",
      name: "Fan Club",
      monthlyUSD: 50,
      badge: "Verified Fan Club",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "gaming",
      name: "Gaming Community",
      monthlyUSD: 35,
      badge: "Verified Gaming Community",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "student_association",
      name: "Student Association",
      monthlyUSD: 35,
      badge: "Verified Student Association",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "professional_association",
      name: "Professional Association",
      monthlyUSD: 60,
      badge: "Verified Professional Association",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "sports_club",
      name: "Sports Club",
      monthlyUSD: 100,
      badge: "Verified Sports Club",
      renewal: "Contract",
      premium: true,
      ifseProtection: true,
      contractRequired: true,
    },

    {
      id: "religious_group",
      name: "Religious Group",
      monthlyUSD: 40,
      badge: "Verified Religious Group",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },

    {
      id: "charity_group",
      name: "Charity Group",
      monthlyUSD: 40,
      badge: "Verified Charity Group",
      renewal: "Monthly",
      premium: true,
      ifseProtection: true,
    },
  ],
};

export default group;
