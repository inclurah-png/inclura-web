import DashboardLayout from "../components/DashboardLayout";

function AdvertiserDashboard() {
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
📢 Advertiser Dashboard
</h1>

    <div style={card}>
      ➕ Create Campaign
    </div>

    <div style={card}>
      💰 Campaign Budget
    </div>

    <div style={card}>
      🌍 Country Targeting
    </div>

    <div style={card}>
      📍 State Targeting
    </div>

    <div style={card}>
      🏙 City Targeting
    </div>

    <div style={card}>
      👥 Age Range Targeting
    </div>

    <div style={card}>
      ♿ Accessibility Audience
    </div>

    <div style={card}>
      🖼 Image Advertisements
    </div>

    <div style={card}>
      🎥 Video Advertisements
    </div>

    <div style={card}>
      📈 Active Campaigns
    </div>

    <div style={card}>
      📊 Campaign Analytics
    </div>

    <div style={card}>
      📜 Campaign History
    </div>

    <div style={card}>
      💳 Billing & Payments
    </div>

    <div style={card}>
      🏆 Top Performing Campaigns
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

export default AdvertiserDashboard;
