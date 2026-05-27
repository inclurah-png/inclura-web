import { useState } from "react";

import {
createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase";


function Signup() {
const [fullName, setFullName] = useState("");

const [email, setEmail] = useState("");

const [password, setPassword] = useState("");

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
}}
>
<h1
style={{
color: "white",
marginBottom: "12px",
fontSize: "34px",
}}
>
Create Account </h1>

    <p
      style={{
        color: "#94a3b8",
        marginBottom: "24px",
      }}
    >
      Join Inclura today.
    </p>

    <input
      type="text"
      placeholder="Full Name"
      value={fullName}
      onChange={(e) =>
        setFullName(e.target.value)
      }
      style={inputStyle}
    />

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
      style={{
        width: "100%",
        padding: "16px",
        borderRadius: "14px",
        border: "none",
        background: "#38bdf8",
        color: "white",
        fontWeight: "700",
        fontSize: "16px",
      }}
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
};

export default Signup;
