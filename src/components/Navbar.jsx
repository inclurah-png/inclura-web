import Logo from "./Logo";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        background: "#020617",
      }}
    >
      <Logo />

      <div style={{ display: "flex", gap: "15px" }}>
        <button
          style={{
            padding: "12px 24px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Login
        </button>

        <button
          style={{
            padding: "12px 24px",
            borderRadius: "10px",
            border: "none",
            background: "#38bdf8",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
