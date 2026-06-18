import { useState } from "react";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import {
  storage,
  db,
  auth,
} from "../firebase";

function CreateStory() {
  const [uploading, setUploading] =
    useState(false);

  async function handleFile(e) {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const user =
        auth.currentUser;

      if (!user) {
        alert("Login required");
        return;
      }

      setUploading(true);

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

      if (
        storiesSnapshot.docs.length >=
        12
      ) {
        alert(
          "Maximum of 12 active stories allowed"
        );
        return;
      }

      const fileName =
        `${Date.now()}-${file.name}`;

      const storageRef = ref(
        storage,
        `stories/${user.uid}/${fileName}`
      );

      await uploadBytes(
        storageRef,
        file
      );

      const downloadURL =
        await getDownloadURL(
          storageRef
        );

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
            user.displayName ||
            "Inclura User",

          storyUrl:
            downloadURL,

          createdAt:
            serverTimestamp(),

          expiresAt,

          views: [],
        }
      );

      alert(
        "Story uploaded successfully"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to upload story"
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <label
      style={{
        background:
          "#38bdf8",
        color: "white",
        padding:
          "12px 18px",
        borderRadius:
          "12px",
        cursor: "pointer",
        display:
          "inline-block",
        marginBottom:
          "16px",
      }}
    >
      {uploading
        ? "Uploading..."
        : "+ Add Story"}

      <input
        type="file"
        accept="image/*"
        hidden
        onChange={
          handleFile
        }
      />
    </label>
  );
}

export default CreateStory;
