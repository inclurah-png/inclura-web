import { Link } from "react-router-dom";

function Login() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "56px",
          color: "#0f172a",
          marginBottom: "14px",
        }}
      >
        Welcome Back
      </h1>

      <p
        style={{
          fontSize: "26px",
          color: "#64748b",
          marginBottom: "40px",
        }}
      >
        Don’t have an account?{" "}
        <Link to="/signup" style={{ color: "#2563eb" }}>
          Sign up →
        </Link>
      </p>

      {/* Email */}
      <div style={{ marginBottom: "28px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "10px",
            fontSize: "24px",
            color: "#334155",
          }}
        >
          Email
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          style={{
            width: "100%",
            padding: "26px",
            borderRadius: "22px",
            border: "2px solid #c7d2fe",
            fontSize: "24px",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Password */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "10px",
            fontSize: "24px",
            color: "#334155",
          }}
        >
          Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
          style={{
            width: "100%",
            padding: "26px",
            borderRadius: "22px",
            border: "2px solid #c7d2fe",
            fontSize: "24px",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div
        style={{
          textAlign: "right",
          marginBottom: "40px",
        }}
      >
        <a
          href="#"
          style={{
            color: "#2563eb",
            fontSize: "22px",
            textDecoration: "none",
          }}
        >
          Forgot Password?
        </a>
      </div>

      {/* Login Button */}
      <button
        style={{
          width: "100%",
          padding: "28px",
          borderRadius: "24px",
          border: "none",
          background: "#2563eb",
          color: "white",
          fontSize: "32px",
          fontWeight: "700",
        }}
      >
        Login →
      </button>
    </div>
  );
}

export default Login;
