import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export async function updatePlatformInsights() {
  try {
    const usersSnapshot = await getDocs(
      collection(db, "users")
    );

    let totalUsers = 0;
    let premiumUsers = 0;
    let verifiedCreators = 0;
    let qualifiedCreators = 0;
    let activeUsers = 0;

    usersSnapshot.forEach((docSnap) => {
      const user = docSnap.data();

      totalUsers++;

      if (
        user.premiumPlan &&
        user.premiumPlan.active === true
      ) {
        premiumUsers++;
      }

      if (user.creatorVerified === true) {
        verifiedCreators++;
      }

      if (
        user.creatorEconomy?.premiumQualified ===
        true
      ) {
        qualifiedCreators++;
      }

      if (
        user.lastLogin &&
        Date.now() -
          user.lastLogin.toMillis() <
          1000 * 60 * 60 * 24 * 20
      ) {
        activeUsers++;
      }
    });

    //------------------------------------------------

    let platformHealth = "Excellent";

    if (activeUsers < 100)
      platformHealth = "Poor";

    else if (activeUsers < 500)
      platformHealth = "Good";

    //------------------------------------------------

    let overallHealthScore = 100;

    if (activeUsers < 500)
      overallHealthScore -= 10;

    if (qualifiedCreators < 100)
      overallHealthScore -= 15;

    if (premiumUsers < 50)
      overallHealthScore -= 15;

    if (verifiedCreators < 50)
      overallHealthScore -= 10;

    //------------------------------------------------

    await updateDoc(
      doc(db, "executiveReports", "current"),
      {
        totalUsers,

        activeCreators:
          activeUsers,

        premiumUsers,

        verifiedCreators,

        qualifiedCreators,

        platformHealth,

        overallHealthScore,

        generatedAt:
          serverTimestamp(),
      }
    );
  } catch (error) {
    console.error(
      "Platform Insights Error:",
      error
    );
  }
}
