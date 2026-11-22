// =======================================================
// Inclura Fortress Security Engine (IFSE)
// SOS Notification Sweeper
// =======================================================
//
// Safety net: if the SOS page is closed, the network drops or
// the client call fails, this server-side loop still dispatches
// the pending SOS notification within about one minute.
// It works without any administrator being online.
// =======================================================

import { firestore } from "../config/firebaseAdmin.js";
import { getNotificationConfig } from "../config/notificationConfig.js";
import { dispatchSOSNotifications } from "./sosNotificationService.js";

let timer = null;
let running = false;

async function sweepOnce() {
  if (running) {
    return;
  }

  running = true;

  try {
    const db = firestore();

    const emergencySOS = db.collection("emergencySOS");

    const pending = await emergencySOS
      .where("notificationDispatch.status", "==", "pending")
      .limit(20)
      .get();

    // Stale in-progress jobs (worker restarted mid-send) are
    // re-claimed by the service after its claim timeout.
    const stalled = await emergencySOS
      .where("notificationDispatch.status", "==", "in_progress")
      .limit(20)
      .get();

    const candidates = new Map();

    [...pending.docs, ...stalled.docs].forEach((snapshot) => {
      candidates.set(snapshot.id, snapshot);
    });

    for (const emergencyId of candidates.keys()) {
      await dispatchSOSNotifications({
        emergencyId,
        source: "sweeper",
      });
    }
  } catch (error) {
    // Missing index / offline Firebase must not crash Render.
    console.warn(
      "SOS notification sweeper warning:",
      error?.message || error
    );
  } finally {
    running = false;
  }
}

export function startSOSNotificationSweeper() {
  const config = getNotificationConfig();

  if (!config.sweep.enabled) {
    console.log("SOS notification sweeper disabled.");
    return null;
  }

  const interval = Math.max(15000, config.sweep.intervalMs);

  const kickoff = setTimeout(sweepOnce, 15000);
  kickoff.unref?.();

  timer = setInterval(sweepOnce, interval);
  timer.unref?.();

  console.log(
    `SOS notification sweeper enabled (every ${Math.round(
      interval / 1000
    )}s).`
  );

  return timer;
}

export function stopSOSNotificationSweeper() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
