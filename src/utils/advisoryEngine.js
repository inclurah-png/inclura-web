import { getCreatorEconomyInsights } from "./creatorEconomyInsights";

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

  const insights =
  await getCreatorEconomyInsights();

const qualifiedCreators =
  insights.qualifiedCreators;

const averageCreatorScore =
  insights.averageCreatorScore;

const averageWatchMinutes =
  insights.averageWatchMinutes;

const averageEngagement =
  insights.averageEngagement;

const averageReferralQuality =
  insights.averageReferralQuality;

const averageCommunityTrust =
  insights.averageCommunityTrust;

const creatorHealth =
  insights.creatorHealth;

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
