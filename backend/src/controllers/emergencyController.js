// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Emergency Notification Controller
// =======================================================
//
// The administrator has no endpoint here that can approve,
// reject, delay, cancel, reroute or authorize an SOS message.
// SOS notification is automatic and one-way.
// =======================================================

import { firestore } from "../config/firebaseAdmin.js";
import { publicNotificationStatus } from "../config/notificationConfig.js";

import {
  dispatchSOSNotifications,
  sendSOSTestNotification,
} from "../services/sosNotificationService.js";

export async function notifySOS(req, res) {
  const emergencyId = String(req.params.emergencyId || "").trim();

  if (!emergencyId) {
    return res.status(400).json({
      success: false,
      message: "Emergency ID is required.",
    });
  }

  try {
    const snapshot = await firestore()
      .collection("emergencySOS")
      .doc(emergencyId)
      .get();

    if (!snapshot.exists) {
      return res.status(404).json({
        success: false,
        message: "Emergency SOS record was not found.",
      });
    }

    const emergency = snapshot.data() || {};

    if (
      emergency.userId !== req.user.uid &&
      req.user.token?.admin !== true
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You may only request notification for your own SOS event.",
      });
    }

    const result = await dispatchSOSNotifications({
      emergencyId,
      source: String(req.body?.source || "client"),
    });

    return res.status(200).json({
      success: true,
      emergencyId,
      replayed: Boolean(result.replayed),
      notifications: result.summary,
    });
  } catch (error) {
    console.error(
      "SOS notification endpoint error:",
      error?.message || error
    );

    return res.status(500).json({
      success: false,
      message: "SOS notification pipeline failed.",
      details: String(error?.message || error).slice(0, 300),
    });
  }
}

// Compatibility handler for the URL the SOS page already calls:
// POST /api/sos-notifications/:emergencyId/send
//
// It runs the same automatic pipeline. The sent/failed counts
// reported to the page are SMS only, so the page's "Trusted-contact
// SMS" wording stays accurate. Email is dispatched and audited too.
export async function sendSOSNotification(req, res) {
  const emergencyId = String(req.params.emergencyId || "").trim();

  if (!emergencyId) {
    return res.status(400).json({
      success: false,
      message: "Emergency ID is required.",
    });
  }

  try {
    const snapshot = await firestore()
      .collection("emergencySOS")
      .doc(emergencyId)
      .get();

    if (!snapshot.exists) {
      return res.status(404).json({
        success: false,
        message: "Emergency SOS record was not found.",
      });
    }

    const emergency = snapshot.data() || {};

    if (
      emergency.userId !== req.user.uid &&
      req.user.token?.admin !== true
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You may only request notification for your own SOS event.",
      });
    }

    const result = await dispatchSOSNotifications({
      emergencyId,
      source: "sos-page",
    });

    const summary = result.summary || null;
    const sms = summary?.channels?.sms || {};

    return res.status(200).json({
      success: true,
      emergencyId,
      replayed: Boolean(result.replayed),
      status: summary?.status || "unknown",
      sent: Number(sms.providerAccepted || 0),
      failed: Number(sms.failed || 0),
      notConfigured: Number(sms.notConfigured || 0),
      deliveryConfirmed: false,
      channels: summary?.channels || null,
      warnings: summary?.warnings || [],
      message:
        "Provider acceptance is not recipient delivery confirmation.",
    });
  } catch (error) {
    console.error(
      "SOS notification endpoint error:",
      error?.message || error
    );

    return res.status(500).json({
      success: false,
      message: "SOS notification pipeline failed.",
      details: String(error?.message || error).slice(0, 300),
    });
  }
}

// Safe verification. Never uses real emergency recipients and
// never creates or alters an SOS record.
export async function testSOSNotification(req, res) {
  const dryRun = req.body?.dryRun !== false;
  const channel = ["sms", "email", "both"].includes(req.body?.channel)
    ? req.body.channel
    : "both";

  try {
    if (dryRun) {
      return res.status(200).json({
        success: true,
        dryRun: true,
        message:
          "Dry run only. Nothing was sent. Call again with { dryRun: false } after setting EMERGENCY_TEST_PHONES / EMERGENCY_TEST_EMAILS.",
        configuration: publicNotificationStatus(),
      });
    }

    const result = await sendSOSTestNotification({ channel, userId: req.user.uid });

    return res.status(result.ok ? 200 : 502).json({
      success: result.ok,
      dryRun: false,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "SOS test notification failed.",
      details: String(error?.message || error).slice(0, 300),
    });
  }
}

export async function notificationStatus(req, res) {
  return res.status(200).json({
    success: true,
    ...publicNotificationStatus(),
  });
}
