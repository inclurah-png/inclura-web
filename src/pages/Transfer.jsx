import DashboardLayout from "../components/DashboardLayout";

function Transfer() {
return (
<DashboardLayout>
<div style={{ color: "white" }}>
<h1>💸 Transfer Funds</h1>

    <div style={card}>
      <input
        type="text"
        placeholder="Recipient Username"
        style={input}
      />

      <input
        type="number"
        placeholder="Amount"
        style={input}
      />

      <button style={button}>
        Transfer
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

export default Transfer;
