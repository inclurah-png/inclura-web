import DashboardLayout from "../components/DashboardLayout";

function CreatorMonetization() {
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
💵 Creator Monetization
</h1>

    <div style={card}>
      💰 Earnings Dashboard
    </div>

    <div style={card}>
      📢 Sponsored Posts
    </div>

    <div style={card}>
      🎥 Reels Revenue
    </div>

    <div style={card}>
      🤝 Brand Deals
    </div>

    <div style={card}>
      🛒 Marketplace Revenue
    </div>

    <div style={card}>
      🎓 Mentor Revenue
    </div>

    <div style={card}>
      💼 Care-Gig Revenue
    </div>

    <div style={card}>
      💳 Pending Payouts
    </div>

    <div style={card}>
      ⬇ Withdraw Earnings
    </div>

    <div style={card}>
      📈 Creator Analytics
    </div>

    <div style={card}>
      🏆 Top Earning Content
    </div>

    <div style={card}>
      ⭐ Monetization Status
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

export default CreatorMonetization;
