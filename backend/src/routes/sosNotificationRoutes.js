// =======================================================
// Inclura Fortress Security Engine (IFSE)
// SOS Notification Compatibility Routes
// =======================================================
//
// The SOS page calls POST /api/sos-notifications/:id/send
// right after the emergency record is created.
//
// That endpoint did not exist, so every SOS stored a
// notification that was never sent. This route attaches the
// existing automatic SMS/email pipeline to that URL.
//
// There is deliberately no approve, reject, delay, cancel or
// reroute endpoint here.
// =======================================================

import express from "express";

import { sendSOSNotification } from "../controllers/emergencyController.js";
import { requireFirebaseUser, requireRegisteredFirebaseUser } from "../middleware/firebaseAuth.js";

const router = express.Router();

router.post(
  "/:emergencyId/send",
  requireFirebaseUser,
  requireRegisteredFirebaseUser,
  sendSOSNotification
);

export default router;
