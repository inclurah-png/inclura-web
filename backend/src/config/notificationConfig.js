// =======================================================
// Inclura Fortress Security Engine (IFSE)
// SOS Notification Configuration
// =======================================================
//
// All provider credentials are read from environment
// variables already configured on the Render service.
// This module NEVER returns secret values to callers;
// publicNotificationStatus() only reports booleans.
// =======================================================

function csv(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizePhone(value) {
  const raw = String(value || "").trim();

  if (!raw) {
    return "";
  }

  const digits = raw.replace(/[^\d+]/g, "");

  if (!digits) {
    return "";
  }

  return digits.startsWith("+")
    ? "+" + digits.slice(1).replace(/\+/g, "")
    : digits.replace(/\+/g, "");
}

export function normalizeEmail(value) {
  const raw = String(value || "").trim().toLowerCase();

  if (!raw || !raw.includes("@")) {
    return "";
  }

  return raw;
}

// A free-text trusted contact field may hold either a
// phone number or an email address.
export function splitRecipient(value) {
  const raw = String(value || "").trim();

  if (!raw) {
    return { phone: "", email: "" };
  }

  if (raw.includes("@")) {
    return { phone: "", email: normalizeEmail(raw) };
  }

  return { phone: normalizePhone(raw), email: "" };
}

export function getNotificationConfig() {
  const smsProvider = String(process.env.SMS_PROVIDER || "")
    .trim()
    .toLowerCase();

  const emailProvider = String(process.env.EMAIL_PROVIDER || "")
    .trim()
    .toLowerCase();

  const twilio = {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    fromNumber: normalizePhone(process.env.TWILIO_FROM_NUMBER),
  };

  const termii = {
    apiKey: process.env.TERMII_API_KEY || "",
    senderId: process.env.TERMII_SENDER_ID || "",
    baseUrl:
      process.env.TERMII_BASE_URL || "https://api.ng.termii.com",
  };

  const smsWebhook = {
    url: process.env.SMS_WEBHOOK_URL || "",
    token: process.env.SMS_WEBHOOK_TOKEN || "",
  };

  const resend = {
    apiKey: process.env.RESEND_API_KEY || "",
    from:
      process.env.EMAIL_FROM || "Inclura Emergency <onboarding@resend.dev>",
  };

  const sendgrid = {
    apiKey: process.env.SENDGRID_API_KEY || "",
    from: process.env.EMAIL_FROM || "",
  };

  const emailWebhook = {
    url: process.env.EMAIL_WEBHOOK_URL || "",
    token: process.env.EMAIL_WEBHOOK_TOKEN || "",
  };

  const smsConfigured =
    (smsProvider === "twilio" &&
      twilio.accountSid &&
      twilio.authToken &&
      twilio.fromNumber) ||
    (smsProvider === "termii" && termii.apiKey) ||
    (smsProvider === "webhook" && smsWebhook.url) ||
    false;

  const emailConfigured =
    (emailProvider === "resend" && resend.apiKey) ||
    (emailProvider === "sendgrid" && sendgrid.apiKey && sendgrid.from) ||
    (emailProvider === "webhook" && emailWebhook.url) ||
    false;

  const emergencyPhones = csv(process.env.EMERGENCY_SMS_NUMBERS)
    .map(normalizePhone)
    .filter(Boolean);

  const emergencyEmails = csv(process.env.EMERGENCY_EMAILS)
    .map(normalizeEmail)
    .filter(Boolean);

  const adminPhones = csv(process.env.ADMIN_NOTIFICATION_PHONES)
    .map(normalizePhone)
    .filter(Boolean);

  const adminEmails = csv(process.env.ADMIN_NOTIFICATION_EMAILS)
    .map(normalizeEmail)
    .filter(Boolean);

  return {
    sms: {
      provider: smsProvider || "none",
      configured: Boolean(smsConfigured),
      twilio,
      termii,
      webhook: smsWebhook,
    },
    email: {
      provider: emailProvider || "none",
      configured: Boolean(emailConfigured),
      resend,
      sendgrid,
      webhook: emailWebhook,
    },
    recipients: {
      emergencyPhones,
      emergencyEmails,
      adminPhones,
      adminEmails,
      // Verification targets. These are the ONLY addresses
      // used by the safe test endpoint.
      testPhones: csv(process.env.EMERGENCY_TEST_PHONES)
        .map(normalizePhone)
        .filter(Boolean),
      testEmails: csv(process.env.EMERGENCY_TEST_EMAILS)
        .map(normalizeEmail)
        .filter(Boolean),
    },
    sweep: {
      enabled:
        String(process.env.SOS_SWEEP_ENABLED || "true").toLowerCase() !==
        "false",
      intervalMs: Number(process.env.SOS_SWEEP_INTERVAL_MS) || 60000,
    },
  };
}

// Safe to expose over HTTP: no keys, tokens or addresses.
export function publicNotificationStatus() {
  const config = getNotificationConfig();

  return {
    sms: {
      provider: config.sms.provider,
      configured: config.sms.configured,
    },
    email: {
      provider: config.email.provider,
      configured: config.email.configured,
    },
    recipients: {
      emergencyPhoneCount: config.recipients.emergencyPhones.length,
      emergencyEmailCount: config.recipients.emergencyEmails.length,
      adminPhoneCount: config.recipients.adminPhones.length,
      adminEmailCount: config.recipients.adminEmails.length,
      testPhoneCount: config.recipients.testPhones.length,
      testEmailCount: config.recipients.testEmails.length,
    },
    sweeper: {
      enabled: config.sweep.enabled,
      intervalMs: config.sweep.intervalMs,
    },
    deliverySemantics:
      "Provider acceptance only. Recipient delivery is never confirmed by this system unless a provider webhook supplies a delivery receipt.",
  };
}
