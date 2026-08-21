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
    "=".repeat((4 - (normalized.length % 4)) % 4);

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

  const challengeId = randomUUID();

  const options = await generateRegistrationOptions({
    rpName: process.env.WEBAUTHN_RP_NAME,
    rpID: process.env.WEBAUTHN_RP_ID,

    userName: data.email,

    userID: String(data.userId),

    userDisplayName:
      data.fullName ||
      data.email,

    timeout: 60000,

    attestationType: "none",

    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "required",
    },

    excludeCredentials: [],
  });

  const expiresAt =
    Date.now() + 5 * 60 * 1000;

  await firestore()
    .collection("ifse_passkey_challenges")
    .doc(challengeId)
    .set({
      challengeId,

      type: "registration",

      challenge: options.challenge,

      userId: String(data.userId),

      email: data.email,

      createdAt:
        admin.firestore.FieldValue.serverTimestamp(),

      expiresAt,

      verified: false,

      used: false,
    });

  return {
    success: true,

    challengeId,

    optionsJSON: options,
  };
}

// =======================================================
// Authentication Options
// =======================================================

export async function authenticationOptionsService(data = {}) {
  if (!data.userId) {
    throw new Error(
      "userId is required for passkey authentication."
    );
  }

  const userId = String(data.userId);

  const credentialsSnapshot = await firestore()
    .collection("ifse_passkeys")
    .doc(userId)
    .collection("credentials")
    .get();

  const allowCredentials = [];

  credentialsSnapshot.forEach((credentialDoc) => {
    const credential = credentialDoc.data();

    if (
      credential.credentialId &&
      credential.verified === true
    ) {
      allowCredentials.push({
        id: decodeBase64Url(
          credential.credentialId
        ),
        type: "public-key",
      });
    }
  });

  if (allowCredentials.length === 0) {
    throw new Error(
      "No registered passkeys were found for this user."
    );
  }

  const options =
    await generateAuthenticationOptions({
      rpID: process.env.WEBAUTHN_RP_ID,

      timeout: 60000,

      userVerification: "required",

      allowCredentials,
    });

  const challengeId = randomUUID();

  const expiresAt =
    Date.now() + 5 * 60 * 1000;

  await firestore()
    .collection("ifse_passkey_challenges")
    .doc(challengeId)
    .set({
      challengeId,

      type: "authentication",

      challenge: options.challenge,

      userId,

      createdAt:
        admin.firestore.FieldValue.serverTimestamp(),

      expiresAt,

      verified: false,

      used: false,
    });

  return {
    success: true,

    challengeId,

    optionsJSON: options,
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
      !data.userId ||
      !data.challengeId ||
      !data.credentialId ||
      !data.authenticationResponse
    ) {
      return {
        success: false,
        authenticated: false,
        message:
          "Invalid authentication request.",
      };
    }

    const userId = String(data.userId);

    // ===================================================
    // Load Authentication Challenge
    // ===================================================

    const challengeDoc = await firestore()
      .collection("ifse_passkey_challenges")
      .doc(data.challengeId)
      .get();

    if (!challengeDoc.exists) {
      return {
        success: false,
        authenticated: false,
        message:
          "Authentication challenge not found.",
      };
    }

    const challenge =
      challengeDoc.data();

    // ===================================================
    // Verify Challenge Ownership
    // ===================================================

    if (
      challenge.userId !== userId ||
      challenge.type !== "authentication"
    ) {
      return {
        success: false,
        authenticated: false,
        message:
          "Authentication challenge is invalid.",
      };
    }

    // ===================================================
    // Check Challenge Expiration
    // ===================================================

    if (
      !challenge.expiresAt ||
      Date.now() > challenge.expiresAt
    ) {
      return {
        success: false,
        authenticated: false,
        message:
          "Authentication challenge expired.",
      };
    }

    // ===================================================
    // Prevent Challenge Replay
    // ===================================================

    if (challenge.used === true) {
      return {
        success: false,
        authenticated: false,
        message:
          "Authentication challenge has already been used.",
      };
    }

    // ===================================================
    // Find Registered Credential
    // ===================================================

    const credentialsSnapshot =
      await firestore()
        .collection("ifse_passkeys")
        .doc(userId)
        .collection("credentials")
        .get();

    let credentialDoc = null;
    let credential = null;

    for (
      const document of credentialsSnapshot.docs
    ) {
      const storedCredential =
        document.data();

      if (
        !storedCredential.credentialId
      ) {
        continue;
      }

      try {
        const storedId =
          decodeBase64Url(
            storedCredential.credentialId
          );

        const requestedId =
          decodeBase64Url(
            data.credentialId
          );

        if (
          Buffer.from(storedId).equals(
            Buffer.from(requestedId)
          )
        ) {
          credentialDoc = document;
          credential = storedCredential;
          break;
        }
      } catch (error) {
        console.error(
          "Credential ID decoding error:",
          error
        );
      }
    }

    if (
      !credentialDoc ||
      !credential
    ) {
      return {
        success: false,
        authenticated: false,
        message:
          "Trusted passkey credential not found.",
      };
    }

    // ===================================================
    // Verify Cryptographic WebAuthn Response
    // ===================================================

    const verification =
      await verifyAuthenticationResponse({
        response:
          data.authenticationResponse,

        expectedChallenge:
          challenge.challenge,

        expectedOrigin:
          process.env.WEBAUTHN_ORIGIN,

        expectedRPID:
          process.env.WEBAUTHN_RP_ID,

        credential: {
          id: credential.credentialId,

          publicKey:
            decodeBase64Url(
              credential.credentialPublicKey
            ),

          counter:
            Number(credential.counter || 0),
        },

        requireUserVerification: true,
      });

    if (!verification.verified) {
      return {
        success: false,
        authenticated: false,
        message:
          "Passkey cryptographic verification failed.",
      };
    }

    // ===================================================
    // Update Credential Counter
    // ===================================================

    const newCounter =
      verification.authenticationInfo
        ?.newCounter;

    const updateData = {
      lastUsed:
        admin.firestore.FieldValue.serverTimestamp(),
    };

    if (
      typeof newCounter === "number"
    ) {
      updateData.counter = newCounter;
    }

    await credentialDoc.ref.update(
      updateData
    );

    // ===================================================
    // Mark Challenge Used
    // ===================================================

    await challengeDoc.ref.update({
      verified: true,

      used: true,

      verifiedAt:
        admin.firestore.FieldValue.serverTimestamp(),
    });

    // ===================================================
    // Authentication Successful
    // ===================================================

    return {
      success: true,

      authenticated: true,

      userId,

      credentialId:
        credential.credentialId,

      message:
        "Passkey authentication verified successfully.",
    };
  } catch (error) {
    console.error(
      "IFSE passkey authentication error:",
      error
    );

    return {
      success: false,

      authenticated: false,

      message: error.message,
    };
  }
}

// =======================================================
// Face Verification
// =======================================================

export async function verifyFaceService(data) {
  return {
    success: true,

    verified: false,

    engine:
      "FaceAuthenticityEngine",

    message:
      "Face verification engine will be connected next.",

    request: data,
  };
}

// =======================================================
// Biometric Verification
// =======================================================

export async function verifyBiometricService(
  data
) {
  return {
    success: true,

    verified: false,

    engine:
      "BiometricVerificationEngine",

    message:
      "Biometric verification engine will be connected next.",

    request: data,
  };
}

// =======================================================
// Identity Verification
// =======================================================

export async function verifyIdentityService(
  data
) {
  return {
    success: true,

    verified: false,

    engine:
      "IdentityVerificationEngine",

    message:
      "Identity verification engine will be connected next.",

    request: data,
  };
}
