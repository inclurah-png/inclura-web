import {
  doc,
  updateDoc,
} from "firebase/firestore";

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

import { storage } from "../firebase";

import { useState } from "react";

import { db, auth } from "../firebase";

function ChatWindow({
  selectedChat,
  messages,
}) {
  const [text, setText] =
    useState("");
  
async function updateTypingStatus(
  isTyping
) {
  if (!selectedChat)
    return;

  try {
    await updateDoc(
      doc(
        db,
        "chats",
        selectedChat.id
      ),
      {
        typing:
          isTyping,
        typingUser:
          auth.currentUser.uid,
      }
    );
  } catch (error) {
    console.log(error);
  }
}
  
  async function handleImageUpload(
  e
) {
  const file =
    e.target.files[0];

  if (!file)
    return;

  try {
    const storageRef = ref(
      storage,
      `chatImages/${Date.now()}`
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
        "chats",
        selectedChat.id,
        "messages"
      ),
      {
        senderId:
          auth.currentUser.uid,
        imageUrl,
        createdAt:
          serverTimestamp(),
        status: "sent",
        readBy: [
          auth.currentUser.uid,
        ],
      }
    );
  } catch (error) {
    alert(error.message);
  }
  }
  
  async function sendMessage() {
    if (
      !text.trim() ||
      !selectedChat
    )
      return;

    await addDoc(
  collection(
    db,
    "chats",
    selectedChat.id,
    "messages"
  ),
  {
    text,
    senderId:
      auth.currentUser.uid,
    createdAt:
      serverTimestamp(),

    status: "sent",

    readBy: [
      auth.currentUser.uid,
    ],
  }
);

    await updateTypingStatus(
  false
);
    setText("");
  }

  if (!selectedChat) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
          color: "#94a3b8",
        }}
      >
        Select a conversation
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "16px",
          borderBottom:
            "1px solid #1e293b",
        }}
      >
        <p
  style={{
    color: "#94a3b8",
    fontSize: "13px",
  }}
>
  {selectedChat?.typing
    ? "Someone is typing..."
    : ""}
</p>
      </div>

      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg) => (
  <div
    key={msg.id}
    style={{
      display: "flex",
      justifyContent:
        msg.senderId ===
        auth.currentUser.uid
          ? "flex-end"
          : "flex-start",
      marginBottom: "12px",
    }}
  >
    <div
      style={{
        background:
          msg.senderId ===
          auth.currentUser.uid
            ? "#38bdf8"
            : "#1e293b",
        color: "white",
        padding: "12px",
        borderRadius: "16px",
        maxWidth: "70%",
      }}
    >
<>
  {msg.text && (
    <div>
      {msg.text}
    </div>
  )}

  {msg.imageUrl && (
    <img
      src={msg.imageUrl}
      alt="Chat"
      style={{
        width: "220px",
        borderRadius: "12px",
        marginTop: "8px",
      }}
    />
  )}
</>

      {msg.senderId ===
        auth.currentUser.uid && (
        <div
          style={{
            fontSize: "11px",
            color: "#cbd5e1",
            marginTop: "4px",
          }}
        >
          {msg.status === "read"
            ? "✓✓ Read"
            : "✓ Sent"}
        </div>
      )}
    </div>
  </div>
))}
      </div>

      <div
        style={{
          display: "flex",
          padding: "16px",
          gap: "10px",
        }}
      >
        <input
  value={text}
  onChange={(e) => {
    setText(e.target.value);

    updateTypingStatus(
      true
    );
  }}
  onBlur={() =>
    updateTypingStatus(
      false
    )
  }
  placeholder="Type a message..."
  style={{
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
  }}
/>
        
<input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
/>
        <button>
  🎤 Voice Note
</button>
        
        <button
          onClick={sendMessage}
        >
          Send
        </button>
        
        <button>
  🔊 Read
</button>

<button>
  🎙 Speech To Text
</button>

<button>
  📝 Text To Speech
</button>
      </div>
    </div>
  );
}

export default ChatWindow;
