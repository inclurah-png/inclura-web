import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import { VERIFICATION_PLANS } from "../config";

function VerificationApplication() {

  const navigate = useNavigate();
  const { t } = useTranslation();

  const categories = useMemo(
    () => Object.keys(VERIFICATION_PLANS),
    []
  );

  const [category, setCategory] =
    useState(categories[0]);

  const [verificationType, setVerificationType] =
    useState("");

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [organizationName, setOrganizationName] =
    useState("");

  const [website, setWebsite] =
    useState("");

  const [socialLink1, setSocialLink1] =
    useState("");

  const [socialLink2, setSocialLink2] =
    useState("");

  const [officialEmail, setOfficialEmail] =
    useState("");

  const selectedCategory =
    VERIFICATION_PLANS[category];

  const verificationTypes =
    selectedCategory?.verificationTypes || selectedCategory?.certification || [];

  useEffect(() => {
if (verificationTypes?.length > 0) {
  setVerificationType(verificationTypes[0].id);
}
  }, [category, verificationTypes]);

  const selectedVerification =
    verificationTypes.find(
      (item) =>
        item.id === verificationType
    );

  const paymentAmount =
    selectedVerification?.monthlyUSD ??
    selectedVerification?.yearlyUSD ??
    selectedVerification?.contractUSD ??
    0;

  const paymentFrequency =
    selectedVerification?.monthlyUSD
      ? t("vaMonthly")
      : selectedVerification?.yearlyUSD
      ? t("vaYearly")
      : t("vaOneTime");

  const isEnterprise =
  selectedVerification?.enterprise === true;

const requiresContract =
  selectedVerification?.contractRequired === true && paymentAmount === 0;

const contractRoute =
  selectedVerification?.redirect ||
  (category === "organization" ? "/corporate-partnership" : "/enterprise-partnership");

async function handleContinue() {
  const user = auth.currentUser;

  if (!user) {
    alert(t("vaLoginFirst"));
    return;
  }

  if (!fullName.trim()) {
    alert(t("vaEnterName"));
    return;
  }

  if (!email.trim()) {
    alert(t("vaEnterEmail"));
    return;
  }

  if (!phone.trim()) {
    alert(t("vaEnterPhone"));
    return;
  }

  if (!verificationType) {
    alert(t("vaSelectType"));
    return;
  }

  // Enterprise and negotiated corporate contracts use their dedicated
  // partnership workflow. Do not create an unpriced payment request.
  if (requiresContract || isEnterprise) {
    navigate(contractRoute, {
      state: {
        source: "verification-application",
        category,
        verificationType,
        fullName,
        email,
        phone,
        organizationName,
        website,
        officialEmail,
      },
    });
    return;
  }

  if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
    alert("This verification option has no published fee. Please select a priced verification type or use the relevant partnership application for a negotiated quote.");
    return;
  }

  try {
    // Identity, document, fraud and accessibility checks have not yet been
    // completed by a trusted server or authorized reviewer. Do not issue a
    // client-generated approval, score or badge.
    const ifseResult = {
      status: "PENDING_SERVER_REVIEW",
      message: "Awaiting server-side verification and authorized administrator review.",
      badge: false,
      executiveReview: true,
    };
    // ==========================================
    // CREATE VERIFICATION REQUEST
    // ==========================================

    const verificationRef = await addDoc(
      collection(db, "verificationRequests"),
      {
        // ========================================
        // USER IDENTITY
        // ========================================

        userId: user.uid,

        // Required for VerificationCenter history
        submittedBy: user.uid,

        // ========================================
        // APPLICATION INFORMATION
        // ========================================

        category,

        verificationType,

        accountType: category,

        fullName,

        email,

        phone,

        organizationName,

        website,

        socialLink1,

        socialLink2,

        officialEmail,

        // ========================================
        // PAYMENT
        // ========================================

        paymentAmount,

        paymentStatus:
          paymentAmount > 0
            ? "pending"
            : "free",

        // ========================================
        // VERIFICATION WORKFLOW
        // ========================================

        status: "pending",

        // ========================================
        // IFSE SCREENING RESULT
        // ========================================

        ifseScore: null,
        ifseScoreSource: "not_server_verified",
        ifseStatus: ifseResult.status,
        ifseMessage: ifseResult.message,
        ifseBadge: false,
        executiveReview: true,

        // ========================================
        // NORMALIZED IFSE FIELDS
        // Used by VerificationCenter
        // ========================================

        riskScore: null,
        riskScoreSource: "not_server_verified",
        threatLevel: "UNASSESSED",
        executiveReviewRequired: true,

        // ========================================
        // ENTERPRISE
        // ========================================

        enterprise:
          isEnterprise,

        // ========================================
        // DOCUMENT
        // ========================================

        // Actual storage URL will be added
        // by the document workflow.
        documentUrl: "",

        // File selection is NOT authentication.
        documentVerified: false,

        // ========================================
        // APPLICATION METADATA
        // ========================================

        note:
          "Verification request submitted from Inclura Verification Center.",

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      }
    );

    // ==========================================
    // VERIFICATION TIMELINE
    // ==========================================

    await addDoc(
      collection(db, "verificationTimeline"),
      {
        verificationId:
          verificationRef.id,

        title:
          "Application Submitted",

        status:
          "Completed",

        description:
          "Verification application successfully submitted and entered into the IFSE verification workflow.",

        createdBy:
          user.uid,

        createdAt:
          serverTimestamp(),
      }
    );

    // ==========================================
    // VERIFICATION AUDIT LOG
    // ==========================================

    await addDoc(
      collection(db, "verificationAuditLogs"),
      {
        verificationId:
          verificationRef.id,

        action:
          "Verification application submitted",

        performedBy:
          user.uid,

        category,

        verificationType,

        createdAt:
          serverTimestamp(),
      }
    );

    // ==========================================
    // IFSE SECURITY EVENT
    // ==========================================

    await addDoc(
      collection(db, "ifseSecurityEvents"),
      {
        verificationId:
          verificationRef.id,

        eventType:
          "Application Received",

        assessmentStatus: "pending_server_review",

        // The security lifecycle is not finished
        // simply because the application was received.
        resolved: false,

        createdAt:
          serverTimestamp(),
      }
    );

    // ==========================================
    // ROUTING
    // ==========================================

    // Corporate / contract-required verification
    if (requiresContract) {
      navigate(contractRoute, {
        state: {
          verificationId:
            verificationRef.id,
        },
      });

      return;
    }

    // Paid verification
    if (paymentAmount > 0) {
      navigate(
        "/verification-payment",
        {
          state: {
            verificationId: verificationRef.id,
            verificationType,
            category,
            paymentAmount,
          },
        }
      );

      return;
    }

    throw new Error("This verification option requires a published payment fee or an approved partnership contract.");

  } catch (error) {
    console.error(
      "Verification Application Error:",
      error
    );

    alert(
      t("vaSubmitError")
    );
  }
}
  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "16px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "white",
  };

  return (
    <DashboardLayout>
      <div
        style={{
          background: "#0f172a",
          padding: "24px",
          borderRadius: "20px",
          color: "white",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h1>{t("vaTitle")}</h1>

        <p>
          {t("vaIntro")}
        </p>
                <label>
          {t("vaCategory")}
        </label>

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          style={inputStyle}
        >
          {categories.map((key) => (
            <option
              key={key}
              value={key}
            >
              {
                t(`vaCategory_${key}`, { defaultValue: VERIFICATION_PLANS[key]?.title })
              }
            </option>
          ))}
        </select>

        <label>
          {t("vaTypeLabel")}
        </label>

        <select
          value={verificationType}
          onChange={(e) =>
            setVerificationType(
              e.target.value
            )
          }
          style={inputStyle}
        >
          {verificationTypes.map(
            (item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {t(`vaType_${item.id}`, { defaultValue: item.name })}
              </option>
            )
          )}
        </select>

        <label>
          {t("fullName")}
        </label>

        <input
          type="text"
          value={fullName}
          onChange={(e) =>
            setFullName(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <label>
          {t("email")}
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <label>
          {t("vaPhone")}
        </label>

        <input
          type="text"
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <label>
          {t("vaOrganization")}
        </label>

        <input
          type="text"
          value={organizationName}
          onChange={(e) =>
            setOrganizationName(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <label>
          {t("vaWebsite")}
        </label>

        <input
          type="text"
          value={website}
          onChange={(e) =>
            setWebsite(
              e.target.value
            )
          }
          style={inputStyle}
        />
                {category === "creator" && (
          <>
            <label>
              {t("vaPrimarySocial")}
            </label>

            <input
              type="text"
              value={socialLink1}
              onChange={(e) =>
                setSocialLink1(
                  e.target.value
                )
              }
              style={inputStyle}
              placeholder={t("vaUrlPlaceholder")}
            />

            <label>
              {t("vaSecondarySocial")}
            </label>

            <input
              type="text"
              value={socialLink2}
              onChange={(e) =>
                setSocialLink2(
                  e.target.value
                )
              }
              style={inputStyle}
              placeholder="https://..."
            />
          </>
        )}

        {category === "government" && (
          <>
            <div
              style={{
                background: "#14532d",
                color: "white",
                padding: "14px",
                borderRadius: "12px",
                marginBottom: "18px",
                fontWeight: "600",
              }}
            >
              🏛 {t("vaGovernmentNotice")}
            </div>

            <label>
              {t("vaOfficialEmail")}
            </label>

            <input
              type="email"
              value={officialEmail}
              onChange={(e) =>
                setOfficialEmail(
                  e.target.value
                )
              }
              style={inputStyle}
              placeholder="agency@gov.ng"
            />
          </>
        )}

        <div
          role="note"
          style={{
            marginTop: "10px",
            marginBottom: "24px",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "#1e293b",
            color: "#e2e8f0",
            lineHeight: 1.5,
          }}
        >
          {t("vaUploadSupportingNotice")}
        </div>

<div
  style={{
    background: "#1e293b",
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "24px",
  }}
>
  <h3>{t("vaFee")}</h3>

  {requiresContract ? (
    <p>
      <strong>{t("vaContractRequired")}</strong>
      <br />
      {t("vaContractDescription")}
    </p>
  ) : isEnterprise ? (
    <p>
      <strong>{t("vaEnterprisePricing")}</strong>
      <br />
      {t("vaEnterpriseQuote")}
    </p>
  ) : (
    <>
      <p
        style={{
          fontSize: "26px",
          fontWeight: "700",
          marginBottom: "6px",
        }}
      >
        ${Number(paymentAmount || 0).toLocaleString()}
      </p>

      <p
        style={{
          color: "#94a3b8",
          fontSize: "15px",
          fontWeight: "600",
        }}
      >
        {paymentFrequency} {t("vaSubscription")}
      </p>
    </>
  )}
</div>
        
                <button
          onClick={handleContinue}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            border: "none",
            background: "#38bdf8",
            color: "white",
            fontSize: "18px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
{requiresContract
  ? t("vaContinueCorporate")
  : isEnterprise
  ? t("vaSubmitPartnership")
  : paymentAmount > 0
  ? t("vaContinuePayment")
  : t("vaSubmitRequest")}
        </button>
      </div>
    </DashboardLayout>
  );
}

export default VerificationApplication;
