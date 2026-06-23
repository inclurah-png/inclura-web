import { useState } from "react";

import {
createUserWithEmailAndPassword,
signInWithPopup,
GoogleAuthProvider,
} from "firebase/auth";

import {
doc,
setDoc,
serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase";

import { useNavigate } from "react-router-dom";

const googleProvider =
new GoogleAuthProvider();

function Signup() {

const navigate = useNavigate();

const [fullName, setFullName] =
useState("");

const [email, setEmail] =
useState("");

const [password, setPassword] =
useState("");
  
const [category, setCategory] =
useState("");
  
const [accessibilityNeeds,
setAccessibilityNeeds] =
useState([]);

const accessibilityOptions = [
"🦻 Deaf/HoH",
"👁 Blind/Low Vision",
"♿ Wheelchair",
"🗣 Non-verbal",
"🤲 Motor Impaired",
"🧠 Neurodivergent",
"💪 No disability",
];

function toggleAccessibility(option) {

if (
accessibilityNeeds.includes(option)
) {

setAccessibilityNeeds(
accessibilityNeeds.filter(
(item) => item !== option
)
);

} else {

setAccessibilityNeeds([
...accessibilityNeeds,
option,
]);

}

}

async function handleSignup() {

try {

const userCredential =
await createUserWithEmailAndPassword(
auth,
email,
password
);

const user =
userCredential.user;

await setDoc(
  doc(db, "users", user.uid),
  {
    uid: user.uid,

    fullName,

    email,

    category,

    createdAt:
      serverTimestamp(),

    verified: false,

    badgeType: "",

    creatorVerified: false,

    creatorVerifiedAt: null,

    premium: false,

    premiumTier: "",

    role: "user",

    walletBalance: 0,

    resumeCompleted: false,

    accessibilityNeeds,

    followers: [],

    following: [],

    savedPosts: [],

    profilePhoto: "",
  }
);

alert(
"Account created successfully"
);

navigate("/onboarding");

} catch (error) {

alert(error.message);

}

}

async function handleGoogleSignup() {

try {

const result =
await signInWithPopup(
auth,
googleProvider
);

const user =
result.user;

await setDoc(
  doc(db, "users", user.uid),
  {
    uid: user.uid,

    fullName:
      user.displayName || "",

    email:
      user.email || "",

    createdAt:
      serverTimestamp(),

    verified: false,

    badgeType: "",

    creatorVerified: false,

    creatorVerifiedAt: null,

    premium: false,

    premiumTier: "",

    role: "user",

    walletBalance: 0,

    resumeCompleted: false,

    accessibilityNeeds: [],

    followers: [],

    following: [],

    savedPosts: [],

    profilePhoto:
      user.photoURL || "",
  },
  { merge: true }
);
navigate("/onboarding");

} catch (error) {

alert(error.message);

}

}

return (

<div
style={{
minHeight: "100vh",
background: "#020617",
color: "white",
padding: "24px",
fontFamily:
"Arial, sans-serif",
}}
>

<div
style={{
maxWidth: "520px",
margin: "0 auto",
}}
>

<h1
style={{
fontSize: "42px",
fontWeight: "800",
marginBottom: "12px",
}}
>
Join Inclura 👋
</h1>

<p
style={{
color: "#94a3b8",
marginBottom: "30px",
lineHeight: "1.6",
fontSize: "17px",
}}
>
The inclusive social platform
for everyone.
</p>

<div
style={{
marginBottom: "28px",
}}
>

<h2
style={{
marginBottom: "14px",
fontSize: "20px",
}}
>
Choose Identity
</h2>

<div
style={{
display: "flex",
flexWrap: "wrap",
gap: "12px",
}}
>

<button
onClick={() =>
setCategory("Disability")
}
style={{
...tagStyle,
background:
category === "Disability"
? "#38bdf8"
: "#0f172a",
}}
>
♿ Disability
</button>

<button
onClick={() =>
setCategory("Ally")
}
style={{
...tagStyle,
background:
category === "Ally"
? "#38bdf8"
: "#0f172a",
}}
>
🤝 Ally
</button>

<button
onClick={() =>
setCategory("Caregiver")
}
style={{
...tagStyle,
background:
category === "Caregiver"
? "#38bdf8"
: "#0f172a",
}}
>
❤️ Caregiver
</button>
  
<button
onClick={() =>
setCategory("Volunteer")
}
style={{
...tagStyle,
background:
category === "Volunteer"
? "#38bdf8"
: "#0f172a",
}}
>
🙋 Volunteer
</button>
  
<button
onClick={() =>
setCategory("Creator")
}
style={{
...tagStyle,
background:
category === "Creator"
? "#38bdf8"
: "#0f172a",
}}
>
🎨 Creator
</button>

<button
onClick={() =>
setCategory("Organization")
}
style={{
...tagStyle,
background:
category === "Organization"
? "#38bdf8"
: "#0f172a",
}}
>
🏢 Organization
</button>

<button
onClick={() =>
setCategory("Employer")
}
style={{
...tagStyle,
background:
category === "Employer"
? "#38bdf8"
: "#0f172a",
}}
>
🏢 Employer
</button>

<button
onClick={() =>
setCategory("Job Seeker")
}
style={{
...tagStyle,
background:
category === "Job Seeker"
? "#38bdf8"
: "#0f172a",
}}
>
💼 Job Seeker
</button>

<button
onClick={() =>
setCategory("Advocate")
}
style={{
...tagStyle,
background:
category === "Advocate"
? "#38bdf8"
: "#0f172a",
}}
>
📢 Advocate
</button>

</div>

</div>

<div
style={{
marginBottom: "30px",
}}
>

<h2
style={{
marginBottom: "14px",
fontSize: "20px",
}}
>
Your Accessibility Needs
(optional)
</h2>

<div
style={{
display: "flex",
flexWrap: "wrap",
gap: "12px",
}}
>

{accessibilityOptions.map(
(option) => (

<button
type="button"
key={option}
onClick={() =>
toggleAccessibility(option)
}
style={{
padding: "14px 18px",
borderRadius: "18px",

border:
accessibilityNeeds.includes(option)
? "2px solid #38bdf8"
: "1px solid #334155",

background:
accessibilityNeeds.includes(option)
? "#1e3a8a"
: "#0f172a",

color: "white",

fontSize: "15px",

cursor: "pointer",
}}

>

{option}

</button>

)
)}

</div>

</div>

<div
style={{
background: "#0f172a",
borderRadius: "28px",
padding: "28px",
}}
>

<input
type="text"
placeholder="Full Name"
value={fullName}
onChange={(e) =>
setFullName(
e.target.value
)
}
style={inputStyle}
/>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e) =>
setEmail(
e.target.value
)
}
style={inputStyle}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e) =>
setPassword(
e.target.value
)
}
style={inputStyle}
/>

<button
onClick={handleSignup}
style={buttonStyle}

>

Create Account </button>

<div
style={{
textAlign: "center",
margin: "24px 0",
color: "#64748b",
}}
>
or continue with
</div>

<button
onClick={handleGoogleSignup}
style={googleButton}

>

🔵 Continue with Google </button>

</div>

</div>

</div>

);

}

const tagStyle = {
padding: "14px 18px",
borderRadius: "40px",
border: "1px solid #334155",
background: "#0f172a",
color: "white",
fontSize: "15px",
};

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
fontSize: "16px",
cursor: "pointer",
};

const googleButton = {
width: "100%",
padding: "16px",
borderRadius: "14px",
border: "1px solid #334155",
background: "#111827",
color: "white",
fontWeight: "600",
fontSize: "15px",
cursor: "pointer",
};

export default Signup;
