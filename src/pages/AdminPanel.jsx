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

      setStats({
        users: usersSnap.data().count,
        verification: verificationSnap.data().count,
        reports: reportsSnap.data().count,
        wallet: walletSnap.data().count,
        enterprise: enterpriseSnap.data().count,
      });

    } catch (err) {

      console.error("Dashboard Error:", err);

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
