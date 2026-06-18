import { useState } from "react";

import {
collection,
addDoc,
getDocs,
query,
where,
serverTimestamp,
doc,
getDoc,
} from "firebase/firestore";

import {
db,
auth,
} from "../firebase";

function CreateStory() {
const [storyText, setStoryText] =
useState("");

const [uploading, setUploading] =
useState(false);

async function submitTextStory() {
try {
const user =
auth.currentUser;

  if (!user) {
    alert("Login required");
    return;
  }

  if (!storyText.trim()) {
    alert(
      "Write a story first"
    );
    return;
  }

  setUploading(true);

  const userRef = doc(
    db,
    "users",
    user.uid
  );

  const userSnap =
    await getDoc(userRef);

  const profile =
    userSnap.data();

  const storiesQuery = query(
    collection(db, "stories"),
    where(
      "userId",
      "==",
      user.uid
    )
  );

  const storiesSnapshot =
    await getDocs(
      storiesQuery
    );

  const activeStories =
    storiesSnapshot.docs.filter(
      (doc) =>
        doc.data()
          .expiresAt >
        Date.now()
    );

  if (
    activeStories.length >=
    12
  ) {
    alert(
      "Maximum of 12 active stories allowed"
    );
    return;
  }

  const expiresAt =
    Date.now() +
    24 *
      60 *
      60 *
      1000;

  await addDoc(
    collection(
      db,
      "stories"
    ),
    {
      userId: user.uid,

      userName:
        profile?.fullName ||
        user.displayName ||
        "Inclura User",

      verified:
        profile?.verified ||
        false,

      badgeType:
        profile?.badgeType ||
        "",

      role:
        profile?.role ||
        "user",

      category:
        profile?.category ||
        "Member",

      storyType: "text",

      storyText,

      storyUrl: "",

      createdAt:
        serverTimestamp(),

      expiresAt,

      views: [],
    }
  );

  setStoryText("");

  alert(
    "Story posted successfully"
  );
} catch (error) {
  console.error(error);

  alert(
    "Failed to post story"
  );
} finally {
  setUploading(false);
}

}

function imageStoryComingSoon() {
alert(
"Image stories will activate automatically when Firebase Storage is enabled."
);
}

function videoStoryComingSoon() {
alert(
"Video stories will activate automatically when Firebase Storage is enabled."
);
}

return (
<div
style={{
background: "#1e293b",
padding: "16px",
borderRadius: "16px",
marginBottom: "20px",
}}
>
<textarea
value={storyText}
onChange={(e) =>
setStoryText(
e.target.value
)
}
placeholder="Share a story..."
style={{
width: "100%",
minHeight: "90px",
borderRadius: "12px",
border:
"1px solid #334155",
background: "#0f172a",
color: "white",
padding: "12px",
marginBottom: "14px",
boxSizing:
"border-box",
}}
/>

  <div
    style={{
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    }}
  >
    <button
      onClick={
        submitTextStory
      }
      style={buttonStyle}
    >
      📝 Text Story
    </button>

    <button
      onClick={
        imageStoryComingSoon
      }
      style={buttonStyle}
    >
      📷 Image Story
    </button>

    <button
      onClick={
        videoStoryComingSoon
      }
      style={buttonStyle}
    >
      🎥 Video Story
    </button>
  </div>

  {uploading && (
    <p
      style={{
        marginTop: "12px",
        color: "#38bdf8",
      }}
    >
      Posting story...
    </p>
  )}
</div>

);
}

const buttonStyle = {
background: "#38bdf8",
border: "none",
color: "white",
padding: "10px 16px",
borderRadius: "12px",
cursor: "pointer",
};

export default CreateStory;
