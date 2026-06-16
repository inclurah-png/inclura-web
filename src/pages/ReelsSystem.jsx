import DashboardLayout from "../components/DashboardLayout";

function ReelsSystem() {
return (
<DashboardLayout>
<div style={{ color: "white" }}>
<h1>🎥 Reels System</h1>

    <div style={card}>
      🎥 Upload Reel
    </div>

    <div style={card}>
      🔥 Trending Reels
    </div>

    <div style={card}>
      ❤️ Most Liked Reels
    </div>

    <div style={card}>
      💬 Most Commented Reels
    </div>

    <div style={card}>
      📢 Sponsored Reels
    </div>

    <div style={card}>
      💵 Reel Earnings
    </div>

    <div style={card}>
      📈 Reel Analytics
    </div>

    <div style={card}>
      🎯 Reel Audience Insights
    </div>

    <div style={card}>
      ⭐ Featured Creators
    </div>

    <div style={card}>
      🚀 Boost Reel
    </div>

    <div style={card}>
      🏆 Top Performing Videos
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

export default ReelsSystem;
