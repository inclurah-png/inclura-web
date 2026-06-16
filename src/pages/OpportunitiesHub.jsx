import DashboardLayout from "../components/DashboardLayout";

function OpportunitiesHub() {
  return (
    <DashboardLayout>
      <div style={page}>
        <h1>💼 Opportunities Hub</h1>

        <div style={card}>💻 Remote Jobs</div>
        <div style={card}>🏢 Enterprise Jobs</div>
        <div style={card}>📄 Internships</div>
        <div style={card}>🌍 Volunteer Opportunities</div>
        <div style={card}>🚀 Featured Opportunities</div>
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

export default OpportunitiesHub;
