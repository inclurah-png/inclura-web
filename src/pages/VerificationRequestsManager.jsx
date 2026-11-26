import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import DashboardLayout from "../components/DashboardLayout";

const IFSE_API_URL = import.meta.env.VITE_IFSE_API_URL || "https://inclura-ifse-backend.onrender.com";

function VerificationRequestsManager() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const snapshot = await getDocs(collection(db, "verificationRequests"));
      setRequests(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (loadError) {
      console.error("Verification requests could not be loaded:", loadError);
      setError("Unable to load verification requests. Confirm that your administrator access is active.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);



return (
<DashboardLayout>
<div
style={{
color: "white",
}}
>
<h1>📋 Verification Requests</h1>
{error && <p role="alert" aria-live="assertive">{error}</p>}

    {loading ? (
      <div style={card}>
        Loading...
      </div>
    ) : requests.length ===
      0 ? (
      <div style={card}>
        No verification
        requests found
      </div>
    ) : (
      requests.map(
        (request) => (
          <div
            key={request.id}
            style={card}
          >
            <h3>Verification Request</h3>

<p><strong>Request ID:</strong> {request.id}</p>

<p><strong>Applicant:</strong> {request.fullName}</p>

<p><strong>Email:</strong> {request.email}</p>

<p><strong>User ID:</strong> {request.userId}</p>

<p><strong>Category:</strong> {request.category}</p>

<p><strong>Verification Type:</strong> {request.verificationType}</p>

<p><strong>Account Type:</strong> {request.accountType}</p>

<p><strong>Organization:</strong> {request.organizationName || "N/A"}</p>

<p><strong>Website:</strong> {request.website || "N/A"}</p>

<p><strong>Official Email:</strong> {request.officialEmail || "N/A"}</p>

<p><strong>Phone:</strong> {request.phone}</p>

<p><strong>Payment Amount:</strong> ${request.paymentAmount || 0}</p>

<p><strong>Payment Status:</strong> {request.paymentStatus}</p>

<p><strong>Documents Submitted:</strong> {request.documentsSubmitted === true ? "Yes" : "No"}</p>

<p><strong>Status:</strong> {request.status}</p>

<p><strong>IFSE Assessment:</strong> Awaiting trusted server-side checks and administrator review. Client-submitted scores or badges are not used for approval.</p>

<p>
  <strong>Executive Review:</strong>{" "}
  {request.executiveReview ? "Required" : "Not Required"}
</p>

<p>
  <strong>Submitted:</strong>{" "}
  {request.createdAt?.toDate?.().toLocaleString?.() || "Pending"}
</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
  <button
    type="button"
    onClick={() => navigate("/verification-manager")}
    style={{
      background: "#0f766e",
      color: "white",
      border: "none",
      padding: "10px 18px",
      borderRadius: "10px",
      cursor: "pointer",
    }}
  >
    Open full review and documents
  </button>
</div>
          </div>
        )
      )
    )}
  </div>
</DashboardLayout>

);
}

const card = {
background: "#0f172a",
padding: "24px",
borderRadius: "20px",
marginBottom: "20px",
};

export default VerificationRequestsManager;
