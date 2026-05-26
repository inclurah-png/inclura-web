import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, googleProvider } from "../firebase";

import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(
        auth,
        googleProvider
      );

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
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
          maxWidth: "420px",
          background: "#0f172a",
          padding: "32px",
          borderRadius: "28px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "34px",
            marginBottom: "10px",
          }}
        >
          Welcome Back 👋
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "28px",
          }}
        >
          Sign in to continue to Inclura
        </p>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "none",
            background: "white",
            color: "#111827",
            fontWeight: "700",
            cursor: "pointer",
            marginBottom: "20px",
            fontSize: "16px",
          }}
        >
          Continue with Google
        </button>

        <div
          style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: "20px",
          }}
        >
          OR
        </div>

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
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "none",
            background: "#38bdf8",
            color: "white",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "10px",
          }}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            color: "#94a3b8",
          }}
        >
          Don’t have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#38bdf8",
              textDecoration: "none",
            }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
  marginBottom: "16px",
  outline: "none",
  fontSize: "15px",
  boxSizing: "border-box",
};

export default Login;
