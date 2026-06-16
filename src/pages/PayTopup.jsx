import DashboardLayout from "../components/DashboardLayout";

function PayTopup() {
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
⬆ Pay & Top-Up
</h1>

    <div style={card}>
      <h2>Select Currency</h2>

      <select style={input}>
        <option>USD ($)</option>
        <option>EUR (€)</option>
        <option>GBP (£)</option>
        <option>NGN (₦)</option>
      </select>
    </div>

    <div style={card}>
      <h2>Amount</h2>

      <input
        type="number"
        placeholder="Enter amount"
        style={input}
      />
    </div>

    <div style={card}>
      <h2>Payment Method</h2>

      <button style={methodBtn}>
        💳 Card Payment
      </button>

      <button style={methodBtn}>
        🏦 Bank Transfer
      </button>

      <button style={methodBtn}>
        📱 Mobile Payment
      </button>
    </div>

    <button
      style={{
        background: "#38bdf8",
        color: "white",
        border: "none",
        padding: "16px 24px",
        borderRadius: "16px",
        cursor: "pointer",
        fontWeight: "700",
        marginTop: "20px",
      }}
    >
      Continue
    </button>
  </div>
</DashboardLayout>

);
}

const card = {
background: "#0f172a",
padding: "24px",
borderRadius: "20px",
marginBottom: "20px",
};

const input = {
width: "100%",
padding: "14px",
borderRadius: "14px",
border: "1px solid #334155",
background: "#1e293b",
color: "white",
marginTop: "12px",
boxSizing: "border-box",
};

const methodBtn = {
display: "block",
width: "100%",
marginTop: "12px",
padding: "14px",
borderRadius: "14px",
border: "none",
background: "#1e293b",
color: "white",
cursor: "pointer",
};

export default PayTopup;
