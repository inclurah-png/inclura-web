import { FieldValue } from "firebase-admin/firestore";
import { firestore } from "../config/firebaseAdmin.js";

let expirySweepRunning = false;

export async function runPremiumExpirySweep() {
  if (expirySweepRunning) return { skipped: true, expired: 0 };
  expirySweepRunning = true;
  try {
    const db = firestore();
    const now = new Date();
    let cursor = null;
    let expired = 0;
    let pages = 0;

    // Remove processed expiry dates so a large set of already-expired,
    // inactive accounts cannot block later expired subscriptions.
    while (pages < 20) {
      let query = db.collection("users")
        .where("premiumExpiryDate", "<=", now)
        .orderBy("premiumExpiryDate")
        .limit(400);
      if (cursor) query = query.startAfter(cursor);

      const snapshot = await query.get();
      if (snapshot.empty) break;

      const batch = db.batch();
      snapshot.docs.forEach((userDoc) => {
        const data = userDoc.data();
        const isActive = data.premium === true || data.premiumActive === true;
        const update = {
          premiumLastExpiryDate: data.premiumExpiryDate,
          premiumExpiryDate: FieldValue.delete(),
        };
        if (isActive) {
          update.premium = false;
          update.premiumActive = false;
          update.premiumTier = "";
          update.premiumExpiredAt = now;
          expired += 1;
        }
        batch.set(userDoc.ref, update, { merge: true });
      });
      await batch.commit();
      cursor = snapshot.docs[snapshot.docs.length - 1];
      pages += 1;
      if (snapshot.size < 400) break;
    }

    let recruiterExpired = 0;
    let recruiterCursor = null;
    let recruiterPages = 0;
    while (recruiterPages < 20) {
      let recruiterQuery = db.collection("users")
        .where("recruiter.expiresAt", "<=", now)
        .orderBy("recruiter.expiresAt")
        .limit(400);
      if (recruiterCursor) recruiterQuery = recruiterQuery.startAfter(recruiterCursor);

      const recruiterSnapshot = await recruiterQuery.get();
      if (recruiterSnapshot.empty) break;

      const recruiterBatch = db.batch();
      recruiterSnapshot.docs.forEach((userDoc) => {
        const recruiter = userDoc.data().recruiter || {};
        const updates = {
          "recruiter.lastExpiresAt": recruiter.expiresAt,
          "recruiter.expiresAt": FieldValue.delete(),
        };
        if (recruiter.status === "active") {
          updates["recruiter.status"] = "expired";
          updates["recruiter.expiredAt"] = now;
          recruiterExpired += 1;
        }
        recruiterBatch.update(userDoc.ref, updates);
      });
      await recruiterBatch.commit();
      recruiterCursor = recruiterSnapshot.docs[recruiterSnapshot.docs.length - 1];
      recruiterPages += 1;
      if (recruiterSnapshot.size < 400) break;
    }

    return { skipped: false, expired, recruiterExpired, pages: pages + recruiterPages };
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
