
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";

import {
doc,
onSnapshot,
} from "firebase/firestore";

function Profile() {
  
const [profile, setProfile] =
useState(null);
const navigate =
useNavigate();  

alert("Profile photo updated");

} catch (error) {

alert(error.message);

} finally {

setUploading(false);

}

}
useEffect(() => {

const user =
auth.currentUser;

if (!user) return;

const unsubscribe =
onSnapshot(
doc(
db,
"users",
user.uid
),
(docSnap) => {

if (
docSnap.exists()
) {

setProfile(
docSnap.data()
);

}

}
);

return () =>
unsubscribe();

}, []);

if (!profile) {

return (

<div
style={{
background: "#020617",
minHeight: "100vh",
color: "white",
display: "flex",
justifyContent: "center",
alignItems: "center",
fontFamily: "Arial",
}}
>
Loading profile...
</div>
);

}

return (

<div
style={{
background: "#020617",
minHeight: "100vh",
padding: "24px",
color: "white",
fontFamily: "Arial",
}}
>

<div
style={{
maxWidth: "700px",
margin: "0 auto",
}}
>

<div
style={{
background: "#0f172a",
padding: "32px",
borderRadius: "30px",
border: "1px solid #1e293b",
}}
>

<div
style={{
display: "flex",
alignItems: "center",
gap: "20px",
marginBottom: "30px",
}}
>

<div
style={{
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: "10px",
}}
>

{profile.photoURL ? (

<img
src={profile.photoURL}
alt="Profile"
style={{
width: "140px",
height: "140px",
borderRadius: "50%",
objectFit: "cover",
}}
/>

) : (

<div
style={{
width: "140px",
height: "140px",
borderRadius: "50%",
background: "#38bdf8",
display: "flex",
justifyContent: "center",
alignItems: "center",
fontSize:  "48px",,
fontWeight: "700",
}}
>
{profile.fullName?.charAt(0)}
</div>

)}

<input
type="file"
accept="image/*"
onChange={handlePhotoUpload}
/>

{uploading && (
<p style={{ color: "#38bdf8" }}>
Uploading...
</p>
)}

</div>

<div>

<h1
style={{
marginBottom: "8px",
}}
>
{profile.fullName}
</h1>
  
<button
onClick={() =>
window.location.href =
"/edit-profile"
}
style={{
background: "#38bdf8",
border: "none",
padding: "10px 18px",
borderRadius: "12px",
color: "white",
fontWeight: "600",
cursor: "pointer",
marginTop: "10px",
}}
>
Edit Profile
</button>
{profile.bio && (

<p
style={{
marginTop: "12px",
color: "#cbd5e1",
lineHeight: "1.6",
}}
>
{profile.bio}
</p>

)}
<p
style={{
color: "#94a3b8",
marginTop: "12px",
fontSize: "14px",
}}
>
Followers:
{" "}
{profile.followers?.length || 0}

&nbsp;•&nbsp;

Following:
{" "}
{profile.following?.length || 0}
</p>

<p
style={{
color: "#94a3b8",
}}
>
📧 Private Email
</p>
  
<button
onClick={() =>
navigate("/edit-profile")
}
style={{
background: "#38bdf8",
border: "none",
padding: "10px 18px",
borderRadius: "12px",
color: "white",
fontWeight: "600",
cursor: "pointer",
marginTop: "10px",
}}
>
Edit Profile
</button>
  
</div>

</div>

<div
style={{
display: "flex",
flexDirection: "column",
gap: "18px",
}}
>

<div style={cardStyle}>
♿ Accessibility Mode:
{" "}
{profile.accessibilityMode
? "Enabled"
: "Disabled"}
</div>

<div style={cardStyle}>
🏅 Verified:
{" "}
{profile.verified
? "Yes"
: "No"}
</div>

<div style={cardStyle}>
💳 Wallet Balance:
$
{profile.walletBalance}
</div>

<div style={cardStyle}>
📄 Resume Completed:
{" "}
{profile.resumeCompleted
? "Yes"
: "No"}
</div>

<div style={cardStyle}>
🛡 Role:
{profile.role}
</div>
  
<div style={cardStyle}>
🗂 Category:
{" "}
{profile.category || "Not selected"}
</div>

<div style={cardStyle}>
📱 Phone:
{" "}
{profile.phoneNumber || "Not provided"}
</div>
  
<div style={cardStyle}>
🏷 Category:
{" "}
{profile.category || "Not Selected"}
</div>

<h3
style={{
marginBottom: "12px",
}}
>
♿ Accessibility Needs
</h3>

<div
style={{
display: "flex",
flexWrap: "wrap",
gap: "10px",
}}
>

{(profile.accessibilityNeeds || []).map(
(item) => (

<div
key={item}
style={{
background: "#1e3a8a",
padding: "10px 14px",
borderRadius: "14px",
fontSize: "14px",
}}
>

{item}

</div>

)
)}

</div>

</div>
  
</div>

</div>

</div>

</div>

);

}


const cardStyle = {
background: "#1e293b",
padding: "18px",
borderRadius: "18px",
};

export default Profile;
