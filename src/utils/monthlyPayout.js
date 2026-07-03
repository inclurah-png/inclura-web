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

import { calculateCreatorWeights } from "./creatorWeight";

export async function runMonthlyPayout() {
  // Revenue Pool
  const poolRef = doc(db, "revenuePool", "current");
  const poolSnap = await getDoc(poolRef);

  if (!poolSnap.exists()) return;

  const pool = poolSnap.data();

  const creatorPool =
    pool.creatorContentRevenue || 0;

  if (creatorPool <= 0) return;

  // Revenue Policy
  const policySnap = await getDoc(
    doc(db, "system", "creatorRevenuePolicy")
  );

  if (!policySnap.exists()) return;

  const policy = policySnap.data();

  // Qualified Creators + Weights
  const result = await calculateCreatorWeights();

  const creators = result.creators;

  const totalWeight = result.totalWeight;

  const qualifiedCreators =
    creators.length;

  if (
    qualifiedCreators === 0 ||
    totalWeight === 0
  )
    return;

  // Determine Release %
  let releasedPercent = 0;

  if (
    qualifiedCreators >=
    policy.tier10MinCreators
  )
    releasedPercent =
      policy.tier10Release;
  else if (
    qualifiedCreators >=
    policy.tier9MinCreators
  )
    releasedPercent =
      policy.tier9Release;
  else if (
    qualifiedCreators >=
    policy.tier8MinCreators
  )
    releasedPercent =
      policy.tier8Release;
  else if (
    qualifiedCreators >=
    policy.tier7MinCreators
  )
    releasedPercent =
      policy.tier7Release;
  else if (
    qualifiedCreators >=
    policy.tier6MinCreators
  )
    releasedPercent =
      policy.tier6Release;
  else if (
    qualifiedCreators >=
    policy.tier5MinCreators
  )
    releasedPercent =
      policy.tier5Release;
  else if (
    qualifiedCreators >=
    policy.tier4MinCreators
  )
    releasedPercent =
      policy.tier4Release;
  else if (
    qualifiedCreators >=
    policy.tier3MinCreators
  )
    releasedPercent =
      policy.tier3Release;
  else if (
    qualifiedCreators >=
    policy.tier2MinCreators
  )
    releasedPercent =
      policy.tier2Release;
  else
    releasedPercent =
      policy.tier1Release;

  // Hidden Platform Growth Reserve
  let growthReserve = 0;

  if (
    qualifiedCreators <
    policy.tier10MinCreators
  ) {
    growthReserve =
      policy.growthReserveDefault;
  }

  // Money Calculations
  const releasedAmount =
    creatorPool *
    (releasedPercent / 55);

  const growthReserveAmount =
    creatorPool *
    (growthReserve / 55);

  const creatorReserveAmount =
    creatorPool -
    releasedAmount -
    growthReserveAmount;

  // Pay Creators by Weight
  for (const creator of creators) {
    const payout =
      (creator.weight / totalWeight) *
      releasedAmount;

    await updateDoc(
      doc(
        db,
        "creatorWallets",
        creator.uid
      ),
      {
        availableBalance:
          increment(payout),
        lifetimeEarnings:
          increment(payout),
        lastUpdated:
          serverTimestamp(),
      }
    );

    await addDoc(
      collection(
        db,
        "creatorTransactions"
      ),
      {
        uid: creator.uid,
        amount: payout,
        source:
          "Monthly Creator Revenue Share",
        status: "completed",
        createdAt:
          serverTimestamp(),
      }
    );
  }

  // Update Pool (Admin Only)
  await updateDoc(poolRef, {
    creatorContentRevenue: 0,

    creatorReserve:
      increment(
        creatorReserveAmount
      ),

    platformGrowthReserve:
      increment(
        growthReserveAmount
      ),

    totalQualifiedCreators:
      qualifiedCreators,

    lastMonthlyPayout:
      serverTimestamp(),
  });
}
