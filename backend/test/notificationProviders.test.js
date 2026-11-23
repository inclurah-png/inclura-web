import test from "node:test";
import assert from "node:assert/strict";

import { sendSMS } from "../src/services/notificationProviders.js";

test("TextBee sends only to the pinned device and reports queue acceptance honestly", async () => {
  const originalFetch = globalThis.fetch;
  let capturedUrl = "";
  let capturedOptions = {};

  globalThis.fetch = async (url, options) => {
    capturedUrl = url;
    capturedOptions = options;
    return new Response(JSON.stringify({
      data: {
        success: true,
        smsBatchId: "batch-test-123",
        recipientCount: 1,
      },
    }), { status: 200, headers: { "content-type": "application/json" } });
  };

  try {
    const result = await sendSMS({
      to: "+2348012345678",
      body: "TEST ONLY",
      config: {
        sms: {
          provider: "textbee",
          configured: true,
          textbee: {
            baseUrl: "https://sms.inclura.example/api/v1",
            apiKey: "server-only-test-key",
            deviceId: "approved-device-123",
          },
        },
      },
    });

    assert.equal(capturedUrl, "https://sms.inclura.example/api/v1/gateway/send-sms");
    assert.equal(capturedOptions.headers["x-api-key"], "server-only-test-key");
    assert.deepEqual(JSON.parse(capturedOptions.body), {
      recipients: ["+2348012345678"],
      message: "TEST ONLY",
      deviceId: "approved-device-123",
    });
    assert.equal(result.accepted, true);
    assert.equal(result.outcome, "provider_accepted");
    assert.equal(result.providerMessageId, "batch-test-123");
    assert.equal(result.providerStatus, "queued");
    assert.equal(result.deliveryConfirmed, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("TextBee HTTP success without an accepted batch is not treated as accepted", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    data: { success: false },
  }), { status: 200, headers: { "content-type": "application/json" } });

  try {
    const result = await sendSMS({
      to: "+2348012345678",
      body: "TEST ONLY",
      config: {
        sms: {
          provider: "textbee",
          configured: true,
          textbee: {
            baseUrl: "https://sms.inclura.example/api/v1",
            apiKey: "server-only-test-key",
            deviceId: "approved-device-123",
          },
        },
      },
    });

    assert.equal(result.accepted, false);
    assert.equal(result.outcome, "provider_rejected");
    assert.equal(result.deliveryConfirmed, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
