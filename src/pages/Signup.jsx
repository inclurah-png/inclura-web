import { useEffect, useState } from "react";

import {
createUserWithEmailAndPassword,
sendEmailVerification,
signInWithPopup,
signInWithRedirect,
getRedirectResult,
GoogleAuthProvider,
} from "firebase/auth";

import {
doc,
setDoc,
serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase";

import {
getAuthErrorInfo,
} from "../services/authErrorMessages";

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

const [error, setError] =
useState(null);
  
const [category, setCategory] =
useState("");
  
const [accessibilityNeeds,
setAccessibilityNeeds] =
useState([]);

const [acceptedStandards, setAcceptedStandards] = useState(false);
const [submitting, setSubmitting] = useState(false);

// Complete Google sign-up when a mobile browser returns from Firebase.
useEffect(() => {
  let active = true;

  getRedirectResult(auth)
    .then(async (result) => {
      if (!active || !result?.user) return;

      const user = result.user;
      try {
        await setDoc(
          doc(db, "users", user.uid),
          {
            uid: user.uid,
            fullName: user.displayName || "",
            email: user.email || "",
            acceptedCommunityStandards: true,
            acceptedCommunityStandardsAt: serverTimestamp(),
            createdAt: serverTimestamp(),
            verified: false,
            badgeType: "",
            creatorVerified: false,
            creatorVerifiedAt: null,
            premium: false,
            premiumTier: "",
            role: "user",
            resumeCompleted: false,
            accessibilityNeeds: [],
            accessibility: {
              deaf: false,
              blindLowVision: false,
              wheelchair: false,
              nonVerbal: false,
              motorImpaired: false,
              neurodivergent: false,
              noDisability: false,
            },
            followers: [],
            following: [],
            savedPosts: [],
            profilePhoto: user.photoURL || "",
          },
          { merge: true }
        );
      } catch (profileError) {
        console.error("Profile setup error:", profileError);
      }

      if (user.emailVerified) {
        navigate("/onboarding");
      } else {
        await sendEmailVerification(user);
        navigate("/verify-email");
      }
    })
    .catch((redirectError) => {
      console.error("Google signup redirect error:", redirectError);
      if (active) setError(getAuthErrorInfo(redirectError));
    });

  return () => {
    active = false;
  };
}, [navigate]);

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

setError(null);
const cleanName = fullName.trim().replace(/\s+/g, " ");
const cleanEmail = email.trim().toLowerCase();
if (cleanName.length < 2 || cleanName.length > 80) {
  setError({ message: "Enter your real display name (2–80 characters)." });
  return;
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
  setError({ message: "Enter a valid email address." });
  return;
}
if (!category) {
  setError({ message: "Please choose the category that best describes your participation." });
  return;
}
if (password.length < 12 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
  setError({ message: "Use at least 12 characters with uppercase and lowercase letters, a number and a symbol." });
  return;
}
if (!acceptedStandards) {
  setError({ message: "Please agree to follow Inclura's Community Safety Standards before creating an account." });
  return;
}
setSubmitting(true);

try {

const userCredential =
await createUserWithEmailAndPassword(
auth,
cleanEmail,
password
);

const user =
userCredential.user;

// A failed profile write must not be reported as a failed signup:
// the Firebase account already exists at this point.
try {

await setDoc(
  doc(db, "users", user.uid),
  {
    uid: user.uid,

    fullName: cleanName,

    email: cleanEmail,

    category,

    acceptedCommunityStandards: true,
    acceptedCommunityStandardsAt: serverTimestamp(),

    createdAt:
      serverTimestamp(),

    verified: false,

    badgeType: "",

    creatorVerified: false,

    creatorVerifiedAt: null,

    premium: false,

    premiumTier: "",

    role: "user",

    resumeCompleted: false,

accessibilityNeeds,

accessibility: {
  deaf: accessibilityNeeds.includes("🦻 Deaf/HoH"),
  blindLowVision: accessibilityNeeds.includes("👁 Blind/Low Vision"),
  wheelchair: accessibilityNeeds.includes("♿ Wheelchair"),
  nonVerbal: accessibilityNeeds.includes("🗣 Non-verbal"),
  motorImpaired: accessibilityNeeds.includes("🤲 Motor Impaired"),
  neurodivergent: accessibilityNeeds.includes("🧠 Neurodivergent"),
  noDisability: accessibilityNeeds.includes("💪 No disability"),
},

followers: [],

following: [],

savedPosts: [],

profilePhoto: "",
  }
  );

} catch (profileError) {

console.error(
"Profile setup error:",
profileError
);

}

await sendEmailVerification(user);
navigate("/verify-email");

} catch (signupError) {

console.error(
"Signup error:",
signupError
);

setError(
getAuthErrorInfo(signupError)
);

} finally {
  setSubmitting(false);
}

}

async function handleGoogleSignup() {

try {

const isMobileBrowser =
  /Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent
  );

if (isMobileBrowser) {
  await signInWithRedirect(auth, googleProvider);
  return;
}

const result =
await signInWithPopup(
auth,
googleProvider
);

const user =
result.user;

setError(null);

// Same as above: the account exists even if this write fails.
try {

await setDoc(
  doc(db, "users", user.uid),
  {
    uid: user.uid,

    fullName:
      user.displayName || "",

    email:
      user.email || "",

    acceptedCommunityStandards: true,
    acceptedCommunityStandardsAt: serverTimestamp(),

    createdAt:
      serverTimestamp(),

    verified: false,

    badgeType: "",

    creatorVerified: false,

    creatorVerifiedAt: null,

    premium: false,

    premiumTier: "",

    role: "user",

    resumeCompleted: false,

accessibilityNeeds: [],

accessibility: {
  deaf: false,
  blindLowVision: false,
  wheelchair: false,
  nonVerbal: false,
  motorImpaired: false,
  neurodivergent: false,
  noDisability: false,
},

followers: [],

following: [],

savedPosts: [],

profilePhoto:
  user.photoURL || "",
  },
  { merge: true }
  );

} catch (profileError) {

console.error(
"Profile setup error:",
profileError
);

}

if (user.emailVerified) {
  navigate("/onboarding");
} else {
  await sendEmailVerification(user);
  navigate("/verify-email");
}

} catch (signupError) {

console.error(
"Google signup error:",
signupError
);

setError(
getAuthErrorInfo(signupError)
);

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
maxLength={80}
autoComplete="name"
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
autoComplete="email"
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
placeholder="Password (12+ characters)"
autoComplete="new-password"
value={password}
onChange={(e) =>
setPassword(
e.target.value
)
}
style={inputStyle}
/>

<label style={{ display: "flex", gap: "10px", alignItems: "flex-start", color: "#cbd5e1", fontSize: "14px", lineHeight: "1.5", margin: "4px 0 18px" }}>
  <input type="checkbox" checked={acceptedStandards} onChange={(event) => setAcceptedStandards(event.target.checked)} style={{ marginTop: "3px" }} />
  <span>I agree to respect other members, use my account honestly, and never engage in scams, impersonation, threats, harassment, blackmail, exploitation or abusive conduct. I understand that serious violations may lead to account restrictions or removal.</span>
</label>

{error && (
<div
role="alert"
style={{
background: "#450a0a",
border: "1px solid #7f1d1d",
color: "#fecaca",
padding: "12px 14px",
borderRadius: "12px",
marginBottom: "16px",
fontSize: "14px",
lineHeight: "1.45",
}}
>
{error.message}
</div>
)}

<button
onClick={handleSignup}
disabled={submitting}
style={{ ...buttonStyle, opacity: submitting ? 0.65 : 1 }}
>
{submitting ? "Creating secure account…" : "Create Account"}
</button>

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
disabled={!acceptedStandards || submitting}
style={{ ...googleButton, opacity: !acceptedStandards ? 0.55 : 1 }}

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
