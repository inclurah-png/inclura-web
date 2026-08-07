import { processVerification } from "../utils/processVerification";
import { useState, useMemo, useEffect } from "react";

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

  const [documentFile, setDocumentFile] =
    useState(null);

  const selectedCategory =
    VERIFICATION_PLANS[category];

  const verificationTypes =
    selectedCategory?.verificationTypes || [];

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
  0;

const paymentFrequency =
  selectedVerification?.monthlyUSD
    ? "Monthly"
    : selectedVerification?.yearlyUSD
    ? "Yearly"
    : "One Time";

  const isEnterprise =
  selectedVerification?.enterprise === true;

const requiresContract =
  selectedVerification?.contractRequired === true;

const contractRoute =
  selectedVerification?.redirect || "";
    async function handleContinue() {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (!fullName.trim()) {
      alert("Enter your full name.");
      return;
    }

    if (!email.trim()) {
      alert("Enter your email.");
      return;
    }

    if (!phone.trim()) {
      alert("Enter your phone number.");
      return;
    }

    try {
      const ifseResult = processVerification({

  identityVerified: !!fullName && !!email && !!phone,

  documentVerified: !!documentFile,

  duplicateChecked: true,

  fraudChecked: true,

  businessValidated: !!organizationName,

  governmentValidated: category === "government",

  accessibilityValidated: true,

  paymentVerified: paymentAmount === 0,

});
      const verificationRef = await addDoc(
  collection(
    db,
    "verificationRequests"
  ),
  {
          userId: user.uid,

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

          paymentAmount,

          paymentStatus:
            paymentAmount > 0
              ? "pending"
              : "free",

          status: "pending",

          ifseScore: ifseResult.score,

ifseStatus: ifseResult.status,

ifseMessage: ifseResult.message,

ifseBadge: ifseResult.badge,

executiveReview: ifseResult.executiveReview,

          enterprise:
            isEnterprise,

          documentName:
            documentFile
              ? documentFile.name
              : "",

async function handleContinue() {
  const user = auth.currentUser;

  if (!user) {
    alert("Please login first.");
    return;
  }

  if (!fullName.trim()) {
    alert("Enter your full name.");
    return;
  }

  if (!email.trim()) {
    alert("Enter your email.");
    return;
  }

  if (!phone.trim()) {
    alert("Enter your phone number.");
    return;
  }

  if (!verificationType) {
    alert("Select a verification type.");
    return;
  }

  try {
    const ifseResult = processVerification({
      identityVerified:
        !!fullName.trim() &&
        !!email.trim() &&
        !!phone.trim(),

      // Selecting a document does NOT mean
      // the document has already been authenticated.
      documentVerified: false,

      duplicateChecked: true,

      fraudChecked: true,

      businessValidated:
        category === "creator"
          ? true
          : !!organizationName.trim(),

      governmentValidated:
        category === "government",

      accessibilityValidated: true,

      paymentVerified:
        paymentAmount === 0,
    });

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

        ifseScore:
          ifseResult.score || 0,

        ifseStatus:
          ifseResult.status || "PENDING",

        ifseMessage:
          ifseResult.message || "",

        ifseBadge:
          ifseResult.badge || "",

        executiveReview:
          !!ifseResult.executiveReview,

        // ========================================
        // NORMALIZED IFSE FIELDS
        // Used by VerificationCenter
        // ========================================

        riskScore:
          ifseResult.score || 0,

        threatLevel:
          ifseResult.status === "REJECTED"
            ? "High"
            : "Low",

        executiveReviewRequired:
          !!ifseResult.executiveReview,

        // ========================================
        // ENTERPRISE
        // ========================================

        enterprise:
          isEnterprise,

        // ========================================
        // DOCUMENT
        // ========================================

        documentName:
          documentFile
            ? documentFile.name
            : "",

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

        threatLevel:
          ifseResult.status === "REJECTED"
            ? "High"
            : "Low",

        riskScore:
          ifseResult.score || 0,

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

    // Enterprise partnership
    if (isEnterprise) {
      navigate(
        "/enterprise-partnership",
        {
          state: {
            verificationId:
              verificationRef.id,
          },
        }
      );

      return;
    }

    // Paid verification
    if (paymentAmount > 0) {
      navigate(
        "/creator-verification-payment",
        {
          state: {
            verificationId:
              verificationRef.id,

            verificationType,

            category,

            paymentAmount,
          },
        }
      );

      return;
    }

    // ==========================================
    // FREE / NO-PAYMENT VERIFICATION
    // ==========================================

    alert(
      "Verification request submitted successfully."
    );

    navigate(
      "/verification-status"
    );

  } catch (error) {
    console.error(
      "Verification Application Error:",
      error
    );

    alert(
      "Unable to submit verification request."
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
        <h1>
          Verification Application
        </h1>

        <p>
          Complete the form below to apply for verification.
        </p>
                <label>
          Verification Category
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
                VERIFICATION_PLANS[key]
                  ?.title
              }
            </option>
          ))}
        </select>

        <label>
          Verification Type
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
                {item.name}
              </option>
            )
          )}
        </select>

        <label>
          Full Name
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
          Email Address
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
          Phone Number
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
          Organization / Brand Name
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
          Official Website
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
              Primary Social Link
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
              placeholder="https://..."
            />

            <label>
              Secondary Social Link
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
              🏛 Government verification is reviewed
              manually by Inclura and does not require
              online payment.
            </div>

            <label>
              Official Government Email
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

        <label>
          Upload Supporting Document
        </label>

        <input
          type="file"
          onChange={(e) =>
            setDocumentFile(
              e.target.files[0]
            )
          }
          style={{
            marginTop: "10px",
            marginBottom: "24px",
            color: "white",
          }}
        />

<div
  style={{
    background: "#1e293b",
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "24px",
  }}
>
  <h3>Verification Fee</h3>

  {requiresContract ? (
    <p>
      <strong>Contract Required</strong>
      <br />
      Pricing will be determined after IFSE due diligence and partnership review.
    </p>
  ) : isEnterprise ? (
    <p>
      <strong>Enterprise Pricing</strong>
      <br />
      Contact Inclura for a customized quotation.
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
        {paymentFrequency} Subscription
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
  ? "Continue To Corporate Partnership"
  : isEnterprise
  ? "Submit Partnership Request"
  : paymentAmount > 0
  ? "Continue To Payment"
  : "Submit Verification Request"}
        </button>
      </div>
    </DashboardLayout>
  );
}

export default VerificationApplication;
