import DashboardLayout from "../components/DashboardLayout";

function ReportsAndViolations() {
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
🚨 Reports & Violations
</h1>

    <div style={card}>
      🚨 Reported Users
    </div>

    <div style={card}>
      📝 Reported Posts
    </div>

    <div style={card}>
      📢 Reported Advertisements
    </div>

    <div style={card}>
      🛒 Reported Marketplace Listings
    </div>

    <div style={card}>
      🤝 Reported Care-Gigs
    </div>

    <div style={card}>
      🎓 Reported Mentors
    </div>

    <div style={card}>
      🚫 Harassment Reports
    </div>

    <div style={card}>
      ⚠ Scam Reports
    </div>

    <div style={card}>
      🤖 Fake Account Reports
    </div>

    <div style={card}>
      📵 Content Violations
    </div>

    <div style={card}>
      ⛔ Suspensions
    </div>

    <div style={card}>
      🔨 Banned Accounts
    </div>

    <div style={card}>
      📨 Appeals & Reviews
    </div>

    <div style={card}>
      📊 Moderation Analytics
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

export default ReportsAndViolations;
