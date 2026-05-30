 import { useState } from "react";

import {
signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase";

import { useNavigate } from "react-router-dom";

function Login() {

const navigate = useNavigate();

const [email, setEmail] =
useState("");

const [password, setPassword] =
useState("");

const [loading, setLoading] =
useState(false);

async function handleLogin() {

if (!email || !password) {
alert("Fill all fields");
return;
}

try {

setLoading(true);

await signInWithEmailAndPassword(
auth,
email,
password
);

alert("Login successful");

navigate("/dashboard");

} catch (error) {

console.log(error);

alert(error.code);

} finally {

setLoading(false);

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
fontFamily: "Arial, sans-serif",
}}
>

<div
style={{
width: "100%",
maxWidth: "430px",
background: "#0f172a",
padding: "32px",
borderRadius: "28px",
border: "1px solid #1e293b",
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
marginBottom: "24px",
}}
>
Sign in to continue to Inclura.
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

{loading ? "Signing In..." : "Sign In"}

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
};

export default Login;
 
