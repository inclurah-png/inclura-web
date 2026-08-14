// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Express Application
// Production Foundation
// =======================================================

import express from "express";
import cors from "cors";
import passkeyRoutes from "./src/routes/passkeyRoutes.js";

const app = express();

// =======================================================
// Basic Middleware
// =======================================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =======================================================
// Health Check
// =======================================================

app.get("/", (req, res) => {
  res.status(200).json({
    platform: "Inclura",
    service: "IFSE Identity Backend",
    version: "1.0.0",
    status: "Running",
    timestamp: new Date().toISOString(),
  });
});

// =======================================================
// API Status
// =======================================================

app.get("/api/status", (req, res) => {
  res.status(200).json({
    success: true,
    backend: "Identity Backend",
    securityEngine: "IFSE",
    environment:
      process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// =======================================================
// IFSE Identity Routes
// =======================================================

app.use(
  "/api/identity",
  passkeyRoutes
);

// =======================================================
// 404 Handler
// =======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found.",
  });
});

// =======================================================
// Global Error Handler
// =======================================================

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

export default app;
