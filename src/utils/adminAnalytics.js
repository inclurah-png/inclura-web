import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function getAdminRevenueSummary() {
  const poolSnap = await getDoc(
    doc(db, "revenuePool", "current")
  );

  const policySnap = await getDoc(
    doc(db, "system", "creatorRevenuePolicy")
  );

  const pool = poolSnap.exists() ? poolSnap.data() : {};
  const policy = policySnap.exists() ? policySnap.data() : {};

  return {
    creatorRevenue:
      pool.creatorContentRevenue || 0,

    creatorReserve:
      pool.creatorReserve || 0,

    platformGrowthReserve:
      pool.platformGrowthReserve || 0,

    platformRevenue:
      pool.platformPoolShare || 0,

    marketplaceRevenue:
      pool.marketplaceRevenue || 0,

    platformServiceRevenue:
      pool.platformServiceRevenue || 0,

    qualifiedCreators:
      pool.totalQualifiedCreators || 0,

    lastPayout:
      pool.lastMonthlyPayout || null,

    creatorAllocation:
      policy.creatorAllocation || 55,

    platformAllocation:
      policy.platformAllocation || 45,

    growthReserve:
      policy.growthReserveDefault || 20,
  };
}
