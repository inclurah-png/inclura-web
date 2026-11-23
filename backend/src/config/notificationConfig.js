// =======================================================
// Inclura Fortress Security Engine (IFSE)
// SOS Notification Configuration
// =======================================================
//
// All provider credentials are read from environment
// variables already configured on the backend.
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

// Only an explicitly configured HTTPS self-hosted TextBee
// instance is accepted. This prevents credentials being sent
// to the public hosted service or to an arbitrary HTTP URL.
export function normalizeTextbeeBaseUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  try {
    const parsed = new URL(raw);
    const hostname = parsed.hostname.toLowerCase();

    if (
      parsed.protocol !== "https:" ||
      parsed.username ||
      parsed.password ||
      parsed.search ||
      parsed.hash ||
      !hostname.includes(".") ||
      hostname === "localhost" ||
      hostname.endsWith(".local") ||
      hostname === "textbee.dev" ||
      hostname.endsWith(".textbee.dev")
    ) {
      return "";
    }

    const path = parsed.pathname.replace(/\/+$/, "");
    return `${parsed.origin}${path.endsWith("/api/v1") ? path : `${path}/api/v1`}`;
  } catch {
    return "";
  }
}

export function getNotificationConfig() {
  const requestedSmsProvider = String(process.env.SMS_PROVIDER || "")
    .trim()
    .toLowerCase();
  // Unknown/retired providers are treated as disabled.
  const smsProvider = ["twilio", "webhook", "textbee"].includes(requestedSmsProvider)
    ? requestedSmsProvider
    : "";

  const emailProvider = String(process.env.EMAIL_PROVIDER || "")
    .trim()
    .toLowerCase();

  const twilio = {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    fromNumber: normalizePhone(process.env.TWILIO_FROM_NUMBER),
  };

  const smsWebhook = {
    url: process.env.SMS_WEBHOOK_URL || "",
    token: process.env.SMS_WEBHOOK_TOKEN || "",
  };

  const textbee = {
    baseUrl: normalizeTextbeeBaseUrl(process.env.TEXTBEE_BASE_URL),
    apiKey: process.env.TEXTBEE_API_KEY || "",
    // Pin every send to the configured device. Without this,
    // TextBee may select another enabled phone automatically.
    deviceId: String(process.env.TEXTBEE_DEVICE_ID || "").trim(),
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

  // SMS remains disabled unless explicitly enabled by an
  // authorised production configuration change.
  const smsEnabled = String(process.env.SOS_SMS_ENABLED || "false").toLowerCase() === "true";

  const smsConfigured =
    smsEnabled && (
      (smsProvider === "twilio" &&
        twilio.accountSid &&
        twilio.authToken &&
        twilio.fromNumber) ||
      (smsProvider === "webhook" && smsWebhook.url) ||
      (smsProvider === "textbee" &&
        textbee.baseUrl &&
        textbee.apiKey &&
        textbee.deviceId) ||
      false
    );

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
      webhook: smsWebhook,
      textbee,
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

// Safe to expose over HTTP: no keys, tokens, URLs or addresses.
export function publicNotificationStatus() {
  const config = getNotificationConfig();

  return {
    sms: {
      provider: config.sms.provider,
      configured: config.sms.configured,
    },
    email: {
      provider: config.email.provider,
      configured: Boolean(config.email.configured),
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
