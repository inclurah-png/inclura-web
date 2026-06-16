import DashboardLayout from "../components/DashboardLayout";

function Marketplace() {
  return (
    <DashboardLayout>
      <div style={page}>
        <h1>🛒 Marketplace</h1>

        <div style={card}>🛍 Products</div>
        <div style={card}>🧰 Accessibility Equipment</div>
        <div style={card}>🎨 Creator Stores</div>
        <div style={card}>📦 Services</div>
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

export default Marketplace;
