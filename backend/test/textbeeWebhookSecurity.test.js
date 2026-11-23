import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

import {
  mapTextbeeEvent,
  shouldAdvanceTextbeeStatus,
  textbeeEventTimestamp,
  verifyTextbeeWebhookSignature,
} from "../src/services/textbeeWebhookSecurity.js";

const secret = "test-webhook-secret-with-at-least-20-chars";

function signed(rawBody, timestamp) {
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.`)
    .update(rawBody)
    .digest("hex");
  return `t=${timestamp},v1=${signature}`;
}

test("accepts a valid timestamped TextBee signature over exact raw bytes", () => {
  const now = 1_800_000_000_000;
  const timestamp = Math.floor(now / 1000);
  const body = Buffer.from('{ "webhookEvent":"MESSAGE_SENT" }');
  assert.equal(verifyTextbeeWebhookSignature({
    rawBody: body,
    signatureHeader: signed(body, timestamp),
    secret,
    nowMs: now,
  }), true);
});

test("rejects modified body, invalid signature and stale timestamp", () => {
  const now = 1_800_000_000_000;
  const timestamp = Math.floor(now / 1000);
  const body = Buffer.from('{"webhookEvent":"MESSAGE_SENT"}');
  assert.equal(verifyTextbeeWebhookSignature({
    rawBody: Buffer.from('{"webhookEvent":"MESSAGE_FAILED"}'),
    signatureHeader: signed(body, timestamp),
    secret,
    nowMs: now,
  }), false);
  assert.equal(verifyTextbeeWebhookSignature({
    rawBody: body,
    signatureHeader: "t=1800000000,v1=not-a-signature",
    secret,
    nowMs: now,
  }), false);
  assert.equal(verifyTextbeeWebhookSignature({
    rawBody: body,
    signatureHeader: signed(body, timestamp - 301),
    secret,
    nowMs: now,
  }), false);
});

test("maps only supported outgoing event types", () => {
  assert.equal(mapTextbeeEvent("MESSAGE_SENT"), "sent");
  assert.equal(mapTextbeeEvent("MESSAGE_DELIVERED"), "delivered");
  assert.equal(mapTextbeeEvent("MESSAGE_FAILED"), "failed");
  assert.equal(mapTextbeeEvent("UNKNOWN_STATE"), "unknown");
  assert.equal(mapTextbeeEvent("MESSAGE_RECEIVED"), "");
});

test("status transitions never downgrade a known status or replace a final state", () => {
  assert.equal(shouldAdvanceTextbeeStatus("queued", "sent"), true);
  assert.equal(shouldAdvanceTextbeeStatus("sent", "delivered"), true);
  assert.equal(shouldAdvanceTextbeeStatus("sent", "unknown"), false);
  assert.equal(shouldAdvanceTextbeeStatus("delivered", "sent"), false);
  assert.equal(shouldAdvanceTextbeeStatus("failed", "delivered"), false);
});

test("normalizes only valid provider event timestamps", () => {
  assert.equal(textbeeEventTimestamp({ deliveredAt: "2026-11-23T10:00:00.000Z" }), "2026-11-23T10:00:00.000Z");
  assert.equal(textbeeEventTimestamp({ deliveredAt: "not-a-date" }), "");
});
