import { storage } from "../firebase";

import {
  addVideoPost,
  addTextPost,
} from "../utils/creatorScore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "../firebase";

import { useState, useRef } from "react";

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

import {
  db,
  auth,
} from "../firebase";

function CreatePost() {
  const [postText, setPostText] =
    useState("");

  const [category, setCategory] =
    useState("General");

  const [loading, setLoading] =
    useState(false);

  const [imageFile, setImageFile] =
    useState(null);

  const [videoFile, setVideoFile] =
    useState(null);

  const imageInputRef =
    useRef(null);

  const videoInputRef =
    useRef(null);

  async function handlePost() {
    if (
      !postText.trim() &&
      !imageFile &&
      !videoFile
    ) {
      alert(
        "Add text, image or video first."
      );
      return;
    }

    try {
      setLoading(true);

      const user =
        auth.currentUser;

      if (!user) {
        alert(
          "Please login again."
        );
        return;
      }

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      const userSnap =
        await getDoc(userRef);

      const profile =
        userSnap.data();

let imageUrl = "";
let videoUrl = "";

if (imageFile) {
  const imageRef = ref(
    storage,
    `posts/images/${user.uid}/${Date.now()}_${imageFile.name}`
  );

  await uploadBytes(imageRef, imageFile);

  imageUrl = await getDownloadURL(imageRef);
}

if (videoFile) {
  const videoRef = ref(
    storage,
    `posts/videos/${user.uid}/${Date.now()}_${videoFile.name}`
  );

  await uploadBytes(videoRef, videoFile);

  videoUrl = await getDownloadURL(videoRef);
}

      await addDoc(
  collection(db, "posts"),
  {
    text: postText,

    language: "auto",

    translatedText: {},

    category,

    userId: user.uid,

          userName:
            profile?.fullName ||
            user.displayName ||
            "Inclura User",

          profilePhoto:
            profile?.profilePhoto ||
            "",

          role:
            profile?.role ||
            "user",

          accessibilityNeeds:
            profile?.accessibilityNeeds ||
            [],

          verified:
            profile?.verified ||
            false,

          badgeType:
            profile?.badgeType ||
            "",

          premium:
            profile?.premium ||
            false,

          premiumTier:
            profile?.premiumTier ||
            "",

          imageUrl,

          videoUrl,

          likes: [],

          comments: [],

              reactions: {
  "👍": 0,
  "❤️": 0,
  "😂": 0,
  "😊": 0,
  "😮": 0,
  "😢": 0,
  "👏": 0,
  "👎": 0,
},

userReactions: {},

creatorScore: 0,

commentCount: 0,

crossPosts: 0,

saveCount: 0,
              
          createdAt:
            serverTimestamp(),
        }
      );
      
      // ---------------------------
// Update Creator Economy
// ---------------------------

if (videoFile) {
  await addVideoPost(user.uid);
} else {
  await addTextPost(user.uid);
}
      
if (videoFile) {
  await addVideoPost(user.uid);
}

if (!videoFile) {
  await addTextPost(user.uid);
}
      setPostText("");
      setImageFile(null);
      setVideoFile(null);

      alert(
        "Post created successfully!"
      );
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleImageSelect(
    e
  ) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
  }

  function handleVideoSelect(
    e
  ) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setVideoFile(file);
  }

  return (
    <div
      style={{
        background: "#0f172a",
        padding: "20px",
        borderRadius: "20px",
        marginBottom: "24px",
        color: "white",
      }}
    >
      <h3
        style={{
          marginBottom: "16px",
        }}
      >
        ✍ Create Post
      </h3>

      <textarea
        value={postText}
        onChange={(e) =>
          setPostText(
            e.target.value
          )
        }
        placeholder="Share something with the Inclura community..."
        style={{
          width: "100%",
          minHeight: "120px",
          borderRadius: "14px",
          border:
            "1px solid #334155",
          background:
            "#1e293b",
          color: "white",
          padding: "14px",
          resize: "vertical",
          boxSizing:
            "border-box",
        }}
      />

      {imageFile && (
        <div
          style={{
            marginTop: "14px",
            color: "#38bdf8",
          }}
        >
          📷 {imageFile.name}
        </div>
      )}

      {videoFile && (
        <div
          style={{
            marginTop: "10px",
            color: "#38bdf8",
          }}
        >
          🎥 {videoFile.name}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "14px",
          flexWrap: "wrap",
        }}
      >
        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          style={{
            padding: "10px",
            borderRadius:
              "12px",
            border: "none",
          }}
        >
          <option>
            General
          </option>

          <option>
            Accessibility
          </option>

          <option>
            Care-Gig
          </option>

          <option>
            Opportunity
          </option>

          <option>
            Mentorship
          </option>

          <option>
            Marketplace
          </option>
        </select>

        <button
          style={actionBtn}
          onClick={() =>
            imageInputRef.current?.click()
          }
        >
          📷 Photo
        </button>

        <button
          style={actionBtn}
          onClick={() =>
            videoInputRef.current?.click()
          }
        >
          🎥 Video
        </button>

        <button
          style={actionBtn}
        >
          ♿ Accessibility
        </button>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={
          handleImageSelect
        }
        style={{
          display: "none",
        }}
      />

      <input
        type="file"
        accept="video/*"
        ref={videoInputRef}
        onChange={
          handleVideoSelect
        }
        style={{
          display: "none",
        }}
      />

      <button
        onClick={handlePost}
        disabled={loading}
        style={{
          marginTop: "16px",
          background:
            "#38bdf8",
          border: "none",
          color: "white",
          padding:
            "12px 18px",
          borderRadius:
            "12px",
          cursor: "pointer",
          fontWeight:
            "bold",
        }}
      >
        {loading
          ? "Posting..."
          : "Post"}
      </button>
    </div>
  );
}

const actionBtn = {
  background: "#1e293b",
  border:
    "1px solid #334155",
  color: "white",
  padding: "10px 14px",
  borderRadius: "12px",
  cursor: "pointer",
};

export default CreatePost;
