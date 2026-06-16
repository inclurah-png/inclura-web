import DashboardLayout from "../components/DashboardLayout";

function CareGigs() {
  return (
    <DashboardLayout>
      <div style={page}>
        <h1>🤝 Care-Gigs</h1>

        <div style={card}>🧑‍⚕ Caregiver Requests</div>
        <div style={card}>🏠 Home Assistance</div>
        <div style={card}>🚗 Transportation Support</div>
        <div style={card}>💬 Support Services</div>
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

export default CareGigs;
