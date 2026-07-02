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

  const data = snap.data();

  const economy = data.creatorEconomy || {};

  const qualified =
    (data.followers?.length || 0) >= 4000 &&
    (economy.activeDaysLast30 || 0) >= 16 &&
    (economy.monthlyVideoPosts || 0) >= 30 &&
    (economy.monthlyTextPosts || 0) >= 30 &&
    (economy.monthlyCrossPosts || 0) >= 60 &&
    (economy.creatorScore || 0) > 0 &&
    (economy.communityTrust || 0) > 0;

  if (qualified && !data.premiumQualified) {
    await updateDoc(userRef, {
      premiumQualified: true,
      qualifiedSince: serverTimestamp(),
    });
  }

  if (!qualified && data.premiumQualified) {
    await updateDoc(userRef, {
      premiumQualified: false,
      qualifiedSince: null,
    });
  }
}
