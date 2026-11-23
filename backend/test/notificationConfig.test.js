import test from "node:test";
import assert from "node:assert/strict";

import {
  getNotificationConfig,
  normalizeTextbeeBaseUrl,
} from "../src/config/notificationConfig.js";

test("TextBee base URL accepts only HTTPS self-hosted instances", () => {
  assert.equal(
    normalizeTextbeeBaseUrl("https://sms.inclura.example"),
    "https://sms.inclura.example/api/v1"
  );
  assert.equal(
    normalizeTextbeeBaseUrl("https://sms.inclura.example/api/v1/"),
    "https://sms.inclura.example/api/v1"
  );
  assert.equal(normalizeTextbeeBaseUrl("http://sms.inclura.example"), "");
  assert.equal(normalizeTextbeeBaseUrl("https://api.textbee.dev"), "");
  assert.equal(normalizeTextbeeBaseUrl("https://sub.textbee.dev"), "");
  assert.equal(normalizeTextbeeBaseUrl("https://user:pass@sms.inclura.example"), "");
  assert.equal(normalizeTextbeeBaseUrl("https://sms.inclura.example?key=secret"), "");
});

test("TextBee SMS remains disabled unless explicitly enabled and fully pinned", () => {
  const names = [
    "SMS_PROVIDER",
    "SOS_SMS_ENABLED",
    "TEXTBEE_BASE_URL",
    "TEXTBEE_API_KEY",
    "TEXTBEE_DEVICE_ID",
  ];
  const previous = Object.fromEntries(
    names.map((name) => [name, process.env[name]])
  );

  try {
    process.env.SMS_PROVIDER = "textbee";
    process.env.SOS_SMS_ENABLED = "false";
    process.env.TEXTBEE_BASE_URL = "https://sms.inclura.example";
    process.env.TEXTBEE_API_KEY = "test-key";
    process.env.TEXTBEE_DEVICE_ID = "approved-device";

    assert.equal(getNotificationConfig().sms.configured, false);

    process.env.SOS_SMS_ENABLED = "true";
    assert.equal(getNotificationConfig().sms.configured, true);

    process.env.TEXTBEE_DEVICE_ID = "";
    assert.equal(getNotificationConfig().sms.configured, false);
  } finally {
    for (const name of names) {
      if (previous[name] === undefined) delete process.env[name];
      else process.env[name] = previous[name];
    }
  }
});
