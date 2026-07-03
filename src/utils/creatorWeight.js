import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

export async function calculateCreatorWeights() {
  const snapshot = await getDocs(
    collection(db, "users")
  );

  const creators = [];

  let totalWeight = 0;

  snapshot.forEach((docSnap) => {
    const user = docSnap.data();

    const economy = user.creatorEconomy || {};

    if (
      user.creatorVerified !== true ||
      economy.premiumQualified !== true ||
      !economy.premiumTier
    ) {
      return;
    }

    const creatorScore =
      economy.creatorScore || 0;

    const videoPosts =
      economy.monthlyVideoPosts || 0;

    const textPosts =
      economy.monthlyTextPosts || 0;

    const crossPosts =
      economy.monthlyCrossPosts || 0;

    const activeDays =
      economy.activeDaysLast30 || 0;

    const trust =
      economy.communityTrust || 0;

    const watchMinutes =
      economy.totalWatchMinutes || 0;

    const engagement =
      economy.engagementScore || 0;

    const translation =
      economy.translationContribution || 0;

    const referralQuality =
      user.referralQualityScore || 0;

    const weight =
      creatorScore * 0.20 +
      videoPosts * 0.10 +
      textPosts * 0.10 +
      crossPosts * 0.10 +
      activeDays * 0.10 +
      trust * 0.10 +
      watchMinutes * 0.10 +
      engagement * 0.10 +
      translation * 0.05 +
      referralQuality * 0.05;

    creators.push({
      uid: docSnap.id,
      weight,
    });

    totalWeight += weight;
  });

  return {
    creators,
    totalWeight,
  };
}
