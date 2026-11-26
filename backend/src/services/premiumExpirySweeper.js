import { firestore } from "../config/firebaseAdmin.js";

let expirySweepRunning = false;

export async function runPremiumExpirySweep() {
  if (expirySweepRunning) return { skipped: true, expired: 0 };
  expirySweepRunning = true;
  try {
    const db = firestore();
    const now = new Date();
    const snapshot = await db.collection("users")
      .where("premiumExpiryDate", "<=", now)
      .limit(400)
      .get();

    const expiredUsers = snapshot.docs.filter((userDoc) => {
      const data = userDoc.data();
      return data.premium === true || data.premiumActive === true;
    });
    if (expiredUsers.length === 0) return { skipped: false, expired: 0 };
    const batch = db.batch();
    expiredUsers.forEach((userDoc) => {
      batch.set(userDoc.ref, {
        premium: false,
        premiumActive: false,
        premiumTier: "",
        premiumExpiredAt: now,
      }, { merge: true });
    });
    await batch.commit();
    return { skipped: false, expired: expiredUsers.length };
  } finally {
    expirySweepRunning = false;
  }
}

export function startPremiumExpirySweeper() {
  const intervalMs = Math.max(60_000, Number(process.env.PREMIUM_EXPIRY_SWEEP_INTERVAL_MS) || 60_000);
  const run = async () => {
    try {
      const result = await runPremiumExpirySweep();
      if (result.expired > 0) {
        console.log(`Premium expiry sweep deactivated ${result.expired} expired subscription(s).`);
      }
    } catch (error) {
      console.error("Premium expiry sweep failed:", error.message);
    }
  };
  void run();
  const timer = setInterval(run, intervalMs);
  timer.unref?.();
  return timer;
}
