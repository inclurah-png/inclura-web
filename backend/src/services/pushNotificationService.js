import admin from "firebase-admin";

const INVALID_TOKEN_CODES = new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
]);

export async function sendPushToUsers({
  db,
  userIds = [],
  title,
  body,
  emergencyId,
  audience = "trusted_contact",
}) {
  const uniqueUserIds = [...new Set(userIds.filter((id) => typeof id === "string" && id.trim()).map((id) => id.trim()))];
  const attempts = [];
  const seenTokens = new Set();

  for (const userId of uniqueUserIds) {
    let snapshot;
    try {
      snapshot = await db.collection("fcmTokens").where("userId", "==", userId).get();
    } catch (error) {
      attempts.push({
        channel: "push",
        to: userId,
        name: audience === "administrator" ? "Administrator device" : "Trusted contact device",
        audience,
        provider: "firebase-cloud-messaging",
        outcome: "failed",
        accepted: false,
        error: `Could not load registered devices: ${error?.message || error}`,
        attemptedAt: new Date().toISOString(),
      });
      continue;
    }

    const devices = snapshot.docs.filter((doc) => {
      const data = doc.data() || {};
      return data.enabled === true && typeof data.token === "string" && data.token.length > 20;
    });

    if (!devices.length) {
      attempts.push({
        channel: "push",
        to: userId,
        name: audience === "administrator" ? "Administrator device" : "Trusted contact device",
        audience,
        provider: "firebase-cloud-messaging",
        outcome: "no_registered_device",
        accepted: false,
        error: "This Inclura account has no enabled push device registered.",
        attemptedAt: new Date().toISOString(),
      });
      continue;
    }

    for (const device of devices) {
      const data = device.data() || {};
      const token = data.token;
      if (seenTokens.has(token)) continue;
      seenTokens.add(token);

      const attempt = {
        channel: "push",
        to: userId,
        name: audience === "administrator" ? "Administrator device" : "Trusted contact device",
        audience,
        provider: "firebase-cloud-messaging",
        outcome: "failed",
        accepted: false,
        providerMessageId: "",
        providerStatus: "",
        error: "",
        attemptedAt: new Date().toISOString(),
      };

      try {
        const messageId = await admin.messaging().send({
          token,
          notification: { title, body },
          data: {
            type: "inclura_sos",
            emergencyId: String(emergencyId || ""),
            url: "/sos",
          },
          webpush: {
            notification: {
              title,
              body,
              icon: "/favicon.ico",
              tag: `inclura-sos-${emergencyId || "alert"}`,
              requireInteraction: true,
            },
          },
        });
        attempt.outcome = "provider_accepted";
        attempt.accepted = true;
        attempt.providerMessageId = messageId;
        attempt.providerStatus = "accepted_by_firebase";
      } catch (error) {
        const code = error?.code || "";
        attempt.error = String(error?.message || error);
        attempt.providerStatus = code;
        if (INVALID_TOKEN_CODES.has(code)) {
          attempt.outcome = "invalid_device_token";
          try {
            await device.ref.set({
              enabled: false,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
          } catch (disableError) {
            attempt.error += `; token disable failed: ${disableError?.message || disableError}`;
          }
        }
      }
      attempts.push(attempt);
    }
  }

  return attempts;
}

export async function sendPushToContacts({ db, contacts = [], title, body, emergencyId }) {
  const attempts = [];
  for (const contact of contacts) {
    let userId = contact.userId || "";
    if (!userId) {
      try {
        let userRecord = null;
        if (contact.email) userRecord = await admin.auth().getUserByEmail(contact.email);
        else if (contact.phone && contact.phone.startsWith("+")) {
          userRecord = await admin.auth().getUserByPhoneNumber(contact.phone);
        }
        userId = userRecord?.uid || "";
      } catch (error) {
        attempts.push({
          channel: "push",
          to: contact.email || contact.phone || "unlinked_contact",
          name: contact.name || "Trusted contact",
          audience: contact.audience || "trusted_contact",
          provider: "firebase-cloud-messaging",
          outcome: "no_linked_inclura_account",
          accepted: false,
          error: "No matching Inclura account was found for this trusted contact. A registered Inclura account and enabled device are required for push alerts.",
          providerStatus: error?.code || "",
          attemptedAt: new Date().toISOString(),
        });
        continue;
      }
    }
    if (!userId) {
      attempts.push({
        channel: "push",
        to: contact.email || contact.phone || "unlinked_contact",
        name: contact.name || "Trusted contact",
        audience: contact.audience || "trusted_contact",
        provider: "firebase-cloud-messaging",
        outcome: "no_linked_inclura_account",
        accepted: false,
        error: "This trusted contact could not be matched to an Inclura account. The contact must use the email or international phone number linked to their Inclura account and register a device.",
        attemptedAt: new Date().toISOString(),
      });
      continue;
    }
    const sent = await sendPushToUsers({
      db,
      userIds: [userId],
      title,
      body,
      emergencyId,
      audience: contact.audience || "trusted_contact",
    });
    attempts.push(...sent.map((attempt) => ({
      ...attempt,
      to: contact.email || contact.phone || userId,
      name: contact.name || attempt.name,
    })));
  }
  return attempts;
}


// Send a minimal, non-identifying alert to opted-in anonymous browsers
// whose selected locality is present in the SOS location text.
// This collection is separate from member fcmTokens and grants no SOS access.
export async function sendPushToCommunityArea({
  db,
  location = "",
  title = "Inclura community emergency alert",
  body = "An emergency has been reported in your subscribed area. Stay alert and follow guidance from local emergency services.",
  emergencyId = "",
}) {
  const normalize = (value) => String(value || "").normalize("NFKC").trim().toLocaleLowerCase();
  const normalizedLocation = normalize(location);
  if (!normalizedLocation) {
    return [{
      channel: "push",
      to: "community",
      name: "Community alert subscribers",
      audience: "community",
      provider: "firebase-cloud-messaging",
      outcome: "no_emergency_area",
      accepted: false,
      error: "The SOS record did not contain a usable location, so no area-wide push was sent.",
      attemptedAt: new Date().toISOString(),
    }];
  }

  try {
    const snapshot = await db.collection("communityAlertDevices")
      .where("enabled", "==", true)
      .get();
    const matching = snapshot.docs.filter((doc) => {
      const data = doc.data() || {};
      const locality = normalize(data.localityNormalized);
      return data.consent === true
        && typeof data.token === "string"
        && data.token.length > 20
        && locality.length >= 2
        && normalizedLocation.includes(locality);
    });

    if (!matching.length) {
      return [{
        channel: "push",
        to: "community",
        name: "Community alert subscribers",
        audience: "community",
        provider: "firebase-cloud-messaging",
        outcome: "no_matching_area_subscribers",
        accepted: false,
        error: "No opted-in community alert devices matched the SOS location.",
        attemptedAt: new Date().toISOString(),
      }];
    }

    const attempts = [];
    const seenTokens = new Set();
    for (const device of matching) {
      const data = device.data() || {};
      const token = data.token;
      if (seenTokens.has(token)) continue;
      seenTokens.add(token);
      const attempt = {
        channel: "push",
        to: data.area || "subscribed area",
        name: "Community alert subscriber",
        audience: "community",
        provider: "firebase-cloud-messaging",
        outcome: "failed",
        accepted: false,
        providerMessageId: "",
        providerStatus: "",
        error: "",
        attemptedAt: new Date().toISOString(),
      };
      try {
        const messageId = await admin.messaging().send({
          token,
          notification: { title, body },
          data: {
            type: "inclura_community_emergency_alert",
            url: "/community-alerts",
          },
          webpush: {
            notification: {
              title,
              body,
              icon: "/favicon.ico",
              tag: "inclura-community-emergency-" + String(emergencyId || "alert"),
              requireInteraction: true,
            },
            fcmOptions: { link: "/community-alerts" },
          },
        });
        attempt.outcome = "provider_accepted";
        attempt.accepted = true;
        attempt.providerMessageId = messageId;
        attempt.providerStatus = "accepted_by_firebase";
      } catch (error) {
        const code = error?.code || "";
        attempt.error = String(error?.message || error);
        attempt.providerStatus = code;
        if (INVALID_TOKEN_CODES.has(code)) {
          attempt.outcome = "invalid_device_token";
          try {
            await device.ref.set({
              enabled: false,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
          } catch (disableError) {
            attempt.error += "; token disable failed: " + (disableError?.message || disableError);
          }
        }
      }
      attempts.push(attempt);
    }
    return attempts;
  } catch (error) {
    return [{
      channel: "push",
      to: "community",
      name: "Community alert subscribers",
      audience: "community",
      provider: "firebase-cloud-messaging",
      outcome: "failed",
      accepted: false,
      error: "Community subscriber lookup failed: " + String(error?.message || error),
      attemptedAt: new Date().toISOString(),
    }];
  }
}
