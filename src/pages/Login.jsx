
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
      {/* Accessibility Buttons */}
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

      {/* Social Login Buttons */}
      {[
        {
          icon: "🔵",
          text: "Continue with Google",
          bg: "#ffffff",
        },
        {
          icon: "📘",
          text: "Continue with Facebook",
          bg: "#1877f2",
          color: "white",
        },
        {
          icon: "🍎",
          text: "Continue with Apple",
          bg: "#111827",
          color: "white",
        },
      ].map((item) => (
        <button
          key={item.text}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "18px",
            border: "1px solid #dbeafe",
            background: item.bg,
            color: item.color || "#111827",
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          }}
        >
          <span>{item.icon}</span>
          {item.text}
        </button>
      ))}

      {/* Divider */}
      <div
        style={{
          textAlign: "center",
          color: "#94a3b8",
          margin: "30px 0",
          fontSize: "16px",
        }}
      >
        or continue with email
      </div>

      {/* Email Input */}
      <div style={{ marginBottom: "22px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            color: "#334155",
            fontSize: "16px",
            fontWeight: "600",
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
            outline: "none",
            boxSizing: "border-box",
            background: "white",
          }}
        />
      </div>

      {/* Password Input */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            color: "#334155",
            fontSize: "16px",
            fontWeight: "600",
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
            outline: "none",
            boxSizing: "border-box",
            background: "white",
          }}
        />
      </div>

      {/* Remember + Forgot */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#64748b",
            fontSize: "15px",
          }}
        >
          <input type="checkbox" />
          Remember me
        </label>

        <button
          style={{
            border: "none",
            background: "transparent",
            color: "#2563eb",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          Forgot password?
        </button>
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
          boxShadow: "0 6px 18px rgba(37,99,235,0.25)",
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
          lineHeight: "1.7",
        }}
      >
        Inclusive access for everyone.
      </p>
    </div>
  );
}

export default Login;
```
