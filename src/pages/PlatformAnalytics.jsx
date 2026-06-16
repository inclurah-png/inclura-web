import DashboardLayout from "../components/DashboardLayout";

function PlatformAnalytics() {
return (
<DashboardLayout>
<div style={{ color: "white" }}>
<h1
style={{
marginBottom: "24px",
}}
>
📊 Platform Analytics
</h1>

    <div style={card}>
      👥 Total Users
    </div>

    <div style={card}>
      🟢 Active Users
    </div>

    <div style={card}>
      💰 Total Platform Revenue
    </div>

    <div style={card}>
      💵 Creator Earnings
    </div>

    <div style={card}>
      📢 Advertisement Revenue
    </div>

    <div style={card}>
      🏢 Enterprise Revenue
    </div>

    <div style={card}>
      🛒 Marketplace Sales
    </div>

    <div style={card}>
      🤝 Care-Gigs Activity
    </div>

    <div style={card}>
      🎓 Mentor Activity
    </div>

    <div style={card}>
      ♿ Accessibility Requests
    </div>

    <div style={card}>
      🚨 SOS Activity
    </div>

    <div style={card}>
      📈 Growth Metrics
    </div>

    <div style={card}>
      🌍 Geographic Analytics
    </div>

    <div style={card}>
      📊 Business Intelligence Dashboard
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

export default PlatformAnalytics;
