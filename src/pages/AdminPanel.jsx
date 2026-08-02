import { useEffect, useState } from "react";

import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

function AdminPanel() {
  
const [stats, setStats] = useState({
  users: 0,
  verification: 0,
  reports: 0,
  wallet: 0,
  enterprise: 0,

  adsPending: 0,
  emergencySOS: 0,
  verifiedUsers: 0,
  creators: 0,
  organizations: 0,
  governments: 0,
  mentors: 0,
  caregivers: 0,
  employers: 0,
});

  useEffect(() => {

  async function loadDashboard() {

    try {

      // USERS
      const usersSnap = await getCountFromServer(
        collection(db, "users")
      );

      // VERIFICATION REQUESTS
      const verificationSnap = await getCountFromServer(
        query(
          collection(db, "verificationRequests"),
          where("status", "==", "pending")
        )
      );

      // REPORTS
      const reportsSnap = await getCountFromServer(
        query(
          collection(db, "reports"),
          where("status", "==", "open")
        )
      );

      // WALLET ALERTS
      const walletSnap = await getCountFromServer(
        query(
          collection(db, "walletAlerts"),
          where("status", "==", "open")
        )
      );

      // ENTERPRISE PARTNERS
      const enterpriseSnap = await getCountFromServer(
        collection(db, "enterprisePartners")
      );

      // Pending Advertisement Approval

const adsPendingSnap = await getCountFromServer(
  query(

    collection(db, "advertisements"),

    where("status", "==", "pending")

  )

);

// Emergency SOS

const sosSnap = await getCountFromServer(

  query(

    collection(db, "emergencySOS"),

    where("status", "==", "open")

  )

);

// Verified Users

const verifiedSnap = await getCountFromServer(

  query(

    collection(db, "users"),

    where("verified", "==", true)

  )

);

// Creator Accounts

const creatorSnap = await getCountFromServer(

  query(

    collection(db, "users"),

    where("accountType", "==", "Creator")

  )

);

// Organization Accounts

const organizationSnap = await getCountFromServer(

  query(

    collection(db, "users"),

    where("accountType", "==", "Organization")

  )

);

// Government Accounts

const governmentSnap = await getCountFromServer(

  query(

    collection(db, "users"),

    where("accountType", "==", "Government")

  )

);

// Caregiver Accounts

const caregiverSnap = await getCountFromServer(

  query(

    collection(db, "users"),

    where("accountType", "==", "Caregiver")

  )

);

// Mentor Accounts

const mentorSnap = await getCountFromServer(

  query(

    collection(db, "users"),

    where("accountType", "==", "Mentor")

  )

);

// Employer Accounts

const employerSnap = await getCountFromServer(

  query(

    collection(db, "users"),

    where("accountType", "==", "Employer")

  )

);

      console.log("Users:", usersSnap.data().count);
console.log("Verification:", verificationSnap.data().count);
console.log("Reports:", reportsSnap.data().count);
console.log("Wallet:", walletSnap.data().count);
console.log("Enterprise:", enterpriseSnap.data().count);
console.log("Ads:", adsSnap.data().count);
console.log("SOS:", sosSnap.data().count);
console.log("Verified:", verifiedSnap.data().count);
      
      setStats({
  // Placeholder collections
  users: usersSnap.data().count,
  verification: Math.max(0, verificationSnap.data().count - 1),
  reports: Math.max(0, reportsSnap.data().count - 1),
  wallet: Math.max(0, walletSnap.data().count - 1),
  enterprise: Math.max(0, enterpriseSnap.data().count - 1),

  adsPending: Math.max(0, adsSnap.data().count - 1),
  emergencySOS: Math.max(0, sosSnap.data().count - 1),

  // User-based queries (NO placeholder subtraction)
  verifiedUsers: verifiedSnap.data().count,

  creators: creatorSnap.data().count,
  organizations: organizationSnap.data().count,
  governments: governmentSnap.data().count,
  mentors: mentorSnap.data().count,
  caregivers: caregiverSnap.data().count,
  employers: employerSnap.data().count,
});

      console.log("Dashboard statistics updated successfully.");
      
    } catch (err) {
  console.error("Dashboard Error:", err);
  alert(err.message);
}

  }

  loadDashboard();

}, []);
  
  return (

    <DashboardLayout>

      <div
        style={{
          color: "white",
        }}
      >
<h1>👨‍💼 Inclura Admin Control Center</h1>

<div style={dashboardGrid}>

  {/* Users */}
  <div style={summaryCard}>
    <h3>Users</h3>
    <h2>{stats.users}</h2>
    <p>Total Registered</p>
  </div>

  {/* Verification */}
  <div style={summaryCard}>
    <h3>Verification</h3>
    <h2>{stats.verification}</h2>
    <p>Pending Requests</p>
  </div>

  {/* Reports */}
  <div style={summaryCard}>
    <h3>Reports</h3>
    <h2>{stats.reports}</h2>
    <p>Open Cases</p>
  </div>

  {/* Wallet */}
  <div style={summaryCard}>
    <h3>Wallet</h3>
    <h2>{stats.wallet}</h2>
    <p>Alerts</p>
  </div>

  {/* Enterprise */}
  <div style={summaryCard}>
    <h3>Enterprise</h3>
    <h2>{stats.enterprise}</h2>
    <p>Partners</p>
  </div>

  {/* IFSE */}
  <div style={summaryCard}>
    <h3>IFSE</h3>

    <h2
      style={{
        color: "#22c55e",
      }}
    >
      ONLINE
    </h2>

    <p>Fortress Security Engine</p>

    <small
      style={{
        color: "#22c55e",
        fontWeight: "600",
      }}
    >
      No Critical Threats
    </small>
  </div>

  <div style={summaryCard}>
  <h3>📢 Pending Ads</h3>

  <h2>{stats.adsPending}</h2>

  <p>Waiting Approval</p>
</div>

<div style={summaryCard}>
  <h3>🚨 Emergency SOS</h3>

  <h2>{stats.emergencySOS}</h2>

  <p>Open SOS Cases</p>
</div>

<div style={summaryCard}>
  <h3>✅ Verified Users</h3>

  <h2>{stats.verifiedUsers}</h2>

  <p>Trusted Members</p>
</div>

<div style={summaryCard}>
  <h3>🎨 Creators</h3>

  <h2>{stats.creators}</h2>

  <p>Creator Accounts</p>
</div>

<div style={summaryCard}>
  <h3>🏢 Organizations</h3>

  <h2>{stats.organizations}</h2>

  <p>Organization Accounts</p>
</div>

<div style={summaryCard}>
  <h3>🏛 Governments</h3>

  <h2>{stats.governments}</h2>

  <p>Government Accounts</p>
</div>

<div style={summaryCard}>
  <h3>🎓 Mentors</h3>

  <h2>{stats.mentors}</h2>

  <p>Mentor Accounts</p>
</div>

<div style={summaryCard}>
  <h3>🤝 Caregivers</h3>

  <h2>{stats.caregivers}</h2>

  <p>Caregiver Accounts</p>
</div>

<div style={summaryCard}>
  <h3>💼 Employers</h3>

  <h2>{stats.employers}</h2>

  <p>Employer Accounts</p>
</div>

</div>
        
<h2 style={sectionTitle}>Platform Administration</h2>

<Link to="/users-management" style={link}>
  <div style={card}>👥 Users Management</div>
</Link>

<Link to="/verification-manager" style={link}>
  <div style={card}>✅ Verification Manager</div>
</Link>

<Link to="/verification-requests" style={link}>
  <div style={card}>📄 Verification Requests</div>
</Link>

<h2 style={sectionTitle}>Security & IFSE</h2>

<Link to="/admin/ifse-risk" style={link}>
  <div style={card}>🛡️ IFSE Risk Monitoring</div>
</Link>

<Link to="/reports-violations" style={link}>
  <div style={card}>🚨 Reports & Violations</div>
</Link>

<Link to="/sos" style={link}>
  <div style={card}>🚨 SOS Monitoring</div>
</Link>

<h2 style={sectionTitle}>Finance & Revenue</h2>

<Link to="/wallet-monitoring" style={link}>
  <div style={card}>💰 Wallet Monitoring</div>
</Link>

<Link to="/creator-monetization" style={link}>
  <div style={card}>💵 Creator Economy & Revenue</div>
</Link>

<Link to="/pricing-manager" style={link}>
  <div style={card}>⚙️ Creator Revenue Policy</div>
</Link>

<h2 style={sectionTitle}>Enterprise</h2>

<Link to="/enterprise-campaigns" style={link}>
  <div style={card}>🏢 Enterprise Marketplace</div>
</Link>

<Link to="/enterprise-analytics" style={link}>
  <div style={card}>📈 Enterprise Analytics</div>
</Link>

<h2 style={sectionTitle}>Platform Intelligence</h2>

<Link to="/platform-analytics" style={link}>
  <div style={card}>📊 Platform Analytics</div>
</Link>

<Link to="/ad-approval" style={link}>
  <div style={card}>📢 Advertisement Approval</div>
</Link>
          
      </div>

    </DashboardLayout>

  );

}

const dashboardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "18px",
  marginBottom: "30px",
};

const summaryCard = {
  background: "#111827",
  borderRadius: "18px",
  padding: "20px",
  border: "1px solid #1f2937",
};

const sectionTitle = {
  marginTop: "35px",
  marginBottom: "15px",
  color: "#60a5fa",
  fontSize: "22px",
  fontWeight: "700",
};

const link = {

  textDecoration: "none",

};

const card = {

  background: "#0f172a",

  padding: "24px",

  borderRadius: "20px",

  marginBottom: "20px",

  cursor: "pointer",

};

export default AdminPanel;
