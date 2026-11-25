// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Identity Backend Server
// Production Foundation
// =======================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import passkeyRoutes from "./src/routes/passkeyRoutes.js";
import mediaRoutes from "./src/routes/mediaRoutes.js";
import emergencyRoutes from "./src/routes/emergencyRoutes.js";
import sosNotificationRoutes from "./src/routes/sosNotificationRoutes.js";
import textbeeWebhookRoutes from "./src/routes/textbeeWebhookRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";

import {
  startSOSNotificationSweeper,
} from "./src/services/sosNotificationSweeper.js";


import {
  initializeFirebaseAdmin,
  firestore,
  auth,
} from "./src/config/firebaseAdmin.js";

import {
  validateEnvironment,
  environment,
} from "./src/config/environment.js";

// =======================================================
// Environment
// =======================================================

dotenv.config();

validateEnvironment();

initializeFirebaseAdmin();

// =======================================================
// Express Application
// =======================================================

const app = express();

// =======================================================
// Configuration
// =======================================================

const PORT =
  process.env.PORT || 5000;

// =======================================================
// CORS
// =======================================================

// Comma separated list. Defaults preserve the existing production
// origins and allow local Vite development.
const ALLOWED_ORIGINS = (
  process.env.CORS_ORIGINS ||
  "https://inclura-web.pages.dev,https://inclura-prod-90734.web.app,http://localhost:5173,http://localhost:4173"
)
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without an Origin header (server-to-server,
      // curl, health checks) are allowed.
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: false,
  })
);

// =======================================================
// TextBee signed webhook — raw body must be parsed before JSON.
// =======================================================

app.use("/api/integrations/textbee", textbeeWebhookRoutes);

// =======================================================
// JSON Body Parser
// =======================================================
//
// IMPORTANT:
// This allows Express to read JSON sent by Login.jsx.
//
// Without this middleware:
// req.body can be undefined.
//
// That was preventing the email from reaching
// authenticationOptionsService().
//

app.use(
  express.json({
    limit: "1mb",
  })
);

// =======================================================
// URL-Encoded Body Parser
// =======================================================

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

// =======================================================
// OPTIONS / CORS Preflight
// =======================================================

app.options(
  "*",
  cors()
);

// =======================================================
// Health Check
// =======================================================

app.get(
  "/",
  (req, res) => {

    res.status(200).json({

      platform:
        "Inclura",

      service:
        "IFSE Identity Backend",

      version:
        "1.0.0",

      status:
        "Running",

      timestamp:
        new Date().toISOString(),

    });

  }
);

// =======================================================
// API Status
// =======================================================

app.get(
  "/api/status",
  (req, res) => {

    res.status(200).json({

      success:
        true,

      backend:
        "Identity Backend",

      securityEngine:
        "IFSE",

      environment:
        process.env.NODE_ENV ||
        "development",

      uptime:
        process.uptime(),

      timestamp:
        new Date().toISOString(),

    });

  }
);

// =======================================================
// Administrator-only Platform Analytics
// =======================================================

app.post("/api/analytics/platform", async (req, res) => {
  try {
    const authorization = req.headers.authorization || "";
    const match = authorization.match(/^Bearer (.+)$/i);
    if (!match) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    // Use the server-issued Firebase Authentication custom claim.
    // This matches Inclura's existing Users Management authorization model.
    const decoded = await auth().verifyIdToken(match[1]);
    if (decoded.admin !== true) {
      return res.status(403).json({ success: false, message: "Administrator access required." });
    }

    const database = firestore();
    const [usersSnap, campaignsSnap, listingsSnap, ordersSnap] = await Promise.all([
      database.collection("users").get(),
      database.collection("enterpriseCampaigns").get(),
      database.collection("marketplaceListings").get(),
      database.collection("marketplaceOrders").get(),
    ]);

    const now = Date.now();
    let premiumUsers = 0;
    let verifiedCreators = 0;
    let qualifiedCreators = 0;
    let activeUsers = 0;

    usersSnap.forEach((userDoc) => {
      const user = userDoc.data();
      if (user.premiumPlan?.active === true) premiumUsers += 1;
      if (user.creatorVerified === true) verifiedCreators += 1;
      if (user.creatorEconomy?.premiumQualified === true) qualifiedCreators += 1;
      const lastLogin = user.lastLogin?.toMillis
        ? user.lastLogin.toMillis()
        : (user.lastLogin ? new Date(user.lastLogin).getTime() : 0);
      if (lastLogin && now - lastLogin < 30 * 24 * 60 * 60 * 1000) activeUsers += 1;
    });

    let activeEnterpriseCampaigns = 0;
    let totalEnterpriseCampaignBudget = 0;
    campaignsSnap.forEach((campaignDoc) => {
      const campaign = campaignDoc.data();
      if (campaign.status === "active") {
        activeEnterpriseCampaigns += 1;
        const budget = Number(campaign.budget);
        if (Number.isFinite(budget) && budget > 0) totalEnterpriseCampaignBudget += budget;
      }
    });

    let totalMarketplaceListings = listingsSnap.size;
    let completedMarketplaceOrders = 0;
    let marketplaceRevenue = 0;
    ordersSnap.forEach((orderDoc) => {
      const order = orderDoc.data();
      if (order.status === "completed") {
        completedMarketplaceOrders += 1;
        const amount = Number(order.amount);
        if (Number.isFinite(amount) && amount > 0) marketplaceRevenue += amount;
      }
    });

    let platformHealth = "Excellent";
    if (activeUsers < 10) platformHealth = "Needs attention";
    else if (activeUsers < 100) platformHealth = "Developing";

    let overallHealthScore = 100;
    if (activeUsers < 100) overallHealthScore -= 15;
    if (premiumUsers === 0) overallHealthScore -= 10;
    if (verifiedCreators === 0) overallHealthScore -= 10;
    if (qualifiedCreators === 0) overallHealthScore -= 10;
    if (overallHealthScore < 0) overallHealthScore = 0;

    const report = {
      totalUsers: usersSnap.size,
      activeCreators: activeUsers,
      premiumUsers,
      verifiedCreators,
      qualifiedCreators,
      activeEnterpriseCampaigns,
      totalEnterpriseCampaignBudget,
      marketplaceRevenue,
      totalMarketplaceListings,
      completedMarketplaceOrders,
      platformHealth,
      overallHealthScore,
      generatedAt: new Date(),
    };

    await database.collection("executiveReports").doc("current").set(report, { merge: true });
    return res.status(200).json({ success: true, report: { ...report, generatedAt: report.generatedAt.toISOString() } });
  } catch (error) {
    console.error("Platform analytics generation failed:", error);
    return res.status(500).json({ success: false, message: "Platform analytics could not be generated." });
  }
});

// =======================================================
// Protected Media Upload Routes
// =======================================================

app.use("/api/media", mediaRoutes);

// No Inclura wallet, funding, withdrawal or transfer API is exposed.

// =======================================================
// IFSE Identity Routes
// =======================================================

app.use(
  "/api/identity",
  passkeyRoutes
);

// Server-side Flutterwave verification and entitlement activation.
app.use("/api/payments", paymentRoutes);

// =======================================================
// Emergency SOS Notification Routes
// =======================================================
//
// Automatic, one-way notification. No administrator action is
// required or possible.

app.use(
  "/api/emergency",
  emergencyRoutes
);

// URL used by the SOS page for automatic trusted-contact SMS
// and email dispatch.
app.use(
  "/api/sos-notifications",
  sosNotificationRoutes
);

// =======================================================
// 404 Handler
// =======================================================

app.use(
  (req, res) => {

    res.status(404).json({

      success:
        false,

      message:
        "Endpoint not found.",

    });

  }
);

// =======================================================
// Global Error Handler
// =======================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    console.error(
      "IFSE Backend Error:",
      error
    );

    res.status(500).json({

      success:
        false,

      message:
        "Internal server error.",

    });

  }
);

// =======================================================
// Start Server
// =======================================================

app.listen(
  PORT,
  () => {

    console.log("");

    console.log(
      "===================================="
    );

    console.log(
      " Inclura IFSE Identity Backend"
    );

    console.log(
      "===================================="
    );

    console.log(
      ` Server Running : ${PORT}`
    );

    console.log(
      ` Environment : ${
        process.env.NODE_ENV ||
        "development"
      }`
    );

    console.log(
      " JSON Body Parser : Enabled"
    );

    console.log(
      "===================================="
    );

    // Automatic SOS notification retry loop. Independent of
    // any administrator being online.
    startSOSNotificationSweeper();

  }
);
