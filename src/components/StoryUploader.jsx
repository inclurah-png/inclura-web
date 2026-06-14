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
  const [uploading, setUploading] =
    useState(false);

  async function uploadStory(e) {
    const file =
      e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      const storyRef = ref(
        storage,
        `stories/${Date.now()}`
      );

      await uploadBytes(
        storyRef,
        file
      );

      const mediaUrl =
        await getDownloadURL(
          storyRef
        );

      const user =
        auth.currentUser;

      const expiresAt =
        Timestamp.fromDate(
          new Date(
            Date.now() +
              24 * 60 * 60 * 1000
          )
        );

      await addDoc(
        collection(db, "stories"),
        {
          userId: user.uid,
          userName:
            user.displayName ||
            "Inclura User",
          mediaUrl,
          mediaType: "image",
          createdAt:
            serverTimestamp(),
          expiresAt,
        }
      );

      alert(
        "Story uploaded!"
      );
    } catch (error) {
      alert(error.message);
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
        cursor: "pointer",
      }}
    >
      {uploading
        ? "Uploading..."
        : "+ Story"}

      <input
        type="file"
        accept="image/*"
        hidden
        onChange={uploadStory}
      />
    </label>
  );
}

export default StoryUploader;
