import DashboardLayout from "../components/DashboardLayout";

function Transactions() {
return (
<DashboardLayout>
<div style={{ color: "white" }}>
<h1>📜 Transactions</h1>

    <div style={card}>
      No transactions yet.
    </div>
  </div>
</DashboardLayout>

);
}

const card = {
background: "#0f172a",
padding: "24px",
borderRadius: "20px",
};

export default Transactions;
