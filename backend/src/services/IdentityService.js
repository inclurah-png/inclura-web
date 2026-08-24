// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Identity Service
// =======================================================

import {
  generateRegistrationOptions,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";

import admin from "firebase-admin";

import { randomUUID } from "crypto";

import { firestore } from "../config/firebaseAdmin.js";

// =======================================================
// Helpers
// =======================================================

function decodeBase64Url(value) {
  if (!value) {
    throw new Error("Missing Base64URL value.");
  }

  const normalized = String(value)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padded =
    normalized +
    "=".repeat(
      (4 - (normalized.length % 4)) % 4
    );

  return Uint8Array.from(
    Buffer.from(padded, "base64")
  );
}

// =======================================================
// Health
// =======================================================

export async function healthService() {
  return {
    success: true,
    service: "IFSE Identity Service",
    status: "Operational",
    timestamp: new Date().toISOString(),
  };
}

// =======================================================
// Passkey Registration
// =======================================================

export async function registerPasskeyService(data) {
  if (
    !data ||
    !data.userId ||
    !data.email
  ) {
    throw new Error(
      "userId and email are required for passkey registration."
    );
  }

  const userId = String(data.userId);
  const challengeId = randomUUID();

  const userIdBytes =
    new TextEncoder().encode(userId);

  const options =
    await generateRegistrationOptions({
      rpName:
        process.env.WEBAUTHN_RP_NAME,

      rpID:
        process.env.WEBAUTHN_RP_ID,

      userName:
        data.email,

      userID:
        userIdBytes,

      userDisplayName:
        data.fullName ||
        data.email,

      timeout:
        60000,

      attestationType:
        "none",

      authenticatorSelection: {
        residentKey:
          "preferred",

        userVerification:
          "required",
      },

      excludeCredentials: [],
    });

  const expiresAt =
    Date.now() +
    5 * 60 * 1000;

  await firestore()
    .collection(
      "ifse_passkey_challenges"
    )
    .doc(challengeId)
    .set({
      challengeId,

      type:
        "registration",

      challenge:
        options.challenge,

      userId,

      email:
        data.email,

      createdAt:
        admin.firestore.FieldValue
          .serverTimestamp(),

      expiresAt,

      verified:
        false,

      used:
        false,
    });

  return {
    success:
      true,

    challengeId,

    optionsJSON:
      options,
  };
}

// =======================================================
// Authentication Options
// =======================================================

export async function authenticationOptionsService(
  data = {}
) {
  if (
    !data.email &&
    !data.userId
  ) {
    throw new Error(
      "email or userId is required for passkey authentication."
    );
  }

  let userId;
  let email;

  // =====================================================
  // Resolve Firebase User
  // =====================================================

  if (data.userId) {
    userId =
      String(data.userId);

    email =
      data.email ||
      null;

  } else {
    email =
      String(data.email)
        .trim()
        .toLowerCase();

    try {
      const firebaseUser =
        await admin
          .auth()
          .getUserByEmail(
            email
          );

      userId =
        firebaseUser.uid;

    } catch (error) {
      console.error(
        "IFSE Firebase user lookup failed:",
        error
      );

      throw new Error(
        "No Inclura account was found for this email."
      );
    }
  }

  // =====================================================
  // Load Registered Passkeys
  // =====================================================

  const credentialsSnapshot =
    await firestore()
      .collection(
        "ifse_passkeys"
      )
      .doc(userId)
      .collection(
        "credentials"
      )
      .get();

  const allowCredentials = [];

  credentialsSnapshot.forEach(
    (credentialDoc) => {
      const credential =
        credentialDoc.data();

      if (
        credential.credentialId &&
        credential.verified === true
      ) {
        allowCredentials.push({
          id:
            decodeBase64Url(
              credential.credentialId
            ),

          type:
            "public-key",
        });
      }
    }
  );

  if (
    allowCredentials.length === 0
  ) {
    throw new Error(
      "No registered passkeys were found for this user."
    );
  }

  // =====================================================
  // Generate Authentication Options
  // =====================================================

  const options =
    await generateAuthenticationOptions({
      rpID:
        process.env.WEBAUTHN_RP_ID,

      timeout:
        60000,

      userVerification:
        "required",

      allowCredentials,
    });

  // =====================================================
  // Store Authentication Challenge
  // =====================================================

  const challengeId =
    randomUUID();

  const expiresAt =
    Date.now() +
    5 * 60 * 1000;

  await firestore()
    .collection(
      "ifse_passkey_challenges"
    )
    .doc(challengeId)
    .set({
      challengeId,

      type:
        "authentication",

      challenge:
        options.challenge,

      userId,

      email,

      createdAt:
        admin.firestore.FieldValue
          .serverTimestamp(),

      expiresAt,

      verified:
        false,

      used:
        false,
    });

  return {
    success:
      true,

    challengeId,

    userId,

    optionsJSON:
      options,
  };
}

// =======================================================
// Verify Authentication
// =======================================================

export async function verifyAuthenticationService(
  data
) {
  try {
    if (
      !data ||
      !data.challengeId ||
      !data.credentialId ||
      !data.authenticationResponse
    ) {
      return {
        success:
          false,

        authenticated:
          false,

        message:
      "Identity verification engine will be connected next.",

    request:
      data,
  };
}
         
