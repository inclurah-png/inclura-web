import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export async function updateRevenueInsights() {
  try {
    // Revenue Pool
    const revenuePoolSnap = await getDoc(
      doc(db, "revenuePool", "current")
    );

    // Revenue Policy
    const policySnap = await getDoc(
      doc(db, "system", "creatorRevenuePolicy")
    );

    // Executive Report
    const executiveRef = doc(
      db,
      "executiveReports",
      "current"
    );

    if (!revenuePoolSnap.exists()) return;

    const revenue =
      revenuePoolSnap.data();

    const policy =
      policySnap.exists()
        ? policySnap.data()
        : {};

    const creatorRevenue =
      revenue.creatorContentRevenue || 0;

    const creatorReserve =
      revenue.creatorReserve || 0;

    const creatorReleased =
      revenue.creatorPoolReleased || 0;

    const platformRevenue =
      revenue.platformRevenue || 0;

    const platformGrowthReserve =
      revenue.platformGrowthReserve || 0;

    const marketplaceRevenue =
      revenue.marketplaceRevenue || 0;

    const enterpriseRevenue =
      revenue.enterpriseRevenue || 0;

    const totalPlatformRevenue =
      platformRevenue +
      marketplaceRevenue +
      enterpriseRevenue;

    const qualifiedCreators =
      revenue.totalQualifiedCreators || 0;

    //--------------------------------------------------
    // Determine Release Stage
    //--------------------------------------------------

    let releaseStage = "Tier 1";
    let releasePercentage = 4;

    if (qualifiedCreators >= 10000) {
      releaseStage = "Tier 10";
      releasePercentage = 55;
    } else if (qualifiedCreators >= 5000) {
      releaseStage = "Tier 9";
      releasePercentage = 50;
    } else if (qualifiedCreators >= 2000) {
      releaseStage = "Tier 8";
      releasePercentage = 45;
    } else if (qualifiedCreators >= 1000) {
      releaseStage = "Tier 7";
      releasePercentage = 35;
    } else if (qualifiedCreators >= 700) {
      releaseStage = "Tier 6";
      releasePercentage = 28;
    } else if (qualifiedCreators >= 550) {
      releaseStage = "Tier 5";
      releasePercentage = 24;
    } else if (qualifiedCreators >= 400) {
      releaseStage = "Tier 4";
      releasePercentage = 20;
    } else if (qualifiedCreators >= 250) {
      releaseStage = "Tier 3";
      releasePercentage = 14;
    } else if (qualifiedCreators >= 100) {
      releaseStage = "Tier 2";
      releasePercentage = 7;
    }

    //--------------------------------------------------
    // Overall Health
    //--------------------------------------------------

    let revenueHealth = "Excellent";

    if (creatorRevenue <= 0)
      revenueHealth = "Critical";

    else if (creatorReserve < 1000)
      revenueHealth = "Poor";

    else if (creatorReserve < 10000)
      revenueHealth = "Fair";

    //--------------------------------------------------
    // Platform Health Score
    //--------------------------------------------------

    let overallHealthScore = 100;

    if (creatorReserve < 10000)
      overallHealthScore -= 15;

    if (qualifiedCreators < 100)
      overallHealthScore -= 20;

    if (creatorRevenue <= 0)
      overallHealthScore -= 30;

    //--------------------------------------------------
    // Summary
    //--------------------------------------------------

    const summary =
      `Qualified creators: ${qualifiedCreators}. ` +
      `Current release: ${releasePercentage}% (${releaseStage}). ` +
      `Creator reserve: ₦${creatorReserve.toLocaleString()}. ` +
      `Platform revenue: ₦${totalPlatformRevenue.toLocaleString()}.`;

    //--------------------------------------------------
    // Update Executive Report
    //--------------------------------------------------

    await updateDoc(executiveRef, {
      creatorRevenue,

      creatorReserve,

      creatorPoolReleased:
        creatorReleased,

      platformGrowthReserve,

      marketplaceRevenue,

      enterpriseRevenue,

      totalPlatformRevenue,

      qualifiedCreators,

      revenueHealth,

      overallHealthScore,

      summary,

      generatedAt:
        serverTimestamp(),
    });
  } catch (error) {
    console.error(
      "Revenue Insights Error:",
      error
    );
  }
}
