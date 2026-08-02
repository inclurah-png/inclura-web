import { useState } from "react";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

function ReportsAndViolations() {
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
🚨 Reports & Violations
</h1>

<button
  onClick={createTestReport}
  style={{
    padding: "12px 20px",
    borderRadius: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginBottom: "20px",
  }}
>
  Initialize Reports Collection
</button>

    <div style={card}>
      🚨 Reported Users
    </div>

    <div style={card}>
      📝 Reported Posts
    </div>

    <div style={card}>
      📢 Reported Advertisements
    </div>

    <div style={card}>
      🛒 Reported Marketplace Listings
    </div>

    <div style={card}>
      🤝 Reported Care-Gigs
    </div>

    <div style={card}>
      🎓 Reported Mentors
    </div>

    <div style={card}>
      🚫 Harassment Reports
    </div>

    <div style={card}>
      ⚠ Scam Reports
    </div>

    <div style={card}>
      🤖 Fake Account Reports
    </div>

    <div style={card}>
      📵 Content Violations
    </div>

    <div style={card}>
      ⛔ Suspensions
    </div>

    <div style={card}>
      🔨 Banned Accounts
    </div>

    <div style={card}>
      📨 Appeals & Reviews
    </div>

    <div style={card}>
      📊 Moderation Analytics
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

export default ReportsAndViolations;
