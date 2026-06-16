import DashboardLayout from "../components/DashboardLayout";

function Wallet() {
  return (
    <DashboardLayout>
      <div style={page}>
        <h1>💰 Wallet</h1>

        <div style={card}>Balance</div>
        <div style={card}>⬆ Top Up</div>
        <div style={card}>⬇ Withdraw</div>
        <div style={card}>💸 Send Money</div>
        <div style={card}>📜 Transactions</div>
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

export default Wallet;
