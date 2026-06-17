import DashboardLayout from "../components/DashboardLayout";

function PremiumDashboard() {
  return (
    <DashboardLayout>
      <div style={{ color: "white" }}>
        <h1>⭐ Premium Dashboard</h1>

        <div style={card}>
          ⭐ Inclura Plus
        </div>

        <div style={card}>
          📊 Analytics Pro
        </div>

        <div style={card}>
          🎨 Canva Pro Add-On
        </div>

        <div style={card}>
          🤝 HubSpot Integration
        </div>

        <div style={card}>
          📦 HubSpot + Canva Bundle
        </div>

        <div style={card}>
          🛠 Business Tools Suite
        </div>

        <div style={card}>
          🎥 Creator Plus
        </div>

        <div style={card}>
          🏢 Enterprise Plus
        </div>

        <div style={card}>
          ⚡ Early Access Features
        </div>

        <div style={card}>
          🎯 Premium Support
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

export default PremiumDashboard;
