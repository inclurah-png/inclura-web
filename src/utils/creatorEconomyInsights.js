import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

export async function getCreatorEconomyInsights() {
  const usersSnapshot = await getDocs(
    collection(db, "users")
  );

  let qualifiedCreators = 0;

  let creatorScore = 0;
  let watchMinutes = 0;
  let engagement = 0;
  let referralQuality = 0;
  let communityTrust = 0;

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

      creatorScore +=
        economy.creatorScore || 0;

      watchMinutes +=
        economy.totalWatchMinutes || 0;

      engagement +=
        economy.engagementScore || 0;

      referralQuality +=
        user.referralQualityScore || 0;

      communityTrust +=
        economy.communityTrust || 0;
    }
  });

  if (qualifiedCreators === 0) {
    return {
      qualifiedCreators: 0,

      averageCreatorScore: 0,

      averageWatchMinutes: 0,

      averageEngagement: 0,

      averageReferralQuality: 0,

      averageCommunityTrust: 0,

      creatorHealth: "No Qualified Creators",
    };
  }

  const averageCreatorScore =
    creatorScore / qualifiedCreators;

  const averageWatchMinutes =
    watchMinutes / qualifiedCreators;

  const averageEngagement =
    engagement / qualifiedCreators;

  const averageReferralQuality =
    referralQuality /
    qualifiedCreators;

  const averageCommunityTrust =
    communityTrust /
    qualifiedCreators;

  let creatorHealth =
    "Excellent";

  if (averageEngagement < 40)
    creatorHealth = "Poor";

  else if (
    averageEngagement < 60
  )
    creatorHealth = "Fair";

  else if (
    averageEngagement < 80
  )
    creatorHealth = "Good";

  return {
    qualifiedCreators,

    averageCreatorScore,

    averageWatchMinutes,

    averageEngagement,

    averageReferralQuality,

    averageCommunityTrust,

    creatorHealth,
  };
    }
