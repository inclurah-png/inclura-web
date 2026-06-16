import DashboardLayout from "../components/DashboardLayout";

function Enterprise() {
  return (
    <DashboardLayout>
      <div style={page}>
        <h1>🏢 Enterprise</h1>

        <div style={card}>🏢 Enterprise Profiles</div>
        <div style={card}>📢 Enterprise Opportunities</div>
        <div style={card}>🤝 Partnerships</div>
        <div style={card}>📊 Enterprise Insights</div>
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

export default Enterprise;
