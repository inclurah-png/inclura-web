import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

function AdminPanel() {
  return (
    <DashboardLayout>
      <div style={{ color: "white" }}>
        <h1>👨‍💼 Inclura Admin Control Center</h1>

        <Link to="/admin/users" style={link}>
          <div style={card}>👥 Users Management</div>
        </Link>

        <Link to="/verification-manager" style={link}>
          <div style={card}>✅ Verification Requests</div>
        </Link>

        <Link to="/admin/reports" style={link}>
          <div style={card}>🚨 Reports & Violations</div>
        </Link>

        <Link to="/admin/ads" style={link}>
          <div style={card}>📢 Advertisement Approval</div>
        </Link>

        <Link to="/wallet-monitoring" style={link}>
          <div style={card}>💰 Wallet Monitoring</div>
        </Link>

        <Link to="/admin/sos" style={link}>
          <div style={card}>🚨 SOS Monitoring</div>
        </Link>

        <Link to="/admin-monetization" style={link}>
          <div style={card}>💵 Creator Economy & Revenue</div>
        </Link>

        <Link to="/platform-analytics" style={link}>
          <div style={card}>📊 Platform Analytics</div>
        </Link>

        <Link to="/pricing-manager" style={link}>
          <div style={card}>⚙️ Creator Revenue Policy</div>
        </Link>

        <Link to="/enterprise-campaign-manager" style={link}>
          <div style={card}>🏢 Enterprise Marketplace</div>
        </Link>

        <Link to="/enterprise-analytics" style={link}>
          <div style={card}>📈 Enterprise Analytics</div>
        </Link>
      </div>
    </DashboardLayout>
  );
}

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
