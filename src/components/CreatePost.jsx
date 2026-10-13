import {
  addVideoPost,
  addTextPost,
} from "../utils/creatorScore";

import {
  getVerificationMetadata,
} from "../config/verificationTypes";

import {
  migrateVerificationId,
} from "../config/verificationMigration";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  storage,
  db,
  auth,
} from "../firebase";

import {
  useState,
  useRef,
} from "react";

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

import {
  detectLanguage,
} from "../translation/languageDetector";

function normalizeLanguageCode(code = "") {
  const normalized = String(code)
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");

  if (
    normalized === "zh-tw" ||
    normalized === "zh-hant"
  ) {
    return "zh-TW";
  }

  return normalized || "en";
}

function getProfileName(profile, user) {
  const fullName =
    typeof profile?.fullName === "string"
      ? profile.fullName.trim()
      : "";

  if (fullName) return fullName;

  const profileDisplayName =
    typeof profile?.displayName === "string"
      ? profile.displayName.trim()
      : "";

  if (profileDisplayName) return profileDisplayName;

  const profileName =
    typeof profile?.name === "string"
      ? profile.name.trim()
      : "";

  if (profileName) return profileName;

  const firstName =
    typeof profile?.firstName === "string"
      ? profile.firstName.trim()
      : "";

  const lastName =
    typeof profile?.lastName === "string"
      ? profile.lastName.trim()
      : "";

  const combinedName =
    `${firstName} ${lastName}`.trim();

  if (combinedName) return combinedName;

  const authDisplayName =
    typeof user?.displayName === "string"
      ? user.displayName.trim()
      : "";

  if (authDisplayName) return authDisplayName;

  return "";
}

function CreatePost() {
  const [postText, setPostText] = useState("");
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  async function handlePost() {
    const cleanPostText = postText.trim();

    if (!cleanPostText && !imageFile && !videoFile) {
      alert("Add text, image or video first.");
      return;
    }

    if (imageFile && videoFile) {
      alert("Please create a post with either a photo or a video, not both.");
      return;
    }

    let postCreated = false;
    let scoringRecorded = true;

    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user) {
        alert("Please login again.");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const profile = userSnap.exists()
        ? userSnap.data()
        : {};

      const userName = getProfileName(profile, user);

      if (!userName) {
        alert(
          "Your profile name is not available yet. Please complete your profile name and try again."
        );
        return;
      }

      let detectedLanguage = {
        code: "en",
        language: "English",
        confidence: 0,
      };

      if (cleanPostText) {
        try {
          detectedLanguage = await detectLanguage(cleanPostText);
        } catch (languageError) {
          console.warn(
            "Inclura Post Language Detection Warning:",
            languageError
          );
        }
      }

      const originalLanguage = normalizeLanguageCode(
        detectedLanguage?.code || "en"
      );

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

      // Save the post and retain its real Firestore document ID.
      const createdPost = await addDoc(
        collection(db, "posts"),
        {
          text: cleanPostText,
          language: originalLanguage,
          originalLanguage,
          translatedText: {},
          category,
          userId: user.uid,
          userName,
          profilePhoto: profile?.profilePhoto || "",
          role: profile?.role || "user",
          accessibilityNeeds: profile?.accessibilityNeeds || [],

          verified: profile?.verified || false,

          badgeType: migrateVerificationId(
            profile?.badgeType
          ),

          verificationMetadata: profile?.verified
            ? getVerificationMetadata(
                migrateVerificationId(profile?.badgeType)
              )
            : null,

          premium: profile?.premium || false,
          premiumTier: profile?.premiumTier || "",

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
          createdAt: serverTimestamp(),
        }
      );

      postCreated = true;

      // Award activity against the actual saved post ID.
      // A scoring failure must not turn a successful post
      // creation into a reported post-creation failure.
      try {
        if (videoFile) {
          await addVideoPost(user.uid, createdPost.id);
        } else {
          await addTextPost(user.uid, createdPost.id);
        }
      } catch (scoreError) {
        scoringRecorded = false;

        console.error(
          "Inclura Creator Scoring Error:",
          scoreError
        );
      }

      setPostText("");
      setImageFile(null);
      setVideoFile(null);

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }

      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }

      if (scoringRecorded) {
        alert("Post created successfully!");
      } else {
        alert(
          "Your post was created, but creator scoring could not be recorded. Please try again later."
        );
      }
    } catch (error) {
      console.error(
        "Inclura Create Post Error:",
        error
      );

      if (postCreated) {
        alert(
          "Your post was created, but a follow-up operation failed."
        );
      } else {
        alert(
          error?.message || "Unable to create post."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function handleImageSelect(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setVideoFile(null);

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  }

  function handleVideoSelect(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setVideoFile(file);
    setImageFile(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
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
      <h3 style={{ marginBottom: "16px" }}>
        ✍ Create Post
      </h3>

      <textarea
        value={postText}
        onChange={(event) => setPostText(event.target.value)}
        placeholder="Share something with the Inclura community..."
        style={{
          width: "100%",
          minHeight: "120px",
          borderRadius: "14px",
          border: "1px solid #334155",
          background: "#1e293b",
          color: "white",
          padding: "14px",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />

      {imageFile && (
        <div style={{ marginTop: "14px", color: "#38bdf8" }}>
          📷 {imageFile.name}
        </div>
      )}

      {videoFile && (
        <div style={{ marginTop: "10px", color: "#38bdf8" }}>
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
          onChange={(event) => setCategory(event.target.value)}
          style={{
            padding: "10px",
            borderRadius: "12px",
            border: "none",
          }}
        >
          <option>General</option>
          <option>Accessibility</option>
          <option>Care-Gig</option>
          <option>Opportunity</option>
          <option>Mentorship</option>
          <option>Marketplace</option>
        </select>

        <button
          type="button"
          style={actionBtn}
          onClick={() => imageInputRef.current?.click()}
          disabled={loading}
        >
          📷 Photo
        </button>

        <button
          type="button"
          style={actionBtn}
          onClick={() => videoInputRef.current?.click()}
          disabled={loading}
        >
          🎥 Video
        </button>

        <button
          type="button"
          style={actionBtn}
          disabled={loading}
        >
          ♿ Accessibility
        </button>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageSelect}
        style={{ display: "none" }}
        disabled={loading}
      />

      <input
        type="file"
        accept="video/*"
        ref={videoInputRef}
        onChange={handleVideoSelect}
        style={{ display: "none" }}
        disabled={loading}
      />

      <button
        type="button"
        onClick={handlePost}
        disabled={loading}
        style={{
          marginTop: "16px",
          background: "#38bdf8",
          border: "none",
          color: "white",
          padding: "12px 18px",
          borderRadius: "12px",
          cursor: loading ? "wait" : "pointer",
          fontWeight: "bold",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </div>
  );
}

const actionBtn = {
  background: "#1e293b",
  border: "1px solid #334155",
  color: "white",
  padding: "10px 14px",
  borderRadius: "12px",
  cursor: "pointer",
};

export default CreatePost;
