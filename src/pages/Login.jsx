import { useState } from "react";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Login successful");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#0f172a",
          padding: "30px",
          borderRadius: "24px",
        }}
      >
        <h1
          style={{
            color: "white",
            marginBottom: "20px",
          }}
        >
          Login
        </h1>

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
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  border: "none",
  background: "#38bdf8",
  color: "white",
  fontWeight: "700",
};

export default Login;
