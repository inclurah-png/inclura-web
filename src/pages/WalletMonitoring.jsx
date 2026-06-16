import DashboardLayout from "../components/DashboardLayout";

function WalletMonitoring() {
return (
<DashboardLayout>
<div style={{ color: "white" }}>
<h1>💰 Wallet Monitoring</h1>

    <div style={card}>
      💵 Total Wallet Balance
    </div>

    <div style={card}>
      ⬆ Total Deposits
    </div>

    <div style={card}>
      ⬇ Total Withdrawals
    </div>

    <div style={card}>
      ⏳ Pending Withdrawals
    </div>

    <div style={card}>
      🔄 Transfers
    </div>

    <div style={card}>
      💵 Creator Earnings
    </div>

    <div style={card}>
      📢 Ad Revenue
    </div>

    <div style={card}>
      🏢 Enterprise Revenue
    </div>

    <div style={card}>
      📊 Platform Revenue Analytics
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

export default WalletMonitoring;
