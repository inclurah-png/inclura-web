import { useState } from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db, auth } from "../firebase";

function NewChatModal() {
  const [targetUid,
    setTargetUid] =
    useState("");

  async function createChat() {
    if (!targetUid) return;

    await addDoc(
      collection(db, "chats"),
      {
        participants: [
          auth.currentUser.uid,
          targetUid,
        ],
        createdAt:
          serverTimestamp(),
        lastMessage: "",
      }
    );

    alert(
      "Conversation created"
    );
  }

  return (
    <div>
      <input
        placeholder="User UID"
        value={targetUid}
        onChange={(e) =>
          setTargetUid(
            e.target.value
          )
        }
      />

      <button
        onClick={createChat}
      >
        Start Chat
      </button>
    </div>
  );
}

export default NewChatModal;
