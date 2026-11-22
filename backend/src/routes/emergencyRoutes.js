// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Emergency Notification Routes
// =======================================================

import express from "express";

import {
  notificationStatus,
  notifySOS,
  testSOSNotification,
} from "../controllers/emergencyController.js";

import { requireFirebaseUser } from "../middleware/firebaseAuth.js";

const router = express.Router();

// Safe diagnostics: booleans and provider names only.
router.get("/notification-status", notificationStatus);

// Automatic SOS notification. No administrator approval step.
router.post("/sos/:emergencyId/notify", requireFirebaseUser, notifySOS);

// Verification endpoint: test recipients only, dry run by default.
router.post("/notification-test", requireFirebaseUser, testSOSNotification);

export default router;
