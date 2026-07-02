import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export async function startNewMonth() {
  await updateDoc(
    doc(db, "system", "creatorRevenuePool"),
    {
      payoutProcessed: false,
      currentMonth:
        new Date().toISOString().slice(0, 7),
    }
  );
}
