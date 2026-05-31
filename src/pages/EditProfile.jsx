import { useState } from "react";

function EditProfile() {

const [fullName, setFullName] =
useState("");

const [location, setLocation] =
useState("");

const [bio, setBio] =
useState("");

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

<button
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
