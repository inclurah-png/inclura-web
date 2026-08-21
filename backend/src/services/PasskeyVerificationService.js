// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Passkey Registration Verification Service
// =======================================================

import admin from "firebase-admin";

import {
  firestore,
} from "../config/firebaseAdmin.js";

import {
  verifyRegistrationResponse,
} from "@simplewebauthn/server";

// =======================================================
// Helpers
// =======================================================

function toBase64Url(value) {

  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

}

// =======================================================
// Verify Passkey Registration
// =======================================================

export async function verifyPasskeyRegistrationService(
  data
) {

  // =====================================================
  // Validate Request
  // =====================================================

  if (
    !data ||
    !data.challengeId ||
    !data.response
  ) {

    throw new Error(
      "challengeId and response are required."
    );

  }

  // =====================================================
  // Load Challenge
  // =====================================================

  const challengeDoc =
    await firestore()

      .collection(
        "ifse_passkey_challenges"
      )

      .doc(data.challengeId)

      .get();

  if (!challengeDoc.exists) {

    throw new Error(
      "Challenge not found."
    );

  }

  const challenge =
    challengeDoc.data();

  // =====================================================
  // Validate Challenge Type
  // =====================================================

  if (
    challenge.type &&
    challenge.type !== "registration"
  ) {

    throw new Error(
      "Invalid challenge type."
    );

  }

  // =====================================================
  // Prevent Challenge Replay
  // =====================================================

  if (challenge.used === true) {

    throw new Error(
      "Challenge has already been used."
    );

  }

  // =====================================================
  // Check Challenge Expiration
  // =====================================================

  if (
    !challenge.expiresAt ||
    Date.now() > challenge.expiresAt
  ) {

    throw new Error(
      "Challenge expired."
    );

  }

  // =====================================================
  // Verify WebAuthn Registration
  // =====================================================

  const verification =
    await verifyRegistrationResponse({

      response:
        data.response,

      expectedChallenge:
        challenge.challenge,

      expectedOrigin:
        process.env.WEBAUTHN_ORIGIN,

      expectedRPID:
        process.env.WEBAUTHN_RP_ID,

      requireUserVerification:
        true,

    });

  // =====================================================
  // Verification Failed
  // =====================================================

  if (!verification.verified) {

    return {

      success: false,

      verified: false,

      message:
        "Registration verification failed.",

    };

  }

  // =====================================================
  // Registration Information
  // =====================================================

  const registrationInfo =
    verification.registrationInfo;

  if (!registrationInfo) {

    return {

      success: false,

      verified: false,

      message:
        "Credential information was not returned.",

    };

  }

  // =====================================================
  // Extract Credential
  // =====================================================

  const credentialId =
    toBase64Url(
      registrationInfo.credentialID
    );

  const credentialPublicKey =
    toBase64Url(
      registrationInfo.credentialPublicKey
    );

  const counter =
    Number(
      registrationInfo.counter || 0
    );

  // =====================================================
  // Store Credential
  // =====================================================

  await firestore()

    .collection(
      "ifse_passkeys"
    )

    .doc(
      String(challenge.userId)
    )

    .collection(
      "credentials"
    )

    .doc(
      credentialId
    )

    .set({

      credentialId,

      credentialPublicKey,

      counter,

      createdAt:
        admin.firestore.FieldValue
          .serverTimestamp(),

      lastUsed:
        admin.firestore.FieldValue
          .serverTimestamp(),

      verified: true,

      deviceName:
        data.deviceName ||
        "Unknown Device",

      platform:
        data.platform ||
        "Unknown",

      authenticatorType:
        "Passkey",

      registeredFrom:
        process.env.WEBAUTHN_ORIGIN,

      registrationMethod:
        "PASSKEY",

      securityEngine:
        "IFSE",

    });

  // =====================================================
  // Mark Challenge Used
  // =====================================================

  await challengeDoc.ref.update({

    verified: true,

    used: true,

    verifiedAt:
      admin.firestore.FieldValue
        .serverTimestamp(),

  });

  // =====================================================
  // Success
  // =====================================================

  return {

    success: true,

    verified: true,

    credentialId,

    userId:
      String(challenge.userId),

    message:
      "Passkey registration verified successfully.",

  };

}
