export default function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        background: "#071028",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <h2 style={{ color: "#38bdf8", margin: 0 }}>
        Inclura
      </h2>

      <div style={{ display: "flex", gap: "12px" }}>
        <button style={btnStyle}>Login</button>
        <button style={primaryBtn}>Sign Up</button>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "10px 18px",
  borderRadius: "12px",
  border: "none",
  background: "white",
  cursor: "pointer",
};

const primaryBtn = {
  padding: "10px 18px",
  borderRadius: "12px",
  border: "none",
  background: "#38bdf8",
  color: "white",
  cursor: "pointer",
};
