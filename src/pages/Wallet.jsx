import DashboardLayout from "../components/DashboardLayout";

function Wallet() {
return (
<DashboardLayout>
<div
style={{
color: "white",
}}
>
<h1
style={{
marginBottom: "24px",
}}
>
💰 Inclura Wallet
</h1>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      <div style={walletCard}>
        <h3>🇺🇸 USD</h3>
        <h2>$0.00</h2>
      </div>

      <div style={walletCard}>
        <h3>🇪🇺 EUR</h3>
        <h2>€0.00</h2>
      </div>

      <div style={walletCard}>
        <h3>🇬🇧 GBP</h3>
        <h2>£0.00</h2>
      </div>

      <div style={walletCard}>
        <h3>🇳🇬 NGN</h3>
        <h2>₦0.00</h2>
      </div>
    </div>

    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "30px",
      }}
    >
      <button style={actionBtn}>
        ⬆ Pay & Top-Up
      </button>

      <button style={actionBtn}>
        ⬇ Withdraw
      </button>

      <button style={actionBtn}>
        💸 Transfer
      </button>
    </div>

    <div
      style={{
        background: "#0f172a",
        padding: "24px",
        borderRadius: "20px",
      }}
    >
      <h2>📜 Transaction History</h2>

      <p
        style={{
          color: "#94a3b8",
        }}
      >
        No transactions yet.
      </p>
    </div>
  </div>
</DashboardLayout>

);
}

const walletCard = {
background: "#0f172a",
padding: "24px",
borderRadius: "20px",
};

const actionBtn = {
background: "#38bdf8",
color: "white",
border: "none",
padding: "14px 20px",
borderRadius: "14px",
cursor: "pointer",
fontWeight: "700",
};

export default Wallet;
