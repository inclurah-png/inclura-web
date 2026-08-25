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
  if (!data || !data.userId || !data.email) {
    throw new Error(
      "userId and email are required for passkey registration."
    );
  }

  const userId = String(data.userId);
  const challengeId = randomUUID();

  const userIdBytes = new TextEncoder().encode(userId);

  const options = await generateRegistrationOptions({
    rpName: process.env.WEBAUTHN_RP_NAME,
    rpID: process.env.WEBAUTHN_RP_ID,

    userName: String(data.email),

    userID: userIdBytes,

    userDisplayName:
      data.fullName || String(data.email),

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
      userId,
      email: String(data.email),

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
  if (!data.email && !data.userId) {
    throw new Error(
      "email or userId is required for passkey authentication."
    );
  }

  let userId = null;
  let email = null;

  // -----------------------------------------------------
  // Resolve Firebase user
  // -----------------------------------------------------

  if (data.userId) {
    userId = String(data.userId);

    email = data.email
      ? String(data.email).trim().toLowerCase()
      : null;
  } else {
    email = String(data.email)
      .trim()
      .toLowerCase();

    try {
      const firebaseUser =
        await admin
          .auth()
          .getUserByEmail(email);

      userId = firebaseUser.uid;
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

  // -----------------------------------------------------
  // Load registered passkeys
  // -----------------------------------------------------

  const credentialsSnapshot =
    await firestore()
      .collection("ifse_passkeys")
      .doc(userId)
      .collection("credentials")
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
          id: decodeBase64Url(
            credential.credentialId
          ),
          type: "public-key",
        });
      }
    }
  );

  if (allowCredentials.length === 0) {
    throw new Error(
      "No registered passkeys were found for this user."
    );
  }

  // -----------------------------------------------------
  // Generate authentication options
  // -----------------------------------------------------

  const options =
    await generateAuthenticationOptions({
      rpID: process.env.WEBAUTHN_RP_ID,

      timeout: 60000,

      userVerification: "required",

      allowCredentials,
    });

  // -----------------------------------------------------
  // Store challenge
  // -----------------------------------------------------

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
      email,

      createdAt:
        admin.firestore.FieldValue.serverTimestamp(),

      expiresAt,

      verified: false,
      used: false,
    });

  return {
    success: true,
    challengeId,
    userId,
    optionsJSON: options,
  };
}

// =======================================================
// Verify Authentication
// =======================================================

export async function verifyAuthenticationService(data) {
  try {
    if (
      !data ||
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

    // ---------------------------------------------------
    // Resolve Firebase user
    // ---------------------------------------------------

    let userId = data.userId
      ? String(data.userId)
      : null;

    if (!userId && data.email) {
      const email = String(data.email)
        .trim()
        .toLowerCase();

      try {
        const firebaseUser =
          await admin
            .auth()
            .getUserByEmail(email);

        userId = firebaseUser.uid;
      } catch (error) {
        console.error(
          "IFSE Firebase user lookup failed during authentication:",
          error
        );

        return {
          success: false,
          authenticated: false,
          message:
            "Inclura account could not be resolved.",
        };
      }
    }

    if (!userId) {
      return {
        success: false,
        authenticated: false,
        message:
          "User identity is required for authentication.",
      };
    }

    // ---------------------------------------------------
    // Load challenge
    // ---------------------------------------------------

    const challengeDoc =
      await firestore()
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

    // ---------------------------------------------------
    // Verify challenge ownership
    // ---------------------------------------------------

    if (
      String(challenge.userId) !== userId ||
      challenge.type !== "authentication"
    ) {
      return {
        success: false,
        authenticated: false,
        message:
          "Authentication challenge is invalid.",
      };
    }

    // ---------------------------------------------------
    // Check expiration
    // ---------------------------------------------------

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

    // ---------------------------------------------------
    // Prevent replay
    // ---------------------------------------------------

    if (challenge.used === true) {
      return {
        success: false,
        authenticated: false,
        message:
          "Authentication challenge has already been used.",
      };
    }

    // ---------------------------------------------------
    // Find credential
    // ---------------------------------------------------

    const credentialsSnapshot =
      await firestore()
        .collection("ifse_passkeys")
        .doc(userId)
        .collection("credentials")
        .get();

    const requestedId =
      decodeBase64Url(data.credentialId);

    let credentialDoc = null;
    let credential = null;

    for (
      const document
      of credentialsSnapshot.docs
    ) {
      const storedCredential =
        document.data();

      if (!storedCredential.credentialId) {
        continue;
      }

      try {
        const storedId =
          decodeBase64Url(
            storedCredential.credentialId
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

    // ---------------------------------------------------
    // Cryptographic WebAuthn verification
    // ---------------------------------------------------

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
          id:
            credential.credentialId,

          publicKey:
            decodeBase64Url(
              credential.credentialPublicKey
            ),

          counter:
            Number(
              credential.counter || 0
            ),
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

    // ---------------------------------------------------
    // Update credential counter
    // ---------------------------------------------------

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

    // ---------------------------------------------------
    // Mark challenge as used
    // ---------------------------------------------------

    await challengeDoc.ref.update({
      verified: true,
      used: true,

      verifiedAt:
        admin.firestore.FieldValue.serverTimestamp(),
    });

    // ---------------------------------------------------
    // Authentication successful
    // ---------------------------------------------------

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
    engine: "FaceAuthenticityEngine",

    message:
      "Face verification engine will be connected next.",

    request: data,
  };
}

// =======================================================
// Biometric Verification
// =======================================================

export async function verifyBiometricService(data) {
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

export async function verifyIdentityService(data) {
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
