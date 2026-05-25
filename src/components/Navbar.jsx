import { Link } from "react-router-dom";
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
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Logo />

      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
        }}
      >
        <Link
          to="/login"
          style={{
            textDecoration: "none",
          }}
        >
          <button
            style={{
              padding: "12px 24px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              background: "white",
              color: "#020617",
              fontWeight: "600",
            }}
          >
            Login
          </button>
        </Link>

        <Link
          to="/signup"
          style={{
            textDecoration: "none",
          }}
        >
          <button
            style={{
              padding: "12px 24px",
              borderRadius: "10px",
              border: "none",
              background: "#38bdf8",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
