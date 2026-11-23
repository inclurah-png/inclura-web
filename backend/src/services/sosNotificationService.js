// =======================================================
// Inclura Fortress Security Engine (IFSE)
// SOS Notification Service
// =======================================================
//
// Runs fully automatically on the backend. There is no
// administrator approval, rejection, delay, cancellation,
// routing decision or authorization step anywhere in this
// pipeline.
//
// Flow:
//   1. Claim the SOS notification job (idempotent).
//   2. Collect trusted contacts, family network, configured
//      emergency recipients and the SOS form contact.
//   3. Send SMS and email through the configured provider.
//   4. Record every attempt, provider response and failure
//      in the audit trail.
//   5. Notify the administrator with the result.
//   6. Persist an honest summary: provider acceptance is NOT
//      recipient delivery.
// =======================================================

import admin from "firebase-admin";

import { firestore } from "../config/firebaseAdmin.js";
import { sendPushToContacts, sendPushToUsers } from "./pushNotificationService.js";
import {
  getNotificationConfig,
  normalizeEmail,
  normalizePhone,
  splitRecipient,
} from "../config/notificationConfig.js";

import {
  buildAdminMessage,
  buildSOSMessage,
  sendEmail,
  sendSMS,
} from "./notificationProviders.js";

const LOG_COLLECTION = "emergencyNotificationLogs";
const CLAIM_TIMEOUT_MS = 5 * 60 * 1000;

const DELIVERY_NOTE =
  "Provider acceptance only. Recipient delivery is not confirmed unless the provider returns a delivery receipt.";

function serverTimestamp() {
  return admin.firestore.FieldValue.serverTimestamp();
}

function toMillis(value) {
  if (!value) {
    return 0;
  }

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "number") {
    return value;
  }

  const parsed = Date.parse(value);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function safeString(value, fallback = "") {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : fallback;
}

// =======================================================
// Recipient discovery
// =======================================================

function contactPhone(data) {
  return normalizePhone(
    data.phoneNumber ||
      data.phone ||
      data.mobile ||
      data.mobileNumber ||
      data.phone_number ||
      ""
  );
}

function contactEmail(data) {
  return normalizeEmail(data.email || data.emailAddress || "");
}

async function loadOwnerDocuments(db, collectionName, ownerId, fields) {
  const found = [];
  const seen = new Set();

  for (const field of fields) {
    try {
      const snapshot = await db
        .collection(collectionName)
        .where(field, "==", ownerId)
        .get();

      snapshot.forEach((docSnap) => {
        const key = `${collectionName}:${docSnap.id}`;

        if (seen.has(key)) {
          return;
        }

        seen.add(key);

        found.push({
          id: docSnap.id,
          collection: collectionName,
          data: docSnap.data() || {},
        });
      });
    } catch (error) {
      // A missing field or a permission problem must not stop
      // the emergency notification. It is recorded by the caller.
      console.warn(
        `SOS recipients: could not read ${collectionName}.${field}:`,
        error?.message || error
      );
    }
  }

  return found;
}

async function collectDirectoryRecipients(db, ownerId) {
  if (!ownerId) {
    return { recipients: [], warnings: [] };
  }

  const recipients = [];
  const warnings = [];

  const trustedContacts = await loadOwnerDocuments(
    db,
    "trustedContacts",
    ownerId,
    ["userId", "ownerId"]
  );

  const familyNetwork = await loadOwnerDocuments(
    db,
    "familyEmergencyNetwork",
    ownerId,
    ["ownerId", "userId"]
  );

  if (!trustedContacts.length) {
    warnings.push(
      "No trusted contact documents were found for this user (checked userId and ownerId)."
    );
  }

  for (const record of trustedContacts) {
    recipients.push({
      name:
        safeString(record.data.fullName) ||
        safeString(record.data.name) ||
        "Trusted contact",
      phone: contactPhone(record.data),
      email: contactEmail(record.data),
      audience: "trusted_contact",
      sourceId: record.id,
      linkedUserId: safeString(record.data.contactUserId) || safeString(record.data.linkedUserId) || safeString(record.data.memberUserId) || safeString(record.data.firebaseUid) || safeString(record.data.uid),
    });
  }

  for (const record of familyNetwork) {
    recipients.push({
      name:
        safeString(record.data.fullName) ||
        safeString(record.data.name) ||
        "Family network member",
      phone: contactPhone(record.data),
      email: contactEmail(record.data),
      audience: "family_network",
      sourceId: record.id,
      linkedUserId: safeString(record.data.contactUserId) || safeString(record.data.linkedUserId) || safeString(record.data.memberUserId) || safeString(record.data.firebaseUid) || safeString(record.data.uid),
    });
  }

  return { recipients, warnings };
}

// =======================================================
// Job claiming
// =======================================================

async function claimNotificationJob({ emergencyId, source }) {
  const db = firestore();
  const ref = db.collection("emergencySOS").doc(emergencyId);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);

    if (!snapshot.exists) {
      return { ok: false, reason: "not_found" };
    }

    const emergency = snapshot.data() || {};
    const dispatch = emergency.notificationDispatch || {};

    // Completed jobs are idempotent: the stored summary is returned.
    if (
      dispatch.status === "completed" ||
      dispatch.status === "completed_with_failures"
    ) {
      return {
        ok: true,
        replayed: true,
        emergency,
        summary: dispatch.summary || emergency.notificationSummary || null,
      };
    }

    // Another worker is currently sending. Do not duplicate.
    if (
      dispatch.status === "in_progress" &&
      Date.now() - toMillis(dispatch.startedAt) < CLAIM_TIMEOUT_MS
    ) {
      return { ok: true, busy: true, emergency };
    }

    transaction.set(
      ref,
      {
        notificationDispatch: {
          ...dispatch,
          required: true,
          status: "in_progress",
          startedAt: serverTimestamp(),
          lastSource: source || "system",
          attemptCount: Number(dispatch.attemptCount || 0) + 1,
          lastError: "",
        },
        notificationUpdatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return { ok: true, claimed: true, emergency };
  });
}

// =======================================================
// Audit helpers
// =======================================================

function attemptAuditRecord({
  emergencyId,
  sos,
  attempt,
  audience,
  channel,
  kind,
}) {
  return {
    emergencyId,
    userId: sos.userId || "",
    userEmail: sos.userEmail || "",
    channel,
    audience,
    kind: kind || "sos_alert",
    recipientName: attempt.name || "",
    recipientAddress: attempt.to || "",
    provider: attempt.provider || "none",
    outcome: attempt.outcome,
    providerAccepted: attempt.accepted === true,
    deliveryConfirmed: false,
    deliveryNote: DELIVERY_NOTE,
    providerMessageId: attempt.providerMessageId || "",
    providerStatus: attempt.providerStatus || "",
    httpStatus: attempt.httpStatus || 0,
    error: attempt.error || "",
    attemptedAt: attempt.attemptedAt || new Date().toISOString(),
    createdAt: serverTimestamp(),
  };
}

async function writeAuditLogs(db, records) {
  const ids = [];

  for (const record of records) {
    try {
      const ref = await db.collection(LOG_COLLECTION).add(record);
      ids.push(ref.id);
    } catch (error) {
      console.error(
        "SOS notification audit write failed:",
        error?.message || error
      );
    }
  }

  return ids;
}

// =======================================================
// Summary
// =======================================================

function buildChannelSummary(attempts) {
  const summary = {
    attempted: 0,
    providerAccepted: 0,
    failed: 0,
    notConfigured: 0,
  };

  for (const attempt of attempts) {
    summary.attempted += 1;

    if (attempt.accepted) {
      summary.providerAccepted += 1;
    } else if (attempt.outcome === "skipped_not_configured") {
      summary.notConfigured += 1;
    } else {
      summary.failed += 1;
    }
  }

  return summary;
}

function overallStatus({ recipients, attempts, emailConfigured, smsConfigured, pushConfigured }) {
  if (!recipients.length && !pushConfigured) {
    return "no_recipients";
  }

  if (!emailConfigured && !smsConfigured && !pushConfigured) {
    return "not_configured";
  }

  const accepted = attempts.some((attempt) => attempt.accepted);

  return accepted ? "provider_accepted" : "failed";
}

// =======================================================
// Main pipeline
// =======================================================

export async function dispatchSOSNotifications({
  emergencyId,
  source = "system",
  testRecipients = null,
  dryRun = false,
} = {}) {
  const db = firestore();
  const config = getNotificationConfig();

  if (!emergencyId) {
    return {
      summary: {
        status: "invalid",
        error: "Emergency ID is required.",
      },
      replayed: false,
    };
  }

  // A dry run must never claim (and therefore block or delay) the
  // real notification job, so it reads the record without writing.
  const claim = dryRun
    ? null
    : await claimNotificationJob({ emergencyId, source });

  if (claim && !claim.ok) {
    return {
      summary: {
        status: "not_recorded",
        error: "Emergency SOS record was not found.",
      },
      replayed: false,
    };
  }

  if (claim?.replayed) {
    return { summary: claim.summary, replayed: true };
  }

  if (claim?.busy) {
    return {
      summary: {
        status: "in_progress",
        note: "SOS notification is already being dispatched.",
      },
      replayed: false,
    };
  }

  let sos = claim?.emergency || {};

  if (!Object.keys(sos).length) {
    const snapshot = await db
      .collection("emergencySOS")
      .doc(emergencyId)
      .get();

    if (!snapshot.exists) {
      return {
        summary: {
          status: "not_recorded",
          error: "Emergency SOS record was not found.",
        },
        replayed: false,
      };
    }

    sos = snapshot.data() || {};
  }
  const emergencyRef = db.collection("emergencySOS").doc(emergencyId);
  const startedAt = new Date().toISOString();
  const warnings = [];

  // -----------------------------------------------------
  // Recipients
  // -----------------------------------------------------

  let recipients = [];
  let pushUserTargets = [];

  if (Array.isArray(testRecipients) && testRecipients.length) {
    recipients = testRecipients;
  } else {
    const directory = await collectDirectoryRecipients(db, sos.userId);
    recipients.push(...directory.recipients);
    pushUserTargets = directory.recipients.map((recipient) => ({
      userId: recipient.linkedUserId || "",
      name: recipient.name,
      email: recipient.email || "",
      phone: recipient.phone || "",
      audience: recipient.audience,
    })).filter((recipient) => recipient.userId || recipient.email || recipient.phone);
    warnings.push(...directory.warnings);

    for (const phone of config.recipients.emergencyPhones) {
      recipients.push({
        name: "Configured emergency number",
        phone,
        email: "",
        audience: "emergency_list",
      });
    }

    for (const email of config.recipients.emergencyEmails) {
      recipients.push({
        name: "Configured emergency email",
        phone: "",
        email,
        audience: "emergency_list",
      });
    }

    const formContact = splitRecipient(sos.trustedContact);

    if (formContact.phone || formContact.email) {
      recipients.push({
        name: "Trusted contact from SOS form",
        phone: formContact.phone,
        email: formContact.email,
        audience: "sos_form_contact",
      });
    }
  }

  // Deduplicate by channel + normalized address.
  const deduped = [];
  const seen = new Set();

  for (const recipient of recipients) {
    const phone = normalizePhone(recipient.phone);
    const email = normalizeEmail(recipient.email);

    if (phone) {
      const key = `sms:${phone}`;

      if (!seen.has(key)) {
        seen.add(key);
        deduped.push({ ...recipient, phone, email: "" });
      }
    }

    if (email) {
      const key = `email:${email}`;

      if (!seen.has(key)) {
        seen.add(key);
        deduped.push({ ...recipient, email, phone: "" });
      }
    }
  }

  if (!deduped.length) {
    warnings.push(
      "No SOS recipients were available: no trusted contacts, no configured emergency numbers/emails and no SOS form contact."
    );
  }

  const message = buildSOSMessage(sos, emergencyId);

  // -----------------------------------------------------
  // Dry run (safe verification, sends nothing)
  // -----------------------------------------------------

  if (dryRun) {
    return {
      replayed: false,
      summary: {
        status: "dry_run",
        emergencyId,
        recipients: deduped.map((recipient) => ({
          channel: recipient.phone ? "sms" : "email",
          to: recipient.phone || recipient.email,
          name: recipient.name || "",
          audience: recipient.audience || "",
        })),
        smsConfigured: config.sms.configured,
        emailConfigured: config.email.configured,
        pushTargetCount: pushUserTargets.length + String(process.env.ADMIN_FCM_USER_IDS || "").split(",").map((value) => value.trim()).filter(Boolean).length,
        smsProvider: config.sms.provider,
        emailProvider: config.email.provider,
        smsText: message.smsText,
        emailSubject: message.emailSubject,
        warnings,
        deliveryConfirmed: false,
        deliveryNote: DELIVERY_NOTE,
      },
    };
  }

  // -----------------------------------------------------
  // Dispatch
  // -----------------------------------------------------

  const smsAttempts = [];
  const emailAttempts = [];

  for (const recipient of deduped) {
    if (recipient.phone) {
      const attempt = await sendSMS({
        to: recipient.phone,
        body: message.smsText,
        config,
        name: recipient.name,
        audience: recipient.audience,
      });

      smsAttempts.push({ ...attempt, name: recipient.name });
    } else if (recipient.email) {
      const attempt = await sendEmail({
        to: recipient.email,
        subject: message.emailSubject,
        text: message.emailText,
        config,
        name: recipient.name,
        audience: recipient.audience,
      });

      emailAttempts.push({ ...attempt, name: recipient.name });
    }
  }

  const pushTitle = "Inclura SOS emergency alert";
  const pushBody = safeString(sos.description, "A trusted contact has requested emergency assistance. Open Inclura to view the alert.");
  const pushAttempts = await sendPushToContacts({
    db,
    contacts: pushUserTargets,
    title: pushTitle,
    body: pushBody,
    emergencyId,
  });

  const allAttempts = [...smsAttempts, ...emailAttempts, ...pushAttempts];

  const summary = {
    status: overallStatus({
      recipients: deduped,
      attempts: allAttempts,
      emailConfigured: config.email.configured,
      smsConfigured: config.sms.configured,
      pushConfigured: pushUserTargets.length > 0 || String(process.env.ADMIN_FCM_USER_IDS || "").trim().length > 0,
    }),
    emergencyId,
    startedAt,
    completedAt: "",
    smsProvider: config.sms.provider,
    emailProvider: config.email.provider,
    smsConfigured: config.sms.configured,
    emailConfigured: config.email.configured,
    deliveryConfirmed: false,
    deliveryNote: DELIVERY_NOTE,
    channels: {
      sms: buildChannelSummary(smsAttempts),
      email: buildChannelSummary(emailAttempts),
      push: buildChannelSummary(pushAttempts),
    },
    recipients: allAttempts.map((attempt) => ({
      channel: attempt.channel,
      to: attempt.to,
      name: attempt.name || "",
      audience: attempt.audience || "",
      outcome: attempt.outcome,
      providerAccepted: attempt.accepted === true,
      providerMessageId: attempt.providerMessageId || "",
      providerStatus: attempt.providerStatus || "",
      error: attempt.error || "",
      deliveryConfirmed: false,
    })),
    warnings,
    adminNotification: null,
  };

  // -----------------------------------------------------
  // Administrator notification (automatic, one-way)
  // -----------------------------------------------------

  const adminAttempts = [];
  const adminMessage = buildAdminMessage({ sos, emergencyId, summary });
  const adminPushUserIds = String(process.env.ADMIN_FCM_USER_IDS || "")
    .split(",").map((value) => value.trim()).filter(Boolean);
  const adminPushTargets = [
    ...adminPushUserIds.map((userId) => ({ userId, name: "Administrator", audience: "administrator" })),
    ...config.recipients.adminEmails.map((email) => ({ email, name: "Administrator", audience: "administrator" })),
  ];
  const adminPushAttempts = await sendPushToContacts({
    db,
    contacts: adminPushTargets,
    title: "Inclura SOS — Administrator alert",
    body: `SOS ${emergencyId}: ${safeString(sos.userName, "A member")} needs emergency assistance. Open Inclura IFSE monitoring.`,
    emergencyId,
  });
  adminAttempts.push(...adminPushAttempts);

  if (!config.recipients.adminEmails.length) {
    warnings.push(
      "No ADMIN_NOTIFICATION_EMAILS configured: administrator received no email copy of this SOS."
    );
  }

  if (!config.recipients.adminPhones.length) {
    warnings.push(
      "No ADMIN_NOTIFICATION_PHONES configured: administrator received no SMS copy of this SOS."
    );
  }
  if (!adminPushTargets.length) {
    warnings.push("No ADMIN_FCM_USER_IDS configured: no administrator device received an FCM push copy.");
  }

  for (const phone of config.recipients.adminPhones) {
    const attempt = await sendSMS({
      to: phone,
      body: adminMessage.smsText,
      config,
      name: "Administrator",
      audience: "administrator",
    });

    adminAttempts.push({ ...attempt, name: "Administrator" });
  }

  for (const email of config.recipients.adminEmails) {
    const attempt = await sendEmail({
      to: email,
      subject: adminMessage.emailSubject,
      text: adminMessage.emailText,
      config,
      name: "Administrator",
      audience: "administrator",
    });

    adminAttempts.push({ ...attempt, name: "Administrator" });
  }

  summary.adminNotification = {
    recipientCount:
      config.recipients.adminEmails.length +
      config.recipients.adminPhones.length + adminPushTargets.length,
    sms: buildChannelSummary(
      adminAttempts.filter((attempt) => attempt.channel === "sms")
    ),
    email: buildChannelSummary(
      adminAttempts.filter((attempt) => attempt.channel === "email")
    ),
    push: buildChannelSummary(adminPushAttempts),
    attempts: adminAttempts.map((attempt) => ({
      channel: attempt.channel,
      to: attempt.to,
      outcome: attempt.outcome,
      providerAccepted: attempt.accepted === true,
      providerMessageId: attempt.providerMessageId || "",
      error: attempt.error || "",
      deliveryConfirmed: false,
    })),
  };

  summary.completedAt = new Date().toISOString();

  // -----------------------------------------------------
  // Audit trail
  // -----------------------------------------------------

  const auditRecords = [
    ...smsAttempts.map((attempt) =>
      attemptAuditRecord({
        emergencyId,
        sos,
        attempt,
        audience: attempt.audience,
        channel: "sms",
        kind: "sos_alert",
      })
    ),
    ...emailAttempts.map((attempt) =>
      attemptAuditRecord({
        emergencyId,
        sos,
        attempt,
        audience: attempt.audience,
        channel: "email",
        kind: "sos_alert",
      })
    ),
    ...adminAttempts.map((attempt) =>
      attemptAuditRecord({
        emergencyId,
        sos,
        attempt,
        audience: "administrator",
        channel: attempt.channel,
        kind: "admin_alert",
      })
    ),
  ];

  const auditIds = await writeAuditLogs(db, auditRecords);

  summary.auditLogCount = auditIds.length;

  // -----------------------------------------------------
  // Persist results
  // -----------------------------------------------------

  // Only an accepted message counts as a completed dispatch. A job
  // where nothing could be sent is recorded as completed WITH
  // failures, so the audit trail never reads as a successful alert.
  const finalDispatchStatus =
    summary.status === "provider_accepted"
      ? "completed"
      : "completed_with_failures";

  try {
    await emergencyRef.set(
      {
        notificationStatus: summary.status,
        notificationSummary: summary,
        notificationDispatch: {
          required: true,
          status: finalDispatchStatus,
          summary,
          startedAt: sos.notificationDispatch?.startedAt || serverTimestamp(),
          completedAt: serverTimestamp(),
          lastSource: source,
          attemptCount: Number(
            sos.notificationDispatch?.attemptCount || 0
          ) + 1,
          auditLogIds: auditIds,
          deliveryConfirmed: false,
          deliveryNote: DELIVERY_NOTE,
          lastError:
            summary.status === "provider_accepted"
              ? ""
              : summary.status === "not_configured"
              ? "No SMS or email provider is configured on the backend, so nothing was sent."
              : summary.status === "no_recipients"
              ? "No SOS recipient was available, so nothing was sent."
              : "No provider accepted any SOS message.",
        },
        notificationUpdatedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error(
      "SOS notification: could not update SOS record:",
      error?.message || error
    );
  }

  // Keep the existing IFSE notification queue records truthful.
  try {
    const notificationsSnapshot = await db
      .collection("emergencyNotifications")
      .where("emergencyId", "==", emergencyId)
      .get();

    for (const docSnap of notificationsSnapshot.docs) {
      const record = docSnap.data() || {};
      const phone = normalizePhone(record.recipientPhone);
      const email = normalizeEmail(record.recipientEmail);

      const related = allAttempts.filter(
        (attempt) =>
          (phone && attempt.to === phone) ||
          (email && attempt.to === email)
      );

      if (!related.length) {
        continue;
      }

      const accepted = related.some((attempt) => attempt.accepted);
      const outcome = related[0].outcome;

      await docSnap.ref.set(
        {
          notificationStatus: accepted
            ? "Provider Accepted (delivery not confirmed)"
            : outcome === "skipped_not_configured"
            ? "Not Sent (provider not configured)"
            : "Failed",
          providerAccepted: accepted,
          deliveryConfirmed: false,
          deliveryNote: DELIVERY_NOTE,
          provider: related[0].provider,
          providerMessageId: related[0].providerMessageId || "",
          notificationUpdatedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.warn(
      "SOS notification: could not update emergencyNotifications records:",
      error?.message || error
    );
  }

  // Timeline entry so the IFSE audit view shows the notification result.
  try {
    await db.collection("emergencyTimeline").add({
      timelineId: `${emergencyId}_NOTIFY`,
      emergencyId,
      eventType: "Emergency Contact Notification Dispatched",
      eventDescription:
        `Automatic SOS notification completed: ${summary.channels.sms.providerAccepted} SMS and ${summary.channels.email.providerAccepted} email message(s) accepted by the provider, ` +
        `${summary.channels.sms.failed + summary.channels.email.failed} failed. Provider acceptance is not recipient delivery.`,
      performedBy: "SOS Notification Service",
      performerType: "System",
      eventStatus:
        summary.status === "failed" ? "Failed" : "Completed",
      severity: sos.priority || "Critical",
      notificationStatus: summary.status,
      deliveryConfirmed: false,
      visibleToFamily: true,
      visibleToGovernment: true,
      visibleToResponders: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn(
      "SOS notification: could not write timeline entry:",
      error?.message || error
    );
  }

  return { summary, replayed: false };
}

// Used by the safe verification endpoint only. Sends a clearly
// labelled test message to EMERGENCY_TEST_* recipients and never
// touches a real SOS record.
export async function sendSOSTestNotification({ channel = "both", userId = "" } = {}) {
  const config = getNotificationConfig();

  const testPhones = config.recipients.testPhones;
  const testEmails = config.recipients.testEmails;
  const attempts = [];

  if (!testPhones.length && !testEmails.length && !(channel !== "sms" && userId)) {
    return {
      ok: false,
      status: "no_test_recipients",
      message:
        "No test recipients configured. Set EMERGENCY_TEST_PHONES and/or EMERGENCY_TEST_EMAILS, or register this signed-in device for push. Real SOS recipients are never used by this endpoint.",
      attempts: [],
    };
  }

  const message = buildSOSMessage(
    {
      userId: "SOS_TEST",
      userName: "Inclura SOS Test",
      userEmail: "test@inclura.invalid",
      emergencyType: "TEST - NO EMERGENCY",
      priority: "Low",
      description:
        "This is a delivery test of the Inclura SOS notification pipeline. There is no emergency. No emergency service, responder or agency was contacted.",
      location: "Test location (not a real emergency)",
      latitude: "0",
      longitude: "0",
      accuracy: "0",
      trustedContact: "",
    },
    "SOS-TEST"
  );

  const withTestBanner = (text) =>
    `[TEST - NOT AN EMERGENCY]\n\n${text}\n\nThis message was sent by the Inclura SOS verification endpoint.`;

  if (channel !== "email") {
    for (const phone of testPhones) {
      const attempt = await sendSMS({
        to: phone,
        body: withTestBanner(message.smsText),
        config,
        name: "SOS test recipient",
        audience: "test",
      });

      attempts.push(attempt);
    }
  }

  if (channel !== "sms" && userId) {
    const pushAttempts = await sendPushToUsers({
      db: firestore(),
      userIds: [userId],
      title: "Inclura SOS test — not an emergency",
      body: "This is a safe test of push notifications on your own registered device. No emergency was created.",
      emergencyId: "SOS-TEST",
      audience: "test",
    });
    attempts.push(...pushAttempts);
  }

  if (channel !== "sms") {
    for (const email of testEmails) {
      const attempt = await sendEmail({
        to: email,
        subject: `[INCLURA TEST - NOT AN EMERGENCY] ${message.emailSubject}`,
        text: withTestBanner(message.emailText),
        config,
        name: "SOS test recipient",
        audience: "test",
      });

      attempts.push(attempt);
    }
  }

  return {
    ok: attempts.some((attempt) => attempt.accepted),
    status: attempts.some((attempt) => attempt.accepted)
      ? "provider_accepted"
      : "failed",
    attempts: attempts.map((attempt) => ({
      channel: attempt.channel,
      to: attempt.to,
      provider: attempt.provider,
      outcome: attempt.outcome,
      providerAccepted: attempt.accepted === true,
      providerMessageId: attempt.providerMessageId || "",
      providerStatus: attempt.providerStatus || "",
      httpStatus: attempt.httpStatus || 0,
      error: attempt.error || "",
      deliveryConfirmed: false,
    })),
    deliveryNote: DELIVERY_NOTE,
  };
}
