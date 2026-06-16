import DashboardLayout from "../components/DashboardLayout";

function EnterpriseAds() {
return (
<DashboardLayout>
<div style={{ color: "white" }}>
<h1>🏢 Enterprise Ads</h1>

    <div style={card}>
      ➕ Create Enterprise Campaign
    </div>

    <div style={card}>
      📢 Active Campaigns
    </div>

    <div style={card}>
      🎯 Audience Segments
    </div>

    <div style={card}>
      💰 Campaign Budget
    </div>

    <div style={card}>
      📊 Campaign Analytics
    </div>

    <div style={card}>
      🧾 Billing & Invoices
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

export default EnterpriseAds;
