import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export async function runIFSEEscalationEngine() {
  try {
    console.log("🛡 IFSE Escalation Engine Started");

    const escalationQuery = query(
      collection(db, "emergencyEscalationQueue"),
      where("status", "==", "Waiting")
    );

    const escalationSnapshot = await getDocs(escalationQuery);

    console.log(
      "Escalation Queue Found:",
      escalationSnapshot.size
    );

    for (const escalationDoc of escalationSnapshot.docs) {
      const escalation = escalationDoc.data();

      const createdTime = escalation.createdAt?.toDate();

      if (!createdTime) {
        console.log(
          "Escalation skipped: missing createdAt",
          escalationDoc.id
        );
        continue;
      }

      const now = new Date();

      const elapsedMinutes = Math.floor(
        (now.getTime() - createdTime.getTime()) / 60000
      );

      const escalationMinutes =
        Number(escalation.escalationMinutes) || 0;

      console.log(
        "Emergency:",
        escalation.emergencyId
      );

      console.log(
        "Elapsed Minutes:",
        elapsedMinutes
      );

      console.log(
        "Escalation Limit:",
        escalationMinutes
      );

      if (elapsedMinutes >= escalationMinutes) {
        const newLevel =
          (Number(escalation.escalationLevel) || 0) + 1;

        await updateDoc(
          doc(
            db,
            "emergencyEscalationQueue",
            escalationDoc.id
          ),
          {
            status: "Escalating",
            escalationLevel: newLevel,
            updatedAt: serverTimestamp(),
          }
        );

        console.log(
          "🚨 Escalation Triggered:",
          escalation.emergencyId
        );
      } else {
        console.log(
          "✅ Still Waiting:",
          escalation.emergencyId
        );
      }
    }

    return {
      success: true,
      processed: escalationSnapshot.size,
    };

  } catch (err) {
    console.error(
      "IFSE Escalation Engine Error:",
      err
    );

    return {
      success: false,
      error:
        err?.message ||
        "Escalation engine failed.",
    };
  }
}
