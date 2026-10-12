
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

/**
 * Refreshes the enterprise campaign summary.
 *
 * SECURITY:
 * This function uses the browser Firebase SDK.
 * It must only run in an appropriately authorized context,
 * and Firestore rules must enforce access independently.
 *
 * IMPORTANT:
 * Campaign budget is not the same as earned revenue.
 * This function does not calculate or claim actual revenue.
 */
export async function updateEnterpriseInsights() {
  try {
    const campaignsRef = collection(
      db,
      "enterpriseCampaigns"
    );

    const campaignsSnapshot = await getDocs(
      campaignsRef
    );

    let activeCampaigns = 0;
    let completedCampaigns = 0;
    let pausedCampaigns = 0;

    let totalCampaignBudget = 0;

    campaignsSnapshot.forEach((docSnap) => {
      const campaign = docSnap.data();

      if (campaign.status === "active") {
        activeCampaigns += 1;
      } else if (campaign.status === "completed") {
        completedCampaigns += 1;
      } else if (campaign.status === "paused") {
        pausedCampaigns += 1;
      }

      const budget = campaign.budget;

      if (
        typeof budget === "number" &&
        Number.isFinite(budget) &&
        budget >= 0
      ) {
        totalCampaignBudget += budget;
      }
    });

    let enterpriseHealth = "Excellent";

    if (activeCampaigns === 0) {
      enterpriseHealth = "Critical";
    } else if (activeCampaigns < 5) {
      enterpriseHealth = "Poor";
    } else if (activeCampaigns < 20) {
      enterpriseHealth = "Good";
    }

    const reportRef = doc(
      db,
      "executiveReports",
      "current"
    );

    await updateDoc(reportRef, {
      enterpriseHealth,

      // Budget is not verified revenue.
      totalEnterpriseCampaignBudget:
        totalCampaignBudget,

      activeEnterpriseCampaigns:
        activeCampaigns,

      completedEnterpriseCampaigns:
        completedCampaigns,

      pausedEnterpriseCampaigns:
        pausedCampaigns,

      generatedAt: serverTimestamp(),
    });

    return {
      success: true,
      enterpriseHealth,
      totalEnterpriseCampaignBudget:
        totalCampaignBudget,
      activeEnterpriseCampaigns:
        activeCampaigns,
      completedEnterpriseCampaigns:
        completedCampaigns,
      pausedEnterpriseCampaigns:
        pausedCampaigns,
    };
  } catch (error) {
    console.error(
      "Enterprise Insights Error:",
      error
    );

    // Allow callers to detect and handle the failure.
    throw error;
  }
}
