import DashboardLayout from "../components/DashboardLayout";

function SOS() {
  return (
    <DashboardLayout>
      <div style={page}>
        <h1>🚨 SOS Emergency</h1>

        <div style={card}>🚨 Send Emergency Alert</div>
        <div style={card}>📍 Share Location</div>
        <div style={card}>👨‍👩‍👧 Trusted Contacts</div>
        <div style={card}>🤝 Community Assistance</div>
      </div>
    </DashboardLayout>
  );
}

const page = { color: "white" };

const card = {
  background: "#0f172a",
  padding: "24px",
  borderRadius: "20px",
  marginBottom: "20px",
};

export default SOS;
