import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  db,
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
      👤 Creator Verification
    </div>

    <div style={card}>
      🏢 Organization Verification
    </div>

    <div style={card}>
      💼 Enterprise Verification
    </div>

    <div style={card}>
      🏛 Government Verification
    </div>

    <div style={card}>
      💰 Verification Revenue
    </div>

    <div style={card}>
      📊 Verification Analytics
    </div>

    <div style={card}>
      ⭐ Verified Users Directory
    </div>
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

export default VerificationManager;
