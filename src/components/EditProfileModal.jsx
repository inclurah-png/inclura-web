
import { useState } from "react";

import {
doc,
updateDoc,
} from "firebase/firestore";

import { db, auth } from "../firebase";

function EditProfileModal({
profile,
onClose,
}) {

const [fullName, setFullName] =
useState(
profile.fullName || ""
);

const [bio, setBio] =
useState(
profile.bio || ""
);

const [location, setLocation] =
useState(
profile.location || ""
);

const [accessibility, setAccessibility] =
useState(
profile.accessibility || ""
);

async function handleSave() {

try {

const user =
auth.currentUser;

await updateDoc(
doc(
db,
"users",
user.uid
),
{
fullName,
bio,
location,
accessibility,
}
);

alert(
"Profile updated"
);

onClose();

} catch (error) {

alert(error.message);

}

}

return (

<div
style={{
position: "fixed",
top: 0,
left: 0,
right: 0,
bottom: 0,
background:
"rgba(0,0,0,0.7)",
display: "flex",
justifyContent: "center",
alignItems: "center",
zIndex: 1000,
padding: "20px",
}}
>

<div
style={{
background: "#0f172a",
padding: "24px",
borderRadius: "24px",
width: "100%",
maxWidth: "500px",
}}
>

<h2
style={{
marginBottom: "20px",
}}
>
Edit Profile
</h2>

<input
type="text"
placeholder="Full name"
value={fullName}
onChange={(e) =>
setFullName(e.target.value)
}
style={inputStyle}
/>

<textarea
placeholder="Bio"
value={bio}
onChange={(e) =>
setBio(e.target.value)
}
style={{
...inputStyle,
minHeight: "100px",
resize: "none",
}}
/>

<input
type="text"
placeholder="Location"
value={location}
onChange={(e) =>
setLocation(e.target.value)
}
style={inputStyle}
/>

<input
type="text"
placeholder="Accessibility preferences"
value={accessibility}
onChange={(e) =>
setAccessibility(
e.target.value
)
}
style={inputStyle}
/>

<div
style={{
display: "flex",
gap: "12px",
marginTop: "20px",
}}
>

<button
onClick={handleSave}
style={saveBtn}
>
Save
</button>

<button
onClick={onClose}
style={cancelBtn}
>
Cancel
</button>

</div>

</div>

</div>

);

}

const inputStyle = {
width: "100%",
padding: "14px",
borderRadius: "14px",
border: "1px solid #334155",
background: "#1e293b",
color: "white",
marginBottom: "14px",
outline: "none",
boxSizing: "border-box",
};

const saveBtn = {
padding: "14px 20px",
borderRadius: "14px",
border: "none",
background: "#38bdf8",
color: "white",
fontWeight: "700",
cursor: "pointer",
};

const cancelBtn = {
padding: "14px 20px",
borderRadius: "14px",
border: "1px solid #334155",
background: "transparent",
color: "white",
cursor: "pointer",
};

export default EditProfileModal;
