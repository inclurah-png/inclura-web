import express from "express";
import { auth, firestore } from "../config/firebaseAdmin.js";

const router = express.Router();

async function requireAdmin(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) return res.status(401).json({ success: false, message: "Authentication required." });
    const decoded = await auth().verifyIdToken(match[1], true);
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

      const trustScore = Math.max(0, Math.min(100,
        Number(application.ifseScore ?? application.ifseTrustScore ?? 0) || 0
      ));
      const riskScore = Math.max(0, Math.min(100,
        Number(application.riskScore ?? (100 - trustScore)) || 0
      ));
      const threatLevel = riskScore >= 80 ? "CRITICAL" :
        riskScore >= 60 ? "HIGH" : riskScore >= 35 ? "MEDIUM" : "LOW";
      const now = new Date();
      const certificateNumber = "INC-" + id.slice(-12).toUpperCase();

      tx.update(requestRef, {
        status: "approved",
        verificationActive: true,
        ifseDecision: "Administrator Approved",
        ifseFinalScore: trustScore,
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
        ifseStatus: application.ifseStatus || "",
        ifseScore: trustScore,
        ifseBadge: application.ifseBadge || "",
        executiveReview: application.executiveReview === true,
        verifiedAt: now,
        lastVerificationUpdate: now,
      }, { merge: true });
      if (!badgeSnap.exists) {
        tx.create(badgeRef, {
          verificationId: id,
          userId,
          badgeType: application.accountType || "",
          verificationType: application.verificationType || "",
          category: application.category || "",
          issuedAt: now,
          active: true,
        });
      }
      if (!certificateSnap.exists) {
        tx.create(certificateRef, {
          verificationId: id,
          userId,
          certificateNumber,
          issuedAt: now,
          status: "active",
        });
      }
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
        threatLevel,
        riskScore,
        resolved: true,
        createdAt: now,
      });
    });

    return res.json({ success: true, message: "Verification approved and records issued." });
  } catch (error) {
    const status = /not found/i.test(error.message) ? 404 :
      /payment must|already been closed/i.test(error.message) ? 409 : 500;
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
