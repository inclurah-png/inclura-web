import { getDoc } from "firebase/firestore";

import {
  doc,
  updateDoc,
  increment,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

/**
 * Adds money into the Creator Revenue Pool
 */
export async function addCreatorRevenue(amount) {
  await updateDoc(doc(db, "revenuePool", "current"), {
    creatorContentRevenue: increment(amount),
    totalRevenue: increment(amount),
  });
}

/**
 * Adds Marketplace income
 */
export async function addMarketplaceRevenue(amount) {
  await updateDoc(doc(db, "revenuePool", "current"), {
    marketplaceRevenue: increment(amount),
    totalRevenue: increment(amount),
  });
}

/**
 * Adds Platform Service income
 */
export async function addPlatformServiceRevenue(amount) {
  await updateDoc(doc(db, "revenuePool", "current"), {
    platformServiceRevenue: increment(amount),
    totalRevenue: increment(amount),
  });
}

/**
 * Credits creator wallet
 */
export async function creditCreatorWallet(uid, amount) {
  await updateDoc(doc(db, "creatorWallets", uid), {
    availableBalance: increment(amount),
    lifetimeEarnings: increment(amount),
    lastUpdated: serverTimestamp(),
  });
}

/**
 * Records every payment
 */
export async function recordTransaction(
  uid,
  amount,
  source,
  description
) {
  await addDoc(collection(db, "creatorTransactions"), {
    uid,
    amount,
    source,
    description,
    status: "completed",
    createdAt: serverTimestamp(),
  });
}

/**
 * Revenue sharing engine
 * Default:
 * 55% Creator
 * 45% Inclura
 */
export async function distributeRevenue(
  uid,
  totalRevenue,
  source,
  description
) {
  const creatorPoolContribution = totalRevenue * 0.55;
  const platformShare = totalRevenue * 0.45;
  const userSnap = await getDoc(doc(db, "users", uid));

if (!userSnap.exists()) return;

const user = userSnap.data();

const creator = user.creatorEconomy || {};

const eligible =
  user.creatorVerified === true &&
  creator.premiumQualified === true &&
  creator.premiumTier;

if (!eligible) {
  // Creator receives nothing
  await updateDoc(doc(db, "revenuePool", "current"), {
    platformPoolShare: increment(totalRevenue),
  });

  return;
}

  // Update revenue pool
await updateDoc(doc(db, "revenuePool", "current"), {
  creatorPoolShare: increment(creatorPoolContribution),
  platformPoolShare: increment(platformShare),
});

  return {
  creatorPoolContribution,
  platformShare,
};
}
