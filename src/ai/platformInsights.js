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

      const expiryValue = user.premiumExpiryDate;
      const expiryDate = expiryValue && typeof expiryValue.toDate === "function"
        ? expiryValue.toDate()
        : expiryValue
          ? new Date(expiryValue)
          : null;
      const hasPremiumEntitlement =
        user.premium === true ||
        user.premiumActive === true ||
        user.premiumPlan?.active === true;
      const premiumIsCurrent =
        !expiryDate ||
        (Number.isFinite(expiryDate.getTime()) && expiryDate.getTime() > Date.now());

      if (hasPremiumEntitlement && premiumIsCurrent) {
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

      const lastLoginValue = user.lastLogin;
      const lastLoginDate = lastLoginValue && typeof lastLoginValue.toDate === "function"
        ? lastLoginValue.toDate()
        : lastLoginValue
          ? new Date(lastLoginValue)
          : null;
      if (
        lastLoginDate &&
        Number.isFinite(lastLoginDate.getTime()) &&
        Date.now() - lastLoginDate.getTime() < 1000 * 60 * 60 * 24 * 20
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
