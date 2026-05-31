import { useEffect, useState } from "react";

import { auth, db } from "../firebase";

import {
doc,
getDoc,
updateDoc,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

function EditProfile() {

const [fullName, setFullName] =
useState("");

const [location, setLocation] =
useState("");

const [bio, setBio] =
useState("");
  
const [category, setCategory] =
useState("");
  
const navigate =
useNavigate();

useEffect(() => {

async function loadProfile() {

const user =
auth.currentUser;

if (!user) return;

const snap =
await getDoc(
doc(
db,
"users",
user.uid
)
);

if (snap.exists()) {

const data =
snap.data();

setFullName(
data.fullName || ""
);

setLocation(
data.location || ""
);

setBio(
data.bio || ""
);

setCategory(
data.category || ""
);

}

}

loadProfile();

}, []);

async function handleSave() {

try {

const user =
auth.currentUser;

if (!user) return;

await updateDoc(
doc(
db,
"users",
user.uid
),
{
fullName,
location,
bio,
category,
}
);

alert(
"Profile updated successfully"
);

navigate("/profile");

} catch (error) {

alert(error.message);

}

}
return (

<div
style={{
background:"#020617",
minHeight:"100vh",
padding:"24px",
color:"white",
fontFamily:"Arial",
}}
>

<div
style={{
maxWidth:"700px",
margin:"0 auto",
background:"#0f172a",
padding:"30px",
borderRadius:"24px",
}}
>

<h1>Edit Profile</h1>

<input
placeholder="Full Name"
value={fullName}
onChange={(e)=>
setFullName(e.target.value)
}
style={inputStyle}
/>

<input
placeholder="Location"
value={location}
onChange={(e)=>
setLocation(e.target.value)
}
style={inputStyle}
/>

<textarea
placeholder="Bio"
value={bio}
onChange={(e)=>
setBio(e.target.value)
}
style={{
...inputStyle,
height:"120px",
}}
/>
  
<select
value={category}
onChange={(e) =>
setCategory(
e.target.value
)
}
style={inputStyle}
>

<option value="">
Select Category
</option>

<option value="Creator">
Creator
</option>

<option value="Caregiver">
Caregiver
</option>

<option value="Employer">
Employer
</option>

<option value="Job Seeker">
Job Seeker
</option>

<option value="Volunteer">
Volunteer
</option>

<option value="Organization">
Organization
</option>

<option value="Advocate">
Advocate
</option>

</select>
<button
onClick={handleSave}
style={buttonStyle}
>
Save Changes
</button>

</div>

</div>

);

}

const inputStyle = {
width:"100%",
padding:"16px",
marginBottom:"16px",
borderRadius:"14px",
border:"1px solid #334155",
background:"#1e293b",
color:"white",
boxSizing:"border-box",
};

const buttonStyle = {
width:"100%",
padding:"16px",
borderRadius:"14px",
border:"none",
background:"#38bdf8",
color:"white",
fontWeight:"700",
cursor:"pointer",
};

export default EditProfile;
