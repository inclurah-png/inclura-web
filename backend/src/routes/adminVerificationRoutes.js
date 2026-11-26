import express from "express";
import { auth, firestore } from "../config/firebaseAdmin.js";
import creator from "../../../src/config/pricing/creator.js";

const router = express.Router();

async function requireAdmin(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) return res.status(401).json({ success: false, message: "Authentication required." });
    const decoded = await auth().verifyIdToken(match[1], true);
    if (decoded.email_verified !== true) {
      return res.status(403).json({ success: false, message: "A verified administrator account is required." });
    }
    const adminRecord = await auth().getUser(decoded.uid);
    if (adminRecord.disabled) {
      return res.status(403).json({ success: false, message: "This administrator account is disabled." });
    }
    if (decoded.admin !== true) {
      return res.status(403).json({ success: false, message: "Administrator access required." });
    }
    req.adminUid = decoded.uid;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "A valid administrator session is required." });
  }
}

router.use(requireAdmin);

router.post("/creators/:userId/approve", async (req, res) => {
  try {
    const userId = String(req.params.userId || "");
    if (!/^[A-Za-z0-9_-]{5,128}$/.test(userId)) {
      return res.status(400).json({ success: false, message: "Invalid creator account." });
    }

    const expectedAmount = Number(
      creator.verificationTypes.find((item) => item.id === "verified_creator")?.monthlyUSD || 0
    );
    if (!Number.isFinite(expectedAmount) || expectedAmount <= 0) {
      return res.status(503).json({ success: false, message: "Creator verification pricing is not configured." });
    }

    const db = firestore();
    const userRef = db.collection("users").doc(userId);
    const auditRef = db.collection("creatorVerificationAuditLogs").doc();
    const securityRef = db.collection("ifseSecurityEvents").doc();

    await db.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);
      if (!userSnap.exists) throw new Error("Creator account not found.");
      const user = userSnap.data() || {};
      if (user.creatorVerified === true) {
        throw new Error("This creator account is already verified.");
      }
      if (user.creatorVerificationPaymentStatus !== "paid") {
        throw new Error("A server-confirmed creator verification payment is required.");
      }

      const paymentId = String(user.creatorVerificationPaymentTransactionId || "");
      const paymentReference = String(user.creatorVerificationPaymentReference || "");
      if (!/^\d{1,30}$/.test(paymentId) || !paymentReference) {
        throw new Error("The creator payment reference is missing or invalid.");
      }

      const paymentRef = db.collection("flutterwavePayments").doc(paymentId);
      const paymentSnap = await tx.get(paymentRef);
      if (!paymentSnap.exists) {
        throw new Error("The server-verified creator payment record was not found.");
      }
      const payment = paymentSnap.data() || {};
      if (
        payment.userId !== userId ||
        payment.transactionId !== paymentId ||
        payment.txRef !== paymentReference ||
        payment.purpose !== "creator_verification" ||
        payment.paymentStatus !== "paid" ||
        payment.verifiedByServer !== true ||
        String(payment.currency || "").toUpperCase() !== "USD" ||
        !Number.isFinite(Number(payment.amount)) ||
        Math.abs(Number(payment.amount) - expectedAmount) > 0.01
      ) {
        throw new Error("The creator payment record does not match the approved fee and account.");
      }

      const now = new Date();
      tx.update(userRef, {
        creatorVerified: true,
        creatorVerificationStatus: "approved",
        creatorVerifiedAt: now,
        creatorVerificationReviewedAt: now,
        creatorVerificationApprovedBy: req.adminUid,
        badgeType: "creator",
      });
      tx.create(auditRef, {
        userId,
        paymentId,
        action: "Creator Verification Approved",
        performedBy: req.adminUid,
        createdAt: now,
      });
      tx.create(securityRef, {
        userId,
        paymentId,
        eventType: "creator_verification_approved",
        source: "admin_review",
        reviewed: true,
        resolved: true,
        reviewedBy: req.adminUid,
        createdAt: now,
      });
    });

    return res.json({ success: true, message: "Creator verification approved after payment and administrator review." });
  } catch (error) {
    const status = /not found/i.test(error.message) ? 404 :
      /already verified|payment|required|reference|record|approved fee/i.test(error.message) ? 409 : 500;
    return res.status(status).json({ success: false, message: error.message || "Creator approval failed." });
  }
});

router.post("/verification/:verificationId/approve", async (req, res) => {
  try {
    const id = String(req.params.verificationId || "");
    if (!/^[A-Za-z0-9_-]{10,150}$/.test(id)) {
      return res.status(400).json({ success: false, message: "Invalid verification application." });
    }
    const db = firestore();
    const requestRef = db.collection("verificationRequests").doc(id);
    const badgeRef = db.collection("verificationBadges").doc(id);
    const certificateRef = db.collection("verificationCertificates").doc(id);
    const timelineRef = db.collection("verificationTimeline").doc();
    const auditRef = db.collection("verificationAuditLogs").doc();
    const securityRef = db.collection("ifseSecurityEvents").doc();

    await db.runTransaction(async (tx) => {
      const requestSnap = await tx.get(requestRef);
      if (!requestSnap.exists) throw new Error("Verification application not found.");
      const application = requestSnap.data();
      if (application.paymentStatus !== "paid") {
        throw new Error("Payment must be confirmed before verification can be approved.");
      }
      if (application.status === "approved" || application.status === "rejected") {
        throw new Error("This application has already been closed.");
      }
      const userId = String(application.userId || application.submittedBy || "");
      if (!userId) throw new Error("The application has no valid member account.");
      const paymentId = String(application.paymentId || "");
      if (!/^\d{1,30}$/.test(paymentId)) {
        throw new Error("A server-verified payment record is required before approval.");
      }
      const paymentRef = db.collection("verificationPayments").doc(paymentId);
      const paymentSnap = await tx.get(paymentRef);
      if (!paymentSnap.exists) {
        throw new Error("The server-verified payment record could not be found.");
      }
      const payment = paymentSnap.data();
      if (
        payment.userId !== userId ||
        payment.verificationId !== id ||
        payment.transactionId !== paymentId ||
        payment.paymentStatus !== "paid" ||
        payment.verifiedByServer !== true ||
        String(payment.currency || "").toUpperCase() !== "USD" ||
        !Number.isFinite(Number(payment.amount)) ||
        !Number.isFinite(Number(application.paymentAmount)) ||
        Number(application.paymentAmount) <= 0 ||
        Math.abs(Number(payment.amount) - Number(application.paymentAmount)) > 0.01 ||
        payment.category !== application.category ||
        payment.verificationType !== application.verificationType
      ) {
        throw new Error("The payment record does not match this verification application.");
      }
      const userRef = db.collection("users").doc(userId);
      const [userSnap, badgeSnap, certificateSnap] = await Promise.all([
        tx.get(userRef),
        tx.get(badgeRef),
        tx.get(certificateRef),
      ]);
      if (!userSnap.exists) throw new Error("Applicant account not found.");
      if (badgeSnap.exists && (badgeSnap.data().verificationId !== id || badgeSnap.data().userId !== userId)) {
        throw new Error("A conflicting verification badge record already exists.");
      }
      if (certificateSnap.exists && (certificateSnap.data().verificationId !== id || certificateSnap.data().userId !== userId)) {
        throw new Error("A conflicting verification certificate record already exists.");
      }

      const now = new Date();
      const certificateNumber = "INC-" + id.slice(-12).toUpperCase();

      tx.update(requestRef, {
        status: "approved",
        verificationActive: true,
        ifseDecision: "Administrator Approved",
        ifseFinalScore: null,
        ifseScoreSource: "not_server_verified",
        approvedAt: now,
        approvedBy: req.adminUid,
        updatedAt: now,
      });
      tx.set(userRef, {
        verified: true,
        verificationStatus: "approved",
        verificationActive: true,
        verificationCategory: application.category || "",
        verificationType: application.verificationType || "",
        badgeType: application.accountType || "",
        verificationBadgeId: id,
        verificationCertificateId: id,
        verifiedAt: now,
        lastVerificationUpdate: now,
      }, { merge: true });
      const badgeData = {
        verificationId: id,
        userId,
        badgeType: application.accountType || "",
        verificationType: application.verificationType || "",
        category: application.category || "",
        issuedAt: now,
        active: true,
      };
      if (badgeSnap.exists) tx.set(badgeRef, badgeData, { merge: true });
      else tx.create(badgeRef, badgeData);

      const certificateData = {
        verificationId: id,
        userId,
        certificateNumber: certificateSnap.data()?.certificateNumber || certificateNumber,
        issuedAt: now,
        status: "active",
      };
      if (certificateSnap.exists) tx.set(certificateRef, certificateData, { merge: true });
      else tx.create(certificateRef, certificateData);
      tx.create(timelineRef, {
        verificationId: id,
        title: "Executive Approval",
        status: "Completed",
        description: "Verification approved by an authorized administrator.",
        createdBy: req.adminUid,
        createdAt: now,
      });
      tx.create(auditRef, {
        verificationId: id,
        action: "Verification Approved",
        performedBy: req.adminUid,
        createdAt: now,
      });
      tx.create(securityRef, {
        verificationId: id,
        eventType: "Verification Approved",
        threatLevel: "MANUAL_REVIEW",
        riskScore: null,
        scoreSource: "not_server_verified",
        resolved: true,
        createdAt: now,
      });
    });

    return res.json({ success: true, message: "Verification approved and records issued." });
  } catch (error) {
    const status = /verification application not found|applicant account not found/i.test(error.message) ? 404 :
      /payment|already been closed|conflicting verification/i.test(error.message) ? 409 : 500;
    return res.status(status).json({ success: false, message: error.message || "Approval failed." });
  }
});

router.post("/verification/:verificationId/reject", async (req, res) => {
  try {
    const id = String(req.params.verificationId || "");
    const reason = String(req.body?.reason || "").trim();
    if (!/^[A-Za-z0-9_-]{10,150}$/.test(id)) {
      return res.status(400).json({ success: false, message: "Invalid verification application." });
    }
    if (reason.length < 5 || reason.length > 1000) {
      return res.status(400).json({ success: false, message: "Provide a rejection reason between 5 and 1000 characters." });
    }
    const db = firestore();
    const requestRef = db.collection("verificationRequests").doc(id);
    const timelineRef = db.collection("verificationTimeline").doc();
    const auditRef = db.collection("verificationAuditLogs").doc();
    const securityRef = db.collection("ifseSecurityEvents").doc();
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(requestRef);
      if (!snap.exists) throw new Error("Verification application not found.");
      const data = snap.data();
      if (data.status === "approved" || data.status === "rejected") {
        throw new Error("This application has already been closed.");
      }
      const now = new Date();
      tx.update(requestRef, {
        status: "rejected",
        verificationActive: false,
        rejectionReason: reason,
        rejectedAt: now,
        rejectedBy: req.adminUid,
        updatedAt: now,
      });
      tx.create(timelineRef, {
        verificationId: id,
        title: "Verification Rejected",
        status: "Completed",
        description: "Verification application rejected by an authorized administrator.",
        createdBy: req.adminUid,
        createdAt: now,
      });
      tx.create(auditRef, {
        verificationId: id,
        action: "Verification Rejected",
        rejectionReason: reason,
        performedBy: req.adminUid,
        createdAt: now,
      });
      tx.create(securityRef, {
        verificationId: id,
        eventType: "Verification Rejected",
        threatLevel: "MEDIUM",
        riskScore: 50,
        resolved: true,
        rejectionReason: reason,
        createdAt: now,
      });
    });
    return res.json({ success: true, message: "Verification application rejected." });
  } catch (error) {
    const status = /not found/i.test(error.message) ? 404 :
      /already been closed/i.test(error.message) ? 409 : 500;
    return res.status(status).json({ success: false, message: error.message || "Rejection failed." });
  }
});

export default router;
