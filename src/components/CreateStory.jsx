import { useState } from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  auth,
  db,
  storage,
} from "../firebase";

function CreateStory() {
  const [uploading, setUploading] =
    useState(false);

  async function handleStoryUpload(
    e
  ) {
    const file =
      e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      const user =
        auth.currentUser;

      const storageRef = ref(
        storage,
        `stories/${user.uid}/${Date.now()}`
      );

      await uploadBytes(
        storageRef,
        file
      );

      const imageUrl =
        await getDownloadURL(
          storageRef
        );

      await addDoc(
        collection(
          db,
          "stories"
        ),
        {
          userId: user.uid,
          userName:
            user.displayName ||
            "Inclura User",
          imageUrl,
          createdAt:
            serverTimestamp(),
          expiresAt:
            Date.now() +
            24 *
              60 *
              60 *
              1000,
        }
      );

      alert(
        "Story uploaded successfully!"
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      style={{
        marginBottom: "20px",
      }}
    >
      <label
        style={{
          background:
            "#38bdf8",
          color: "white",
          padding:
            "12px 18px",
          borderRadius:
            "12px",
          cursor:
            "pointer",
          fontWeight:
            "600",
        }}
      >
        {uploading
          ? "Uploading..."
          : "+ Add Story"}

        <input
          type="file"
          accept="image/*"
          onChange={
            handleStoryUpload
          }
          hidden
        />
      </label>
    </div>
  );
}

export default CreateStory;
