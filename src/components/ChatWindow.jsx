import { useState } from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  db,
  auth,
  storage,
} from "../firebase";

function ChatWindow({
  selectedChat,
  messages,
}) {
  const [text, setText] =
    useState("");

  const [recording, setRecording] =
    useState(false);

  const [mediaRecorder, setMediaRecorder] =
    useState(null);

  async function updateTypingStatus(
    isTyping
  ) {
    if (!selectedChat) return;

    try {
      await updateDoc(
        doc(
          db,
          "chats",
          selectedChat.id
        ),
        {
          typing: isTyping,
          typingUser:
            auth.currentUser.uid,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function sendMessage() {
    if (
      !text.trim() ||
      !selectedChat
    )
      return;

    try {
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
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleImageUpload(
    e
  ) {
    const file =
      e.target.files[0];

    if (!file) return;

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

  async function startRecording() {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      const recorder =
        new MediaRecorder(
          stream
        );

      const chunks = [];

      recorder.ondataavailable =
        (event) => {
          chunks.push(
            event.data
          );
        };

      recorder.onstop =
        async () => {
          const audioBlob =
            new Blob(
              chunks,
              {
                type: "audio/webm",
              }
            );

          const storageRef =
            ref(
              storage,
              `voiceNotes/${Date.now()}`
            );

          await uploadBytes(
            storageRef,
            audioBlob
          );

          const audioUrl =
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
              audioUrl,
              createdAt:
                serverTimestamp(),
              status: "sent",
              readBy: [
                auth.currentUser.uid,
              ],
            }
          );
        };

      recorder.start();

      setMediaRecorder(
        recorder
      );

      setRecording(true);
    } catch (error) {
      alert(error.message);
    }
  }

  function stopRecording() {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
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
        flexDirection:
          "column",
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
        {messages.map(
          (msg) => (
            <div
              key={msg.id}
              style={{
                display:
                  "flex",
                justifyContent:
                  msg.senderId ===
                  auth.currentUser
                    .uid
                    ? "flex-end"
                    : "flex-start",
                marginBottom:
                  "12px",
              }}
            >
              <div
                style={{
                  background:
                    msg.senderId ===
                    auth
                      .currentUser
                      .uid
                      ? "#38bdf8"
                      : "#1e293b",
                  color:
                    "white",
                  padding:
                    "12px",
                  borderRadius:
                    "16px",
                  maxWidth:
                    "70%",
                }}
              >
                {msg.text && (
                  <div>
                    {msg.text}
                  </div>
                )}

                {msg.imageUrl && (
                  <img
                    src={
                      msg.imageUrl
                    }
                    alt="Chat"
                    style={{
                      width:
                        "220px",
                      borderRadius:
                        "12px",
                      marginTop:
                        "8px",
                    }}
                  />
                )}

                {msg.audioUrl && (
                  <audio
                    controls
                    style={{
                      marginTop:
                        "8px",
                      width:
                        "100%",
                    }}
                  >
                    <source
                      src={
                        msg.audioUrl
                      }
                      type="audio/webm"
                    />
                  </audio>
                )}

                {msg.senderId ===
                  auth
                    .currentUser
                    .uid && (
                  <div
                    style={{
                      fontSize:
                        "11px",
                      color:
                        "#cbd5e1",
                      marginTop:
                        "4px",
                    }}
                  >
                    {msg.status ===
                    "read"
                      ? "✓✓ Read"
                      : "✓ Sent"}
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "16px",
          flexWrap:
            "wrap",
        }}
      >
        <input
          value={text}
          onChange={(e) => {
            setText(
              e.target.value
            );

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
            minWidth:
              "220px",
            padding:
              "14px",
            borderRadius:
              "12px",
          }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={
            handleImageUpload
          }
        />

        <button
          onClick={() =>
            recording
              ? stopRecording()
              : startRecording()
          }
        >
          {recording
            ? "⏹ Stop"
            : "🎤 Record"}
        </button>

        <button
          onClick={
            sendMessage
          }
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
