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

function normalizeBase64Url(value) {

  if (
    value === null ||
    value === undefined
  ) {

    throw new Error(
      "Missing credential value."
    );

  }

  // Current SimpleWebAuthn returns credential IDs
  // as Base64URL strings.
  if (
    typeof value === "string"
  ) {

    return value
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");

  }

  // Public-key bytes and older API values may be
  // Uint8Array / Buffer instances.
  if (
    value instanceof Uint8Array ||
    Buffer.isBuffer(value)
  ) {

    return Buffer.from(value)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");

  }

  throw new Error(
    "Unsupported credential value type."
  );

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

      .doc(
        data.challengeId
      )

      .get();

  if (
    !challengeDoc.exists
  ) {

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
    challenge.type !==
    "registration"
  ) {

    throw new Error(
      "Invalid registration challenge."
    );

  }

  // =====================================================
  // Prevent Challenge Replay
  // =====================================================

  if (
    challenge.used === true
  ) {

    throw new Error(
      "Challenge has already been used."
    );

  }

  // =====================================================
  // Check Challenge Expiration
  // =====================================================

  if (
    !challenge.expiresAt ||
    Date.now() >
      Number(challenge.expiresAt)
  ) {

    throw new Error(
      "Challenge expired."
    );

  }

  // =====================================================
  // Verify WebAuthn Registration
  // =====================================================

  let verification;

  try {

    verification =
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

  } catch (error) {

    console.error(
      "IFSE WebAuthn registration verification error:",
      error
    );

    throw new Error(
      `Passkey registration verification failed: ${error.message}`
    );

  }

  // =====================================================
  // Verification Failed
  // =====================================================

  if (
    !verification.verified
  ) {

    return {

      success:
        false,

      verified:
        false,

      message:
        "Registration verification failed.",

    };

  }

  // =====================================================
  // Registration Information
  // =====================================================

  const registrationInfo =
    verification.registrationInfo;

  if (
    !registrationInfo
  ) {

    throw new Error(
      "Credential information was not returned."
    );

  }

  // =====================================================
  // Current SimpleWebAuthn Credential Structure
  // =====================================================

  const registeredCredential =
    registrationInfo.credential;

  if (
    !registeredCredential
  ) {

    throw new Error(
      "Registered credential information was not returned."
    );

  }

  // =====================================================
  // Extract Credential
  // =====================================================

  const credentialId =
    normalizeBase64Url(
      registeredCredential.id
    );

  const credentialPublicKey =
    normalizeBase64Url(
      registeredCredential.publicKey
    );

  const counter =
    Number(
      registeredCredential.counter ||
      0
    );

  if (
    !credentialId ||
    !credentialPublicKey
  ) {

    throw new Error(
      "Passkey credential ID or public key is missing."
    );

  }

  // =====================================================
  // Optional Authenticator Information
  // =====================================================

  const transports =
    Array.isArray(
      data.response?.response?.transports
    )
      ? data.response.response.transports
      : [];

  // =====================================================
  // Store Credential
  // =====================================================

  const credentialRef =
    firestore()

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
      );

  await credentialRef.set({

    credentialId,

    credentialPublicKey,

    counter,

    transports,

    createdAt:
      admin.firestore.FieldValue
        .serverTimestamp(),

    lastUsed:
      admin.firestore.FieldValue
        .serverTimestamp(),

    verified:
      true,

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

    verified:
      true,

    used:
      true,

    verifiedAt:
      admin.firestore.FieldValue
        .serverTimestamp(),

  });

  // =====================================================
  // Success
  // =====================================================

  return {

    success:
      true,

    verified:
      true,

    credentialId,

    userId:
      String(
        challenge.userId
      ),

    message:
      "Passkey registration verified successfully.",

  };

}
