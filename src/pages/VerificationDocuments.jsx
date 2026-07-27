import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  auth,
  db,
  storage,
} from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

import { VERIFICATION_PLANS } from "../config";

function VerificationDocuments() {

  const navigate = useNavigate();

  const currentUser = auth.currentUser;

  const IFSE_STAGES = [
    "Identity Verification",
    "Document Authentication",
    "Fraud Detection",
    "OCR Extraction",
    "AI Analysis",
    "Accessibility Validation",
    "Risk Assessment",
    "Executive Review",
    "Final Approval",
  ];

  const SECURITY_LAYERS = [
    "Identity Verification",
    "Document Authenticity",
    "Duplicate Detection",
    "Forgery Detection",
    "Metadata Analysis",
    "OCR Extraction",
    "AI Fraud Detection",
    "Malware Scan",
    "Accessibility Compliance",
    "Executive Approval",
    "Continuous Monitoring",
  ];

  const VERIFICATION_TYPES = [
    "Creator",
    "Group",
    "Organization",
    "NGO",
    "Institution",
    "Religious",
    "Healthcare",
    "Museum",
    "Tourism",
    "Entertainment",
    "Media",
    "Accessibility",
    "Corporate",
    "Government",
    "Enterprise",
  ];

  const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [verificationType, setVerificationType] =
    useState("Creator");

  const [organizationName, setOrganizationName] =
    useState("");

  const [contactName, setContactName] =
    useState("");

  const [contactEmail, setContactEmail] =
    useState("");

  const [country, setCountry] =
    useState("");

  const [state, setState] =
    useState("");

  const [city, setCity] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [uploadedDocuments, setUploadedDocuments] =
    useState({});

  const DOCUMENT_REQUIREMENTS = useMemo(() => ({
      Creator: [
    "Government ID",
    "Recent Selfie",
  ],

  Group: [
    "Group Registration",
    "Administrator ID",
  ],

  Organization: [
    "Organization Registration Certificate",
    "Tax Certificate",
    "Authorized Representative ID",
  ],

  NGO: [
    "NGO Registration Certificate",
    "Tax Exemption Certificate",
    "Director ID",
  ],

  Institution: [
    "Institution Registration",
    "Accreditation Certificate",
    "Principal / Vice Chancellor ID",
  ],

  Religious: [
    "Religious Registration Certificate",
    "Leader Identification",
  ],

  Healthcare: [
    "Medical License",
    "Hospital Registration",
    "Healthcare Accreditation",
    "Medical Director ID",
  ],

  Museum: [
    "Museum Registration",
    "Operating License",
    "Curator Identification",
  ],

  Tourism: [
    "Tourism Registration",
    "Operating License",
    "Business Registration",
  ],

  Entertainment: [
    "Business Registration",
    "Venue Operating License",
    "Management Identification",
  ],

  Media: [
    "Media License",
    "Broadcast /Publishing Registration",
    "Editor ID",
  ],

  Accessibility: [
    "Accessibility Audit Request",
    "Organization Registration",
  ],

  Corporate: [
    "Business Registration",
    "Tax Certificate",
    "Director ID",
    "Proof of Address",
  ],

  Government: [
    "Government Authorization Letter",
    "Agency Registration",
    "Official ID",
  ],

  Enterprise: [
    "Certificate of Incorporation",
    "Corporate Profile",
    "Directors Information",
    "Tax Clearance",
    "Proof of Headquarters",
  ],

}));
    const handleDocumentUpload = (
  documentName,
  file
) => {

  if (!file) return;

  if (file.size === 0) {

    alert(
      "The selected file is empty."
    );

    return;

  }

  if (
    !ALLOWED_FILE_TYPES.includes(file.type)
  ) {

    alert(
      "Only PDF, JPG, JPEG and PNG files are allowed."
    );

    return;

  }

  if (
    file.size >
    MAX_FILE_SIZE
  ) {

    alert(
      "Document size must not exceed 10 MB."
    );

    return;

  }

  setUploadedDocuments((previous) => ({

    ...previous,

    [documentName]: {

      file,

      fileName: file.name,

      fileSize: file.size,

      fileType: file.type,

      uploaded: false,

      validated: true,

    },

  }));

};

  const calculateRiskScore = () => {

    let score = 0;

    if (!contactName.trim()) score += 10;
    if (!contactEmail.trim()) score += 10;
    if (!country.trim()) score += 5;
    if (!state.trim()) score += 5;
    if (!city.trim()) score += 5;

    if (
      ["Enterprise", "Corporate", "Government"].includes(verificationType) &&
      !organizationName.trim()
    ) {
      score += 20;
    }

    if (
      [
        "Religious",
        "Museum",
        "Tourism",
        "Entertainment",
        "Accessibility",
      ].includes(verificationType) &&
      !organizationName.trim()
    ) {
      score += 10;
    }

    return Math.min(score, 100);
  };

  const riskScore = calculateRiskScore();
  const selectedPlan =
  VERIFICATION_PLANS?.[verificationType] || {};

  const threatLevel =
    riskScore >= 75
      ? "High"
      : riskScore >= 40
      ? "Medium"
      : "Low";

  const executiveReviewRequired =
    ["Enterprise", "Corporate", "Government"].includes(
      verificationType
    ) || riskScore >= 60;
  const selectedPlan =
  VERIFICATION_PLANS?.[verificationType] || {
    monthlyUSD: 0,
    renewal: "Monthly",
    trustLevel: "Standard",
    benefits: [],
  };
  
  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!currentUser) {
    setError("Please sign in first.");
    return;
  }

  if (!contactName.trim()) {
    setError("Contact name is required.");
    return;
  }

  if (!contactEmail.trim()) {
    setError("Contact email is required.");
    return;
  }

  const requiredDocuments =
    DOCUMENT_REQUIREMENTS[verificationType] || [];

  const missingDocuments =
    requiredDocuments.filter(
      (document) => !uploadedDocuments[document]
    );

  if (missingDocuments.length > 0) {

    setError(
      `Please upload all required documents.\n\nMissing:\n\n${missingDocuments.join("\n")}`
    );

    return;
  }

  setLoading(true);
const existingVerificationQuery = query(

  collection(
    db,
    "verificationRequests"
  ),

  where(
    "submittedBy",
    "==",
    currentUser.uid
  )

);

const existingVerificationSnapshot =
  await getDocs(
    existingVerificationQuery
  );

const activeVerification =
  existingVerificationSnapshot.docs.find(
    (doc) => {

      const status =
        doc.data().status;

      return [

        "submitted",

        "pending",

        "under_review",

        "payment_completed",

      ].includes(status);

    }
  );

if (activeVerification) {

  setLoading(false);

  setError(
    "You already have an active verification request."
  );

  return;

}
  try {

    const requestRef = await addDoc(

  collection(
    db,
    "verificationRequests"
  ),

  {

    verificationType,

    organizationName,

    contactName,

    contactEmail,

    country,

    state,

    city,

    notes,

    riskScore,

    threatLevel,

    executiveReviewRequired,

    uploadedDocuments: {},

    paymentStatus:
      "pending",

    status:
      "submitted",

    submittedBy:
      currentUser.uid,

    createdAt:
      serverTimestamp(),

    updatedAt:
      serverTimestamp(),

  }

);

    const verificationId = requestRef.id;

    const uploadedFiles = {};
        for (const [documentName, documentInfo] of Object.entries(uploadedDocuments)) {

      if (!documentInfo?.file) continue;

      const storagePath =
        `verificationDocuments/${verificationId}/${Date.now()}_${documentInfo.file.name}`;

      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, documentInfo.file);

      const downloadURL =
        await getDownloadURL(storageRef);

      uploadedFiles[documentName] = {

        fileName: documentInfo.file.name,

        fileSize: documentInfo.file.size,

        fileType: documentInfo.file.type,

        storagePath,

        downloadURL,

        uploadedAt: new Date().toISOString(),

      };

    }

    await addDoc(
      collection(db, "verificationDocuments"),
      {
        verificationId,
        verificationType,
        uploadedDocuments: uploadedFiles,
        submittedBy: currentUser.uid,
        createdAt: serverTimestamp(),
      }
    );

    await addDoc(
      collection(db, "verificationTimeline"),
      {
        verificationId,
        title: "Verification Submitted",
        status: "Completed",
        createdAt: serverTimestamp(),
      }
    );

    await addDoc(
      collection(db, "ifseSecurityEvents"),
      {
        verificationId,
        eventType: "verification_created",
        verificationType,
        riskScore,
        threatLevel,
        executiveReviewRequired,
        reviewed: false,
        createdAt: serverTimestamp(),
      }
    );

    await addDoc(
      collection(db, "verificationAuditLogs"),
      {
        verificationId,
        action: "Verification Submitted",
        actor: currentUser.uid,
        createdAt: serverTimestamp(),
      }
    );

    setSuccess(
      "Verification documents submitted successfully."
    );

    navigate("/verification-status");

  } catch (err) {

    console.error(err);

    setError(
      "Unable to submit verification."
    );

  } finally {

    setLoading(false);

  }

};
  return (

  <DashboardLayout>

    <div
      className="verification-documents-page"
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "24px",
      }}
    >

      <h1>
        IFSE Verification Documents
      </h1>

      <p>

        Upload your verification documents securely.

        Every submission is protected by the

        <strong>
          {" "}
          Inclura Fortress Security Engine (IFSE)
        </strong>

      </p>

      {error && (

        <div className="error-message">

          {error}

        </div>

      )}

      {success && (

        <div className="success-message">

          {success}

        </div>

      )}

      <form onSubmit={handleSubmit}>
        <section
  style={{
    marginBottom: "24px",
  }}
>
  <h2>Verification Type</h2>

  <select
    value={verificationType}
    onChange={(e) =>
      setVerificationType(e.target.value)
    }
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
    }}
  >
    {VERIFICATION_TYPES.map((type) => (
      <option
        key={type}
        value={type}
      >
        {type}
      </option>
    ))}
  </select>
</section>

<section
  style={{
    marginBottom: "24px",
  }}
>
  <h2>Applicant Information</h2>

  <input
    type="text"
    placeholder="Organization / Company Name"
    value={organizationName}
    onChange={(e) =>
      setOrganizationName(e.target.value)
    }
    style={{
      width: "100%",
      padding: "12px",
      marginBottom: "12px",
    }}
  />

  <input
    type="text"
    placeholder="Contact Name"
    value={contactName}
    onChange={(e) =>
      setContactName(e.target.value)
    }
    required
    style={{
      width: "100%",
      padding: "12px",
      marginBottom: "12px",
    }}
  />

  <input
    type="email"
    placeholder="Contact Email"
    value={contactEmail}
    onChange={(e) =>
      setContactEmail(e.target.value)
    }
    required
    style={{
      width: "100%",
      padding: "12px",
      marginBottom: "12px",
    }}
  />

  <input
    type="text"
    placeholder="Country"
    value={country}
    onChange={(e) =>
      setCountry(e.target.value)
    }
    style={{
      width: "100%",
      padding: "12px",
      marginBottom: "12px",
    }}
  />

  <input
    type="text"
    placeholder="State"
    value={state}
    onChange={(e) =>
      setState(e.target.value)
    }
    style={{
      width: "100%",
      padding: "12px",
      marginBottom: "12px",
    }}
  />

  <input
    type="text"
    placeholder="City"
    value={city}
    onChange={(e) =>
      setCity(e.target.value)
    }
    style={{
      width: "100%",
      padding: "12px",
      marginBottom: "12px",
    }}
  />

  <textarea
    rows={4}
    placeholder="Additional Notes"
    value={notes}
    onChange={(e) =>
      setNotes(e.target.value)
    }
    style={{
      width: "100%",
      padding: "12px",
    }}
  />
</section>
  <section
  style={{
    marginBottom: "24px",
  }}
>
  <h2>Required Documents</h2>

  {DOCUMENT_REQUIREMENTS[verificationType].map((document) => (
    <div
      key={document}
      style={{
        marginBottom: "18px",
        padding: "14px",
        border: "1px solid #374151",
        borderRadius: "10px",
      }}
    >
      <label
        style={{
          display: "block",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        {document}
      </label>

      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) =>
          handleDocumentUpload(
            document,
            e.target.files?.[0]
          )
        }
      />

      {uploadedDocuments[document] && (
        <div
          style={{
            marginTop: "10px",
            color: "#22c55e",
            fontSize: "14px",
          }}
        >
          ✅ {uploadedDocuments[document].fileName}
          <br />
          Size:{" "}
          {(
            uploadedDocuments[document].fileSize /
            1024 /
            1024
          ).toFixed(2)}
          {" MB"}
        </div>
      )}
    </div>
  ))}

  <div
    style={{
      marginTop: "20px",
      padding: "18px",
      borderRadius: "10px",
      background: "#1e293b",
    }}
  >
    <h3>Document Progress</h3>
<p>

Uploaded Documents

</p>

<p>

<strong>

{Object.keys(uploadedDocuments).length}

</strong>

of

<strong>

{DOCUMENT_REQUIREMENTS[verificationType].length}

</strong>

uploaded

</p>

<p>

Completion:

<strong>

{" "}

{Math.round(

(
Object.keys(uploadedDocuments).length /

DOCUMENT_REQUIREMENTS[
verificationType
].length
) * 100

)}%

</strong>

</p>
    <progress
      value={Object.keys(uploadedDocuments).length}
      max={DOCUMENT_REQUIREMENTS[verificationType].length}
      style={{
        width: "100%",
        height: "18px",
      }}
    />
  </div>
</section>

        <section
  style={{
    marginBottom: "24px",
    padding: "20px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "12px",
  }}
>
  <h2>IFSE Security Assessment</h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: "16px",
      marginTop: "20px",
    }}
  >

    <div
      style={{
        padding: "16px",
        background: "#1e293b",
        borderRadius: "10px",
      }}
    >
      <h3>Risk Score</h3>

      <h1
        style={{
          marginTop: "10px",
        }}
      >
        {riskScore}%
      </h1>
    </div>

    <div
      style={{
        padding: "16px",
        background: "#1e293b",
        borderRadius: "10px",
      }}
    >
      <h3>Threat Level</h3>

      <h2
        style={{
          color:
            threatLevel === "High"
              ? "#ef4444"
              : threatLevel === "Medium"
              ? "#f59e0b"
              : "#22c55e",
        }}
      >
        {threatLevel}
      </h2>
    </div>

    <div
      style={{
        padding: "16px",
        background: "#1e293b",
        borderRadius: "10px",
      }}
    >
      <h3>Executive Review</h3>

      <h2>
        {executiveReviewRequired
          ? "Required"
          : "Not Required"}
      </h2>
    </div>

  </div>

</section>
        <section
  style={{
    marginBottom: "24px",
    padding: "20px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "12px",
  }}
>

  <h2>IFSE Protection Layers</h2>

  <p
    style={{
      marginBottom: "18px",
      color: "#cbd5e1",
    }}
  >
    Every verification request is processed through multiple
    independent security engines before approval.
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(260px,1fr))",
      gap: "14px",
    }}
  >

    {SECURITY_LAYERS.map((layer) => (

      <div
        key={layer}
        style={{
          background: "#1e293b",
          padding: "14px",
          borderRadius: "10px",
          border: "1px solid #334155",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >

        <span
          style={{
            color: "#22c55e",
            fontSize: "20px",
          }}
        >
          ✅
        </span>

        <span>
          {layer}
        </span>

      </div>

    ))}

  </div>

</section>
        <section
  style={{
    marginBottom: "24px",
    padding: "20px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "12px",
  }}
>

  <h2>Verification Workflow</h2>

  <p
    style={{
      marginBottom: "20px",
      color: "#cbd5e1",
    }}
  >
    Every application progresses through the following IFSE
    verification pipeline before approval.
  </p>

  <div>

    {IFSE_STAGES.map((stage, index) => (

      <div
        key={stage}
        style={{
          display: "flex",
          alignItems: "flex-start",
          marginBottom: "18px",
        }}
      >

        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "#38bdf8",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            flexShrink: 0,
          }}
        >
          {index + 1}
        </div>

        <div
          style={{
            marginLeft: "16px",
            flex: 1,
          }}
        >

          <h3
            style={{
              margin: 0,
            }}
          >
            {stage}
          </h3>

          <div
            style={{
              marginTop: "8px",
              height: "2px",
              background: "#334155",
            }}
          />

        </div>

      </div>

    ))}

  </div>

</section>
        <section
  style={{
    marginBottom: "24px",
    padding: "20px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "12px",
  }}
>

  <h2>Selected Verification Plan</h2>

  <div
    style={{
      marginTop: "18px",
      background: "#1e293b",
      padding: "18px",
      borderRadius: "10px",
    }}
  >

    <p>
      <strong>Verification Type:</strong>{" "}
      {verificationType}
    </p>

    <p>
      <strong>Risk Score:</strong>{" "}
      {riskScore}%
    </p>

    <p>
      <strong>Threat Level:</strong>{" "}
      {threatLevel}
    </p>

    <p>
      <strong>Executive Review:</strong>{" "}
      {executiveReviewRequired
        ? "Required"
        : "Not Required"}
    </p>

    <hr
      style={{
        margin: "18px 0",
        borderColor: "#334155",
      }}
    />
<h3
  style={{
    marginTop: "20px",
    marginBottom: "15px",
  }}
>
Verification Plan Details
</h3>

<p>
<strong>Verification Fee:</strong>
{" "}
${selectedPlan.monthlyUSD || 0}
</p>

<p>
<strong>Renewal:</strong>
{" "}
{selectedPlan.renewal || "Monthly"}
</p>

<p>
<strong>Trust Level:</strong>
{" "}
{selectedPlan.trustLevel || "Standard"}
</p>

{selectedPlan.benefits &&
selectedPlan.benefits.length > 0 && (

<div
  style={{
    marginTop: "15px",
  }}
>

<strong>Benefits</strong>

<ul>

{selectedPlan.benefits.map((benefit) => (

<li key={benefit}>
{benefit}
</li>

))}

</ul>

</div>

)}

  </div>

</section>
        <section
  style={{
    marginBottom: "24px",
    padding: "20px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "12px",
  }}
>

  <h2>IFSE Notice</h2>

  <p>
    Every uploaded verification document is protected by the
    Inclura Fortress Security Engine (IFSE).
  </p>

  <p>
    Before approval, every document passes through the following
    automated and human verification processes:
  </p>

  <ul
    style={{
      lineHeight: "2",
      marginTop: "16px",
    }}
  >
    <li>✅ Identity Verification</li>

    <li>✅ Document Authenticity Verification</li>

    <li>✅ OCR Data Extraction</li>

    <li>✅ AI Fraud Detection</li>

    <li>✅ Duplicate Detection</li>

    <li>✅ Metadata Inspection</li>

    <li>✅ Malware & File Security Scan</li>

    <li>✅ Accessibility Compliance Review</li>

    <li>✅ Risk Assessment</li>

    <li>✅ Executive Review (where required)</li>

    <li>✅ Continuous IFSE Monitoring</li>
  </ul>

</section>

<div
  style={{
    display: "flex",
    gap: "16px",
    marginTop: "30px",
    marginBottom: "30px",
  }}
>

<button
  type="submit"
  disabled={
    loading ||
    Object.keys(uploadedDocuments).length !==
      DOCUMENT_REQUIREMENTS[verificationType].length
  }
  style={{
    flex: 1,
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background:
      loading ||
      Object.keys(uploadedDocuments).length !==
        DOCUMENT_REQUIREMENTS[verificationType].length
        ? "#64748b"
        : "#2563eb",
    color: "#fff",
    cursor:
      loading ||
      Object.keys(uploadedDocuments).length !==
        DOCUMENT_REQUIREMENTS[verificationType].length
        ? "not-allowed"
        : "pointer",
    opacity:
      loading ||
      Object.keys(uploadedDocuments).length !==
        DOCUMENT_REQUIREMENTS[verificationType].length
        ? 0.7
        : 1,
    fontWeight: "bold",
    fontSize: "16px",
    transition: "0.3s ease",
  }}
>
  {loading
    ? "Submitting Verification..."
    : Object.keys(uploadedDocuments).length !==
      DOCUMENT_REQUIREMENTS[verificationType].length
    ? `Upload All Required Documents (${Object.keys(uploadedDocuments).length}/${DOCUMENT_REQUIREMENTS[verificationType].length})`
    : "Submit Verification"}
</button>
  
  <button
    type="button"
    onClick={() => navigate("/verification-center")}
    style={{
      flex: 1,
      padding: "14px",
      borderRadius: "10px",
      border: "1px solid #475569",
      background: "#1e293b",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
    }}
  >
    Cancel
  </button>

</div>

</form>

</div>

</DashboardLayout>
);

}

export default VerificationDocuments;
