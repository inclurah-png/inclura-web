import DashboardLayout from "../components/DashboardLayout";

function VerificationRequestsManager() {
  return (
    <DashboardLayout>
      <div style={{ color: "white" }}>
        <h1>📋 Verification Requests</h1>

        <div style={card}>
          👤 Individual Verification Requests
        </div>

        <div style={card}>
          🎥 Creator Verification Requests
        </div>

        <div style={card}>
          🏢 Organization Verification Requests
        </div>

        <div style={card}>
          🤝 NGO Verification Requests
        </div>

        <div style={card}>
          🏥 Hospital Verification Requests
        </div>

        <div style={card}>
          🎓 University Verification Requests
        </div>

        <div style={card}>
          🏛 Government Verification Requests
        </div>

        <div style={card}>
          ✅ Approved Requests
        </div>

        <div style={card}>
          ❌ Rejected Requests
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

export default VerificationRequestsManager;
