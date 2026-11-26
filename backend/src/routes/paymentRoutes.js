import express from "express";
import { limitPaymentVerification } from "../middleware/passkeyRateLimit.js";
import { auth, firestore } from "../config/firebaseAdmin.js";
import creator from "../../../src/config/pricing/creator.js";
import group from "../../../src/config/pricing/group.js";
import organization from "../../../src/config/pricing/organization.js";
import ngo from "../../../src/config/pricing/ngo.js";
import institution from "../../../src/config/pricing/institution.js";
import religious from "../../../src/config/pricing/religious.js";
import healthcare from "../../../src/config/pricing/healthcare.js";
import museum from "../../../src/config/pricing/museum.js";
import tourism from "../../../src/config/pricing/tourism.js";
import entertainment from "../../../src/config/pricing/entertainment.js";
import media from "../../../src/config/pricing/media.js";
import accessibility from "../../../src/config/pricing/accessibility.js";

const VERIFICATION_PLANS = {
  creator, group, organization, ngo, institution, religious,
  healthcare, museum, tourism, entertainment, media, accessibility,
};

const router = express.Router();

const RECRUITER_PLANS = Object.freeze({
  starter: { amount: 20000, jobs: 5 },
  business: { amount: 40000, jobs: 15 },
  enterprise: { amount: 100000, jobs: null },
});

function unauthorized(res, status, message) {
  return res.status(status).json({ success: false, message });
}

router.post("/verify", limitPaymentVerification, async (req, res) => {
  try {
    const secretKey = process.env.FLW_SECRET_KEY;
    if (!secretKey) {
      return unauthorized(res, 503, "Payment verification is not configured on the server.");
    }

    const authorization = req.headers.authorization || "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) return unauthorized(res, 401, "A valid Inclura session is required.");

    const decoded = await auth().verifyIdToken(match[1], true);
    if (decoded.email_verified !== true) {
      return unauthorized(res, 403, "Verify your email address before confirming a payment.");
    }
    const userRecord = await auth().getUser(decoded.uid);
    if (userRecord.disabled) return unauthorized(res, 403, "This account is disabled.");

    const { transactionId, txRef, purpose, plan, verificationId, paymentMethod } = req.body || {};
    const numericTransactionId = String(transactionId || "");
    const reference = String(txRef || "");
    if (!/^\d{1,30}$/.test(numericTransactionId) || !/^[A-Za-z0-9_-]{8,120}$/.test(reference)) {
      return unauthorized(res, 400, "A valid Flutterwave transaction and reference are required.");
    }

    if (!["premium", "recruiter", "creator_verification", "verification"].includes(purpose)) {
      return unauthorized(res, 400, "Unsupported payment purpose.");
    }

    const database = firestore();
    let expectedAmount;
    let expectedCurrency;
    let grant = null;
    let verificationSnapshot = null;

    if (purpose === "premium") {
      const tierMap = {
        silver: "SilverBadge",
        gold: "GoldBadge",
        platinum: "PlatinumBadge",
        enterprise: "EnterpriseBadge",
      };
      const pricingDocId = tierMap[String(plan || "").toLowerCase()];
      if (!pricingDocId) return unauthorized(res, 400, "Invalid premium plan.");
      const pricingSnapshot = await database.collection("pricing").doc(pricingDocId).get();
      expectedAmount = Number(pricingSnapshot.data()?.price);
      expectedCurrency = "NGN";
      if (!pricingSnapshot.exists || !Number.isFinite(expectedAmount) || expectedAmount <= 0) {
        return unauthorized(res, 409, "This premium plan is not currently priced.");
      }
      grant = { type: "premium", tier: String(plan).toLowerCase() };
    } else if (purpose === "recruiter") {
      const selected = RECRUITER_PLANS[String(plan || "").toLowerCase()];
      if (!selected) return unauthorized(res, 400, "Invalid recruiter plan.");
      expectedAmount = selected.amount;
      expectedCurrency = "NGN";
      grant = { type: "recruiter", plan: String(plan).toLowerCase(), jobs: selected.jobs };
    } else if (purpose === "creator_verification") {
      expectedAmount = Number(
        creator.verificationTypes.find((item) => item.id === "verified_creator")?.monthlyUSD || 0
      );
      expectedCurrency = "USD";
      if (!Number.isFinite(expectedAmount) || expectedAmount <= 0) {
        return unauthorized(res, 409, "Creator verification is not currently priced.");
      }
      grant = { type: "creator_verification" };
    } else {
      const id = String(verificationId || "");
      if (!/^[A-Za-z0-9_-]{10,150}$/.test(id)) {
        return unauthorized(res, 400, "A valid verification application is required.");
      }
      verificationSnapshot = await database.collection("verificationRequests").doc(id).get();
      if (!verificationSnapshot.exists) return unauthorized(res, 404, "Verification application not found.");
      const application = verificationSnapshot.data();
      if (application.userId !== decoded.uid && application.submittedBy !== decoded.uid) {
        return unauthorized(res, 403, "This verification application does not belong to your account.");
      }
      const categoryPricing = VERIFICATION_PLANS[String(application.category || "").toLowerCase()];
      const selectedPlan = (
        categoryPricing?.verificationTypes ||
        categoryPricing?.certification ||
        []
      ).find((item) => item.id === application.verificationType);
      const trustedAmount = Number(
        selectedPlan?.monthlyUSD ??
        selectedPlan?.yearlyUSD ??
        selectedPlan?.monthlyFee ??
        selectedPlan?.fee ??
        selectedPlan?.contractUSD ??
        0
      );
      const applicationAmount = Number(application.paymentAmount);
      expectedAmount = trustedAmount;
      expectedCurrency = "USD";
      if (
        !Number.isFinite(trustedAmount) ||
        trustedAmount <= 0 ||
        !Number.isFinite(applicationAmount) ||
        Math.abs(applicationAmount - trustedAmount) > 0.01
      ) {
        return unauthorized(res, 409, "The application price does not match Inclura's approved pricing. Please contact support.");
      }
    }

    const verifyResponse = await fetch(
      `https://api.flutterwave.com/v3/transactions/${numericTransactionId}/verify`,
      { headers: { Authorization: `Bearer ${secretKey}`, Accept: "application/json" } }
    );
    const verification = await verifyResponse.json();
    if (!verifyResponse.ok || verification.status !== "success" || !verification.data) {
      return unauthorized(res, 402, "Flutterwave could not confirm this transaction.");
    }

    const payment = verification.data;
    const paidAmount = Number(payment.amount);
    const paidCurrency = String(payment.currency || "").toUpperCase();
    const paidEmail = String(payment.customer?.email || "").trim().toLowerCase();
    const accountEmail = String(userRecord.email || "").trim().toLowerCase();

    if (
      String(payment.id) !== numericTransactionId ||
      payment.status !== "successful" ||
      payment.tx_ref !== reference ||
      paidCurrency !== expectedCurrency ||
      !Number.isFinite(paidAmount) ||
      Math.abs(paidAmount - expectedAmount) > 0.01 ||
      !accountEmail ||
      paidEmail !== accountEmail
    ) {
      return unauthorized(res, 402, "The transaction details do not match this account and purchase.");
    }

    const paymentRef = database.collection("flutterwavePayments").doc(numericTransactionId);
    const userRef = database.collection("users").doc(decoded.uid);
    const verificationPaymentRef = database.collection("verificationPayments").doc(numericTransactionId);
    const securityEventRef = database.collection("ifsePaymentEvents").doc();
    const auditLogRef = database.collection("paymentAuditLogs").doc();
    const timelineRef = database.collection("paymentTimeline").doc();
    const now = new Date();

    await database.runTransaction(async (transaction) => {
      const existing = await transaction.get(paymentRef);
      if (existing.exists) {
        const prior = existing.data();
        const priorMatches =
          prior.userId === decoded.uid &&
          prior.transactionId === numericTransactionId &&
          prior.txRef === reference &&
          prior.purpose === purpose &&
          String(prior.plan || "") === String(plan || "") &&
          String(prior.verificationId || "") === String(verificationId || "") &&
          String(prior.currency || "").toUpperCase() === paidCurrency &&
          Number.isFinite(Number(prior.amount)) &&
          Math.abs(Number(prior.amount) - paidAmount) <= 0.01 &&
          prior.paymentStatus === "paid" &&
          prior.verifiedByServer === true;
        if (!priorMatches) {
          throw new Error("This transaction has already been recorded with different payment details.");
        }
        return;
      }

      if (verificationSnapshot) {
        const currentApplication = await transaction.get(verificationSnapshot.ref);
        if (!currentApplication.exists) {
          throw new Error("Verification application no longer exists.");
        }
        const currentData = currentApplication.data();
        if (
          (currentData.userId !== decoded.uid && currentData.submittedBy !== decoded.uid) ||
          currentData.paymentStatus === "paid" ||
          currentData.status === "approved" ||
          currentData.status === "rejected"
        ) {
          throw new Error("This verification application is no longer eligible for payment.");
        }
      }

      const paymentRecord = {
        userId: decoded.uid,
        transactionId: numericTransactionId,
        txRef: reference,
        purpose,
        plan: plan || null,
        verificationId: verificationId || null,
        amount: paidAmount,
        currency: paidCurrency,
        paymentStatus: "paid",
        gateway: "flutterwave",
        verifiedByServer: true,
        createdAt: now,
      };
      transaction.create(paymentRef, paymentRecord);

      if (grant?.type === "premium") {
        const expiry = new Date(now);
        expiry.setMonth(expiry.getMonth() + 1);
        transaction.set(userRef, {
          premium: true,
          premiumActive: true,
          premiumTier: grant.tier,
          premiumStartedAt: now,
          premiumExpiryDate: expiry,
          premiumReference: reference,
          premiumTransactionId: numericTransactionId,
        }, { merge: true });
      } else if (grant?.type === "recruiter") {
        const expiry = new Date(now);
        expiry.setDate(expiry.getDate() + 30);
        transaction.set(userRef, {
          recruiter: {
            plan: grant.plan,
            status: "active",
            activatedAt: now,
            expiresAt: expiry,
            paymentReference: reference,
            transactionId: numericTransactionId,
            activeJobs: 0,
          },
        }, { merge: true });
      } else if (grant?.type === "creator_verification") {
        // Payment is not identity approval. Keep the badge unverified until review.
        transaction.set(userRef, {
          creatorVerificationPaymentStatus: "paid",
          creatorVerificationPaymentReference: reference,
          creatorVerificationPaymentTransactionId: numericTransactionId,
          creatorVerificationPaymentAt: now,
        }, { merge: true });
      } else if (verificationSnapshot) {
        transaction.set(verificationSnapshot.ref, {
          paymentStatus: "paid",
          paymentId: numericTransactionId,
          updatedAt: now,
        }, { merge: true });
        transaction.create(verificationPaymentRef, {
          userId: decoded.uid,
          verificationId,
          category: verificationSnapshot.data()?.category || null,
          verificationType: verificationSnapshot.data()?.verificationType || null,
          transactionId: numericTransactionId,
          flutterwaveReference: reference,
          amount: paidAmount,
          currency: paidCurrency,
          paymentStatus: "paid",
          status: "completed",
          verifiedByServer: true,
          paymentMethod: typeof paymentMethod === "string" ? paymentMethod.slice(0, 50) : "Flutterwave",
          createdAt: now,
          updatedAt: now,
        });
        transaction.create(securityEventRef, {
          paymentId: numericTransactionId,
          transactionId: numericTransactionId,
          eventType: "verification_payment_server_verified",
          riskScore: 0,
          threatLevel: "Low",
          requiresExecutiveApproval: true,
          reviewed: false,
          createdAt: now,
        });
        transaction.create(auditLogRef, {
          paymentId: numericTransactionId,
          transactionId: numericTransactionId,
          action: "Flutterwave payment verified by IFSE",
          actor: decoded.uid,
          createdAt: now,
        });
        transaction.create(timelineRef, {
          paymentId: numericTransactionId,
          transactionId: numericTransactionId,
          title: "Payment confirmed by Flutterwave",
          status: "Completed",
          createdAt: now,
        });
      }
    });

    return res.status(200).json({
      success: true,
      verified: true,
      purpose,
      transactionId: numericTransactionId,
      message: purpose === "creator_verification"
        ? "Payment confirmed. Creator identity review is still required."
        : "Payment verified successfully.",
    });
  } catch (error) {
    console.error("IFSE payment verification failed:", error);
    return res.status(500).json({ success: false, message: "Payment verification could not be completed." });
  }
});

export default router;
