import DashboardLayout from "../components/DashboardLayout";

function EnterpriseAnalytics() {
  return (
    <DashboardLayout>
      <div style={{ color: "white" }}>
        <h1>🏢 Enterprise Analytics</h1>

        <div style={card}>
          👁 Enterprise Profile Views
        </div>

        <div style={card}>
          📢 Campaign Reach
        </div>

        <div style={card}>
          👥 Applications Received
        </div>

        <div style={card}>
          📄 Active Job Listings
        </div>

        <div style={card}>
          ♿ Accessibility Requests
        </div>

        <div style={card}>
          💰 Campaign Spending
        </div>

        <div style={card}>
          📈 Engagement Rate
        </div>

        <div style={card}>
          ⭐ Verification Status
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

export default EnterpriseAnalytics;
