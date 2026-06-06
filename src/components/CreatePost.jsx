import { useState } from "react";

import {
collection,
addDoc,
serverTimestamp,
} from "firebase/firestore";

import {
ref,
uploadBytes,
getDownloadURL,
} from "firebase/storage";

import {
db,
auth,
storage,
} from "../firebase";

function CreatePost() {
const [post, setPost] = useState("");

const [image, setImage] =
useState(null);

const [preview, setPreview] =
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

function handleImage(e) {
const file =
e.target.files[0];

if (!file) return;

setImage(file);

setPreview(
  URL.createObjectURL(file)
);

}

async function handlePost() {
if (
!post.trim() &&
!image
) {
alert(
"Write something or upload an image"
);
return;
}

try {
  const user =
    auth.currentUser;

  let imageUrl = "";

  if (image) {
    const imageRef = ref(
      storage,
      `posts/${Date.now()}_${image.name}`
    );

    await uploadBytes(
      imageRef,
      image
    );

    imageUrl =
      await getDownloadURL(
        imageRef
      );
  }

  await addDoc(
    collection(db, "posts"),
    {
      text: post,
      imageUrl,
      userId: user.uid,
      userName:
        user.displayName ||
        "Inclura User",
      createdAt:
        serverTimestamp(),
      accessibilityTags:
        selectedTags,
      likes: [],
    }
  );

  alert("Post created");

  setPost("");
  setImage(null);
  setPreview("");
  setSelectedTags([]);

} catch (error) {
  alert(error.message);
}

}

return (
<div
style={{
background: "#0f172a",
padding: "24px",
borderRadius: "24px",
marginBottom: "24px",
border:
"1px solid #1e293b",
}}
> <h2>Create Post</h2>

  <textarea
    placeholder="Share something with Inclura..."
    value={post}
    onChange={(e) =>
      setPost(e.target.value)
    }
    style={{
      width: "100%",
      minHeight: "120px",
      padding: "16px",
      borderRadius: "16px",
      background: "#1e293b",
      color: "white",
      border: "none",
      marginBottom: "18px",
    }}
  />

  <input
    type="file"
    accept="image/*"
    onChange={handleImage}
  />

  {preview && (
    <img
      src={preview}
      alt="Preview"
      style={{
        width: "100%",
        marginTop: "16px",
        borderRadius: "16px",
      }}
    />
  )}

  <div
    style={{
      marginTop: "18px",
      marginBottom: "18px",
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
    }}
  >
    {accessibilityTags.map(
      (tag) => (
        <button
          key={tag}
          type="button"
          onClick={() =>
            toggleTag(tag)
          }
        >
          {tag}
        </button>
      )
    )}
  </div>

  <button
    onClick={handlePost}
  >
    Post
  </button>
</div>

);
}

export default CreatePost;
