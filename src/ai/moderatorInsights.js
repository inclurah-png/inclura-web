import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export async function updateModerationInsights() {
  try {
    const reportsSnap = await getDocs(collection(db, "reports"));

    let totalReports = 0;
    let pendingReports = 0;
    let resolvedReports = 0;
    let spamReports = 0;
    let copyrightReports = 0;
    let harassmentReports = 0;

    reportsSnap.forEach((reportDoc) => {
      const report = reportDoc.data();

      totalReports++;

      if (report.status === "pending") pendingReports++;
      if (report.status === "resolved") resolvedReports++;

      switch (report.category) {
        case "spam":
          spamReports++;
          break;

        case "copyright":
          copyrightReports++;
          break;

        case "harassment":
          harassmentReports++;
          break;

        default:
          break;
      }
    });

    let moderationHealth = "Excellent";

    if (pendingReports > 500)
      moderationHealth = "Critical";
    else if (pendingReports > 100)
      moderationHealth = "Warning";

    await updateDoc(
      doc(db, "executiveReports", "current"),
      {
        totalReports,
        pendingReports,
        resolvedReports,
        spamReports,
        copyrightReports,
        harassmentReports,
        moderationHealth,
        moderationGeneratedAt: serverTimestamp(),
      }
    );

    return true;
  } catch (error) {
    console.error(
      "Moderation Insights Error:",
      error
    );
    return false;
  }
}
