import express from "express";
import { timingSafeEqual } from "node:crypto";
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

async function authenticatePaymentUser(req) {
  const authorization = req.headers.authorization || "";
  const match = authorization.match(/^Bearer\\s+(.+)$/i);
  if (!match) { const error = new Error("A valid Inclura session is required."); error.status = 401; throw error; }
  const decoded = await auth().verifyIdToken(match[1], true);
  if (decoded.email_verified !== true) { const error = new Error("Verify your email address before making a payment."); error.status = 403; throw error; }
  const userRecord = await auth().getUser(decoded.uid);
  if (userRecord.disabled) { const error = new Error("This account is disabled."); error.status = 403; throw error; }
  return { decoded, userRecord };
}

function resolveVerificationPrice(application) {
  const categoryPricing = VERIFICATION_PLANS[String(application.category || "").toLowerCase()];
  const selectedPlan = (categoryPricing?.verificationTypes || categoryPricing?.certification || [])
    .find((item) => item.id === application.verificationType);
  const amount = Number(selectedPlan?.monthlyUSD ?? selectedPlan?.yearlyUSD ?? selectedPlan?.monthlyFee ?? selectedPlan?.fee ?? selectedPlan?.contractUSD ?? 0);
  const applicationAmount = Number(application.paymentAmount);
  if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(applicationAmount) || Math.abs(applicationAmount - amount) > 0.01) {
    const error = new Error("The application price does not match Inclura's approved pricing."); error.status = 409; throw error;
  }
  return amount;
}


router.post("/initialize", limitPaymentVerification, async (req, res) => {
  try {
    const { decoded, userRecord } = await authenticatePaymentUser(req);
    const { purpose, plan, verificationId, txRef } = req.body || {};
    if (!["verification", "premium", "recruiter", "creator_verification"].includes(purpose)) {
      return unauthorized(res, 400, "Unsupported payment purpose.");
    }
    const reference = String(txRef || "");
    const id = String(verificationId || "");
    if (!/^[A-Za-z0-9_-]{8,120}$/.test(reference)) return unauthorized(res, 400, "A valid checkout reference is required.");
    if (purpose === "verification" && !/^[A-Za-z0-9_-]{10,150}$/.test(id)) {
      return unauthorized(res, 400, "A valid verification application is required.");
    }
    if (!process.env.FLW_SECRET_KEY) return unauthorized(res, 503, "Flutterwave is not configured on the server.");
    const database = firestore();
    let amount = 0;
    let currency = "NGN";
    let application = null;
    let normalizedPlan = String(plan || "").toLowerCase();

    if (purpose === "verification") {
      const applicationRef = database.collection("verificationRequests").doc(id);
      const applicationSnapshot = await applicationRef.get();
      if (!applicationSnapshot.exists) return unauthorized(res, 404, "Verification application not found.");
      application = applicationSnapshot.data();
      if (application.userId !== decoded.uid && application.submittedBy !== decoded.uid) return unauthorized(res, 403, "This application does not belong to your account.");
      if (application.paymentStatus === "paid" || application.status === "approved" || application.status === "rejected") return unauthorized(res, 409, "This application is not eligible for payment.");
      amount = resolveVerificationPrice(application);
      currency = "USD";
    } else if (purpose === "premium") {
      const tierMap = { silver: "SilverBadge", gold: "GoldBadge", platinum: "PlatinumBadge", enterprise: "EnterpriseBadge" };
      const pricingDocId = tierMap[normalizedPlan];
      if (!pricingDocId) return unauthorized(res, 400, "Invalid premium plan.");
      const pricingSnapshot = await database.collection("pricing").doc(pricingDocId).get();
      amount = Number(pricingSnapshot.data()?.price);
      if (!pricingSnapshot.exists || !Number.isFinite(amount) || amount <= 0) return unauthorized(res, 409, "This premium plan is not currently priced.");
    } else if (purpose === "recruiter") {
      const selected = RECRUITER_PLANS[normalizedPlan];
      if (!selected) return unauthorized(res, 400, "Invalid recruiter plan.");
      amount = selected.amount;
    } else {
      amount = Number(creator.verificationTypes.find((item) => item.id === "verified_creator")?.monthlyUSD || 0);
      currency = "USD";
      normalizedPlan = "verified_creator";
      if (!Number.isFinite(amount) || amount <= 0) return unauthorized(res, 409, "Creator verification is not currently priced.");
    }

    const pendingRef = database.collection("flutterwavePendingPayments").doc(reference);
    const pendingRecord = {
      txRef: reference, userId: decoded.uid,
      customerEmail: String(userRecord.email || "").trim().toLowerCase(),
      purpose, plan: normalizedPlan || null,
      verificationId: purpose === "verification" ? id : null,
      category: application?.category || null,
      verificationType: application?.verificationType || null,
      amount, currency, gateway: "flutterwave",
      paymentStatus: "pending", createdAt: new Date(),
    };
    await database.runTransaction(async (transaction) => {
      const existing = await transaction.get(pendingRef);
      if (existing.exists) {
        const prior = existing.data();
        if (prior.userId !== decoded.uid || prior.verificationId !== id || prior.paymentStatus !== "pending") throw new Error("This checkout reference has already been used.");
        return;
      }
      transaction.create(pendingRef, pendingRecord);
    });
    return res.status(200).json({ success: true, txRef: reference, amount, currency, email: pendingRecord.customerEmail });
  } catch (error) {
    const status = Number.isInteger(error.status) ? error.status : 500;
    if (status === 500) console.error("IFSE payment initialization failed:", error);
    return res.status(status).json({ success: false, message: status === 500 ? "Payment checkout could not be initialized." : error.message });
  }
});

router.post("/flutterwave/webhook", async (req, res) => {
  try {
    const configuredHash = process.env.FLW_SECRET_HASH || "";
    const receivedHash = String(req.headers["verif-hash"] || "");
    if (!configuredHash || !receivedHash) return res.status(401).json({ received: false });
    const expected = Buffer.from(configuredHash);
    const received = Buffer.from(receivedHash);
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return res.status(401).json({ received: false });

    const event = req.body || {};
    if (event.event !== "charge.completed") return res.status(200).json({ received: true, ignored: true });
    const transactionId = String(event.data?.id || "");
    const reference = String(event.data?.tx_ref || "");
    if (!/^\d{1,30}$/.test(transactionId) || !/^[A-Za-z0-9_-]{8,120}$/.test(reference)) return res.status(400).json({ received: false });
    if (!process.env.FLW_SECRET_KEY) return res.status(503).json({ received: false });

    const database = firestore();
    const pendingRef = database.collection("flutterwavePendingPayments").doc(reference);
    const pendingSnapshot = await pendingRef.get();
    if (!pendingSnapshot.exists) return res.status(404).json({ received: false });
    const pending = pendingSnapshot.data();
    if (pending.gateway !== "flutterwave") return res.status(409).json({ received: false });
    if (pending.gatewayTransactionId === transactionId && pending.gatewayConfirmation === "verified") return res.status(200).json({ received: true, duplicate: true });

    const verifyResponse = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`, Accept: "application/json" },
    });
    const verification = await verifyResponse.json().catch(() => ({}));
    const payment = verification.data || {};
    const matches = verifyResponse.ok && verification.status === "success" &&
      String(payment.id) === transactionId && payment.status === "successful" &&
      payment.tx_ref === reference &&
      String(payment.currency || "").toUpperCase() === String(pending.currency).toUpperCase() &&
      Number.isFinite(Number(payment.amount)) && Math.abs(Number(payment.amount) - Number(pending.amount)) <= 0.01 &&
      String(payment.customer?.email || "").trim().toLowerCase() === pending.customerEmail;
    if (!matches) return res.status(409).json({ received: false, message: "Transaction did not match the pending checkout." });

    if (!["verification", "premium", "recruiter", "creator_verification"].includes(pending.purpose) || !pending.userId) {
      return res.status(409).json({ received: false });
    }
    if (pending.purpose === "verification" && !pending.verificationId) {
      return res.status(409).json({ received: false });
    }

    const paymentRef = database.collection("flutterwavePayments").doc(transactionId);
    const applicationRef = pending.purpose === "verification"
      ? database.collection("verificationRequests").doc(pending.verificationId)
      : null;
    const verificationPaymentRef = database.collection("verificationPayments").doc(transactionId);
    const userRef = database.collection("users").doc(pending.userId);
    const securityEventRef = database.collection("ifsePaymentEvents").doc();
    const auditLogRef = database.collection("paymentAuditLogs").doc();
    const timelineRef = database.collection("paymentTimeline").doc();
    const now = new Date();

    await database.runTransaction(async (transaction) => {
      const [currentPending, existingPayment, applicationSnapshot] = await Promise.all([
        transaction.get(pendingRef),
        transaction.get(paymentRef),
        applicationRef ? transaction.get(applicationRef) : Promise.resolve(null),
      ]);
      if (!currentPending.exists || (applicationRef && !applicationSnapshot?.exists)) {
        throw new Error("Pending checkout or verification application no longer exists.");
      }
      const current = currentPending.data();
      const application = applicationSnapshot?.data();
      if (
        current.userId !== pending.userId ||
        current.txRef !== reference ||
        current.purpose !== pending.purpose ||
        String(current.plan || "") !== String(pending.plan || "") ||
        (current.paymentStatus === "paid" && current.transactionId !== transactionId)
      ) throw new Error("Pending checkout details changed before confirmation.");

      if (applicationRef && (
        (application.userId !== pending.userId && application.submittedBy !== pending.userId) ||
        application.category !== pending.category ||
        application.verificationType !== pending.verificationType ||
        Math.abs(Number(application.paymentAmount) - Number(pending.amount)) > 0.01 ||
        (application.paymentStatus === "paid" && application.paymentId !== transactionId) ||
        application.status === "approved" || application.status === "rejected"
      )) throw new Error("Pending checkout no longer matches its verification application.");

      if (existingPayment.exists) {
        const prior = existingPayment.data();
        const priorMatches = prior.userId === pending.userId &&
          prior.transactionId === transactionId && prior.txRef === reference &&
          prior.purpose === pending.purpose &&
          String(prior.plan || "") === String(pending.plan || "") &&
          String(prior.verificationId || "") === String(pending.verificationId || "") &&
          String(prior.category || "") === String(pending.category || "") &&
          String(prior.verificationType || "") === String(pending.verificationType || "") &&
          Number(prior.amount) === Number(payment.amount) &&
          String(prior.currency).toUpperCase() === String(payment.currency).toUpperCase() &&
          prior.paymentStatus === "paid" && prior.verifiedByServer === true;
        if (!priorMatches) throw new Error("Transaction already recorded with different payment details.");
      } else {
        transaction.create(paymentRef, {
          userId: pending.userId, transactionId, txRef: reference,
          purpose: pending.purpose, plan: pending.plan || null,
          verificationId: pending.verificationId || null,
          category: pending.category || null,
          verificationType: pending.verificationType || null,
          amount: Number(payment.amount), currency: String(payment.currency).toUpperCase(),
          paymentStatus: "paid", gateway: "flutterwave",
          verifiedByServer: true, createdAt: now,
        });

        if (pending.purpose === "premium") {
          const expiry = new Date(now);
          expiry.setMonth(expiry.getMonth() + 1);
          transaction.set(userRef, {
            premium: true, premiumActive: true, premiumTier: pending.plan,
            premiumStartedAt: now, premiumExpiryDate: expiry,
            premiumReference: reference, premiumTransactionId: transactionId,
          }, { merge: true });
        } else if (pending.purpose === "recruiter") {
          const expiry = new Date(now);
          expiry.setDate(expiry.getDate() + 30);
          const selected = RECRUITER_PLANS[pending.plan];
          if (!selected) throw new Error("Pending recruiter plan is not recognized.");
          transaction.set(userRef, {
            recruiter: {
              plan: pending.plan, status: "active", activatedAt: now,
              expiresAt: expiry, paymentReference: reference,
              transactionId, activeJobs: 0,
            },
          }, { merge: true });
        } else if (pending.purpose === "creator_verification") {
          transaction.set(userRef, {
            creatorVerificationPaymentStatus: "paid",
            creatorVerificationPaymentReference: reference,
            creatorVerificationPaymentTransactionId: transactionId,
            creatorVerificationPaymentAt: now,
          }, { merge: true });
        } else {
          transaction.create(verificationPaymentRef, {
            userId: pending.userId, verificationId: pending.verificationId,
            category: pending.category, verificationType: pending.verificationType,
            transactionId, flutterwaveReference: reference,
            amount: Number(payment.amount), currency: String(payment.currency).toUpperCase(),
            paymentStatus: "paid", status: "completed", verifiedByServer: true,
            paymentMethod: "Flutterwave", createdAt: now, updatedAt: now,
          });
          transaction.create(securityEventRef, {
            paymentId: transactionId, transactionId,
            eventType: "verification_payment_server_verified",
            riskScore: 0, threatLevel: "Low", requiresExecutiveApproval: true,
            reviewed: false, createdAt: now,
          });
          transaction.create(auditLogRef, {
            paymentId: transactionId, transactionId,
            action: "Flutterwave webhook payment verified by IFSE",
            actor: "flutterwave_webhook", createdAt: now,
          });
          transaction.create(timelineRef, {
            paymentId: transactionId, transactionId,
            title: "Payment confirmed by Flutterwave",
            status: "Completed", createdAt: now,
          });
        }
      }

      if (pending.purpose === "verification") {
        transaction.update(applicationRef, {
          paymentStatus: "paid", paymentId: transactionId, updatedAt: now,
        });
      }
      transaction.update(pendingRef, {
        paymentStatus: "paid", gatewayConfirmation: "verified",
        gatewayTransactionId: transactionId, transactionId,
        verifiedByServer: true, paidAt: now,
      });
    });
    return res.status(200).json({ received: true, verified: true });
  } catch (error) {
    console.error("Flutterwave webhook processing failed:", error);
    return res.status(500).json({ received: false });
  }
});



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
    if (
      purpose === "verification" &&
      !["Credit Card", "Debit Card", "Bank Transfer", "USSD"].includes(String(paymentMethod || ""))
    ) {
      return unauthorized(res, 400, "Select a supported verification payment method.");
    }

    const database = firestore();
    const pendingPaymentRef = database.collection("flutterwavePendingPayments").doc(reference);
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
      const pendingSnapshot = await transaction.get(pendingPaymentRef);
      if (!pendingSnapshot.exists) throw new Error("No server-created pending checkout matches this reference.");
      const pending = pendingSnapshot.data();
      if (
        pending.userId !== decoded.uid || pending.purpose !== purpose ||
        String(pending.plan || "") !== String(plan || "") ||
        String(pending.verificationId || "") !== String(verificationId || "") ||
        (pending.paymentStatus !== "pending" &&
          !(pending.paymentStatus === "paid" && pending.transactionId === numericTransactionId)) ||
        Number(pending.amount) !== expectedAmount ||
        String(pending.currency).toUpperCase() !== expectedCurrency
      ) throw new Error("The pending checkout does not match this account or purchase.");
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
          String(prior.category || "") === String(verificationSnapshot?.data()?.category || "") &&
          String(prior.verificationType || "") === String(verificationSnapshot?.data()?.verificationType || "") &&
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
        if (
          currentData.category !== application.category ||
          currentData.verificationType !== application.verificationType ||
          Number(currentData.paymentAmount) !== Number(application.paymentAmount)
        ) {
          throw new Error("The verification application changed during payment verification. Please restart checkout.");
        }
      }

      const paymentRecord = {
        userId: decoded.uid,
        transactionId: numericTransactionId,
        txRef: reference,
        purpose,
        plan: plan || null,
        verificationId: verificationId || null,
        category: verificationSnapshot?.data()?.category || null,
        verificationType: verificationSnapshot?.data()?.verificationType || null,
        amount: paidAmount,
        currency: paidCurrency,
        paymentStatus: "paid",
        gateway: "flutterwave",
        verifiedByServer: true,
        createdAt: now,
      };
      transaction.create(paymentRef, paymentRecord);
      transaction.update(pendingPaymentRef, {
        paymentStatus: "paid", transactionId: numericTransactionId,
        paidAt: now, verifiedByServer: true,
      });

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
