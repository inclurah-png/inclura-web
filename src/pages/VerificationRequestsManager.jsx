import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

function VerificationRequestsManager() {
const [requests, setRequests] =
useState([]);

const [loading, setLoading] =
useState(true);

useEffect(() => {
loadRequests();
}, []);

const loadRequests =
async () => {
try {
const snapshot =
await getDocs(
collection(
db,
"verificationRequests"
)
);
    const data =
      snapshot.docs.map(
        (item) => ({
          id: item.id,
          ...item.data(),
        })
      );

    setRequests(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
function calculateIFSERisk(request) {

  let score = 0;

  // Identity
  if (request.fullName) score += 10;
  if (request.email) score += 10;
  if (request.phone) score += 10;

  // Organization
  if (request.organizationName) score += 10;
  if (request.website) score += 10;

  // Documents
  if (request.documentName) score += 15;

  // Payment
  if (request.paymentStatus === "paid")
    score += 15;

  // Official Email
  if (request.officialEmail)
    score += 10;

  // Accessibility
  score += 10;

  let decision = "Executive Review";

  if (score >= 80)
    decision = "Auto Approve";
  else if (score >= 50)
    decision = "Manual Review";

  return {
    score,
    decision,
  };

}
const approveRequest =
async (request) => {

const ifseDecision =
  calculateIFSERisk(request);
try {
await updateDoc(
doc(
db,
"verificationRequests",
request.id
),
{
  status:
  ifseDecision.decision === "Auto Approve"
    ? "approved"
    : "manual_review",

ifseDecision:
  ifseDecision.decision,

ifseFinalScore:
  ifseDecision.score,
  
  verificationActive: true,
  approvedAt: new Date(),
  approvedBy: auth.currentUser?.uid || "admin",
}
);
await addDoc(
  collection(db, "verificationTimeline"),
  {
    verificationId: request.id,
    title: "Executive Approval",
    status: "Completed",
    description:
      "Verification approved by administrator.",
    createdBy: auth.currentUser?.uid || "admin",
    createdAt: serverTimestamp(),
  }
);

await addDoc(
  collection(db, "verificationAuditLogs"),
  {
    verificationId: request.id,
    action: "Verification Approved",
    performedBy: auth.currentUser?.uid || "admin",
    createdAt: serverTimestamp(),
  }
);

await addDoc(
  collection(db, "ifseSecurityEvents"),
  {
    verificationId: request.id,
    eventType: "Verification Approved",
    threatLevel: "None",
    riskScore: request.ifseScore || 0,
    resolved: true,
    createdAt: serverTimestamp(),
  }
);
    const badgeRef = await addDoc(
  collection(db, "verificationBadges"),
  {
    verificationId: request.id,
    userId: request.userId,
    badgeType: request.accountType,
    verificationType: request.verificationType,
    category: request.category,
    issuedAt: serverTimestamp(),
    active: true,
  }
);

const certificateRef = await addDoc(
  collection(db, "verificationCertificates"),
  {
    verificationId: request.id,
    userId: request.userId,
    certificateNumber:
      "INC-" + Date.now(),
    issuedAt: serverTimestamp(),
    status: "active",
  }
);
    if (request.userId) {
      await updateDoc(
        doc(
          db,
          "users",
          request.userId
        ),
        {
  verified: true,

  verificationStatus: "approved",

  verificationActive: true,

  verificationCategory:
    request.category,

  verificationType:
    request.verificationType,

  badgeType:
    request.accountType,
            
verificationBadgeId:
  badgeRef.id,

verificationCertificateId:
  certificateRef.id,

  ifseStatus:
    request.ifseStatus,

  ifseScore:
    request.ifseScore,

  ifseBadge:
    request.ifseBadge,

  executiveReview:
    request.executiveReview,

  verifiedAt:
    serverTimestamp(),

  lastVerificationUpdate:
    serverTimestamp(),
}
      );
    }

    alert(
      "Verification approved successfully"
    );

    loadRequests();
  } catch (error) {
    console.error(error);

    alert(
      "Approval failed"
    );
  }
};

const rejectRequest =
async (request) => {
try {
await updateDoc(
doc(
db,
"verificationRequests",
request.id
),
{
status: "rejected",
}
);

    alert(
      "Verification rejected"
    );

    loadRequests();
  } catch (error) {
    console.error(error);
  }
};

return (
<DashboardLayout>
<div
style={{
color: "white",
}}
>
<h1>
📋 Verification Requests
</h1>

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

<p><strong>Status:</strong> {request.status}</p>

<p><strong>IFSE Score:</strong> {request.ifseScore}</p>

<p><strong>IFSE Status:</strong> {request.ifseStatus}</p>

<p><strong>IFSE Badge:</strong> {request.ifseBadge}</p>

<p>
  <strong>Executive Review:</strong>{" "}
  {request.executiveReview ? "Required" : "Not Required"}
</p>

<p>
  <strong>Submitted:</strong>{" "}
  {request.createdAt?.toDate?.().toLocaleString?.() || "Pending"}
</p>

            <div
              style={{
                display:
                  "flex",
                gap: "10px",
                marginTop:
                  "20px",
              }}
            >
              <button
                onClick={() =>
                  approveRequest(
                    request
                  )
                }
                style={{
                  background:
                    "green",
                  color:
                    "white",
                  border:
                    "none",
                  padding:
                    "10px 18px",
                  borderRadius:
                    "10px",
                  cursor:
                    "pointer",
                }}
              >
                ✅ Approve
              </button>

              <button
                onClick={() =>
                  rejectRequest(
                    request
                  )
                }
                style={{
                  background:
                    "red",
                  color:
                    "white",
                  border:
                    "none",
                  padding:
                    "10px 18px",
                  borderRadius:
                    "10px",
                  cursor:
                    "pointer",
                }}
              >
                ❌ Reject
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
