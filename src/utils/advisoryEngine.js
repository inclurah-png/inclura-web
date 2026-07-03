import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export async function runAdvisoryEngine() {
  const usersSnapshot = await getDocs(
    collection(db, "users")
  );

  let qualifiedCreators = 0;
  let totalCreatorScore = 0;
  let totalWatchMinutes = 0;
  let totalEngagement = 0;
  let totalReferralQuality = 0;

  usersSnapshot.forEach((docSnap) => {
    const user = docSnap.data();

    const economy =
      user.creatorEconomy || {};

    if (
      user.creatorVerified === true &&
      economy.premiumQualified === true &&
      economy.premiumTier
    ) {
      qualifiedCreators++;

      totalCreatorScore +=
        economy.creatorScore || 0;

      totalWatchMinutes +=
        economy.totalWatchMinutes || 0;

      totalEngagement +=
        economy.engagementScore || 0;

      totalReferralQuality +=
        user.referralQualityScore || 0;
    }
  });

  if (qualifiedCreators === 0) return;

  const averageCreatorScore =
    totalCreatorScore /
    qualifiedCreators;

  const averageWatchMinutes =
    totalWatchMinutes /
    qualifiedCreators;

  const averageEngagement =
    totalEngagement /
    qualifiedCreators;

  const averageReferralQuality =
    totalReferralQuality /
    qualifiedCreators;

  // Example Advisory

  if (averageEngagement < 40) {
    await addDoc(
      collection(db, "advisories"),
      {
        category:
          "Creator Economy",

        severity: "Medium",

        advisoryType:
          "Negative",

        title:
          "Low Creator Engagement",

        observation:
          `Average engagement has fallen to ${averageEngagement.toFixed(
            2
          )}.`,

        recommendation:
          "Consider running a Creator Engagement Campaign.",

        financialImpact: 0,

        creatorImpact:
          "Reduced creator visibility.",

        platformImpact:
          "Lower platform activity.",

        impactDescription:
          "Engagement directly affects creator retention.",

        confidence: 96,

        generatedAt:
          serverTimestamp(),

        expiresAt:
          serverTimestamp(),

        status: "pending",

        reviewedBy: "",

        reviewedAt: null,

        adminComment: "",

        actionTaken:
          "No Action",

        assignedTo: "",

        deadline: null,

        progress: 0,

        notes: "",

        relatedCollections: [
          "users",
        ],

        tags: [
          "creator",
          "engagement",
        ],
      }
    );
  }
}
