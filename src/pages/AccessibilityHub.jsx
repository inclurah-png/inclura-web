import DashboardLayout from "../components/DashboardLayout";

function AccessibilityHub() {
  return (
    <DashboardLayout>
      <div style={page}>
        <h1>♿ Accessibility Hub</h1>

        <div style={card}>🆘 Accessibility Requests</div>
        <div style={card}>📚 Accessibility Resources</div>
        <div style={card}>🏢 Accessibility Directory</div>
        <div style={card}>🤝 Community Support</div>
        <div style={card}>🚨 Emergency Accessibility Help</div>
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

export default AccessibilityHub;
