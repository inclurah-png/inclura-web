import crypto from "node:crypto";

import { firestore } from "../config/firebaseAdmin.js";
import { normalizePhone } from "../config/notificationConfig.js";
import {
  mapTextbeeEvent,
  shouldAdvanceTextbeeStatus,
  textbeeEventTimestamp,
  verifyTextbeeWebhookSignature,
} from "../services/textbeeWebhookSecurity.js";

const ALLOWED_EVENTS = new Set([
  "MESSAGE_SENT",
  "MESSAGE_DELIVERED",
  "MESSAGE_FAILED",
  "UNKNOWN_STATE",
]);

function boundedString(value, max = 200) {
  return typeof value === "string" && value.length > 0 && value.length <= max
    ? value
    : "";
}

function updateSummaryRecipient(summary, { batchId, recipient, status }) {
  if (!summary || typeof summary !== "object") return summary;
  const next = { ...summary };

  if (Array.isArray(summary.recipients)) {
    next.recipients = summary.recipients.map((item) => {
      if (
        item?.channel !== "sms" ||
        item?.providerMessageId !== batchId ||
        normalizePhone(item?.to) !== recipient
      ) return item;
      return {
        ...item,
        providerStatus: status,
        deliveryStatus: status,
        deliveryConfirmed: status === "delivered",
      };
    });
  }

  if (summary.adminNotification && Array.isArray(summary.adminNotification.attempts)) {
    next.adminNotification = {
      ...summary.adminNotification,
      attempts: summary.adminNotification.attempts.map((item) => {
        if (
          item?.channel !== "sms" ||
          item?.providerMessageId !== batchId ||
          normalizePhone(item?.to) !== recipient
        ) return item;
        return {
          ...item,
          providerStatus: status,
          deliveryStatus: status,
          deliveryConfirmed: status === "delivered",
        };
      }),
    };
  }

  // A per-recipient receipt must never mark the whole SOS as delivered.
  next.deliveryConfirmed = false;
  return next;
}

export async function receiveTextbeeWebhook(req, res) {
  const secret = process.env.TEXTBEE_WEBHOOK_SECRET || "";
  const expectedSubscriptionId = process.env.TEXTBEE_WEBHOOK_SUBSCRIPTION_ID || "";
  const expectedDeviceId = process.env.TEXTBEE_DEVICE_ID || "";
  const rawBody = req.body;

  if (!secret || secret.length < 20 || !expectedSubscriptionId || !expectedDeviceId) {
    return res.status(503).json({ success: false, message: "Webhook integration is not configured." });
  }

  if (!verifyTextbeeWebhookSignature({
    rawBody,
    signatureHeader: req.headers["x-textbee-signature"],
    secret,
  })) {
    return res.status(401).json({ success: false, message: "Invalid webhook signature." });
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return res.status(400).json({ success: false, message: "Invalid webhook payload." });
  }

  const eventName = boundedString(event?.webhookEvent, 40);
  const subscriptionId = boundedString(event?.webhookSubscriptionId, 128);
  const deviceId = boundedString(event?.deviceId, 128);
  const idempotencyKey = boundedString(event?.idempotencyKey, 200);
  const smsId = boundedString(event?.smsId, 128);
  const batchId = boundedString(event?.smsBatchId, 128);
  const recipient = normalizePhone(event?.recipient);
  const nextStatus = mapTextbeeEvent(eventName, event?.status);

  if (
    !ALLOWED_EVENTS.has(eventName) ||
    !subscriptionId ||
    subscriptionId !== expectedSubscriptionId ||
    !deviceId ||
    deviceId !== expectedDeviceId ||
    !idempotencyKey ||
    !smsId ||
    !batchId ||
    !recipient ||
    !nextStatus
  ) {
    return res.status(400).json({ success: false, message: "Webhook event is not valid for this gateway." });
  }

  try {
    const db = firestore();
    const matches = await db
      .collection("emergencyNotificationLogs")
      .where("providerMessageId", "==", batchId)
      .limit(10)
      .get();

    const matched = matches.docs.find((snapshot) => {
      const record = snapshot.data() || {};
      return (
        record.provider === "textbee" &&
        record.channel === "sms" &&
        normalizePhone(record.recipientAddress) === recipient
      );
    });

    // A correctly signed event that cannot be linked to a known Inclura
    // send is acknowledged but never allowed to create or alter an SOS.
    if (!matched) {
      return res.status(202).json({ success: true, accepted: false, ignored: true });
    }

    const eventDocId = crypto.createHash("sha256").update(idempotencyKey).digest("hex");
    const eventRef = db.collection("textbeeWebhookEvents").doc(eventDocId);
    const logRef = matched.ref;
    const logData = matched.data() || {};
    const emergencyRef = logData.emergencyId
      ? db.collection("emergencySOS").doc(logData.emergencyId)
      : null;

    const outcome = await db.runTransaction(async (transaction) => {
      const eventSnapshot = await transaction.get(eventRef);
      if (eventSnapshot.exists) return { duplicate: true };

      const logSnapshot = await transaction.get(logRef);
      if (!logSnapshot.exists) return { ignored: true };

      const currentLog = logSnapshot.data() || {};
      const currentStatus = String(currentLog.deliveryStatus || currentLog.providerStatus || "queued").toLowerCase();
      const advance = shouldAdvanceTextbeeStatus(currentStatus, nextStatus);
      const resultingStatus = advance ? nextStatus : currentStatus;

      transaction.create(eventRef, {
        provider: "textbee",
        eventName,
        smsId,
        smsBatchId: batchId,
        resultingStatus,
        notificationLogId: logRef.id,
        emergencyId: currentLog.emergencyId || "",
        processedAt: new Date(),
      });

      if (advance) {
        transaction.update(logRef, {
          providerStatus: resultingStatus,
          deliveryStatus: resultingStatus,
          deliveryConfirmed: resultingStatus === "delivered",
          providerSmsId: smsId,
          providerDeliveryAt: textbeeEventTimestamp(event) || null,
          providerDeliveryUpdatedAt: new Date(),
        });

        if (emergencyRef) {
          const emergencySnapshot = await transaction.get(emergencyRef);
          if (emergencySnapshot.exists) {
            const emergency = emergencySnapshot.data() || {};
            const summary = updateSummaryRecipient(
              emergency.notificationSummary,
              { batchId, recipient, status: resultingStatus }
            );
            const dispatchSummary = updateSummaryRecipient(
              emergency.notificationDispatch?.summary,
              { batchId, recipient, status: resultingStatus }
            );
            transaction.update(emergencyRef, {
              notificationSummary: summary || null,
              ...(emergency.notificationDispatch
                ? { "notificationDispatch.summary": dispatchSummary || null }
                : {}),
              notificationUpdatedAt: new Date(),
            });
          }
        }
      }

      return { duplicate: false, updated: advance, status: resultingStatus };
    });

    return res.status(200).json({
      success: true,
      duplicate: outcome.duplicate === true,
      updated: outcome.updated === true,
      status: outcome.status || "",
    });
  } catch (error) {
    console.error("TextBee webhook processing failed:", error?.message || "unknown error");
    return res.status(500).json({ success: false, message: "Webhook processing failed." });
  }
}
