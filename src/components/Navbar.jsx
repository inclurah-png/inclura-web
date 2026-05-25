import Logo from "./Logo";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 40px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "#020617",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Logo />

      <div
        style={{
          display: "flex",
          gap: "14px",
        }}
      >
        <button
          style={{
            padding: "12px 22px",
            borderRadius: "12px",
            border: "1px solid #334155",
            background: "transparent",
            color: "white",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          Login
        </button>

        <button
          style={{
            padding: "12px 22px",
            borderRadius: "12px",
            border: "none",
            background: "#38bdf8",
            color: "white",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
