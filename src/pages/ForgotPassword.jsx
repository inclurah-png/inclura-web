
import { useState } from "react";

import {
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../firebase";

function ForgotPassword() {
  const [email, setEmail] =
    useState("");

  async function handleReset() {
    try {
      await sendPasswordResetEmail(
        auth,
        email
      );

      alert(
        "Password reset email sent."
      );
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#020617",
        color: "white",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#0f172a",
          padding: "30px",
          borderRadius: "20px",
        }}
      >
        <h2>
          Reset Password
        </h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            borderRadius: "10px",
          }}
        />

        <button
          onClick={handleReset}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "10px",
            background: "#38bdf8",
            color: "white",
          }}
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
