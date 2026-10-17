import { useState, useRef } from "react";

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage, db, auth } from "../firebase";

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

const ACCESSIBILITY_TAGS = [
  "Alt Text",
  "Captions",
  "Sign Language",
  "Easy Read",
  "Sensory Warning",
  "Screen Reader Friendly",
];

function getErrorMessage(error) {
  if (error?.code) {
    return `${error.message || "Unknown error"} (Firebase code: ${error.code})`;
  }

  return error?.message || "Unknown error";
}

function CreatePost() {
  const [postText, setPostText] = useState("");
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [showAccessibilityOptions, setShowAccessibilityOptions] =
    useState(false);

  const [selectedAccessibilityTags, setSelectedAccessibilityTags] =
    useState([]);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  async function handlePost() {
    if (loading) return;

    const cleanPostText = postText.trim();

    if (!cleanPostText && !imageFile && !videoFile) {
      alert("Add text, image or video first.");
      return;
    }

    if (imageFile && videoFile) {
      alert(
        "Please create a post with either a photo or a video, not both."
      );
      return;
    }

    let operation = "authentication";
    let postCreated = false;

    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user) {
        alert("Please login again.");
        return;
      }

      // 1. Load the author's existing profile.
      operation = "profile read";

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

      // 2. Detect the source language without preventing
      //    post creation if the detector is temporarily unavailable.
      let detectedLanguage = {
        code: "en",
        language: "English",
        confidence: 0,
      };

      if (cleanPostText) {
        operation = "language detection";

        try {
          const detectionResult =
            await detectLanguage(cleanPostText);

          if (
            detectionResult &&
            typeof detectionResult === "object"
          ) {
            detectedLanguage = {
              ...detectedLanguage,
              ...detectionResult,
            };
          } else if (
            typeof detectionResult === "string"
          ) {
            detectedLanguage = {
              ...detectedLanguage,
              code: detectionResult,
            };
          }
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

      // 3. Upload media. Keep upload and URL retrieval
      //    errors distinguishable in the diagnostic output.
      let imageUrl = "";
      let videoUrl = "";

      if (imageFile) {
        const safeFileName = imageFile.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );

        const imageRef = ref(
          storage,
          `posts/images/${user.uid}/${Date.now()}_${safeFileName}`
        );

        operation = "image upload";
        await uploadBytes(imageRef, imageFile);

        operation = "image download URL retrieval";
        imageUrl = await getDownloadURL(imageRef);
      }

      if (videoFile) {
        const safeFileName = videoFile.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );

        const videoRef = ref(
          storage,
          `posts/videos/${user.uid}/${Date.now()}_${safeFileName}`
        );

        operation = "video upload";
        await uploadBytes(videoRef, videoFile);

        operation = "video download URL retrieval";
        videoUrl = await getDownloadURL(videoRef);
      }

      // 4. Prepare the existing verification fields.
      operation = "post preparation";

      const badgeType = migrateVerificationId(
        profile?.badgeType
      );

      const verificationMetadata = profile?.verified
        ? getVerificationMetadata(badgeType)
        : null;

      // 5. Create the Firestore post.
      operation = "post creation";

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

          profilePhoto:
            profile?.profilePhoto ||
            profile?.photoURL ||
            "",

          role: profile?.role || "user",
          accessibilityNeeds:
            Array.isArray(profile?.accessibilityNeeds)
              ? profile.accessibilityNeeds
              : [],

          accessibilityTags: [
            ...selectedAccessibilityTags,
          ],

          verified: profile?.verified || false,
          badgeType,
          verificationMetadata,

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

      // 6. Award creator activity using the real document ID.
      //    Scoring errors must not invalidate successful posting.
      let scoringRecorded = true;

      try {
        operation = "creator scoring";

        if (videoFile) {
          await addVideoPost(user.uid, createdPost.id);
        } else {
          await addTextPost(user.uid, createdPost.id);
        }
      } catch (scoreError) {
        scoringRecorded = false;

        console.error(
          "Inclura Creator Scoring Error:",
          {
            operation: "creator scoring",
            postId: createdPost.id,
            userId: user.uid,
            error: scoreError,
          }
        );
      }

      // 7. Reset the form only after the post is saved.
      setPostText("");
      setImageFile(null);
      setVideoFile(null);
      setSelectedAccessibilityTags([]);

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
          "Your post was created successfully, but creator scoring could not be recorded. Please try again later."
        );
      }
    } catch (error) {
      console.error(
        "Inclura Create Post Error:",
        {
          operation,
          postCreated,
          error,
          code: error?.code || "unknown",
          message: getErrorMessage(error),
        }
      );

      if (postCreated) {
        alert(
          `Your post was created, but the follow-up operation failed during ${operation}. Check the console for details.`
        );
      } else {
        alert(
          `Unable to complete ${operation}: ${getErrorMessage(error)}`
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

  function toggleAccessibilityTag(tag) {
    setSelectedAccessibilityTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((item) => item !== tag)
        : [...currentTags, tag]
    );
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
        aria-label="Post text"
        disabled={loading}
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
        <div
          style={{ marginTop: "14px", color: "#38bdf8" }}
          role="status"
        >
          📷 {imageFile.name}
        </div>
      )}

      {videoFile && (
        <div
          style={{ marginTop: "10px", color: "#38bdf8" }}
          role="status"
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
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Post category"
          disabled={loading}
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
          onClick={() =>
            setShowAccessibilityOptions((visible) => !visible)
          }
          aria-expanded={showAccessibilityOptions}
          disabled={loading}
        >
          ♿ Accessibility
        </button>
      </div>

      {showAccessibilityOptions && (
        <fieldset
          style={{
            marginTop: "14px",
            padding: "14px",
            border: "1px solid #334155",
            borderRadius: "12px",
          }}
        >
          <legend>Accessibility tags for this post</legend>

          <p style={{ fontSize: "13px", color: "#cbd5e1" }}>
            Select the accessibility features provided by your
            content. These tags describe the post; they do not
            automatically generate captions, alt text, or sign
            language.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            {ACCESSIBILITY_TAGS.map((tag) => (
              <label
                key={tag}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: loading ? "default" : "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedAccessibilityTags.includes(tag)}
                  onChange={() => toggleAccessibilityTag(tag)}
                  disabled={loading}
                />
                {tag}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageSelect}
        style={{ display: "none" }}
        disabled={loading}
        aria-label="Choose a photo"
      />

      <input
        type="file"
        accept="video/*"
        ref={videoInputRef}
        onChange={handleVideoSelect}
        style={{ display: "none" }}
        disabled={loading}
        aria-label="Choose a video"
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
