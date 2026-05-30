
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
  const [post, setPost] =
    useState("");
  
const [image,
setImage] =
useState(null);
  const [selectedTags,
    setSelectedTags] =
    useState([]);

  const [image,
    setImage] =
    useState(null);

  const [preview,
    setPreview] =
    useState("");

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
          (item) =>
            item !== tag
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

{image && (

<img
src={URL.createObjectURL(image)}
alt="Preview"
style={{
width: "100%",
marginTop: "16px",
borderRadius: "18px",
border:
"1px solid #334155",
}}
/>

)}

  async function handlePost() {
    if (
      !post.trim() &&
      !image
    ) {
      alert(
        "Write something or upload image"
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

          userId:
            user.uid,

          userName:
            user.displayName ||
            "Inclura User",

          createdAt:
            serverTimestamp(),

          accessibilityTags:
            selectedTags,
        }
      );

      alert(
        "Post created"
      );

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
        background:
          "#0f172a",
        padding: "24px",
        borderRadius:
          "24px",
        marginBottom:
          "24px",
        border:
          "1px solid #1e293b",
      }}
    >
      <h2
        style={{
          marginBottom:
            "18px",
          fontSize: "22px",
        }}
      >
        Create Post
      </h2>

      <textarea
        placeholder="Share something with Inclura..."
        value={post}
        onChange={(e) =>
          setPost(
            e.target.value
          )
        }
        style={{
          width: "100%",
          minHeight:
            "130px",
          background:
            "#1e293b",
          border: "none",
          borderRadius:
            "18px",
          padding: "18px",
          color: "white",
          fontSize: "16px",
          resize: "none",
          outline: "none",
          boxSizing:
            "border-box",
          marginBottom:
            "20px",
        }}
      />
      
<input
type="file"
accept="image/*"
onChange={(e) =>
setImage(
e.target.files[0]
)
}
/>
  
{image && (

<img
src={URL.createObjectURL(image)}
alt="Preview"
style={{
width: "100%",
marginTop: "16px",
borderRadius: "18px",
border:
"1px solid #334155",
}}
/>

)}

  <div    
      <input
        type="file"
        accept="image/*"
        onChange={handleImage}
        style={{
          marginBottom:
            "20px",
          color: "white",
        }}
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{
            width: "100%",
            borderRadius:
              "18px",
            marginBottom:
              "20px",
          }}
        />
      )}

      <div
        style={{
          marginBottom:
            "22px",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            marginBottom:
              "12px",
            color:
              "#cbd5e1",
          }}
        >
          ♿ Accessibility Tags
        </h3>

        <div
          style={{
            display:
              "flex",
            flexWrap:
              "wrap",
            gap: "10px",
          }}
        >
          {accessibilityTags.map(
            (tag) => (
              <button
                type="button"
                key={tag}
                onClick={() =>
                  toggleTag(
                    tag
                  )
                }
                style={{
                  padding:
                    "12px 16px",
                  borderRadius:
                    "16px",

                  border:
                    selectedTags.includes(
                      tag
                    )
                      ? "2px solid #38bdf8"
                      : "1px solid #334155",

                  background:
                    selectedTags.includes(
                      tag
                    )
                      ? "#1e3a8a"
                      : "#1e293b",

                  color:
                    "white",

                  fontSize:
                    "14px",

                  cursor:
                    "pointer",
                }}
              >
                {tag}
              </button>
            )
          )}
        </div>
      </div>

      <button
        onClick={handlePost}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius:
            "16px",
          border: "none",
          background:
            "#38bdf8",
          color: "white",
          fontWeight:
            "700",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Post
      </button>
    </div>
  );
}

export default CreatePost;
