import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export async function updateEnterpriseInsights() {
  try {
    const campaigns = await getDocs(
      collection(db, "enterpriseCampaigns")
    );

    let activeCampaigns = 0;
    let completedCampaigns = 0;
    let pausedCampaigns = 0;

    let totalCampaignValue = 0;

    campaigns.forEach((docSnap) => {
      const campaign = docSnap.data();

      totalCampaignValue +=
        campaign.budget || 0;

      switch (campaign.status) {
        case "active":
          activeCampaigns++;
          break;

        case "completed":
          completedCampaigns++;
          break;

        case "paused":
          pausedCampaigns++;
          break;

        default:
          break;
      }
    });

    //------------------------------------------------

    let enterpriseHealth = "Excellent";

    if (activeCampaigns === 0)
      enterpriseHealth = "Critical";

    else if (activeCampaigns < 5)
      enterpriseHealth = "Poor";

    else if (activeCampaigns < 20)
      enterpriseHealth = "Good";

    //------------------------------------------------

    await updateDoc(
      doc(db, "executiveReports", "current"),
      {
        enterpriseHealth,

        enterpriseRevenue:
          totalCampaignValue,

        activeEnterpriseCampaigns:
          activeCampaigns,

        completedEnterpriseCampaigns:
          completedCampaigns,

        pausedEnterpriseCampaigns:
          pausedCampaigns,

        generatedAt:
          serverTimestamp(),
      }
    );
  } catch (error) {
    console.error(
      "Enterprise Insights Error:",
      error
    );
  }
        }
