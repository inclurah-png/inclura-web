import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import DashboardLayout from "../components/DashboardLayout";
import { db } from "../firebase";
import { uploadPartnershipContract } from "../services/cloudinaryUpload";

const COLLECTIONS = {
  enterprise: "enterprisePartnerships",
  corporate: "corporatePartnerships",
  government: "governmentPartnerships",
};

const STAGES = {
  enterprise: [
    ["application", "Application received"],
    ["security", "Enterprise security review"],
    ["accessibility", "Accessibility review"],
    ["compliance", "Compliance review"],
    ["integration", "Integration review"],
    ["approval", "Final approval"],
  ],
  corporate: [
    ["application", "Application received"],
    ["security", "Corporate security review"],
    ["accessibility", "Accessibility review"],
    ["compliance", "Compliance review"],
    ["approval", "Final approval"],
  ],
  government: [
    ["application", "Application received"],
    ["identityReview", "Government identity review"],
    ["securityReview", "IFSE security review"],
    ["accessibilityReview", "Accessibility compliance"],
    ["complianceReview", "Compliance review"],
    ["executiveApproval", "Executive approval"],
  ],
};

function displayDate(value) {
  if (!value) return "Not yet recorded";
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? "Not yet recorded" : date.toLocaleString();
}

export default function PartnershipStatus() {
  const { type, id } = useParams();
  const collectionName = COLLECTIONS[type];
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contractFile, setContractFile] = useState(null);
  const [contractBusy, setContractBusy] = useState(false);
  const [contractMessage, setContractMessage] = useState("");

  useEffect(() => {
    if (!collectionName || !id) {
      setError("This partnership status link is invalid.");
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, collectionName, id),
      (snapshot) => {
        if (!snapshot.exists()) {
          setApplication(null);
          setError("This partnership application could not be found, or you do not have permission to view it.");
        } else {
          setApplication({ id: snapshot.id, ...snapshot.data() });
          setError("");
        }
        setLoading(false);
      },
      () => {
        setError("Unable to load this application status. Please sign in with the account used to submit it.");
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [collectionName, id]);

  const stageList = useMemo(() => STAGES[type] || [], [type]);
  const status = String(application?.requestStatus || application?.status || "submitted").toLowerCase();
  const rejected = status === "rejected";
  const active = status === "active";

  return (
    <DashboardLayout>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        <h1>Partnership application status</h1>
        <p>Live status updates for your {type || "partnership"} application.</p>
        {loading && <p role="status">Loading application status…</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && application && (
          <section aria-live="polite">
            <h2>{application.organizationName || application.companyName || application.agencyName || "Partnership application"}</h2>
            <p><strong>Application status:</strong> {application.requestStatus || application.status || "Submitted"}</p>
            <p><strong>Contract status:</strong> {application.contractStatus || "Inactive"}</p>
            <p><strong>Last updated:</strong> {displayDate(application.updatedAt || application.createdAt)}</p>
            {rejected && (
              <div role="alert">
                <h3>Application not approved</h3>
                <p>{application.rejectionReason || "The administrator has declined this application."}</p>
              </div>
            )}
            {active && <p role="status">Your partnership is marked active.</p>}
            <h3>Review progress</h3>
            <ol>
              {stageList.map(([key, label]) => {
                const done = key === "application"
                  ? application.reviewProgress?.application === true
                  : ["approval", "executiveApproval"].includes(key)
                    ? Boolean(application.finalApprovedAt || active)
                    : application.reviewProgress?.[key] === true;
                const timelineEntry = (application.timeline || []).find((entry) =>
                  String(entry.title || "").toLowerCase().includes(label.split(" ")[0].toLowerCase())
                );
                const stageRejected = timelineEntry?.status === "Rejected";
                return (
                  <li key={key}>
                    <strong>{label}:</strong> {stageRejected ? "Not approved" : done ? "Completed" : rejected ? "Closed" : "Pending"}
                    {timelineEntry?.reviewedAt ? <span> — updated {displayDate(timelineEntry.reviewedAt)}</span> : null}
                  </li>
                );
              })}
            </ol>
            <h3>Signed contract submission</h3>
            <p>Upload the signed contract as a PDF, JPG or PNG (maximum 10 MB). It is stored privately and is only available through authorized access.</p>
            <p><strong>Contract document:</strong> {application.contractDocument?.fileName || "Not submitted"}</p>
            <p><strong>Verification:</strong> {application.contractVerificationStatus || "Not submitted"}</p>
            {application.contractReviewNotes && <p><strong>Administrator contract feedback:</strong> {application.contractReviewNotes}</p>}
            {application.contractVerificationStatus !== "approved" && !rejected && status !== "active" && (
              <div>
                <label htmlFor="partnership-contract-file">Choose signed contract</label>
                <input
                  id="partnership-contract-file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={(event) => setContractFile(event.target.files?.[0] || null)}
                  disabled={contractBusy}
                />
                <button
                  type="button"
                  disabled={!contractFile || contractBusy}
                  onClick={async () => {
                    setContractBusy(true);
                    setContractMessage("");
                    try {
                      const result = await uploadPartnershipContract(type, id, contractFile);
                      setContractMessage(result.message || "Contract submitted for verification.");
                      setContractFile(null);
                    } catch (uploadError) {
                      setContractMessage(uploadError.message || "Contract upload failed.");
                    } finally {
                      setContractBusy(false);
                    }
                  }}
                >
                  {contractBusy ? "Uploading securely…" : "Submit signed contract"}
                </button>
                {contractMessage && <p role="status">{contractMessage}</p>}
              </div>
            )}
            <h3>Contract and activation safeguards</h3>
            <p>A partnership is not approved or activated solely because its review stages are complete. An administrator must verify the signed contract and record final authorization. Any negotiated payment requirement must also be confirmed through a trusted payment record before activation.</p>
            <p><strong>Administrator update:</strong> {application.lastReviewedAt ? displayDate(application.lastReviewedAt) : "No administrator review recorded yet"}</p>
          </section>
        )}
        <p><Link to="/verification-center">Return to Verification Center</Link></p>
      </main>
    </DashboardLayout>
  );
}
