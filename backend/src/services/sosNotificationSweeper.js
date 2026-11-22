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

// Only SOS events this recent are picked up when the record has no
// notification job at all. Older records are never re-alerted.
const RECENT_SOS_WINDOW_MS = 15 * 60 * 1000;
const RECENT_SOS_LIMIT = 25;

let timer = null;
let running = false;

// A record needs notification when no dispatch job was ever claimed
// (the page never reached the backend) or the job is still queued.
function needsDispatch(snapshot) {
  const data = snapshot.data() || {};

  if (data.systemPlaceholder === true || data.resolved === true) {
    return false;
  }

  const status = data.notificationDispatch?.status || "";

  return status === "" || status === "pending" || status === "in_progress";
}

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

    // SOS records created by any client that never recorded a
    // notification job (browser closed mid-submit, network drop,
    // a client that does not call the send endpoint). Without this
    // the record would sit silently with no alert ever sent.
    try {
      const recent = await emergencySOS
        .where(
          "createdAt",
          ">=",
          new Date(Date.now() - RECENT_SOS_WINDOW_MS)
        )
        .orderBy("createdAt", "desc")
        .limit(RECENT_SOS_LIMIT)
        .get();

      recent.docs.forEach((snapshot) => {
        if (needsDispatch(snapshot)) {
          candidates.set(snapshot.id, snapshot);
        }
      });
    } catch (error) {
      console.warn(
        "SOS notification sweeper: recent SOS scan failed:",
        error?.message || error
      );
    }

    for (const emergencyId of candidates.keys()) {
      const result = await dispatchSOSNotifications({
        emergencyId,
        source: "sweeper",
      });

      const status = result?.summary?.status;

      // in_progress means another request owns the job; do not log noise.
      if (status && status !== "in_progress") {
        console.log(`SOS sweeper dispatched ${emergencyId}: ${status}`);
      }
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
