import DashboardLayout from "../components/DashboardLayout";

function Withdraw() {
return (
<DashboardLayout>
<div style={{ color: "white" }}>
<h1>⬇ Withdraw Funds</h1>

    <div style={card}>
      <input
        type="number"
        placeholder="Amount"
        style={input}
      />

      <input
        type="text"
        placeholder="Bank Account"
        style={input}
      />

      <button style={button}>
        Withdraw
      </button>
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

const input = {
width: "100%",
padding: "14px",
marginBottom: "14px",
borderRadius: "12px",
border: "1px solid #334155",
background: "#1e293b",
color: "white",
boxSizing: "border-box",
};

const button = {
background: "#38bdf8",
color: "white",
border: "none",
padding: "14px",
borderRadius: "12px",
cursor: "pointer",
};

export default Withdraw;
