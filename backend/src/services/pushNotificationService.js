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
            fcmOptions: { link: "/sos" },
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
    if (!userId) continue;
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
