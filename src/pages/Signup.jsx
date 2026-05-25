import { Link } from "react-router-dom";

function Signup() {
  const disabilities = [
    { icon: "👂", label: "Deaf" },
    { icon: "👁️", label: "Blind" },
    { icon: "🗣️", label: "Mute" },
    { icon: "🦽", label: "Motor" },
    { icon: "🧩", label: "Cognitive" },
    { icon: "🙂", label: "None" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Accessibility Top Buttons */}
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
        Create your account
      </h1>

      <p
        style={{
          color: "#64748b",
          fontSize: "18px",
          marginBottom: "32px",
        }}
      >
        Already have an account?{" "}
        <Link
          to="/login"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Sign in →
        </Link>
      </p>

      {/* Social Buttons */}
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
        or sign up with email
      </div>

      {/* Inputs */}
      {[
        "Full Name",
        "Email",
        "Username",
        "Password",
      ].map((label) => (
        <div key={label} style={{ marginBottom: "22px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#334155",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            {label}
          </label>

          <input
            type={label === "Password" ? "password" : "text"}
            placeholder={`Enter ${label}`}
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
      ))}

      {/* Accessibility Needs */}
      <div
        style={{
          background: "white",
          borderRadius: "22px",
          padding: "20px",
          marginTop: "28px",
          border: "1px solid #dbeafe",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            color: "#334155",
            marginBottom: "18px",
          }}
        >
          Accessibility Needs (Optional)
        </h3>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {disabilities.map((item) => (
            <button
              key={item.label}
              style={{
                border: "1px solid #bfdbfe",
                background: "#eff6ff",
                borderRadius: "40px",
                padding: "12px 18px",
                fontSize: "15px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#1e3a8a",
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "28px",
          alignItems: "flex-start",
        }}
      >
        <input type="checkbox" />

        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        >
          I agree to Inclura's Terms of Service and Privacy Policy.
        </p>
      </div>

      {/* Create Account */}
      <button
        style={{
          width: "100%",
          marginTop: "30px",
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
        Create Account →
      </button>
    </div>
  );
}

export default Signup;
        
