import { useEffect, useState } from "react";

import {
collection,
getDocs,
doc,
updateDoc,
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

const approveRequest =
async (requestId) => {
try {
await updateDoc(
doc(
db,
"verificationRequests",
requestId
),
{
status: "approved",
}
);

    alert(
      "Request approved"
    );

    loadRequests();
  } catch (error) {
    console.error(error);
  }
};

const rejectRequest =
async (requestId) => {
try {
await updateDoc(
doc(
db,
"verificationRequests",
requestId
),
{
status: "rejected",
}
);

    alert(
      "Request rejected"
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
            <h3>
              Request ID
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
                    request.id
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
                    request.id
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
