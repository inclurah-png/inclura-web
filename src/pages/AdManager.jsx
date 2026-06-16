import DashboardLayout from "../components/DashboardLayout";

function AdManager() {
return (
<DashboardLayout>
<div style={{ color: "white" }}>
<h1>📢 Ad Manager</h1>

    <div style={card}>
      ➕ Create Advertisement
    </div>

    <div style={card}>
      📊 Ad Analytics
    </div>

    <div style={card}>
      🎯 Audience Targeting
    </div>

    <div style={card}>
      📈 Active Campaigns
    </div>

    <div style={card}>
      💰 Ad Spend
    </div>

    <div style={card}>
      📋 Ad Approval Queue
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

export default AdManager;

