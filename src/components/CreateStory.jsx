import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

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
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

function CreateStory() {
const { t } = useTranslation();

const [storyText, setStoryText] =
useState("");

const [uploading, setUploading] =
useState(false);

const [highContrast, setHighContrast] =
useState(false);

const [largeText, setLargeText] =
useState(false);

const imageInputRef = useRef(null);
const videoInputRef = useRef(null);

async function submitTextStory() {
try {
const user =
auth.currentUser;

  if (!user) {
    alert(t("storyLoginRequired"));
    return;
  }

  if (!storyText.trim()) {
    alert(
      t("storyWriteFirst")
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
    storiesSnapshot.docs.filter((storyDoc) => {
      const expiresAt = storyDoc.data().expiresAt;
      return expiresAt?.toMillis
        ? expiresAt.toMillis() > Date.now()
        : Number(expiresAt || 0) > Date.now();
    });

  if (
    activeStories.length >=
    12
  ) {
    alert(
      t("storyMaxActive")
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

badgeType: profile?.badgeType || "",

verificationMetadata:
  profile?.verified
    ? getVerificationMetadata(profile?.badgeType || "")
    : null,

    role:
      profile?.role ||
      "user",

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

      storyType: "text",

      storyText,

      storyUrl: "",

      accessibility: {
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
    t("storyPosted")
  );
} catch (error) {
  console.error(error);

  alert(
    t("storyPostFailed")
  );
} finally {
  setUploading(false);
}

}

async function submitMediaStory(file, mediaType) {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert(t("storyLoginRequired"));
      return;
    }
    if (!file) return;

    const maxBytes = mediaType === "image"
      ? 10 * 1024 * 1024
      : 100 * 1024 * 1024;

    if (file.size > maxBytes) {
      alert(mediaType === "image"
        ? "Image must be 10 MB or smaller."
        : "Video must be 100 MB or smaller.");
      return;
    }

    if (mediaType === "image" && !file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (mediaType === "video" && !file.type.startsWith("video/")) {
      alert("Please select a video file.");
      return;
    }

    setUploading(true);

    const storagePath = `stories/${user.uid}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file, { contentType: file.type });
    const mediaUrl = await getDownloadURL(storageRef);

    const userSnap = await getDoc(doc(db, "users", user.uid));
    const profile = userSnap.data();

    const storiesSnapshot = await getDocs(query(
      collection(db, "stories"),
      where("userId", "==", user.uid)
    ));

    const activeStories = storiesSnapshot.docs.filter((storyDoc) => {
      const expiresAt = storyDoc.data().expiresAt;
      return expiresAt?.toMillis
        ? expiresAt.toMillis() > Date.now()
        : Number(expiresAt || 0) > Date.now();
    });

    if (activeStories.length >= 12) {
      alert(t("storyMaxActive"));
      return;
    }

    await addDoc(collection(db, "stories"), {
      userId: user.uid,
      userName: profile?.fullName || user.displayName || "Inclura User",
      profilePhoto: profile?.profilePhoto || profile?.photoURL || user.photoURL || "",
      verified: profile?.verified || false,
      badgeType: profile?.badgeType || "",
      verificationMetadata: profile?.verified
        ? getVerificationMetadata(profile?.badgeType || "")
        : null,
      role: profile?.role || "user",
      category: profile?.category || "Member",
      accessibilityNeeds: profile?.accessibilityNeeds || [],
      premium: profile?.premium || false,
      premiumTier: profile?.premiumTier || "",
      storyType: mediaType,
      storyText: storyText.trim(),
      storyUrl: mediaUrl,
      mediaUrl,
      mediaType: file.type,
      accessibility: {
        highContrast,
        largeText,
      },
      createdAt: serverTimestamp(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      views: [],
    });

    setStoryText("");
    alert(mediaType === "image"
      ? "Image story posted successfully."
      : "Video story posted successfully.");
  } catch (error) {
    console.error("Media story upload failed:", error);
    alert(t("storyPostFailed"));
  } finally {
    setUploading(false);
  }
}

function handleImageSelection(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (file) submitMediaStory(file, "image");
}

function handleVideoSelection(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (file) submitMediaStory(file, "video");
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
{t("createStoryTitle")}
</h3>

  <textarea
    value={storyText}
    onChange={(e) =>
      setStoryText(
        e.target.value
      )
    }
    placeholder={t("storyPlaceholder")}
    aria-label={t("storyInputLabel")}
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
      🎨 {t("highContrast")}
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
      🔠 {t("largeTextMode")}
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
      📝 {t("postStory")}
    </button>

    <button
      type="button"
      onClick={() => imageInputRef.current?.click()}
      style={
        buttonStyle
      }
    >
      📷 {t("imageStory")}
    </button>

    <button
      type="button"
      onClick={() => videoInputRef.current?.click()}
      style={
        buttonStyle
      }
    >
      🎥 {t("videoStory")}
    </button>
  </div>

  <input
    ref={imageInputRef}
    type="file"
    accept="image/*"
    onChange={handleImageSelection}
    style={{ display: "none" }}
  />

  <input
    ref={videoInputRef}
    type="file"
    accept="video/*"
    onChange={handleVideoSelection}
    style={{ display: "none" }}
  />

  {uploading && (
    <p
      style={{
        marginTop:
          "12px",
        color:
          "#38bdf8",
      }}
    >
      {t("postingStory")}
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
