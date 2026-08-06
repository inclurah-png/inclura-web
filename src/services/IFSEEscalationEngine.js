import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";
export async function runIFSEEscalationEngine() {

  try {

    console.log("🛡 IFSE Escalation Engine Started");

// Load all waiting escalations
const escalationQuery = query(
  collection(db, "emergencyEscalationQueue"),
  where("status", "==", "Waiting")
);

const escalationSnapshot = await getDocs(escalationQuery);

console.log(
  "Escalation Queue Found:",
  escalationSnapshot.size
);

const escalationList = escalationSnapshot.docs.map((item) => ({
  id: item.id,
  ...item.data(),
}));

for (const escalation of escalationList) {

  const createdTime = escalation.createdAt?.toDate();

  if (!createdTime) {
    console.log(
      "Escalation skipped: missing createdAt",
      escalation.id
    );
    continue;
  }

  const now = new Date();

  const elapsedMinutes =
    Math.floor(
      (now.getTime() - createdTime.getTime()) / 60000
    );

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
    escalation.escalationMinutes
  );

  if (elapsedMinutes >= escalation.escalationMinutes) {

  console.log(
    "🚨 Escalation Required:",
    escalation.emergencyId
  );

  await updateDoc(
    doc(db, "emergencyEscalationQueue", escalation.id),
    {
      status: "Escalating",
      escalationLevel: (escalation.escalationLevel || 0) + 1,
      updatedAt: serverTimestamp(),
    }
  );

  console.log(
    "Escalation Queue Updated:",
    escalation.emergencyId
  );

} else {

  console.log(
    "✅ Still Waiting:",
    escalation.emergencyId
  );

}

}
  } catch (err) {

    console.error("IFSE Escalation Engine:", err);

  }

}
