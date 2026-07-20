// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Passkey Routes
// =======================================================

import express from "express";

import {
  registerPasskey,
  verifyPasskeyRegistration,
} from "../controllers/passkeyController.js";

const router = express.Router();

// =======================================================
// Registration
// =======================================================

router.post(
  "/register/options",
  registerPasskey
);

// =======================================================
// Registration Verification
// =======================================================

router.post(
  "/register/verify",
  verifyPasskeyRegistration
);

export default router;
