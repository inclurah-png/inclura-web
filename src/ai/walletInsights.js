
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export async function updateWalletInsights() {
  try {
    const walletsSnapshot = await getDocs(
      collection(db, "creatorWallets")
    );

    let totalWalletBalance = 0;
    let totalLifetimeEarnings = 0;

    let walletsAbove100k = 0;
    let dormantWallets = 0;
    let emptyWallets = 0;

    walletsSnapshot.forEach((walletDoc) => {
      const wallet = walletDoc.data();

      const balance =
        wallet.availableBalance || 0;

      const lifetime =
        wallet.lifetimeEarnings || 0;

      totalWalletBalance += balance;

      totalLifetimeEarnings += lifetime;

      if (balance >= 100000)
        walletsAbove100k++;

      if (balance <= 0)
        emptyWallets++;

      if (wallet.lastUpdated) {
        const days =
          (Date.now() -
            wallet.lastUpdated.toMillis()) /
          (1000 * 60 * 60 * 24);

        if (days > 90)
          dormantWallets++;
      }
    });

    //-----------------------------------

    let walletHealth = "Excellent";

    if (dormantWallets > 100)
      walletHealth = "Poor";

    else if (emptyWallets > 1000)
      walletHealth = "Fair";

    //-----------------------------------

    await updateDoc(
      doc(db, "executiveReports", "current"),
      {
        totalWalletBalance,

        totalLifetimeCreatorEarnings:
          totalLifetimeEarnings,

        walletsAbove100k,

        dormantWallets,

        emptyWallets,

        walletHealth,

        generatedAt:
          serverTimestamp(),
      }
    );
  } catch (error) {
    console.error(
      "Wallet Insights Error:",
      error
    );
  }
}
