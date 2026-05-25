import { Link } from "react-router-dom";

function Signup() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Accessibility Options */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          marginBottom: "30px",
        }}
      >
        {["Audio", "Sign", "Large", "Contrast"].map((item) => (
          <button
            key={item}
            style={{
              border: "2px solid #c7d2fe",
              background: "white",
              borderRadius: "40px",
              padding: "14px 24px",
              fontSize: "20px",
              color: "#64748b",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Heading */}
      <h1
        style={{
          fontSize: "54px",
          fontWeight: "800",
          color: "#0f172a",
          marginBottom: "10px",
        }}
      >
        Create your account
      </h1>

      <p
        style={{
          fontSize: "28px",
          color: "#64748b",
          marginBottom: "40px",
        }}
      >
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#2563eb" }}>
          Sign in →
        </Link>
      </p>

      {/* Social Buttons */}
      {["Google", "Facebook", "Apple"].map((item) => (
        <button
          key={item}
          style={{
            width: "100%",
            padding: "28px",
            borderRadius: "24px",
            border: "2px solid #c7d2fe",
            background: "white",
            fontSize: "32px",
            marginBottom: "24px",
          }}
        >
          {item}
        </button>
      ))}

      {/* Divider */}
      <div
        style={{
          textAlign: "center",
          margin: "40px 0",
          color: "#94a3b8",
          fontSize: "24px",
        }}
      >
        or sign up with email
      </div>

      {/* Form */}
      {[
        "Full Name",
        "Email",
        "Username",
        "Password",
      ].map((label) => (
        <div key={label} style={{ marginBottom: "28px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontSize: "26px",
              color: "#334155",
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
              padding: "28px",
              fontSize: "26px",
              borderRadius: "22px",
              border: "2px solid #c7d2fe",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      ))}

      {/* Accessibility Needs */}
      <div
        style={{
          background: "white",
          border: "2px solid #c7d2fe",
          borderRadius: "28px",
          padding: "25px",
          marginTop: "40px",
        }}
      >
        <h3
          style={{
            fontSize: "30px",
            marginBottom: "24px",
            color: "#334155",
          }}
        >
          Accessibility Needs (Optional)
        </h3>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          {[
            "Deaf",
            "Blind",
            "Mute",
            "Motor",
            "Cognitive",
            "None",
          ].map((item) => (
            <button
              key={item}
              style={{
                padding: "16px 24px",
                borderRadius: "40px",
                border: "2px solid #c7d2fe",
                background: "#f8fafc",
                fontSize: "24px",
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          gap: "16px",
          alignItems: "flex-start",
        }}
      >
        <input type="checkbox" style={{ width: "28px", height: "28px" }} />

        <p
          style={{
            fontSize: "22px",
            color: "#64748b",
            lineHeight: "1.6",
          }}
        >
          I agree to Inclura’s Terms of Service and Privacy Policy.
        </p>
      </div>

      {/* Create Account */}
      <button
        style={{
          width: "100%",
          marginTop: "40px",
          padding: "28px",
          borderRadius: "24px",
          border: "none",
          background: "#2563eb",
          color: "white",
          fontSize: "34px",
          fontWeight: "700",
        }}
      >
        Create Account →
      </button>
    </div>
  );
}

export default Signup;
