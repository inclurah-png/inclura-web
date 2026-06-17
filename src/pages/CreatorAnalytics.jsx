import DashboardLayout from "../components/DashboardLayout";

function CreatorAnalytics() {
return (
<DashboardLayout>
<div style={{ color: "white" }}>
<h1>📈 Creator Analytics</h1>

    <div style={card}>👥 Followers</div>

    <div style={card}>👁 Profile Views</div>

    <div style={card}>🎥 Reel Views</div>

    <div style={card}>❤️ Likes</div>

    <div style={card}>💬 Comments</div>

    <div style={card}>🔁 Shares</div>

    <div style={card}>💰 Total Earnings</div>

    <div style={card}>📢 Sponsored Posts</div>

    <div style={card}>📊 Engagement Rate</div>
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

export default CreatorAnalytics;
