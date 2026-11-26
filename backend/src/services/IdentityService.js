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

    // Update the credential counter and consume the challenge atomically.
    // Concurrent replays will see the challenge as used and cannot authenticate.
    await firestore().runTransaction(async (transaction) => {
      const freshChallengeSnapshot = await transaction.get(challengeDoc.ref);
      const freshCredentialSnapshot = await transaction.get(credentialDoc.ref);

      if (!freshChallengeSnapshot.exists || !freshCredentialSnapshot.exists) {
        throw new Error("Passkey challenge or credential no longer exists.");
      }

      const freshChallenge = freshChallengeSnapshot.data();
      if (
        freshChallenge.used === true ||
        freshChallenge.type !== "authentication" ||
        String(freshChallenge.userId) !== String(userId) ||
        !freshChallenge.expiresAt ||
        Date.now() > Number(freshChallenge.expiresAt)
      ) {
        throw new Error("Passkey challenge is expired, invalid, or already used.");
      }

      // A second, distinct challenge can be verified concurrently against
      // the same previously-read credential counter. Re-check the counter
      // inside the transaction so an older assertion cannot overwrite a
      // newer authenticator counter after a concurrent sign-in.
      const freshCredential = freshCredentialSnapshot.data();
      const currentCounter = Number(freshCredential.counter || 0);
      if (
        typeof newCounter === "number" &&
        currentCounter > 0 &&
        newCounter <= currentCounter
      ) {
        throw new Error("Passkey authenticator counter did not advance. Please try signing in again.");
      }

      transaction.update(credentialDoc.ref, updateData);
      transaction.update(challengeDoc.ref, {
        verified: true,
        used: true,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    // ---------------------------------------------------
    // Authentication successful
    // ---------------------------------------------------

    // Re-check the Firebase account state before issuing a session.
    // A previously registered passkey must not restore access to a disabled
    // account or bypass Inclura's verified-email requirement.
    const firebaseUser = await admin.auth().getUser(userId);
    if (firebaseUser.disabled) {
      throw new Error("This Inclura account is disabled. Contact support if you believe this is a mistake.");
    }
    if (firebaseUser.emailVerified !== true) {
      throw new Error("Verify your Inclura email address before signing in with a passkey.");
    }

    // Exchange the cryptographically verified passkey assertion for a
    // Firebase custom token so the browser receives a real Firebase session.
    const customToken = await admin.auth().createCustomToken(userId);

    return {
      success: true,
      authenticated: true,
      userId,
      customToken,

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

export async function verifyFaceService() {
  return {
    success: false,
    verified: false,
    available: false,
    code: "VERIFICATION_PROVIDER_NOT_CONFIGURED",
    engine: "FaceAuthenticityEngine",
    message: "Face verification is unavailable until a trusted verification provider is configured.",
  };
}

// =======================================================
// Biometric Verification
// =======================================================

export async function verifyBiometricService() {
  return {
    success: false,
    verified: false,
    available: false,
    code: "VERIFICATION_PROVIDER_NOT_CONFIGURED",
    engine: "BiometricVerificationEngine",
    message: "Biometric verification is unavailable until a trusted verification provider is configured.",
  };
}

// =======================================================
// Identity Verification
// =======================================================

export async function verifyIdentityService() {
  return {
    success: false,
    verified: false,
    available: false,
    code: "VERIFICATION_PROVIDER_NOT_CONFIGURED",
    engine: "IdentityVerificationEngine",
    message: "Identity verification is unavailable until a trusted verification provider is configured.",
  };
}
