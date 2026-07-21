// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Passkey Registration Verification Service
// =======================================================

import admin from "firebase-admin";
import { firestore } from "../config/firebaseAdmin.js";
import { verifyRegistrationResponse } from "@simplewebauthn/server";

export async function verifyPasskeyRegistrationService(data) {

  const challengeDoc = await firestore()

    .collection("ifse_passkey_challenges")

    .doc(data.challengeId)

    .get();

  if (!challengeDoc.exists) {

    throw new Error("Challenge not found.");

  }

  const challenge = challengeDoc.data();

  const verification = await verifyRegistrationResponse({

  response: data.response,

  expectedChallenge: challenge.challenge,

  expectedOrigin: process.env.WEBAUTHN_ORIGIN,

  expectedRPID: process.env.WEBAUTHN_RP_ID,

  requireUserVerification: true,

});
  if (!verification.verified) {

    return {

      success: false,

      message: "Registration verification failed.",

    };

  }

  const credential = verification.registrationInfo;
  if (!credential) {

  return {

    success: false,

    message: "Credential information was not returned.",

  };

  }

  const credentialId = Buffer.from(
  credential.credentialID
).toString("base64");

await firestore()

  .collection("ifse_passkeys")

  .doc(challenge.userId)

  .collection("credentials")

  .doc(credentialId)

  .set({

    credentialId,

    credentialPublicKey: Buffer.from(
      credential.credentialPublicKey
    ).toString("base64"),

    counter: credential.counter,

    createdAt:
      admin.firestore.FieldValue.serverTimestamp(),

    lastUsed:
      admin.firestore.FieldValue.serverTimestamp(),

    verified: true,

    deviceName: data.deviceName || "Unknown Device",

    platform: data.platform || "Unknown",

    authenticatorType: "Passkey",
    registeredFrom: process.env.WEBAUTHN_ORIGIN,

registrationMethod: "PASSKEY",

securityEngine: "IFSE",

  });

  await firestore()

    .collection("ifse_passkey_challenges")

    .doc(data.challengeId)

    .update({

      verified: true,

    });

  return {

    success: true,

    verified: true,

  };

}
