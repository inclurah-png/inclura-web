import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export async function distributeCreatorRevenue() {

  const revenueRef = doc(db, "revenuePool", "current");

  const revenueSnap = await getDoc(revenueRef);

  if (!revenueSnap.exists()) return;

  const pool = revenueSnap.data();

  const creatorPool = pool.creatorContentRevenue || 0;

  if (creatorPool <= 0) return;

  const usersSnap = await getDocs(collection(db, "users"));

  let qualifiedCreators = [];

  let totalScore = 0;

  usersSnap.forEach((userDoc) => {

    const user = userDoc.data();

    if (
      user.creatorVerified &&
      user.premiumQualified
    ) {

      const score =
        user.creatorEconomy?.creatorScore || 0;

      qualifiedCreators.push({
        uid: userDoc.id,
        score,
      });

      totalScore += score;
    }

  });

  if (qualifiedCreators.length === 0) return;

  for (const creator of qualifiedCreators) {

    const payout =
      (creator.score / totalScore) *
      creatorPool;

    await updateDoc(
      doc(db, "creatorWallets", creator.uid),
      {
        availableBalance: increment(payout),
        lifetimeEarnings: increment(payout),
        lastUpdated: serverTimestamp(),
      }
    );

    await addDoc(
      collection(db, "creatorTransactions"),
      {
        uid: creator.uid,
        amount: payout,
        source: "Monthly Revenue Share",
        status: "completed",
        createdAt: serverTimestamp(),
      }
    );

  }

  await updateDoc(revenueRef, {

    creatorContentRevenue: 0,

    lastDistribution: serverTimestamp(),

  });

}
