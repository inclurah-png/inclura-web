// =======================================================
// Inclura Fortress Security Engine (IFSE)
// SOS SMS + Email Providers
// =======================================================
//
// Providers are called over HTTPS with fetch (Node 20).
// No provider SDK or new dependency is required.
//
// IMPORTANT:
// accepted === true means the PROVIDER ACCEPTED the
// message for processing. It does NOT mean the recipient
// received it. deliveryConfirmed is always false unless a
// provider delivery receipt is received.
// =======================================================

const REQUEST_TIMEOUT_MS = 20000;

function requestSignal() {
  if (typeof AbortSignal !== "undefined" && AbortSignal.timeout) {
    return AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  }

  return undefined;
}

function baseResult({ channel, to, provider, name, audience }) {
  return {
    channel,
    to,
    provider: provider || "none",
    name: name || "",
    audience: audience || "",
    accepted: false,
    outcome: "not_attempted",
    deliveryConfirmed: false,
    providerMessageId: "",
    providerStatus: "",
    httpStatus: 0,
    error: "",
    attemptedAt: new Date().toISOString(),
  };
}

async function readResponseBody(response) {
  try {
    const text = await response.text();

    if (!text) {
      return { text: "", json: null };
    }

    try {
      return { text: text.slice(0, 1000), json: JSON.parse(text) };
    } catch {
      return { text: text.slice(0, 1000), json: null };
    }
  } catch {
    return { text: "", json: null };
  }
}

function providerErrorText(body) {
  if (!body) {
    return "";
  }

  if (typeof body.text === "string" && body.text) {
    return body.text.slice(0, 500);
  }

  if (body.json && typeof body.json === "object") {
    return JSON.stringify(body.json).slice(0, 500);
  }

  return "";
}

// =======================================================
// SMS
// =======================================================

export async function sendSMS({
  to,
  body,
  config,
  name = "",
  audience = "",
}) {
  const smsConfig = config?.sms || {};
  const result = baseResult({
    channel: "sms",
    to,
    provider: smsConfig.provider,
    name,
    audience,
  });

  if (!smsConfig.configured) {
    result.outcome = "skipped_not_configured";
    result.error =
      "SMS provider is not configured on the backend (set SMS_PROVIDER and its credentials).";
    return result;
  }

  try {
    if (smsConfig.provider === "twilio") {
      const { accountSid, authToken, fromNumber } = smsConfig.twilio;

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(
          accountSid
        )}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: to,
            From: fromNumber,
            Body: body,
          }).toString(),
          signal: requestSignal(),
        }
      );

      const payload = await readResponseBody(response);
      result.httpStatus = response.status;
      result.accepted = response.ok;

      if (payload.json) {
        result.providerMessageId =
          payload.json.sid || payload.json.message_sid || "";
        result.providerStatus =
          payload.json.status || payload.json.message_status || "";
      }

      if (!response.ok) {
        result.outcome = "provider_rejected";
        result.error =
          (payload.json && (payload.json.message || payload.json.code)) ||
          providerErrorText(payload) ||
          `Twilio rejected the message (HTTP ${response.status}).`;
        result.error = String(result.error).slice(0, 500);
        return result;
      }

      result.outcome = "provider_accepted";
      return result;
    }

    if (smsConfig.provider === "textbee") {
      const { baseUrl, apiKey, deviceId } = smsConfig.textbee || {};

      // Configuration validation happens before this point. Keep the
      // credential on the server and pin sends to one approved gateway.
      const response = await fetch(`${baseUrl}/gateway/send-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          recipients: [to],
          message: body,
          deviceId,
        }),
        signal: requestSignal(),
      });

      const payload = await readResponseBody(response);
      result.httpStatus = response.status;

      const accepted =
        response.ok &&
        payload.json?.data?.success === true &&
        typeof payload.json?.data?.smsBatchId === "string" &&
        payload.json.data.smsBatchId.length > 0;

      if (!accepted) {
        result.outcome = "provider_rejected";
        // Do not copy provider response bodies into audit logs; they may
        // contain recipient or message details. Record only the status.
        result.error = `Self-hosted TextBee did not accept the SMS (HTTP ${response.status || "unknown"}).`;
        return result;
      }

      result.accepted = true;
      result.outcome = "provider_accepted";
      result.providerMessageId = payload.json.data.smsBatchId;
      result.providerStatus = "queued";
      // TextBee HTTP 200 means queued, not sent or delivered.
      result.deliveryConfirmed = false;
      return result;
    }

    if (smsConfig.provider === "webhook") {
      const { url, token } = smsConfig.webhook;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          channel: "sms",
          to,
          body,
          audience,
          name,
          sentAt: new Date().toISOString(),
        }),
        signal: requestSignal(),
      });

      const payload = await readResponseBody(response);
      result.httpStatus = response.status;
      result.accepted = response.ok;

      if (payload.json) {
        result.providerMessageId =
          payload.json.id || payload.json.messageId || "";
        result.providerStatus = payload.json.status || "";
      }

      if (!response.ok) {
        result.outcome = "provider_rejected";
        result.error =
          providerErrorText(payload) ||
          `SMS webhook rejected the message (HTTP ${response.status}).`;
        return result;
      }

      result.outcome = "provider_accepted";
      return result;
    }

    result.outcome = "skipped_not_configured";
    result.error = `Unsupported SMS_PROVIDER: ${smsConfig.provider}`;
    return result;
  } catch (error) {
    result.outcome = "provider_error";
    result.error = String(error?.message || error).slice(0, 500);
    return result;
  }
}

// =======================================================
// EMAIL
// =======================================================

export async function sendEmail({
  to,
  subject,
  text,
  config,
  name = "",
  audience = "",
}) {
  const emailConfig = config?.email || {};
  const result = baseResult({
    channel: "email",
    to,
    provider: emailConfig.provider,
    name,
    audience,
  });

  if (!emailConfig.configured) {
    result.outcome = "skipped_not_configured";
    result.error =
      "Email provider is not configured on the backend (set EMAIL_PROVIDER and its credentials).";
    return result;
  }

  try {
    if (emailConfig.provider === "resend") {
      const { apiKey, from } = emailConfig.resend;

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          text,
        }),
        signal: requestSignal(),
      });

      const payload = await readResponseBody(response);
      result.httpStatus = response.status;
      result.accepted = response.ok;

      if (payload.json) {
        result.providerMessageId = payload.json.id || "";
        result.providerStatus = payload.json.status || "";
      }

      if (!response.ok) {
        result.outcome = "provider_rejected";
        result.error = (
          (payload.json && (payload.json.message || payload.json.name)) ||
          providerErrorText(payload) ||
          `Resend rejected the email (HTTP ${response.status}).`
        ).slice(0, 500);
        return result;
      }

      result.outcome = "provider_accepted";
      return result;
    }

    if (emailConfig.provider === "sendgrid") {
      const { apiKey, from } = emailConfig.sendgrid;

      const response = await fetch(
        "https://api.sendgrid.com/v3/mail/send",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: to }] }],
            from: { email: from },
            subject,
            content: [{ type: "text/plain", value: text }],
          }),
          signal: requestSignal(),
        }
      );

      const payload = await readResponseBody(response);
      result.httpStatus = response.status;
      result.accepted = response.ok;
      result.providerMessageId =
        response.headers.get("x-message-id") || "";

      if (!response.ok) {
        result.outcome = "provider_rejected";
        result.error = (
          providerErrorText(payload) ||
          `SendGrid rejected the email (HTTP ${response.status}).`
        ).slice(0, 500);
        return result;
      }

      result.outcome = "provider_accepted";
      return result;
    }

    if (emailConfig.provider === "webhook") {
      const { url, token } = emailConfig.webhook;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          channel: "email",
          to,
          subject,
          text,
          audience,
          name,
          sentAt: new Date().toISOString(),
        }),
        signal: requestSignal(),
      });

      const payload = await readResponseBody(response);
      result.httpStatus = response.status;
      result.accepted = response.ok;

      if (payload.json) {
        result.providerMessageId =
          payload.json.id || payload.json.messageId || "";
        result.providerStatus = payload.json.status || "";
      }

      if (!response.ok) {
        result.outcome = "provider_rejected";
        result.error =
          providerErrorText(payload) ||
          `Email webhook rejected the message (HTTP ${response.status}).`;
        return result;
      }

      result.outcome = "provider_accepted";
      return result;
    }

    result.outcome = "skipped_not_configured";
    result.error = `Unsupported EMAIL_PROVIDER: ${emailConfig.provider}`;
    return result;
  } catch (error) {
    result.outcome = "provider_error";
    result.error = String(error?.message || error).slice(0, 500);
    return result;
  }
}

// =======================================================
// MESSAGE CONTENT
// =======================================================

export function buildSOSMessage(sos = {}, emergencyId = "") {
  const type = sos.emergencyType || "Emergency";
  const priority = sos.priority || "Critical";
  const name =
    sos.userName || sos.userEmail || "An Inclura user";

  const location = sos.location || "Location not provided";

  const latitude =
    sos.latitude || (sos.gpsLatitude ? String(sos.gpsLatitude) : "");
  const longitude =
    sos.longitude || (sos.gpsLongitude ? String(sos.gpsLongitude) : "");

  const hasCoordinates = Boolean(latitude && longitude);
  const coordinates = hasCoordinates
    ? `${latitude}, ${longitude}${
        sos.accuracy ? ` (+/-${sos.accuracy}m)` : ""
      }`
    : "Not available";

  const mapLink = hasCoordinates
    ? `https://maps.google.com/?q=${encodeURIComponent(
        `${latitude},${longitude}`
      )}`
    : "";

  const description = sos.description
    ? String(sos.description).slice(0, 300)
    : "No description provided.";

  const smsText = [
    "INCLURA EMERGENCY SOS",
    `${name} triggered an SOS.`,
    `Type: ${type} (${priority})`,
    `Location: ${location}`,
    `GPS: ${coordinates}`,
    `Details: ${description}`,
    `Ref: ${emergencyId}`,
    "Automated alert. Call local emergency services and try to reach the person directly.",
  ].join("\n");

  const emailSubject = `[INCLURA SOS] ${type} - ${priority} - ${name}`;

  const emailText = [
    "INCLURA EMERGENCY SOS",
    "",
    `${name} triggered an emergency SOS on Inclura.`,
    "",
    `Emergency ID : ${emergencyId}`,
    `Type         : ${type}`,
    `Priority     : ${priority}`,
    `Location     : ${location}`,
    `GPS          : ${coordinates}`,
    mapLink ? `Map          : ${mapLink}` : "",
    `Description  : ${description}`,
    "",
    "This alert was sent automatically. It does not wait for, and cannot be blocked by, an administrator.",
    "",
    "If you believe this person is in immediate danger, contact your local emergency services and try to reach them directly.",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return {
    smsText: smsText.slice(0, 900),
    emailSubject,
    emailText,
  };
}

export function buildAdminMessage({
  sos = {},
  emergencyId = "",
  summary = null,
}) {
  const type = sos.emergencyType || "Emergency";
  const priority = sos.priority || "Critical";
  const name = sos.userName || sos.userEmail || "An Inclura user";
  const summaryStatus = summary?.status || "unknown";

  const recipientLines = (summary?.recipients || []).map((item) => {
    const identity = item.to || "unknown recipient";
    const providerId = item.providerMessageId
      ? ` id=${item.providerMessageId}`
      : "";
    const error = item.error ? ` error=${item.error}` : "";

    return `- ${item.channel.toUpperCase()} ${identity} [${
      item.audience || "recipient"
    }] -> ${item.outcome}${
      item.accepted ? " (provider accepted, delivery not confirmed)" : ""
    }${providerId}${error}`;
  });

  const lines = [
    "INCLURA ADMIN SOS NOTIFICATION",
    "",
    "An SOS event was recorded and dispatched automatically.",
    "No administrator action is required or possible.",
    "",
    `Emergency ID       : ${emergencyId}`,
    `User               : ${name} (${sos.userEmail || "no email"})`,
    `Type / Priority    : ${type} / ${priority}`,
    `Location           : ${sos.location || "Not provided"}`,
    `GPS                : ${
      sos.latitude && sos.longitude
        ? `${sos.latitude}, ${sos.longitude}`
        : "Not available"
    }`,
    `Notification status: ${summaryStatus}`,
    `Delivery confirmed : No (provider acceptance only)`,
    "",
    "Recipient attempts:",
    ...(recipientLines.length ? recipientLines : ["- No recipients were configured or found."]),
    "",
    "Provider acceptance is not recipient delivery. Check the emergencyNotificationLogs collection for the full audit trail.",
  ];

  const body = lines.join("\n");

  return {
    smsText: [
      `INCLURA SOS ADMIN ALERT`,
      `${name}: ${type} (${priority})`,
      `Ref: ${emergencyId}`,
      `Notification: ${summaryStatus}`,
      "Provider acceptance only, delivery not confirmed.",
    ]
      .join("\n")
      .slice(0, 600),
    emailSubject: `[INCLURA SOS][ADMIN] ${type} - ${priority} - ${name}`,
    emailText: body,
  };
}
