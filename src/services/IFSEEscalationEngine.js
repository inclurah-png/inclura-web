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

console.log(escalationList);
  } catch (err) {

    console.error("IFSE Escalation Engine:", err);

  }

}
