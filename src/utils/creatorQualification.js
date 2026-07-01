import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export async function checkCreatorQualification(uid) {
  const userRef = doc(db, "users", uid);

  const snap = await getDoc(userRef);

  if (!snap.exists()) return;

  const user = snap.data();

  const economy = user.creatorEconomy || {};

  const qualified =
    (user.followers?.length || 0) >= 4000 &&
    (economy.activeDaysLast30 || 0) >= 16 &&
    (economy.monthlyVideoPosts || 0) >= 30 &&
    (economy.monthlyTextPosts || 0) >= 30 &&
    (economy.monthlyCrossPosts || 0) >= 60 &&
    (economy.creatorScore || 0) > 0 &&
    (economy.communityTrust || 0) > 0;

  if (qualified) {
    await updateDoc(userRef, {
      "creatorEconomy.premiumQualified": true,

      "creatorEconomy.qualifiedSince":
        economy.qualifiedSince ||
        serverTimestamp(),
    });
  } else {
    await updateDoc(userRef, {
      "creatorEconomy.premiumQualified": false,

      "creatorEconomy.qualifiedSince": null,
    });
  }
    }
