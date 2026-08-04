import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export async function synchronizeSatelliteQueue() {

  if (!navigator.onLine) return;

  try {

    const syncQuery = query(

      collection(db, "satelliteEmergencyQueue"),

      where("syncPending", "==", true)

    );

    const snapshot = await getDocs(syncQuery);

    for (const emergency of snapshot.docs) {

      await updateDoc(

        doc(db, "satelliteEmergencyQueue", emergency.id),

        {

          syncPending: false,

          transmissionStatus: "Synchronized",

          networkStatus: "Online",

          updatedAt: serverTimestamp(),

        }

      );

      console.log("Emergency synchronized:", emergency.id);

    }

  } catch (err) {

    console.error("Satellite Sync Error:", err);

  }

}
