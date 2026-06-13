import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { useState } from "react";

import { db, auth } from "../firebase";

function ChatWindow({
  selectedChat,
  messages,
}) {
  const [text, setText] =
    useState("");

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
      }
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
        <h3>
          {selectedChat.name}
        </h3>
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
              marginBottom: "12px",
            }}
          >
            {msg.text}
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
          onChange={(e) =>
            setText(
              e.target.value
            )
          }
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "12px",
          }}
        />

        <button
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
