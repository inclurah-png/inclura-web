import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export async function updateMarketplaceInsights() {
  try {
    const listingsSnapshot = await getDocs(
      collection(db, "marketplaceListings")
    );

    const ordersSnapshot = await getDocs(
      collection(db, "marketplaceOrders")
    );

    let totalListings = 0;
    let activeListings = 0;
    let soldListings = 0;

    let totalOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;

    let grossSales = 0;

    listingsSnapshot.forEach((docSnap) => {
      const listing = docSnap.data();

      totalListings++;

      if (listing.status === "active")
        activeListings++;

      if (listing.status === "sold")
        soldListings++;
    });

    ordersSnapshot.forEach((docSnap) => {
      const order = docSnap.data();

      totalOrders++;

      grossSales += order.amount || 0;

      if (order.status === "completed")
        completedOrders++;

      if (order.status === "cancelled")
        cancelledOrders++;
    });

    //------------------------------------------------

    let marketplaceHealth = "Excellent";

    if (completedOrders === 0)
      marketplaceHealth = "Critical";

    else if (completedOrders < 20)
      marketplaceHealth = "Poor";

    else if (completedOrders < 100)
      marketplaceHealth = "Good";

    //------------------------------------------------

    const completionRate =
      totalOrders === 0
        ? 0
        : (completedOrders / totalOrders) * 100;

    //------------------------------------------------

    await updateDoc(
      doc(db, "executiveReports", "current"),
      {
        marketplaceHealth,

        marketplaceRevenue:
          grossSales,

        totalMarketplaceListings:
          totalListings,

        activeMarketplaceListings:
          activeListings,

        soldMarketplaceListings:
          soldListings,

        totalMarketplaceOrders:
          totalOrders,

        completedMarketplaceOrders:
          completedOrders,

        cancelledMarketplaceOrders:
          cancelledOrders,

        marketplaceCompletionRate:
          completionRate,

        generatedAt:
          serverTimestamp(),
      }
    );
  } catch (error) {
    console.error(
      "Marketplace Insights Error:",
      error
    );
  }
}
