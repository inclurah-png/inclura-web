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
      <h1 style={{ color: "#38bdf8", fontSize: "40px" }}>
        Inclura
      </h1>

      <div style={{ display: "flex", gap: "20px" }}>
        <button
          style={{
            padding: "14px 28px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <button
          style={{
            padding: "14px 28px",
            borderRadius: "12px",
            border: "none",
            background: "#38bdf8",
            color: "white",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
