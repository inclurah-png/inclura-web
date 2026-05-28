import { useState } from "react";

function CreatePost() {

const [post, setPost] =
useState("");

const [selectedTags,
setSelectedTags] =
useState([]);

const accessibilityTags = [
"📝 Alt Text",
"🔊 Audio Support",
"🤟 Sign Language",
"📖 Easy Read",
"⚠ Sensory Warning",
"🎙 Voice Note",
];

function toggleTag(tag) {

if (
selectedTags.includes(tag)
) {

setSelectedTags(
selectedTags.filter(
(item) => item !== tag
)
);

} else {

setSelectedTags([
...selectedTags,
tag,
]);

}

}

function handlePost() {

if (!post.trim()) {

alert(
"Write something first"
);

return;

}

alert("Post created");

setPost("");

setSelectedTags([]);

}

return (

<div
style={{
background: "#0f172a",
padding: "24px",
borderRadius: "24px",
marginBottom: "24px",
border: "1px solid #1e293b",
}}
>

<h2
style={{
marginBottom: "18px",
fontSize: "22px",
}}
>
Create Post
</h2>

<textarea
placeholder="Share something with Inclura..."
value={post}
onChange={(e) =>
setPost(e.target.value)
}
style={{
width: "100%",
minHeight: "130px",
background: "#1e293b",
border: "none",
borderRadius: "18px",
padding: "18px",
color: "white",
fontSize: "16px",
resize: "none",
outline: "none",
boxSizing: "border-box",
marginBottom: "20px",
}}
/>

<div
style={{
marginBottom: "22px",
}}
>

<h3
style={{
fontSize: "16px",
marginBottom: "12px",
color: "#cbd5e1",
}}
>
♿ Accessibility Tags
</h3>

<div
style={{
display: "flex",
flexWrap: "wrap",
gap: "10px",
}}
>

{accessibilityTags.map(
(tag) => (

<button
type="button"
key={tag}
onClick={() =>
toggleTag(tag)
}
style={{
padding: "12px 16px",
borderRadius: "16px",

border:
selectedTags.includes(tag)
? "2px solid #38bdf8"
: "1px solid #334155",

background:
selectedTags.includes(tag)
? "#1e3a8a"
: "#1e293b",

color: "white",

fontSize: "14px",

cursor: "pointer",
}}
>

{tag}

</button>

)
)}

</div>

</div>

<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
flexWrap: "wrap",
gap: "12px",
}}
>

<div
style={{
display: "flex",
gap: "12px",
flexWrap: "wrap",
}}
>

<button style={toolStyle}>
🖼 Photo
</button>

<button style={toolStyle}>
🎥 Video
</button>

<button style={toolStyle}>
🎙 Audio
</button>

<button style={toolStyle}>
📄 Document
</button>

</div>

<button
onClick={handlePost}
style={postButton}
>
Post
</button>

</div>

</div>

);

}

const toolStyle = {
padding: "12px 16px",
borderRadius: "14px",
border: "1px solid #334155",
background: "#1e293b",
color: "white",
cursor: "pointer",
fontSize: "14px",
};

const postButton = {
padding: "14px 22px",
borderRadius: "16px",
border: "none",
background: "#38bdf8",
color: "white",
fontWeight: "700",
cursor: "pointer",
fontSize: "15px",
};

export default CreatePost;
