import express from "express";
import { receiveTextbeeWebhook } from "../controllers/textbeeWebhookController.js";

const router = express.Router();

// Must be mounted before express.json() so signature verification uses
// the exact raw bytes TextBee signed. Keep this endpoint server-to-server.
router.post(
  "/webhook",
  express.raw({ type: "application/json", limit: "64kb" }),
  receiveTextbeeWebhook
);

export default router;
