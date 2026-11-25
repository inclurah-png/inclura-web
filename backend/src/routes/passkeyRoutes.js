// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Identity / Passkey Routes
// =======================================================

import express from "express";
import { auth as firebaseAuth } from "../config/firebaseAdmin.js";

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

// Passkey enrollment must be initiated by the verified Firebase account owner.
// Never accept a userId or email supplied by an unauthenticated browser.
async function requireVerifiedFirebaseUser(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const match = authorization.match(/^Bearer\\s+(.+)$/i);
    if (!match) {
      return res.status(401).json({ success: false, message: "Sign in to Inclura before registering a passkey." });
    }

    const decoded = await firebaseAuth().verifyIdToken(match[1], true);
    if (!decoded.uid || !decoded.email || decoded.email_verified !== true) {
      return res.status(403).json({ success: false, message: "A verified Inclura email account is required to register a passkey." });
    }

    req.firebaseUser = decoded;
    req.body = {
      ...(req.body || {}),
      userId: decoded.uid,
      email: decoded.email,
    };
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Your Inclura session is invalid or expired. Please sign in again." });
  }
}

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
  requireVerifiedFirebaseUser,
  registerPasskey
);

router.post(
  "/register/verify",
  requireVerifiedFirebaseUser,
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
  requireVerifiedFirebaseUser,
  registerPasskey
);

router.post(
  "/passkeys/verify-registration",
  requireVerifiedFirebaseUser,
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
