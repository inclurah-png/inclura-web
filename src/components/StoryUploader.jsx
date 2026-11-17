import { useState } from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  db,
  storage,
  auth,
} from "../firebase";

function StoryUploader() {
  const [uploading, setUploading] = useState(false);

  async function uploadStory(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in before uploading a story.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image for this story.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Please choose an image smaller than 10 MB.");
      return;
    }

    try {
      setUploading(true);

      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storyRef = ref(
        storage,
        `stories/${user.uid}/${Date.now()}_${safeFileName}`
      );

      await uploadBytes(storyRef, file, {
        contentType: file.type,
      });

      const storyUrl = await getDownloadURL(storyRef);
      const expiresAt = Timestamp.fromDate(
        new Date(Date.now() + 24 * 60 * 60 * 1000)
      );

      await addDoc(collection(db, "stories"), {
        userId: user.uid,
        userName: user.displayName || "Inclura User",
        storyType: "image",
        storyText: "",
        storyUrl,
        createdAt: serverTimestamp(),
        expiresAt,
        views: [],
      });

      alert("Story uploaded!");
    } catch (error) {
      console.error("Inclura story upload failed:", error);
      alert(error?.message || "Story upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label
      style={{
        minWidth: "90px",
        height: "150px",
        background: "#38bdf8",
        borderRadius: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontWeight: "700",
        cursor: uploading ? "wait" : "pointer",
      }}
    >
      {uploading ? "Uploading..." : "+ Story"}

      <input
        type="file"
        accept="image/*"
        hidden
        disabled={uploading}
        onChange={uploadStory}
      />
    </label>
  );
}

export default StoryUploader;
