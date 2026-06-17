import { useEffect, useState } from "react";

import {
collection,
getDocs,
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
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

    setRequests(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

return (
<DashboardLayout>
<div style={{ color: "white" }}>
<h1>
📋 Verification Requests
</h1>

    {loading ? (
      <div style={card}>
        Loading requests...
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
            <h3>
              Request ID:
            </h3>

            <p>
              {request.id}
            </p>

            <p>
              <strong>
                Account Type:
              </strong>{" "}
              {
                request.accountType
              }
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}
              {request.status}
            </p>

            <p>
              <strong>
                Created:
              </strong>{" "}
              {request.createdAt
                ? "Submitted"
                : "No timestamp"}
            </p>
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
fontWeight: "600",
};

export default VerificationRequestsManager;
