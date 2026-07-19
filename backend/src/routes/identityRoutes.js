// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Identity Routes
// =======================================================

import express from "express";

import {
  health,
  registerPasskey,
  authenticationOptions,
  verifyAuthentication,
  verifyFace,
  verifyBiometric,
  verifyIdentity,
} from "../controllers/IdentityController.js";

const router = express.Router();

// =======================================================
// Health
// =======================================================

router.get("/", health);

// =======================================================
// Passkeys
// =======================================================

router.post("/passkeys/register", registerPasskey);

router.get(
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

router.post("/face/verify", verifyFace);

// =======================================================
// Biometric Verification
// =======================================================

router.post("/biometric/verify", verifyBiometric);

// =======================================================
// Identity Verification
// =======================================================

router.post("/verify", verifyIdentity);

export default router;
