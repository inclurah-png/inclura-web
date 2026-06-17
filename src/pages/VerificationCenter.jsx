import DashboardLayout from "../components/DashboardLayout";

function VerificationCenter() {
  return (
    <DashboardLayout>
      <div style={{ color: "white" }}>
        <h1>🔐 Verification Center</h1>

        <div style={card}>
          👤 Verify Individual Account
        </div>

        <div style={card}>
          🎥 Verify Creator Account
        </div>

        <div style={card}>
          🏢 Verify Organization
        </div>

        <div style={card}>
          🤝 Verify NGO
        </div>

        <div style={card}>
          🏥 Verify Hospital
        </div>

        <div style={card}>
          🎓 Verify University
        </div>

        <div style={card}>
          🏛 Verify Government Account
        </div>

        <div style={card}>
          ⭐ Verification Status
        </div>

        <div style={card}>
          📄 Submitted Documents
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

export default VerificationCenter;
