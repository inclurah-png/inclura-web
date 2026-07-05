import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

/**
 * Community Intelligence Engine
 *
 * Tracks overall platform health.
 */
export async function updateCommunityInsights() {
  try {
    // Collections
    const usersSnap = await getDocs(
      collection(db, "users")
    );

    const postsSnap = await getDocs(
      collection(db, "posts")
    );

    let totalUsers = 0;
    let verifiedCreators = 0;
    let premiumCreators = 0;

    let totalPosts = 0;
    let totalVideos = 0;
    let totalStories = 0;

    let totalFollowers = 0;
    let totalEngagement = 0;

    // USERS
    usersSnap.forEach((userDoc) => {
      const user = userDoc.data();

      totalUsers++;

      if (user.creatorVerified === true) {
        verifiedCreators++;
      }

      if (
        user.creatorEconomy?.premiumQualified ===
        true
      ) {
        premiumCreators++;
      }

      totalFollowers +=
        user.followers?.length || 0;

      totalEngagement +=
        user.creatorEconomy
          ?.engagementScore || 0;
    });

    // POSTS
    postsSnap.forEach((postDoc) => {
      const post = postDoc.data();

      totalPosts++;

      if (post.type === "video") {
        totalVideos++;
      }

      if (post.type === "story") {
        totalStories++;
      }
    });

    // Average Followers
    const averageFollowers =
      totalUsers === 0
        ? 0
        : Number(
            (
              totalFollowers /
              totalUsers
            ).toFixed(2)
          );

    // Average Engagement
    const averageEngagement =
      totalUsers === 0
        ? 0
        : Number(
            (
              totalEngagement /
              totalUsers
            ).toFixed(2)
          );

    // Community Health Score
    let communityHealth = "Excellent";

    if (averageEngagement < 20) {
      communityHealth = "Poor";
    } else if (averageEngagement < 50) {
      communityHealth = "Good";
    }

    // Save Executive Report
    await updateDoc(
      doc(db, "executiveReports", "current"),
      {
        totalUsers,

        verifiedCreators,

        premiumCreators,

        totalPosts,

        totalVideos,

        totalStories,

        averageFollowers,

        averageEngagement,

        communityHealth,

        communityGeneratedAt:
          serverTimestamp(),
      }
    );

    return {
      success: true,

      totalUsers,

      verifiedCreators,

      premiumCreators,

      totalPosts,

      totalVideos,

      totalStories,

      averageFollowers,

      averageEngagement,

      communityHealth,
    };
  } catch (error) {
    console.error(
      "Community Insights Error:",
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
}
