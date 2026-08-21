// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Identity / Passkey Routes
// =======================================================

import express from "express";

import {
  health,
  registerPasskey,
  verifyRegistration,
  authenticationOptions,
  verifyAuthentication,
  verifyFace,
  verifyBiometric,
  verifyIdentity,
} from "../controllers/IdentityController.js";

const router = express.Router();

// =======================================================
// Identity Health
// =======================================================

router.get(
  "/",
  health
);

// =======================================================
// Passkey Registration
// =======================================================

router.post(
  "/register/options",
  registerPasskey
);

router.post(
  "/register/verify",
  verifyRegistration
);

// =======================================================
// Passkey Authentication
// =======================================================

router.post(
  "/authentication/options",
  authenticationOptions
);

router.post(
  "/authentication/verify",
  verifyAuthentication
);

// =======================================================
// Compatibility Routes
// =======================================================
// These preserve the existing /passkeys/... structure
// while using the same verified IdentityController.

router.post(
  "/passkeys/register",
  registerPasskey
);

router.post(
  "/passkeys/verify-registration",
  verifyRegistration
);

router.post(
  "/passkeys/authentication-options",
  authenticationOptions
);

router.post(
  "/passkeys/verify-authentication",
  verifyAuthentication
);

// =======================================================
// Face Verification
// =======================================================

router.post(
  "/face/verify",
  verifyFace
);

// =======================================================
// Biometric Verification
// =======================================================

router.post(
  "/biometric/verify",
  verifyBiometric
);

// =======================================================
// Identity Verification
// =======================================================

router.post(
  "/verify",
  verifyIdentity
);

export default router;
