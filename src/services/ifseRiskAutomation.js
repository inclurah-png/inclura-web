import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

const COLLECTIONS = {
  verificationRequests: "verificationRequests",
  verificationPayments: "verificationPayments",
  ifseSecurityEvents: "ifseSecurityEvents",
  verificationAuditLogs: "verificationAuditLogs",
};

const RISK_WEIGHTS = {
  duplicateIdentity: 40,
  duplicateEmail: 35,
  duplicatePhone: 30,

  suspiciousCountry: 20,

  missingDocuments: 25,

  fakeDocument: 60,

  failedPayment: 30,

  multipleRejectedAttempts: 40,

  executiveReviewThreshold: 70,
};

const HIGH_RISK_COUNTRIES = [
  "Unknown",
];

function clampRisk(score) {
  return Math.max(0, Math.min(score, 100));
}

function determineThreatLevel(score) {
  if (score >= 80) return "CRITICAL";

  if (score >= 60) return "HIGH";

  if (score >= 35) return "MEDIUM";

  return "LOW";
}

export async function calculateIFSERisk(request) {

  let score = 0;

  const reasons = [];

  const email =
    request.email ||
    request.officialEmail ||
    "";

  const phone =
    request.phoneNumber ||
    request.phone ||
    "";

  const identity =
    request.identityNumber ||
    request.nationalId ||
    request.passportNumber ||
    "";

  const country =
    request.country ||
    "Unknown";
    if (email) {

    const emailQuery = query(
      collection(
        db,
        COLLECTIONS.verificationRequests
      ),
      where("email", "==", email)
    );

    const emailSnapshot =
      await getDocs(emailQuery);

    if (emailSnapshot.size > 1) {

      score +=
        RISK_WEIGHTS.duplicateEmail;

      reasons.push(
        "Duplicate email detected"
      );

    }

  }

  if (phone) {

    const phoneQuery = query(
      collection(
        db,
        COLLECTIONS.verificationRequests
      ),
      where("phoneNumber", "==", phone)
    );

    const phoneSnapshot =
      await getDocs(phoneQuery);

    if (phoneSnapshot.size > 1) {

      score +=
        RISK_WEIGHTS.duplicatePhone;

      reasons.push(
        "Duplicate phone number detected"
      );

    }

  }

  if (identity) {

    const identityQuery = query(
      collection(
        db,
        COLLECTIONS.verificationRequests
      ),
      where(
        "identityNumber",
        "==",
        identity
      )
    );

    const identitySnapshot =
      await getDocs(identityQuery);

    if (identitySnapshot.size > 1) {

      score +=
        RISK_WEIGHTS.duplicateIdentity;

      reasons.push(
        "Duplicate identity detected"
      );

    }

  }

  if (request.userId) {

    const rejectedQuery = query(
      collection(
        db,
        COLLECTIONS.verificationRequests
      ),
      where("userId", "==", request.userId),
      where("status", "==", "rejected")
    );

    const rejectedSnapshot =
      await getDocs(rejectedQuery);

    if (rejectedSnapshot.size >= 3) {

      score +=
        RISK_WEIGHTS.multipleRejectedAttempts;

      reasons.push(
        "Multiple rejected verification attempts"
      );

    }

  }

  if (request.userId) {

    const paymentQuery = query(
      collection(
        db,
        COLLECTIONS.verificationPayments
      ),
      where("userId", "==", request.userId),
      where("status", "==", "failed")
    );

    const paymentSnapshot =
      await getDocs(paymentQuery);

    if (paymentSnapshot.size > 0) {

      score +=
        RISK_WEIGHTS.failedPayment;

      reasons.push(
        "Previous verification payment failed"
      );

    }

  }

  if (
    !request.documents ||
    request.documents.length === 0
  ) {

    score +=
      RISK_WEIGHTS.missingDocuments;

    reasons.push(
      "Required verification documents missing"
    );

  }

  if (
    request.documentIntegrity === false
  ) {

    score +=
      RISK_WEIGHTS.fakeDocument;

    reasons.push(
      "Document integrity validation failed"
    );

  }

  if (
    HIGH_RISK_COUNTRIES.includes(country)
  ) {

    score +=
      RISK_WEIGHTS.suspiciousCountry;

    reasons.push(
      "Suspicious verification location"
    );

  }

  const riskScore = clampRisk(score);

  const threatLevel =
    determineThreatLevel(riskScore);

  const executiveReview =
    riskScore >=
    RISK_WEIGHTS.executiveReviewThreshold;

  await addDoc(
    collection(
      db,
      COLLECTIONS.ifseSecurityEvents
    ),
    {
      userId: request.userId || null,

      verificationId:
        request.id || null,

      verificationCategory:
        request.category || null,

      riskScore,

      threatLevel,

      executiveReview,

      reasons,

      reviewed: false,

      resolved: false,

      createdAt:
        serverTimestamp(),
    }
  );

  return {
    riskScore,
    threatLevel,
    executiveReview,
    reasons,
  };

}
