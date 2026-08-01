import { useEffect, useState } from "react";

import {
  collection,
  getCountFromServer,
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

      const usersSnap =
        await getCountFromServer(
          collection(db, "users")
        );

      setStats((prev) => ({
        ...prev,
        users: usersSnap.data().count,
      }));

    } catch (err) {

      console.error(err);

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

        <h1>
          👨‍💼 Inclura Admin Control Center
        </h1>
        <div style={dashboardGrid}>

  <div style={summaryCard}>
    <h3>Users</h3>
    <h2>{stats.users}</h2>
    <p>Total Registered</p>
  </div>

  <div style={summaryCard}>
    <h3>Verification</h3>
    <h2>--</h2>
    <p>Pending Requests</p>
  </div>

  <div style={summaryCard}>
    <h3>Reports</h3>
    <h2>--</h2>
    <p>Open Cases</p>
  </div>

  <div style={summaryCard}>
    <h3>Wallet</h3>
    <h2>--</h2>
    <p>Alerts</p>
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
  <div style={summaryCard}>
    <h3>Enterprise</h3>
    <h2>--</h2>
    <p>Partners</p>
  </div>

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

  <div style={summaryCard}>
    <h3>IFSE</h3>
    Users

<h2>0</h2>

Verification

<h2>0</h2>

Reports

<h2>0</h2>

Wallet

<h2>0</h2>

Enterprise

<h2>0</h2>

IFSE

<h2>ONLINE</h2>
    
    <p>System Status</p>
  </div>

</div>

        <Link
          to="/users-management"
          style={link}
        >
          <div style={card}>
            👥 Users Management
          </div>
        </Link>

        <Link
          to="/verification-manager"
          style={link}
        >
          <div style={card}>
            ✅ Verification Requests
          </div>
        </Link>

        <Link
          to="/admin/ifse-risk"
          style={link}
        >
          <div style={card}>
            🛡️ IFSE Risk Monitoring
          </div>
        </Link>

        <Link
          to="/reports-violations"
          style={link}
        >
          <div style={card}>
            🚨 Reports & Violations
          </div>
        </Link>

        <Link
          to="/ad-approval"
          style={link}
        >
          <div style={card}>
            📢 Advertisement Approval
          </div>
        </Link>

        <Link
          to="/wallet-monitoring"
          style={link}
        >
          <div style={card}>
            💰 Wallet Monitoring
          </div>
        </Link>

        <Link
          to="/sos"
          style={link}
        >
          <div style={card}>
            🚨 SOS Monitoring
          </div>
        </Link>

        <Link
          to="<Link
to="/creator-monetization""
          style={link}
        >
          <div style={card}>
            💵 Creator Economy & Revenue
          </div>
        </Link>

        <Link
          to="/platform-analytics"
          style={link}
        >
          <div style={card}>
            📊 Platform Analytics
          </div>
        </Link>

        <Link
          to="/pricing-manager"
          style={link}
        >
          <div style={card}>
            ⚙️ Creator Revenue Policy
          </div>
        </Link>

        <Link
          to="/enterprise-campaigns"
          style={link}
        >
          <div style={card}>
            🏢 Enterprise Marketplace
          </div>
        </Link>

        <Link
          to="/enterprise-analytics"
          style={link}
        >
          <div style={card}>
            📈 Enterprise Analytics
          </div>
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
