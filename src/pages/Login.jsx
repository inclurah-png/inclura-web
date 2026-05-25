
import { Link } from "react-router-dom";

function Login() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Top Accessibility Buttons */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          marginBottom: "28px",
        }}
      >
        {[
          { icon: "🔊", text: "Audio" },
          { icon: "🤟", text: "Sign" },
          { icon: "🔠", text: "Large" },
          { icon: "🌗", text: "Contrast" },
        ].map((item) => (
          <button
            key={item.text}
            style={{
              border: "1px solid #dbeafe",
              background: "white",
              borderRadius: "40px",
              padding: "10px 18px",
              fontSize: "15px",
              color: "#334155",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>{item.icon}</span>
            {item.text}
          </button>
        ))}
      </div>

      {/* Heading */}
      <h1
        style={{
          fontSize: "42px",
          fontWeight: "800",
          color: "#0f172a",
          marginBottom: "10px",
        }}
      >
        Welcome Back
      </h1>

      <p
        style={{
          color: "#64748b",
          fontSize: "18px",
          marginBottom: "32px",
        }}
      >
        New to Inclura?{" "}
        <Link
          to="/signup"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Create account →
        </Link>
      </p>

      {/* Social Buttons */}
      <button
        style={{
          width: "100%",
          padding: "18px",
          borderRadius: "18px",
          border: "1px solid #dbeafe",
          background: "white",
          fontSize: "18px",
          fontWeight: "600",
          marginBottom: "16px",
        }}
      >
        🔵 Continue with Google
      </button>

      <button
        style={{
          width: "100%",
          padding: "18px",
          borderRadius: "18px",
          border: "none",
          background: "#1877f2",
          color: "white",
          fontSize: "18px",
          fontWeight: "600",
          marginBottom: "16px",
        }}
      >
        📘 Continue with Facebook
      </button>

      <button
        style={{
          width: "100%",
          padding: "18px",
          borderRadius: "18px",
          border: "none",
          background: "#111827",
          color: "white",
          fontSize: "18px",
          fontWeight: "600",
          marginBottom: "26px",
        }}
      >
        🍎 Continue with Apple
      </button>

      {/* Divider */}
      <div
        style={{
          textAlign: "center",
          color: "#94a3b8",
          marginBottom: "28px",
        }}
      >
        or continue with email
      </div>

      {/* Email */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#334155",
          }}
        >
          Email or Username
        </label>

        <input
          type="text"
          placeholder="Enter your email or username"
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "16px",
            border: "1px solid #cbd5e1",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Password */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
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
            padding: "18px",
            borderRadius: "16px",
            border: "1px solid #cbd5e1",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Remember Me */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "28px",
          color: "#64748b",
          fontSize: "15px",
        }}
      >
        <label>
          <input type="checkbox" /> Remember me
        </label>

        <span style={{ color: "#2563eb", fontWeight: "600" }}>
          Forgot password?
        </span>
      </div>

      {/* Login Button */}
      <button
        style={{
          width: "100%",
          padding: "18px",
          borderRadius: "18px",
          border: "none",
          background: "#2563eb",
          color: "white",
          fontSize: "20px",
          fontWeight: "700",
        }}
      >
        Sign In →
      </button>

      {/* Footer */}
      <p
        style={{
          textAlign: "center",
          marginTop: "28px",
          color: "#94a3b8",
          fontSize: "14px",
        }}
      >
        Inclusive access for everyone.
      </p>
    </div>
  );
}

export default Login;
