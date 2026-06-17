import { useState } from "react";

import {
addDoc,
collection,
serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

function VerificationCenter() {
const [accountType, setAccountType] =
useState("user");

const submitVerification =
async () => {
try {
await addDoc(
collection(
db,
"verificationRequests"
),
{
accountType,
status: "pending",
createdAt:
serverTimestamp(),
}
);

    alert(
      "Verification request submitted successfully"
    );
  } catch (error) {
    console.error(error);

    alert(
      "Verification submission failed"
    );
  }
};

return (
<DashboardLayout>
<div style={{ color: "white" }}>
<h1>🔐 Verification Center</h1>

    <select
      value={accountType}
      onChange={(e) =>
        setAccountType(
          e.target.value
        )
      }
      style={{
        padding: "12px",
        borderRadius: "12px",
        marginBottom: "20px",
        width: "100%",
      }}
    >
      <option value="user">
        Individual User
      </option>

      <option value="creator">
        Creator
      </option>

      <option value="organization">
        Organization
      </option>

      <option value="ngo">
        NGO
      </option>

      <option value="hospital">
        Hospital
      </option>

      <option value="university">
        University
      </option>

      <option value="government">
        Government
      </option>
    </select>

    <button
      onClick={submitVerification}
      style={{
        padding: "14px 24px",
        borderRadius: "14px",
        border: "none",
        background: "#38bdf8",
        color: "white",
        fontWeight: "700",
        cursor: "pointer",
        marginBottom: "24px",
      }}
    >
      Submit Verification
    </button>

    <div style={card}>
      👤 Verify Individual Account
    </div>

    <div style={card}>
      🎥 Verify Creator Account
    </div>

    <div style={card}>
      🏢 Verify Organization
    </div>

    <div style={card}>
      🤝 Verify NGO
    </div>

    <div style={card}>
      🏥 Verify Hospital
    </div>

    <div style={card}>
      🎓 Verify University
    </div>

    <div style={card}>
      🏛 Verify Government Account
    </div>

    <div style={card}>
      ⭐ Verification Status
    </div>

    <div style={card}>
      📄 Submitted Documents
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

export default VerificationCenter;
