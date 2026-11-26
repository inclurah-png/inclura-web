import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import {
  db,
  auth,
} from "../firebase";

import { getVerificationDocumentAccess, getPartnershipContractAccess } from "../services/cloudinaryUpload";

const IFSE_API_URL = import.meta.env.VITE_IFSE_API_URL || "https://inclura-ifse-backend.onrender.com";

function VerificationManager() {
const [statistics, setStatistics] = useState({
  total: 0,

  pending: 0,

  underReview: 0,

  approved: 0,

  rejected: 0,

  executiveReview: 0,
});

const [loading, setLoading] =
  useState(true);

const [error, setError] =
  useState("");

const [verificationRequests, setVerificationRequests] =
  useState([]);
  
const [creatorPending, setCreatorPending] =
  useState(0);

const [organizationPending, setOrganizationPending] =
  useState(0);

const [enterprisePending, setEnterprisePending] =
  useState(0);

const [corporatePending, setCorporatePending] = useState(0);

const [governmentPending, setGovernmentPending] =
  useState(0);

const [partnershipApplications, setPartnershipApplications] = useState([]);
const [partnershipActionBusy, setPartnershipActionBusy] = useState("");
const [partnershipContractLinks, setPartnershipContractLinks] = useState({});

const [recentRequests, setRecentRequests] =
  useState([]);

const [selectedRequest, setSelectedRequest] =
  useState(null);

const [selectedDocuments, setSelectedDocuments] = useState([]);
const [documentsLoading, setDocumentsLoading] = useState(false);
const [documentsError, setDocumentsError] = useState("");
const [documentRefreshKey, setDocumentRefreshKey] = useState(0);

const [searchTerm, setSearchTerm] =
  useState("");

const [selectedCategory, setSelectedCategory] =
  useState("all");

useEffect(() => {
  let cancelled = false;

  async function loadSelectedDocuments() {
    const request = selectedRequest;
    const entries = Object.entries(request?.uploadedDocuments || {})
      .filter(([, metadata]) => metadata?.cloudinaryPublicId);

    if (!request?.id || entries.length === 0) {
      setSelectedDocuments([]);
      setDocumentsError("");
      setDocumentsLoading(false);
      return;
    }

    setDocumentsLoading(true);
    setDocumentsError("");
    try {
      const documents = await Promise.all(entries.map(async ([key, metadata]) => {
        const access = await getVerificationDocumentAccess(
          request.id,
          metadata.cloudinaryPublicId
        );
        return {
          id: key,
          name: metadata.fileName || access.fileName || key,
          fileType: metadata.fileType || "",
          url: access.downloadUrl,
          expiresAt: access.expiresAt,
        };
      }));
      if (!cancelled) setSelectedDocuments(documents);
    } catch (documentError) {
      if (!cancelled) {
        setSelectedDocuments([]);
        setDocumentsError(documentError.message || "Unable to load private verification documents.");
      }
    } finally {
      if (!cancelled) setDocumentsLoading(false);
    }
  }

  loadSelectedDocuments();
  return () => { cancelled = true; };
}, [selectedRequest, documentRefreshKey]);

const [verificationRevenue, setVerificationRevenue] =
  useState({
    totalRevenue: 0,

    monthlyRevenue: 0,

    pendingPayments: 0,

    successfulPayments: 0,

    creatorRevenue: 0,

    groupRevenue: 0,

    organizationRevenue: 0,

    enterpriseRevenue: 0,

    governmentRevenue: 0,

    ngoRevenue: 0,

    institutionRevenue: 0,

    religiousRevenue: 0,

    healthcareRevenue: 0,

    museumRevenue: 0,

    tourismRevenue: 0,

    entertainmentRevenue: 0,

    mediaRevenue: 0,

    accessibilityRevenue: 0,
});
    
    useEffect(() => {
  async function loadStatistics() {

    try {

      const snapshot =
        await getDocs(
          collection(
            db,
            "verificationRequests"
          )
        );
      
      const requests =
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
  const recentPending =
  requests
    .filter(
      item =>
        ["pending", "submitted"].includes(item.status)
    )
    .sort((a, b) => {

      const aTime =
        a.createdAt?.seconds || 0;

      const bTime =
        b.createdAt?.seconds || 0;

      return bTime - aTime;

    })
    .slice(0, 10);

setRecentRequests(
  recentPending
);
      setStatistics({

        total: requests.length,

        pending: requests.filter(
          item =>
            ["pending", "submitted"].includes(item.status)
        ).length,

        underReview: requests.filter(
          item =>
            item.status ===
            "under_review"
        ).length,

        approved: requests.filter(
          item =>
            item.status ===
            "approved"
        ).length,

        rejected: requests.filter(
          item =>
            item.status ===
            "rejected"
        ).length,

        executiveReview:
          requests.filter(
            item =>
              item.executiveReviewRequired ===
              true
          ).length,

      });

      const openRequestStatuses = ["pending", "submitted"];
      setCreatorPending(
        requests.filter((item) =>
          item.category === "creator" && openRequestStatuses.includes(item.status)
        ).length
      );
      setOrganizationPending(
        requests.filter((item) =>
          item.category === "organization" && openRequestStatuses.includes(item.status)
        ).length
      );

const enterpriseSnapshot =
  await getDocs(
    query(
      collection(db, "enterprisePartnerships"),
      where("requestStatus", "==", "submitted")
    )
  );

setEnterprisePending(
  enterpriseSnapshot.size
);

const corporateSnapshot = await getDocs(
  query(collection(db, "corporatePartnerships"), where("requestStatus", "==", "submitted"))
);
setCorporatePending(corporateSnapshot.size);

const governmentSnapshot =
  await getDocs(
    query(
      collection(db, "governmentPartnerships"),
      where("status", "==", "submitted")
    )
  );

setGovernmentPending(
  governmentSnapshot.size
);

    } catch (err) {

      console.error(err);

      setError(
        "Unable to load verification statistics."
      );

    } finally {

      setLoading(false);

    }

  }

  loadStatistics();

}, []);
  
  useEffect(() => {

  async function loadVerificationRequests() {

    try {

      const snapshot = await getDocs(
        collection(db, "verificationRequests")
      );

      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setVerificationRequests(requests);



    } catch (err) {

      console.error(err);

    }

  }

  loadVerificationRequests();

}, []);

useEffect(() => {
  const collections = [
    ["enterprise", "enterprisePartnerships", "requestStatus"],
    ["corporate", "corporatePartnerships", "requestStatus"],
    ["government", "governmentPartnerships", "status"],
  ];
  const unsubscribers = collections.map(([type, name, statusField]) =>
    onSnapshot(
      query(collection(db, name), where(statusField, "in", ["submitted", "pending"])),
      (snapshot) => {
        setPartnershipApplications((current) => [
          ...current.filter((item) => item.type !== type),
          ...snapshot.docs.map((document) => ({
            id: document.id,
            type,
            ...document.data(),
          })),
        ]);
      },
      (loadError) => {
        console.error("Partnership applications could not be loaded:", loadError);
        setError("Unable to load partnership applications.");
      }
    )
  );
  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
}, []);

useEffect(() => {
  let cancelled = false;

  async function loadRevenueStatistics() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Administrator session is required.");
      const token = await currentUser.getIdToken();
      const response = await fetch(
        `${IFSE_API_URL}/api/admin/verification/analytics`,
        { method: "GET", headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true || !result.report) {
        throw new Error(result.message || "Verification revenue analytics could not be loaded.");
      }
      if (!cancelled) setVerificationRevenue(result.report);
    } catch (err) {
      console.error("Verification revenue analytics failed:", err);
      if (!cancelled) setError(err.message || "Verification revenue analytics could not be loaded.");
    }
  }

  loadRevenueStatistics();
  return () => { cancelled = true; };
}, []);


const filteredRequests = verificationRequests.filter((item) => {
  const matchesSearch =
    (
      item.fullName ||
      item.organizationName ||
      item.agencyName ||
      item.email ||
      item.officialEmail ||
      ""
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === "all" ||
    item.category === selectedCategory ||
    item.verificationType === selectedCategory;

  return matchesSearch && matchesCategory;
});
  
const submitAdminDecision = async (requestId, action, reason = "") => {
  const user = auth.currentUser;
  if (!user) {
    setError("Your administrator session has expired. Please sign in again.");
    return;
  }
  setError("");
  try {
    const token = await user.getIdToken();
    const response = await fetch(
      `${IFSE_API_URL}/api/admin/verification/${encodeURIComponent(requestId)}/${action}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: action === "reject" ? JSON.stringify({ reason }) : undefined,
      }
    );
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success !== true) {
      throw new Error(result.message || "The verification decision could not be completed.");
    }

    const nextStatus = action === "approve" ? "approved" : "rejected";
    setVerificationRequests((previous) =>
      previous.map((item) =>
        item.id === requestId
          ? { ...item, status: nextStatus, ...(action === "reject" ? { rejectionReason: reason } : {}) }
          : item
      )
    );
    setRecentRequests((previous) => previous.filter((item) => item.id !== requestId));
    if (selectedRequest?.id === requestId) {
      setSelectedRequest({
        ...selectedRequest,
        status: nextStatus,
        ...(action === "reject" ? { rejectionReason: reason } : {}),
      });
    }
    window.alert(result.message || "Verification decision saved.");
  } catch (err) {
    console.error("IFSE administrator verification decision failed:", err);
    setError(err.message || "Unable to save the verification decision.");
    window.alert(err.message || "Unable to save the verification decision.");
  }
};

const handleApprove = async (requestId) => {
  await submitAdminDecision(requestId, "approve");
};

const handleReject = async (requestId) => {
  const reason = window.prompt("Enter the rejection reason:");
  if (!reason || reason.trim().length < 5) return;
  await submitAdminDecision(requestId, "reject", reason.trim());
};


const openPartnershipContract = async (application) => {
  try {
    const access = await getPartnershipContractAccess(application.type, application.id);
    setPartnershipContractLinks((items) => ({
      ...items,
      [application.type + ":" + application.id]: access.downloadUrl,
    }));
  } catch (accessError) {
    setError(accessError.message || "Unable to authorize contract access.");
  }
};

const submitPartnershipContractReview = async (application, decision) => {
  const notes = window.prompt(
    decision === "approved" ? "Record your contract verification notes:" : "Explain why this signed contract is rejected:"
  );
  if (!notes || notes.trim().length < 5) return;
  const user = auth.currentUser;
  if (!user) {
    setError("Your administrator session has expired. Please sign in again.");
    return;
  }
  const actionKey = application.type + ":" + application.id + ":contract";
  setPartnershipActionBusy(actionKey);
  setError("");
  try {
    const token = await user.getIdToken();
    const response = await fetch(
      `${IFSE_API_URL}/api/admin/partnerships/${encodeURIComponent(application.type)}/${encodeURIComponent(application.id)}/contract-review`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ decision, notes: notes.trim() }),
      }
    );
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success !== true) throw new Error(result.message || "Contract review failed.");
    setPartnershipApplications((items) => items.map((item) =>
      item.id === application.id && item.type === application.type
        ? { ...item, contractVerificationStatus: result.contractVerificationStatus, contractStatus: decision === "approved" ? "Verified" : "Rejected - resubmission required" }
        : item
    ));
    window.alert(result.message || "Contract review saved.");
  } catch (reviewError) {
    setError(reviewError.message || "Contract review failed.");
  } finally {
    setPartnershipActionBusy("");
  }
};

const finalizePartnershipActivation = async (application) => {
  const approvalsByType = {
    enterprise: ["executive", "board", "legal"],
    corporate: ["executive", "board"],
    government: ["executive", "government"],
  };
  const required = approvalsByType[application.type] || [];
  const approvals = {};
  for (const key of required) {
    const label = key === "government" ? "Government approval" : key.charAt(0).toUpperCase() + key.slice(1) + " approval";
    const reference = window.prompt("Enter the official reference or record identifier for the " + label + " already obtained:");
    if (!reference || reference.trim().length < 3) return;
    approvals[key] = reference.trim();
  }
  const paymentDecision = window.prompt("Does the negotiated agreement require payment before activation? Type YES or NO.");
  if (!paymentDecision || !["YES", "NO"].includes(paymentDecision.trim().toUpperCase())) return;
  const paymentRequired = paymentDecision.trim().toUpperCase() === "YES";
  const notes = window.prompt("Enter the final authorization and activation notes:");
  if (!notes || notes.trim().length < 5) return;
  const user = auth.currentUser;
  if (!user) {
    setError("Your administrator session has expired. Please sign in again.");
    return;
  }
  const actionKey = application.type + ":" + application.id + ":activate";
  setPartnershipActionBusy(actionKey);
  setError("");
  try {
    const token = await user.getIdToken();
    const response = await fetch(
      `${IFSE_API_URL}/api/admin/partnerships/${encodeURIComponent(application.type)}/${encodeURIComponent(application.id)}/activate`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ approvals, paymentRequired, notes: notes.trim() }),
      }
    );
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success !== true) throw new Error(result.message || "Final activation was blocked.");
    setPartnershipApplications((items) => items.filter((item) => item.id !== application.id || item.type !== application.type));
    window.alert(result.message || "Partnership activated.");
  } catch (activationError) {
    setError(activationError.message || "Final activation was blocked.");
  } finally {
    setPartnershipActionBusy("");
  }
};

const submitPartnershipReview = async (application, stage, decision) => {
  const user = auth.currentUser;
  if (!user) {
    setError("Your administrator session has expired. Please sign in again.");
    return;
  }
  const notes = decision === "rejected"
    ? window.prompt("Enter the reason for rejecting this review stage:")
    : "Review stage completed by an authorized administrator.";
  if (decision === "rejected" && (!notes || notes.trim().length < 5)) return;
  const actionKey = application.type + ":" + application.id + ":" + stage;
  setPartnershipActionBusy(actionKey);
  setError("");
  try {
    const token = await user.getIdToken();
    const response = await fetch(
      `${IFSE_API_URL}/api/admin/partnerships/${encodeURIComponent(application.type)}/${encodeURIComponent(application.id)}/review`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ stage, decision, notes: notes ? notes.trim() : "Review completed." }),
      }
    );
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success !== true) throw new Error(result.message || "Partnership review could not be saved.");
    if (decision === "rejected") {
      setPartnershipApplications((items) => items.filter((item) => item.id !== application.id || item.type !== application.type));
    } else {
      setPartnershipApplications((items) => items.map((item) =>
        item.id === application.id && item.type === application.type
          ? { ...item, reviewProgress: result.reviewProgress, timeline: (item.timeline || []).map((entry) =>
              entry.title === ({
                enterprise: { security: "Enterprise Security Review", accessibility: "Accessibility Review", compliance: "Compliance Review", integration: "Integration Review" },
                corporate: { security: "Corporate Security Review", accessibility: "Accessibility Review", compliance: "Compliance Review" },
                government: { identityReview: "Government Identity Review", securityReview: "IFSE Security Review", accessibilityReview: "Accessibility Compliance", complianceReview: "Compliance Review" },
              }[item.type][stage]) ? { ...entry, status: "Completed" } : entry
            ) }
          : item
      ));
    }
    window.alert(result.message || "Partnership review saved.");
  } catch (reviewError) {
    console.error("Partnership review failed:", reviewError);
    setError(reviewError.message || "Partnership review could not be saved.");
    window.alert(reviewError.message || "Partnership review could not be saved.");
  } finally {
    setPartnershipActionBusy("");
  }
};

const calculateApplicationCompleteness = (request) => {
  const hasContact = Boolean(request.email || request.officialEmail);
  const hasLocation = Boolean(request.country);
  const documentCount = Object.keys(request.uploadedDocuments || {}).length;
  const score = Math.round(
    ((Number(hasContact) + Number(hasLocation) + Number(documentCount > 0)) / 3) * 100
  );
  return {
    score,
    reviewSignal: "SERVER REVIEW PENDING",
    recommendation: "Manual administrator review required; this is not an approval decision.",
  };
}

const applicationReview = selectedRequest ? calculateApplicationCompleteness(selectedRequest) : null;

return (
<DashboardLayout>
  
<div
style={{
color: "white",
}}
>
<h1
style={{
marginBottom: "24px",
}}
>
✅ Verification Manager
</h1>
<div
  style={{
    marginBottom: "25px",
  }}
>

  <input
    type="text"
    placeholder="Search verification requests..."
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
    style={{
      width: "100%",
      padding: "14px",
      borderRadius: "10px",
      border: "1px solid #334155",
      background: "#111827",
      color: "white",
      fontSize: "16px",
      marginBottom: "15px",
    }}
  />

  <select
    value={selectedCategory}
    onChange={(e) =>
      setSelectedCategory(e.target.value)
    }
    style={{
      width: "100%",
      padding: "14px",
      borderRadius: "10px",
      border: "1px solid #334155",
      background: "#111827",
      color: "white",
      fontSize: "16px",
    }}
  >

    <option value="all">
      All Categories
    </option>

    <option value="creator">
      Creator
    </option>

    <option value="organization">
      Organization
    </option>

    <option value="enterprise">
      Enterprise
    </option>

    <option value="government">
      Government
    </option>

    <option value="ngo">
      NGO
    </option>

    <option value="institution">
      Institution
    </option>

    <option value="healthcare">
      Healthcare
    </option>

    <option value="religious">
      Religious
    </option>

    <option value="museum">
      Museum
    </option>

    <option value="tourism">
      Tourism
    </option>

    <option value="entertainment">
      Entertainment
    </option>

    <option value="media">
      Media
    </option>

    <option value="accessibility">
      Accessibility
    </option>

  </select>

</div>

<h2
style={{
marginBottom: "20px",
}}
>
Verification Statistics
</h2>

{loading && (
<p>Loading statistics...</p>
)}

{error && (
<div className="error-message">
{error}
</div>
)}

<div
style={{
display: "grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(220px,1fr))",
gap: "20px",
marginBottom: "35px",
}}
>

<div style={card}>
<h3>Total Requests</h3>
<h1>{statistics.total}</h1>
</div>

<div style={card}>
<h3>Pending</h3>
<h1>{statistics.pending}</h1>
</div>

<div style={card}>
<h3>Under Review</h3>
<h1>{statistics.underReview}</h1>
</div>

<div style={card}>
<h3>Approved</h3>
<h1>{statistics.approved}</h1>
</div>

<div style={card}>
<h3>Rejected</h3>
<h1>{statistics.rejected}</h1>
</div>

<div style={card}>
<h3>Executive Reviews</h3>
<h1>{statistics.executiveReview}</h1>
</div>

</div>

    <div style={card}>
  <h3>👤 Creator Verification</h3>

  <p>
    Pending:
    <strong> {creatorPending}</strong>
  </p>
</div>

<div style={card}>
  <h3>🏢 Organization Verification</h3>

  <p>
    Pending:
    <strong> {organizationPending}</strong>
  </p>
</div>

<div style={card}>
  <h3>💼 Enterprise Verification</h3>

  <p>
    Pending:
    <strong> {enterprisePending}</strong>
  </p>
</div>

<div style={card}>
  <h3>🏢 Corporate Partnership</h3>
  <p>Pending: <strong>{corporatePending}</strong></p>
</div>

<div style={card}>
  <h3>🏛 Government Verification</h3>

  <p>
    Pending:
    <strong> {governmentPending}</strong>
  </p>
</div>

<div style={card}>
  <h2>Enterprise, Corporate and Government Partnership Reviews</h2>
  <p>Each stage is recorded by the secure administrator service. Completing review stages does not itself approve or activate a contract.</p>
  {partnershipApplications.length === 0 ? (
    <p>No partnership applications are awaiting review.</p>
  ) : partnershipApplications.map((application) => {
    const stageConfig = {
      enterprise: [
        ["security", "Enterprise Security Review"],
        ["accessibility", "Accessibility Review"],
        ["compliance", "Compliance Review"],
        ["integration", "Integration Review"],
      ],
      corporate: [
        ["security", "Corporate Security Review"],
        ["accessibility", "Accessibility Review"],
        ["compliance", "Compliance Review"],
      ],
      government: [
        ["identityReview", "Government Identity Review"],
        ["securityReview", "IFSE Security Review"],
        ["accessibilityReview", "Accessibility Compliance"],
        ["complianceReview", "Compliance Review"],
      ],
    }[application.type] || [];
    return (
      <div key={application.type + ":" + application.id} style={{ borderTop: "1px solid #334155", padding: "16px 0" }}>
        <h3>{application.organizationName || application.companyName || application.agencyName || "Partnership applicant"}</h3>
        <p><strong>Type:</strong> {application.type} | <strong>Contact:</strong> {application.contactEmail || application.officialEmail || "Not supplied"}</p>
        <p><strong>Submission status:</strong> {application.requestStatus || application.status || "submitted"}</p>
        <p><strong>Contract:</strong> {application.contractStatus || "Not activated"} | <strong>Verification:</strong> {application.contractVerificationStatus || "Not submitted"}</p>
        {application.contractDocument?.cloudinaryPublicId && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
            <button type="button" disabled={Boolean(partnershipActionBusy)} onClick={() => openPartnershipContract(application)}>
              Open private signed contract
            </button>
            {partnershipContractLinks[application.type + ":" + application.id] && (
              <a href={partnershipContractLinks[application.type + ":" + application.id]} target="_blank" rel="noopener noreferrer">
                View contract (expires shortly)
              </a>
            )}
            <button type="button" disabled={Boolean(partnershipActionBusy) || application.contractVerificationStatus === "approved"} onClick={() => submitPartnershipContractReview(application, "approved")}>
              Verify contract
            </button>
            <button type="button" disabled={Boolean(partnershipActionBusy) || stageConfig.some(([requiredStage]) => application.reviewProgress?.[requiredStage] !== true)} onClick={() => submitPartnershipContractReview(application, "rejected")}>
              Reject contract
            </button>
          </div>
        )}
        {application.contractVerificationStatus === "approved" && (
          <button
            type="button"
            disabled={Boolean(partnershipActionBusy)}
            onClick={() => finalizePartnershipActivation(application)}
          >
            Final approvals and activate partnership
          </button>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {stageConfig.map(([stage, label], stageIndex) => {
            const prerequisitesComplete = stageConfig
              .slice(0, stageIndex)
              .every(([requiredStage]) => application.reviewProgress?.[requiredStage] === true);
            const completed = application.reviewProgress?.[stage] === true;
            return (
              <button
                key={stage}
                type="button"
                disabled={Boolean(partnershipActionBusy) || completed || !prerequisitesComplete}
                onClick={() => submitPartnershipReview(application, stage, "approved")}
                title={!prerequisitesComplete ? "Complete the preceding review stages first." : label}
                style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #64748b", background: completed ? "#166534" : "#1e293b", color: "#fff", cursor: completed || !prerequisitesComplete ? "not-allowed" : "pointer", opacity: prerequisitesComplete ? 1 : 0.55 }}
              >
                {completed ? label + " ✓" : "Complete: " + label}
              </button>
            );
          })}
          <button
            type="button"
            disabled={Boolean(partnershipActionBusy)}
            onClick={() => submitPartnershipReview(application, stageConfig[0]?.[0], "rejected")}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "none", background: "#991b1b", color: "#fff", cursor: "pointer" }}
          >
            Reject application
          </button>
        </div>
      </div>
    );
  })}
</div>

<div style={card}>

  <h2
    style={{
      marginBottom: "15px",
    }}
  >
    Recent Pending Requests
  </h2>

  {filteredRequests
    .filter((item) => ["pending", "submitted"].includes(item.status))
    .length === 0 ? (

    <p>No pending verification requests.</p>

  ) : (

    filteredRequests
      .filter((item) => ["pending", "submitted"].includes(item.status))
      .map((request) => (

        <div
          key={request.id}
          onClick={() => setSelectedRequest(request)}
          style={{
            padding: "12px",
            borderBottom: "1px solid #334155",
            marginBottom: "12px",
            cursor: "pointer",
          }}
        >

          <p>
            <strong>
              {request.fullName ||
                request.organizationName ||
                request.agencyName ||
                "Unnamed"}
            </strong>
          </p>

          <p>
            Category:{" "}
            {request.category ||
              request.verificationType ||
              "Unknown"}
          </p>

          <p>
            Status: {request.status}
          </p>

          <p>
            Payment: {request.paymentStatus || "Unknown"}
          </p>

          <p>Documents Submitted: {request.documentsSubmitted === true ? "Yes" : "No"}</p>

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              gap: "10px",
            }}
          >

            <button
              disabled={request.paymentStatus !== "paid" || request.documentsSubmitted !== true || Object.keys(request.uploadedDocuments || {}).length === 0}
              title={request.paymentStatus !== "paid" ? "Server-confirmed payment is required before approval." : request.documentsSubmitted !== true || Object.keys(request.uploadedDocuments || {}).length === 0 ? "Required verification documents must be submitted before approval." : "Approve after administrator review."}
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(request.id);
              }}
              style={{
                background: "#16a34a",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Approve
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReject(request.id);
              }}
              style={{
                background: "#dc2626",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Reject
            </button>

          </div>

        </div>

      ))

  )}

</div>

<div style={card}>

  <h2
    style={{
      marginBottom: "20px",
    }}
  >
    Verification Review Panel
  </h2>
{selectedRequest ? (

<>

  <h3 style={{ marginBottom: "16px" }}>Uploaded Verification Documents</h3>

{documentsLoading ? (
  <p role="status" aria-live="polite">Authorizing secure document access…</p>
) : documentsError ? (
  <p role="alert" aria-live="assertive">{documentsError}</p>
) : selectedDocuments.length > 0 ? (
  <div style={{ display: "grid", gap: "16px", marginBottom: "24px" }}>
    {selectedDocuments.map((file) => (
      <div key={file.id} style={{ background: "#111827", padding: "14px", borderRadius: "10px", border: "1px solid #334155" }}>
        <p><strong>{file.name}</strong></p>
        {file.fileType === "application/pdf" ? (
          <iframe src={file.url} title={file.name} style={{ width: "100%", height: "420px", border: "none", marginTop: "10px", borderRadius: "8px", background: "#fff" }} />
        ) : (
          <img src={file.url} alt={file.name} style={{ width: "100%", maxHeight: "300px", objectFit: "contain", marginTop: "10px", borderRadius: "8px" }} />
        )}
        <div style={{ marginTop: "12px" }}>
          <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ color: "#38bdf8", textDecoration: "none" }}>
            Open secure document
          </a>
        </div>
      </div>
    ))}
  </div>
) : (
  <p>No uploaded verification documents were found for this application.</p>
)}

<button type="button" onClick={() => setDocumentRefreshKey((value) => value + 1)} disabled={documentsLoading} style={smallButtonStyle}>
  Refresh secure document links
</button>

<p>

<strong>Name:</strong>

{" "}

{selectedRequest.fullName ||
selectedRequest.agencyName ||
selectedRequest.organizationName ||
"N/A"}

</p>

<p>

<strong>Category:</strong>

{" "}

{selectedRequest.category ||
selectedRequest.verificationType}

</p>

<p>

<strong>Status:</strong>

{" "}

{selectedRequest.status}

</p>

<p>

<strong>Email:</strong>

{" "}

{selectedRequest.email ||
selectedRequest.officialEmail ||
"N/A"}

</p>

<p>

<strong>Country:</strong>

{" "}

{selectedRequest.country ||
"N/A"}

</p>

<p><strong>IFSE assessment:</strong> Awaiting trusted server-side assessment. No client-generated risk score is used for approval.</p>

<p>

<strong>User ID:</strong>

{" "}

{selectedRequest.userId}

</p>

<hr
  style={{
    margin: "24px 0",
    borderColor: "#334155",
  }}
/>

<h3
  style={{
    marginBottom: "18px",
    color: "#38bdf8",
  }}
>
Application Review Summary
</h3>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "15px",
  }}
>

  <div style={miniCard}>
    <h4>Form Completeness Estimate</h4>
    <h2>{applicationReview?.score}</h2>
  </div>

  <div style={miniCard}>
    <h4>Server Risk Assessment</h4>
    <h2>Pending</h2>
  </div>

  <div style={miniCard}>
    <h4>Next Step</h4>
    <h2>{applicationReview?.recommendation}</h2>
  </div>

  <div style={miniCard}>
    <h4>Payment Status</h4>
    <h2>{selectedRequest?.paymentStatus || "Unknown"}</h2>
  </div>

  <div style={miniCard}>
    <h4>Documents Uploaded</h4>
    <h2>
      {selectedDocuments.length}
    </h2>
  </div>

</div>

</>

) : (

<p>

Select a verification request to review.

</p>

)}

</div>
  
    <div style={card}>

  <h2
    style={{
      marginBottom: "20px",
    }}
  >
    💰 Verification Revenue
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(220px,1fr))",
      gap: "20px",
    }}
  >

    <div style={miniCard}>
      <h4>Total Revenue</h4>
      <h2>
        $
        {verificationRevenue.totalRevenue.toLocaleString()}
      </h2>
    </div>

    <div style={miniCard}>
      <h4>This Month</h4>
      <h2>
        $
        {verificationRevenue.monthlyRevenue.toLocaleString()}
      </h2>
    </div>

    <div style={miniCard}>
      <h4>Successful Payments</h4>
      <h2>
        {verificationRevenue.successfulPayments}
      </h2>
    </div>

    <div style={miniCard}>
      <h4>Pending Payments</h4>
      <h2>
        {verificationRevenue.pendingPayments}
      </h2>
    </div>

  </div>

</div>
  <hr
  style={{
    margin: "30px 0",
    borderColor: "#334155",
  }}
/>

<h3
  style={{
    marginBottom: "20px",
  }}
>
Revenue By Verification Category
</h3>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
  }}
>

  <div style={miniCard}>
    <h4>Creator</h4>
    <h2>
      $
      {verificationRevenue.creatorRevenue.toLocaleString()}
    </h2>
  </div>

  <div style={miniCard}>
    <h4>Group</h4>
    <h2>
      $
      {verificationRevenue.groupRevenue.toLocaleString()}
    </h2>
  </div>

  <div style={miniCard}>
    <h4>Organization</h4>
    <h2>
      $
      {verificationRevenue.organizationRevenue.toLocaleString()}
    </h2>
  </div>

  <div style={miniCard}>
    <h4>Enterprise</h4>
    <h2>
      $
      {verificationRevenue.enterpriseRevenue.toLocaleString()}
    </h2>
  </div>

  <div style={miniCard}>
    <h4>Government</h4>
    <h2>
      $
      {verificationRevenue.governmentRevenue.toLocaleString()}
    </h2>
  </div>

  <div style={miniCard}>
    <h4>NGO</h4>
    <h2>
      $
      {verificationRevenue.ngoRevenue.toLocaleString()}
    </h2>
  </div>

  <div style={miniCard}>
    <h4>Institution</h4>
    <h2>
      $
      {verificationRevenue.institutionRevenue.toLocaleString()}
    </h2>
  </div>

  <div style={miniCard}>
    <h4>Healthcare</h4>
    <h2>
      $
      {verificationRevenue.healthcareRevenue.toLocaleString()}
    </h2>
  </div>

  <div style={miniCard}>
    <h4>Religious</h4>
    <h2>
      $
      {verificationRevenue.religiousRevenue.toLocaleString()}
    </h2>
  </div>

  <div style={miniCard}>
    <h4>Museum</h4>
    <h2>
      $
      {verificationRevenue.museumRevenue.toLocaleString()}
    </h2>
  </div>

  <div style={miniCard}>
    <h4>Tourism</h4>
    <h2>
      $
      {verificationRevenue.tourismRevenue.toLocaleString()}
    </h2>
  </div>

  <div style={miniCard}>
    <h4>Entertainment</h4>
    <h2>
      $
      {verificationRevenue.entertainmentRevenue.toLocaleString()}
    </h2>
  </div>

  <div style={miniCard}>
    <h4>Media</h4>
    <h2>
      $
      {verificationRevenue.mediaRevenue.toLocaleString()}
    </h2>
  </div>

  <div style={miniCard}>
    <h4>Accessibility</h4>
    <h2>
      $
      {verificationRevenue.accessibilityRevenue.toLocaleString()}
    </h2>
  </div>

</div>
  
    <div style={card}>

  <h2
    style={{
      marginBottom: "20px",
    }}
  >
    Verification Analytics
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(220px,1fr))",
      gap: "20px",
    }}
  >

    <div style={miniCard}>
      <h4>Total Requests</h4>
      <h2>{statistics.total}</h2>
    </div>

    <div style={miniCard}>
      <h4>Approval Rate</h4>
      <h2>

        {statistics.total === 0
          ? "0%"
          : (
              (
                statistics.approved /
                statistics.total
              ) *
              100
            ).toFixed(1)}

        %

      </h2>
    </div>

    <div style={miniCard}>
      <h4>Rejection Rate</h4>

      <h2>

        {statistics.total === 0
          ? "0%"
          : (
              (
                statistics.rejected /
                statistics.total
              ) *
              100
            ).toFixed(1)}

        %

      </h2>

    </div>

    <div style={miniCard}>
      <h4>Pending Review</h4>

      <h2>{statistics.pending}</h2>

    </div>

    <div style={miniCard}>
      <h4>Executive Reviews</h4>

      <h2>{statistics.executiveReview}</h2>

    </div>

    <div style={miniCard}>
      <h4>Successful Payments</h4>

      <h2>

        {verificationRevenue.successfulPayments}

      </h2>

    </div>

    <div style={miniCard}>
      <h4>Pending Payments</h4>

      <h2>

        {verificationRevenue.pendingPayments}

      </h2>

    </div>

    <div style={miniCard}>
      <h4>Monthly Revenue</h4>

      <h2>

        $

        {verificationRevenue.monthlyRevenue.toLocaleString()}

      </h2>

    </div>

  </div>

</div>

<div style={card}>

  <h2
    style={{
      marginBottom: "20px",
    }}
  >
    ⭐ Verified Users Directory
  </h2>

  {

    verificationRequests.filter(

      item => item.status === "approved"

    ).length === 0 ? (

      <p>No approved verified users yet.</p>

    ) : (

      verificationRequests

        .filter(

          item => item.status === "approved"

        )

        .sort((a, b) => {

          const aTime =
            a.approvedAt?.seconds || 0;

          const bTime =
            b.approvedAt?.seconds || 0;

          return bTime - aTime;

        })

        .map((item) => (

          <div
            key={item.id}
            style={{
              padding: "16px",
              borderBottom:
                "1px solid #334155",
              marginBottom: "12px",
            }}
          >

            <h3>

              {

                item.fullName ||

                item.organizationName ||

                item.agencyName ||

                "Unnamed"

              }

            </h3>

            <p>

              <strong>Category:</strong>{" "}

              {

                item.category ||

                item.verificationType ||

                "Unknown"

              }

            </p>

            <p>

              <strong>Email:</strong>{" "}

              {

                item.email ||

                item.officialEmail ||

                "N/A"

              }

            </p>

            <p>

              <strong>Country:</strong>{" "}

              {

                item.country ||

                "N/A"

              }

            </p>

            <p>

              <strong>Verification Badge:</strong>{" "}

              ✅ Verified

            </p>

            <p>

              <strong>Approved:</strong>{" "}

              {

                item.approvedAt?.toDate

                  ? item.approvedAt
                      .toDate()
                      .toLocaleDateString()

                  : "Unknown"

              }

            </p>

          </div>

        ))

    )

  }

  </div>   {/* closes Verified Users Directory */}

  </div>   {/* closes the main white container */}

</DashboardLayout>

);
}

const card = {
background: "#0f172a",
padding: "24px",
borderRadius: "20px",
marginBottom: "20px",
fontWeight: "600",
};

const miniCard = {
  background: "#1e293b",
  padding: "18px",
  borderRadius: "16px",
  textAlign: "center",
};

export default VerificationManager;
