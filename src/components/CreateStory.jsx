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

import {
  getVerificationMetadata,
} from "../config/verificationTypes";

import {
  migrateVerificationId,
} from "../config/verificationMigration";

function CreateStory() {
const [storyText, setStoryText] =
useState("");

const [uploading, setUploading] =
useState(false);

const [screenReader, setScreenReader] =
useState(true);

const [textOnly, setTextOnly] =
useState(true);

const [voiceStory, setVoiceStory] =
useState(false);

const [highContrast, setHighContrast] =
useState(false);

const [largeText, setLargeText] =
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

    profilePhoto:
      profile?.profilePhoto ||
      profile?.photoURL ||
      user.photoURL ||
      "",

    verified:
  profile?.verified ||
  false,

badgeType:
  migrateVerificationId(
    profile?.badgeType
  ),

verificationMetadata:
  profile?.verified
    ? getVerificationMetadata(
        migrateVerificationId(
          profile?.badgeType
        )
      )
    : null,

    role:
      profile?.role ||
      "individual",

    category:
      profile?.category ||
      "Member",

    accessibilityNeeds:
      profile?.accessibilityNeeds || [],

    premium:
      profile?.premium ||
      false,

    premiumTier:
      profile?.premiumTier ||
      "",

      storyType:
        voiceStory
          ? "voice"
          : "text",

      storyText,

      storyUrl: "",

      accessibility: {
        screenReader,
        textOnly,
        voiceStory,
        highContrast,
        largeText,
      },

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
background:
"#1e293b",
padding: "16px",
borderRadius: "16px",
marginBottom:
"20px",
}}
>
<h3
style={{
color: "white",
marginBottom:
"12px",
}}
>
Create Story
</h3>

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
      borderRadius:
        "12px",
      border:
        "1px solid #334155",
      background:
        "#0f172a",
      color: "white",
      padding: "12px",
      marginBottom:
        "14px",
      boxSizing:
        "border-box",
      fontSize:
        largeText
          ? "22px"
          : "16px",
    }}
  />

  <div
    style={{
      display: "grid",
      gap: "8px",
      marginBottom:
        "16px",
      color: "white",
    }}
  >
    <label>
      <input
        type="checkbox"
        checked={
          screenReader
        }
        onChange={(e) =>
          setScreenReader(
            e.target
              .checked
          )
        }
      />
      {" "}
      🔊 Screen Reader
      Support
    </label>

    <label>
      <input
        type="checkbox"
        checked={
          textOnly
        }
        onChange={(e) =>
          setTextOnly(
            e.target
              .checked
          )
        }
      />
      {" "}
      📄 Text Only Story
    </label>

    <label>
      <input
        type="checkbox"
        checked={
          voiceStory
        }
        onChange={(e) =>
          setVoiceStory(
            e.target
              .checked
          )
        }
      />
      {" "}
      🎤 Voice Story
    </label>

    <label>
      <input
        type="checkbox"
        checked={
          highContrast
        }
        onChange={(e) =>
          setHighContrast(
            e.target
              .checked
          )
        }
      />
      {" "}
      🎨 High Contrast
    </label>

    <label>
      <input
        type="checkbox"
        checked={
          largeText
        }
        onChange={(e) =>
          setLargeText(
            e.target
              .checked
          )
        }
      />
      {" "}
      🔠 Large Text Mode
    </label>
  </div>

  <div
    style={{
      display: "flex",
      gap: "10px",
      flexWrap:
        "wrap",
    }}
  >
    <button
      onClick={
        submitTextStory
      }
      style={
        buttonStyle
      }
    >
      📝 Post Story
    </button>

    <button
      onClick={
        imageStoryComingSoon
      }
      style={
        buttonStyle
      }
    >
      📷 Image Story
    </button>

    <button
      onClick={
        videoStoryComingSoon
      }
      style={
        buttonStyle
      }
    >
      🎥 Video Story
    </button>
  </div>

  {uploading && (
    <p
      style={{
        marginTop:
          "12px",
        color:
          "#38bdf8",
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
