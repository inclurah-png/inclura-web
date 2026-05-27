import { useState } from "react";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../firebase";

import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleGoogleLogin() {
    try {
      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #020617, #0f172a)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "28px",
          padding: "32px",
          boxShadow:
            "0 0 40px rgba(0,0,0,0.4)",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "36px",
            marginBottom: "10px",
            fontWeight: "700",
          }}
        >
          Welcome Back 👋
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
            lineHeight: "1.6",
          }}
        >
          Login to continue your Inclura journey.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={inputStyle}
        />

        <button
          onClick={handleLogin}
          style={buttonStyle}
        >
          Sign In
        </button>

        <button
          onClick={handleGoogleLogin}
          style={googleButton}
        >
          Continue with Google
        </button>

        <p
          style={{
            color: "#94a3b8",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          Don’t have an account?
        </p>

        <button
          onClick={() => navigate("/signup")}
          style={signupButton}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "16px",
  marginBottom: "16px",
  borderRadius: "14px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
  boxSizing: "border-box",
  fontSize: "15px",
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  border: "none",
  background: "#38bdf8",
  color: "white",
  fontWeight: "700",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "8px",
};

const googleButton = {
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  border: "1px solid #334155",
  background: "#111827",
  color: "white",
  fontWeight: "700",
  fontSize: "15px",
  cursor: "pointer",
  marginTop: "16px",
};

const signupButton = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #38bdf8",
  background: "transparent",
  color: "#38bdf8",
  fontWeight: "700",
  fontSize: "15px",
  cursor: "pointer",
  marginTop: "12px",
};

export default Login;
