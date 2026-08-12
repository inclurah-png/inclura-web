import { useEffect, useRef, useState } from "react";

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

  const [isSending, setIsSending] =
    useState(false);

  const [isUploadingImage, setIsUploadingImage] =
    useState(false);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [isSpeechToTextActive, setIsSpeechToTextActive] =
    useState(false);

  const [isTextToSpeechActive, setIsTextToSpeechActive] =
    useState(false);

  const recognitionRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  const typingTimeoutRef =
    useRef(null);


  // ============================================================
  // AUTO-SCROLL TO LATEST MESSAGE
  // ============================================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);


  // ============================================================
  // CLEAN UP SPEECH RECOGNITION
  // ============================================================

  useEffect(() => {

    return () => {

      if (
        recognitionRef.current
      ) {

        recognitionRef.current.stop();

      }

      if (
        typingTimeoutRef.current
      ) {

        clearTimeout(
          typingTimeoutRef.current
        );

      }

      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {

        window.speechSynthesis.cancel();

      }

    };

  }, []);

  const [speechSupported, setSpeechSupported] =
    useState(false);

  const [speaking, setSpeaking] = useState(false);

  const messageInputRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    setSpeechSupported(
      Boolean(SpeechRecognition)
    );
  }, []);

  // ============================================================
  // UPDATE TYPING STATUS
  // ============================================================

  async function updateTypingStatus(
    isTyping
  ) {

    if (
      !selectedChat ||
      !auth.currentUser
    ) {
      return;
    }

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
            isTyping
              ? auth.currentUser.uid
              : "",
        }
      );

    } catch (error) {

      console.error(
        "Chat typing status error:",
        error
      );

    }

  }


  // ============================================================
  // HANDLE TYPING
  // ============================================================

  function handleTyping(
    value
  ) {

    setText(value);

    updateTypingStatus(true);


    if (
      typingTimeoutRef.current
    ) {

      clearTimeout(
        typingTimeoutRef.current
      );

    }


    typingTimeoutRef.current =
      setTimeout(() => {

        updateTypingStatus(false);

      }, 1500);

  }

  // ============================================================
  // SEND TEXT MESSAGE
  // ============================================================

  async function sendMessage() {

    if (
      isSending ||
      !selectedChat ||
      !auth.currentUser ||
      !text.trim()
    ) {
      return;
    }


    const messageText =
      text.trim();


    setIsSending(true);


    try {

      await addDoc(
        collection(
          db,
          "chats",
          selectedChat.id,
          "messages"
        ),
        {

          text:
            messageText,

          senderId:
            auth.currentUser.uid,

          createdAt:
            serverTimestamp(),

          status:
            "sent",

          readBy: [
            auth.currentUser.uid,
          ],

          messageType:
            "text",

        }
      );


      await updateTypingStatus(
        false
      );


      if (
        typingTimeoutRef.current
      ) {

        clearTimeout(
          typingTimeoutRef.current
        );

      }


      setText("");


    } catch (error) {

      console.error(
        "Send message error:",
        error
      );


      alert(
        error?.message ||
        "Unable to send message."
      );


    } finally {

      setIsSending(false);

    }

  }

  async function handleImageUpload(event) {
    if (
      !selectedChat ||
      !auth.currentUser
    ) {
      return;
    }

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const storageRef = ref(
        storage,
        `chatImages/${auth.currentUser.uid}/${Date.now()}-${file.name}`
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
          fileName: file.name,
          createdAt:
            serverTimestamp(),
          status: "sent",
          readBy: [
            auth.currentUser.uid,
          ],
          messageType: "image",
        }
      );

      event.target.value = "";
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      alert(
        error.message ||
          "Unable to upload image."
      );
    }
  }

  async function startRecording() {
    if (
      !selectedChat ||
      !auth.currentUser
    ) {
      return;
    }

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      alert(
        "Audio recording is not supported on this device or browser."
      );
      return;
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      const recorder =
        new MediaRecorder(stream);

      const chunks = [];

      recorder.ondataavailable = (
        event
      ) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        try {
          const audioBlob =
            new Blob(chunks, {
              type: "audio/webm",
            });

          const storageRef = ref(
            storage,
            `voiceNotes/${auth.currentUser.uid}/${Date.now()}.webm`
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
              messageType: "audio",
            }
          );
        } catch (error) {
          console.error(
            "Voice upload error:",
            error
          );

          alert(
            error.message ||
              "Unable to send voice message."
          );
        } finally {
          stream
            .getTracks()
            .forEach((track) =>
              track.stop()
            );
        }
      };

      recorder.start();

      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error(
        "Recording error:",
        error
      );

      alert(
        error.message ||
          "Microphone permission is required."
      );
    }
  }

  function stopRecording() {
    if (
      mediaRecorder &&
      mediaRecorder.state !==
        "inactive"
    ) {
      mediaRecorder.stop();
    }

    setMediaRecorder(null);
    setRecording(false);
  }

  function startSpeechToText() {
    if (!speechSupported) {
      alert(
        "Speech recognition is not supported by this browser."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    const recognition =
      new SpeechRecognition();

    recognition.lang =
      document.documentElement.lang ||
      "en";

    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (
      event
    ) => {
      const transcript =
        event.results[0][0].transcript;

      setText((currentText) =>
        currentText
          ? `${currentText} ${transcript}`
          : transcript
      );
    };

    recognition.onerror = (
      error
    ) => {
      console.error(
        "Speech recognition error:",
        error
      );
    };

    recognition.start();
  }

  function speakText(value) {
    if (
      !value ||
      !window.speechSynthesis
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        value
      );

    utterance.onstart = () => {
      setSpeaking(true);
    };

    utterance.onend = () => {
      setSpeaking(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
    };

    window.speechSynthesis.speak(
      utterance
    );
  }

  function stopSpeaking() {
    if (
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);
  }

  function handleInputChange(event) {
    setText(event.target.value);

    updateTypingStatus(
      event.target.value.trim().length >
        0
    );
  }

  function handleInputKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  }

  if (!selectedChat) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          flex: 1,
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
          color: "#94a3b8",
          padding: "24px",
          textAlign: "center",
        }}
      >
        Select a conversation
        to begin messaging.
      </div>
    );
  }

  const currentUserId =
    auth.currentUser?.uid;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection:
          "column",
        minWidth: 0,
      }}
    >
      <header
        aria-label="Conversation header"
        style={{
          padding: "16px",
          borderBottom:
            "1px solid #1e293b",
        }}
      >
        <strong>
          {selectedChat.name ||
            "Conversation"}
        </strong>

        <p
          aria-live="polite"
          style={{
            color: "#94a3b8",
            fontSize: "13px",
            margin:
              "6px 0 0",
          }}
        >
          {selectedChat.typing &&
          selectedChat.typingUser !==
            currentUserId
            ? "Someone is typing..."
            : ""}
        </p>
      </header>

      <main
        aria-label="Messages"
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
        }}
      >
        {messages.length === 0 ? (
          <div
            role="status"
            style={{
              color: "#94a3b8",
              textAlign: "center",
              padding: "30px",
            }}
          >
            No messages yet.
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage =
              msg.senderId ===
              currentUserId;

            return (
              <article
                key={msg.id}
                aria-label={
                  isOwnMessage
                    ? "Your message"
                    : "Received message"
                }
                style={{
                  display: "flex",
                  justifyContent:
                    isOwnMessage
                      ? "flex-end"
                      : "flex-start",
                  marginBottom:
                    "12px",
                }}
              >
                <div
                  style={{
                    background:
                      isOwnMessage
                        ? "#38bdf8"
                        : "#1e293b",
                    color: "white",
                    padding: "12px",
                    borderRadius:
                      "16px",
                    maxWidth:
                      "70%",
                  }}
                >
                  {msg.text && (
                    <>
                      <div>
                        {msg.text}
                      </div>
                      
                    </>
                  )}

                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt={
                        msg.fileName ||
                        "Shared image"
                      }
                      style={{
                        width:
                          "220px",
                        maxWidth:
                          "100%",
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
                      preload="metadata"
                      aria-label="Voice message"
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

                  {isOwnMessage && (
                    <div
                      aria-label={
                        msg.status ===
                        "read"
                          ? "Message read"
                          : "Message sent"
                      }
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
              </article>
            );
          })
        )}
      </main>
      
      <section
        aria-label="Message composer"
        style={{
          padding: "16px",
          borderTop: "1px solid #1e293b",
        }}
      >
        <textarea
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={() =>
            updateTypingStatus(false)
          }
          placeholder="Type a message..."
          aria-label="Type a message"
          rows={3}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #374151",
            background: "#111827",
            color: "#fff",
            boxSizing: "border-box",
            resize: "vertical",
            marginBottom: "10px",
          }}
        />

        <div
          role="toolbar"
          aria-label="Message tools"
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <label
            htmlFor="chat-image-upload"
            style={{
              cursor: "pointer",
            }}
          >
            🖼️ Image
          </label>

          <input
            id="chat-image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            aria-label="Share an image"
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
            }}
          />

          <button
            type="button"
            onClick={() =>
              recording
                ? stopRecording()
                : startRecording()
            }
            aria-pressed={recording}
            aria-label={
              recording
                ? "Stop voice recording"
                : "Start voice recording"
            }
          >
            {recording
              ? "⏹ Stop"
              : "🎤 Record"}
          </button>

          <button
            type="button"
            onClick={startSpeechToText}
            disabled={!speechSupported}
            aria-label="Convert speech to text"
          >
            🎙 Speech to text
          </button>

          <button
            type="button"
            onClick={() =>
              speaking
                ? stopSpeaking()
                : speakText(text)
            }
            disabled={!text.trim()}
            aria-label={
              speaking
                ? "Stop text to speech"
                : "Read typed text aloud"
            }
          >
            {speaking
              ? "⏹ Stop"
              : "📝 Read aloud"}
          </button>

          <button
            type="button"
            onClick={sendMessage}
            disabled={!text.trim()}
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
}

export default ChatWindow;
