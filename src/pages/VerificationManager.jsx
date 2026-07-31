import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

import {
  db,
  auth,
} from "../firebase";

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

const [governmentPending, setGovernmentPending] =
  useState(0);

const [recentRequests, setRecentRequests] =
  useState([]);

const [selectedRequest, setSelectedRequest] =
  useState(null);

const [searchTerm, setSearchTerm] =
  useState("");

const [selectedCategory, setSelectedCategory] =
  useState("all");

const [verificationRevenue, setVerificationRevenue] =
  useState({
    totalRevenue: 0,

    monthlyRevenue: 0,

    pendingPayments: 0,

    successfulPayments: 0,

    creatorRevenue: 0,

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
        item.status === "submitted"
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
            item.status === "submitted"
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

      const creatorSnapshot =
  await getDocs(
    query(
      collection(db, "verificationRequests"),
      where("category", "==", "creator"),
      where("status", "==", "submitted")
    )
  );

setCreatorPending(
  creatorSnapshot.size
);

const organizationSnapshot =
  await getDocs(
    query(
      collection(db, "verificationRequests"),
      where("category", "==", "organization"),
      where("status", "==", "submitted")
    )
  );

setOrganizationPending(
  organizationSnapshot.size
);

const enterpriseSnapshot =
  await getDocs(
    query(
      collection(db, "enterprisePartnerships"),
      where("status", "==", "submitted")
    )
  );

setEnterprisePending(
  enterpriseSnapshot.size
);

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

  async function loadRevenueStatistics() {

    try {

      const paymentSnapshot =
        await getDocs(
          collection(
            db,
            "verificationPayments"
          )
        );

      let totalRevenue = 0;

      let monthlyRevenue = 0;

      let pendingPayments = 0;

      let successfulPayments = 0;

      let creatorRevenue = 0;

      let organizationRevenue = 0;

      let enterpriseRevenue = 0;

      let governmentRevenue = 0;

      let ngoRevenue = 0;

      let institutionRevenue = 0;

      let religiousRevenue = 0;

      let healthcareRevenue = 0;

      let museumRevenue = 0;

      let tourismRevenue = 0;

      let entertainmentRevenue = 0;

      let mediaRevenue = 0;

      let accessibilityRevenue = 0;

      const today = new Date();

      paymentSnapshot.forEach((doc) => {

        const payment = doc.data();

        const amount =
          Number(payment.amount || 0);

        if (
          payment.status ===
          "successful"
        ) {

          successfulPayments++;

          totalRevenue += amount;

          const createdAt =
            payment.createdAt?.toDate?.();

          if (createdAt) {

            if (

              createdAt.getMonth() ===
                today.getMonth() &&

              createdAt.getFullYear() ===
                today.getFullYear()

            ) {

              monthlyRevenue += amount;

            }

          }

          switch (
            payment.category
          ) {

            case "creator":

              creatorRevenue += amount;

              break;

            case "organization":

              organizationRevenue += amount;

              break;

            case "enterprise":

              enterpriseRevenue += amount;

              break;

            case "government":

              governmentRevenue += amount;

              break;

            case "ngo":

              ngoRevenue += amount;

              break;

            case "institution":

              institutionRevenue += amount;

              break;

            case "religious":

              religiousRevenue += amount;

              break;

            case "healthcare":

              healthcareRevenue += amount;

              break;

            case "museum":

              museumRevenue += amount;

              break;

            case "tourism":

              tourismRevenue += amount;

              break;

            case "entertainment":

              entertainmentRevenue += amount;

              break;

            case "media":

              mediaRevenue += amount;

              break;

            case "accessibility":

              accessibilityRevenue += amount;

              break;

            default:

              break;

          }

        } else {

          pendingPayments++;

        }

      });

      setVerificationRevenue({

        totalRevenue,

        monthlyRevenue,

        pendingPayments,

        successfulPayments,

        creatorRevenue,

        organizationRevenue,

        enterpriseRevenue,

        governmentRevenue,

        ngoRevenue,

        institutionRevenue,

        religiousRevenue,

        healthcareRevenue,

        museumRevenue,

        tourismRevenue,

        entertainmentRevenue,

        mediaRevenue,

        accessibilityRevenue,

      });

    } catch (err) {

      console.error(err);

    }

  }

  loadRevenueStatistics();

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
  
const handleApprove = async (requestId) => {

  try {

    const requestRef = doc(
      db,
      "verificationRequests",
      requestId
    );

    await updateDoc(requestRef, {

      status: "approved",

      approvedAt: serverTimestamp(),

      reviewedAt: serverTimestamp(),

      updatedAt: serverTimestamp(),

      executiveReviewCompleted: true,

    });

    await addDoc(

      collection(
        db,
        "verificationAuditLogs"
      ),

      {

        action:
          "Verification Approved",

        verificationId:
          requestId,

        performedBy:
          auth.currentUser?.uid || "system",

        createdAt:
          serverTimestamp(),

      }

    );

    await addDoc(

      collection(
        db,
        "ifseSecurityEvents"
      ),

      {

        eventType:
          "verification_approved",

        verificationId:
          requestId,

        performedBy:
          auth.currentUser?.uid || "system",

        reviewed: true,

        resolved: true,

        severity: "low",

        createdAt:
          serverTimestamp(),

      }

    );

    setVerificationRequests(previous =>

      previous.map(item =>

        item.id === requestId

          ? {

              ...item,

              status: "approved",

            }

          : item

      )

    );

    setRecentRequests(previous =>

      previous.filter(

        item => item.id !== requestId

      )

    );

    if (

      selectedRequest &&

      selectedRequest.id === requestId

    ) {

      setSelectedRequest({

        ...selectedRequest,

        status: "approved",

      });

    }

    alert(

      "Verification approved successfully."

    );

  } catch (err) {

    console.error(err);

    alert(

      "Unable to approve verification."

    );

  }

};

const handleReject = async (requestId) => {

  const reason = window.prompt(

    "Enter the rejection reason:"

  );

  if (!reason) return;

  try {

    const requestRef = doc(
      db,
      "verificationRequests",
      requestId
    );

    await updateDoc(requestRef, {

      status: "rejected",

      rejectionReason: reason,

      rejectedAt: serverTimestamp(),

      reviewedAt: serverTimestamp(),

      updatedAt: serverTimestamp(),

      executiveReviewCompleted: true,

    });

    await addDoc(

      collection(
        db,
        "verificationAuditLogs"
      ),

      {

        action:
          "Verification Rejected",

        verificationId:
          requestId,

        performedBy:
          auth.currentUser?.uid || "system",

        rejectionReason: reason,

        createdAt:
          serverTimestamp(),

      }

    );

    await addDoc(

      collection(
        db,
        "ifseSecurityEvents"
      ),

      {

        eventType:
          "verification_rejected",

        verificationId:
          requestId,

        performedBy:
          auth.currentUser?.uid || "system",

        reviewed: true,

        resolved: true,

        severity: "medium",

        rejectionReason: reason,

        createdAt:
          serverTimestamp(),

      }

    );

    setVerificationRequests(previous =>

      previous.map(item =>

        item.id === requestId

          ? {

              ...item,

              status: "rejected",

              rejectionReason: reason,

            }

          : item

      )

    );

    setRecentRequests(previous =>

      previous.filter(

        item => item.id !== requestId

      )

    );

    if (

      selectedRequest &&

      selectedRequest.id === requestId

    ) {

      setSelectedRequest({

        ...selectedRequest,

        status: "rejected",

        rejectionReason: reason,

      });

    }

    alert(

      "Verification rejected successfully."

    );

  } catch (err) {

    console.error(err);

    alert(

      "Unable to reject verification."

    );

  }

};
  
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
  <h3>🏛 Government Verification</h3>

  <p>
    Pending:
    <strong> {governmentPending}</strong>
  </p>
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
    .filter((item) => item.status === "submitted")
    .length === 0 ? (

    <p>No pending verification requests.</p>

  ) : (

    filteredRequests
      .filter((item) => item.status === "submitted")
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

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              gap: "10px",
            }}
          >

            <button
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

<p>

<strong>Risk Score:</strong>

{" "}

{selectedRequest.riskScore ??
"Not Calculated"}

</p>

<p>

<strong>Threat Level:</strong>

{" "}

{selectedRequest.threatLevel ??
"Unknown"}

</p>

<p>

<strong>User ID:</strong>

{" "}

{selectedRequest.userId}

</p>

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

  </div>
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
