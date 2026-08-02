import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

function WalletMonitoring() {
async function createWalletAlertCollection() {
  try {
    await addDoc(collection(db, "walletAlerts"), {
      alertType: "system",
      title: "Wallet Monitoring Initialized",
      description: "Wallet monitoring collection created successfully.",
      severity: "low",
      status: "open",
      createdAt: serverTimestamp(),
      createdBy: "admin"
    });

    alert("Wallet Alerts collection initialized successfully.");

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}
return (
<DashboardLayout>
<div style={{ color: "white" }}>
<h1>💰 Wallet Monitoring</h1>

<button
  onClick={createWalletAlertCollection}
  style={{
    padding: "12px 20px",
    borderRadius: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginBottom: "20px",
  }}
>
  Initialize Wallet Alerts Collection
</button>

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
