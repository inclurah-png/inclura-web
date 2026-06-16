import DashboardLayout from "../components/DashboardLayout";

function AdminPanel() {
return (
<DashboardLayout>
<div style={{ color: "white" }}>
<h1>👨‍💼 Admin Control Panel</h1>

    <div style={card}>
      👥 Users Management
    </div>

    <div style={card}>
      🚨 Reports & Violations
    </div>

    <div style={card}>
      ✅ Verification Requests
    </div>

    <div style={card}>
      📢 Advertisement Approval
    </div>

    <div style={card}>
      💰 Wallet Monitoring
    </div>

    <div style={card}>
      🚨 SOS Monitoring
    </div>

    <div style={card}>
      💵 Creator Monetization
    </div>

    <div style={card}>
      📊 Platform Analytics
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
};

export default AdminPanel;
