import { useState } from "react";

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

async function handlePost() {
if (!postText.trim()) {
alert("Write something first.");
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

  await addDoc(
  collection(db, "posts"),
  {
    text: postText,

    category,

    userId: user.uid,

    userName:
      profile?.fullName ||
      user.displayName ||
      "Inclura User",

    profilePhoto:
      profile?.profilePhoto || "",

    role:
      profile?.role ||
      "user",

    accessibilityNeeds:
      profile?.accessibilityNeeds || [],

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

    likes: [],

    comments: [],

    createdAt:
      serverTimestamp(),
  }
);

  setPostText("");

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
      background: "#1e293b",
      color: "white",
      padding: "14px",
      resize: "vertical",
      boxSizing:
        "border-box",
    }}
  />

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
        borderRadius: "12px",
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
    >
      📷 Photo
    </button>

    <button
      style={actionBtn}
    >
      🎥 Video
    </button>

    <button
      style={actionBtn}
    >
      ♿ Accessibility
    </button>
  </div>

  <button
    onClick={handlePost}
    disabled={loading}
    style={{
      marginTop: "16px",
      background: "#38bdf8",
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
