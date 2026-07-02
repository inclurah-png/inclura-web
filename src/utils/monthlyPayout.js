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

export async function runMonthlyPayout() {
  const poolRef = doc(db, "system", "creatorRevenuePool");

  const poolSnap = await getDoc(poolRef);

  if (!poolSnap.exists()) return;

  const pool = poolSnap.data();

  if (pool.payoutProcessed) return;

  const creatorPool =
    pool.totalCreatorPool || 0;

  if (creatorPool <= 0) return;

  const users = await getDocs(
    collection(db, "users")
  );

  const qualifiedCreators = [];

  users.forEach((userDoc) => {
    const user = userDoc.data();

    const economy = user.creatorEconomy || {};

    if (
      user.creatorVerified === true &&
      economy.premiumQualified === true &&
      economy.premiumTier
    ) {
      qualifiedCreators.push({
        uid: userDoc.id,
      });
    }
  });

  if (qualifiedCreators.length === 0) return;

  const payout =
    creatorPool / qualifiedCreators.length;

  for (const creator of qualifiedCreators) {
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
        source: "Monthly Creator Revenue Share",
        status: "completed",
        createdAt: serverTimestamp(),
      }
    );
  }

  await updateDoc(poolRef, {
    totalCreatorPool: 0,
    totalQualifiedCreators:
      qualifiedCreators.length,
    payoutProcessed: true,
  });
        }
