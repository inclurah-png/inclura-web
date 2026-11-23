import crypto from "node:crypto";

const SIGNATURE_TOLERANCE_SECONDS = 300;

export function verifyTextbeeWebhookSignature({
  rawBody,
  signatureHeader,
  secret,
  nowMs = Date.now(),
} = {}) {
  if (!Buffer.isBuffer(rawBody)) return false;
  if (typeof secret !== "string" || secret.length < 20) return false;
  if (typeof signatureHeader !== "string" || signatureHeader.length > 256) return false;

  const parts = {};
  for (const segment of signatureHeader.split(",")) {
    const separator = segment.indexOf("=");
    if (separator <= 0) return false;
    const key = segment.slice(0, separator).trim();
    const value = segment.slice(separator + 1).trim();
    if (!["t", "v1"].includes(key) || !value || parts[key]) return false;
    parts[key] = value;
  }

  if (!/^\d{10,12}$/.test(parts.t || "")) return false;
  if (!/^[a-f0-9]{64}$/i.test(parts.v1 || "")) return false;

  const timestampSeconds = Number(parts.t);
  if (!Number.isSafeInteger(timestampSeconds)) return false;
  if (Math.abs(Math.floor(nowMs / 1000) - timestampSeconds) > SIGNATURE_TOLERANCE_SECONDS) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(Buffer.concat([Buffer.from(`${parts.t}.`, "utf8"), rawBody]))
    .digest();

  const supplied = Buffer.from(parts.v1, "hex");
  return supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
}

export function mapTextbeeEvent(eventName, reportedStatus = "") {
  switch (eventName) {
    case "MESSAGE_SENT":
      return "sent";
    case "MESSAGE_DELIVERED":
      return "delivered";
    case "MESSAGE_FAILED":
      return "failed";
    case "UNKNOWN_STATE":
      return "unknown";
    default:
      return "";
  }
}

const STATUS_RANK = {
  queued: 0,
  pending: 0,
  dispatched: 1,
  unknown: 1,
  sent: 2,
  delivered: 3,
  failed: 3,
};

export function shouldAdvanceTextbeeStatus(currentStatus, nextStatus) {
  const current = String(currentStatus || "queued").toLowerCase();
  const next = String(nextStatus || "").toLowerCase();
  if (!Object.hasOwn(STATUS_RANK, next)) return false;
  if (current === "delivered" || current === "failed") return false;
  return (STATUS_RANK[next] ?? -1) > (STATUS_RANK[current] ?? -1);
}

export function textbeeEventTimestamp(event) {
  const value =
    event?.deliveredAt ||
    event?.sentAt ||
    event?.failedAt ||
    "";
  if (typeof value !== "string" || !value) return "";
  const milliseconds = Date.parse(value);
  return Number.isFinite(milliseconds) ? new Date(milliseconds).toISOString() : "";
}
