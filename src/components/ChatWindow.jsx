import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

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

import {
  translateText,
  saveTranslation,
} from "../translation/textTranslator";


function ChatWindow({
  selectedChat,
  messages,
}) {

  const { t, i18n } =
    useTranslation();


  // ============================================================
  // MESSAGE STATE
  // ============================================================

  const [text, setText] =
    useState("");

  const [recording, setRecording] =
    useState(false);

  const [isSending, setIsSending] =
    useState(false);

  const [isUploadingImage, setIsUploadingImage] =
    useState(false);

  const [isUploadingAttachment, setIsUploadingAttachment] =
    useState(false);

  const [speaking, setSpeaking] =
    useState(false);

  const [speechSupported, setSpeechSupported] =
    useState(false);

  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  const [showAttachmentMenu, setShowAttachmentMenu] =
    useState(false);

  const [translatingMessages, setTranslatingMessages] =
    useState({});

  const [messageTranslations, setMessageTranslations] =
    useState({});

  const [translatedMessages, setTranslatedMessages] =
    useState({});


  // ============================================================
  // REFS
  // ============================================================

  const recognitionRef =
    useRef(null);

  const mediaRecorderRef =
    useRef(null);

  const mediaStreamRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  const typingTimeoutRef =
    useRef(null);

  const imageInputRef =
    useRef(null);

  const videoInputRef =
    useRef(null);

  const documentInputRef =
    useRef(null);


  // ============================================================
  // ACTIVE LANGUAGE
  // ============================================================

  const activeLanguage =
    String(
      i18n.language || "en"
    )
      .trim()
      .toLowerCase();


  // ============================================================
  // EMOJI LIST
  // ============================================================

  const emojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
    "🫡",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
    "🙄",
    "😯",
    "😦",
    "😧",
    "😮",
    "😲",
    "🥱",
    "😴",
    "🤤",
    "😪",
    "😵",
    "🤐",
    "🥴",
    "🤢",
    "🤮",
    "🤧",
    "😷",
    "🤒",
    "🤕",
    "👍",
    "👎",
    "👌",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👏",
    "🙌",
    "👐",
    "🤝",
    "🙏",
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "💕",
    "💯",
    "🔥",
    "✨",
    "🎉",
    "🎊",
    "⭐",
    "🌟",
    "💫",
    "✅",
    "❌",
    "⚠️",
  ];


  // ============================================================
  // AUTO-SCROLL TO LATEST MESSAGE
  // ============================================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);


  // ============================================================
  // LOAD EXISTING MESSAGE TRANSLATIONS
  // ============================================================

  useEffect(() => {

    const loadedTranslations = {};
    const loadedTranslatedStates = {};

    messages.forEach((message) => {

      if (!message?.id) {
        return;
      }

      if (
        message.translatedText &&
        typeof message.translatedText ===
          "object"
      ) {

        loadedTranslations[message.id] = {
          ...message.translatedText,
        };

        const existingTranslation =
          message.translatedText[
            activeLanguage
          ];

        if (
          typeof existingTranslation ===
            "string" &&
          existingTranslation.trim()
        ) {

          loadedTranslatedStates[
            message.id
          ] = false;

        }

      }

    });

    setMessageTranslations(
      loadedTranslations
    );

    setTranslatedMessages(
      loadedTranslatedStates
    );

  }, [
    messages,
    activeLanguage,
  ]);


  // ============================================================
  // CHECK SPEECH RECOGNITION SUPPORT
  // ============================================================

  useEffect(() => {

    if (
      typeof window === "undefined"
    ) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    setSpeechSupported(
      Boolean(
        SpeechRecognition
      )
    );

  }, []);


  // ============================================================
  // CLEAN UP SPEECH, TYPING, RECORDING
  // ============================================================

  useEffect(() => {

    return () => {

      if (
        recognitionRef.current
      ) {

        try {

          recognitionRef.current.stop();

        } catch (error) {

          console.warn(
            "Speech recognition cleanup error:",
            error
          );

        }

        recognitionRef.current =
          null;

      }


      if (
        typingTimeoutRef.current
      ) {

        clearTimeout(
          typingTimeoutRef.current
        );

        typingTimeoutRef.current =
          null;

      }


      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !==
          "inactive"
      ) {

        try {

          mediaRecorderRef.current.stop();

        } catch (error) {

          console.warn(
            "Media recorder cleanup error:",
            error
          );

        }

      }


      if (
        mediaStreamRef.current
      ) {

        mediaStreamRef.current
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );

        mediaStreamRef.current =
          null;

      }


      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {

        window.speechSynthesis.cancel();

      }

    };

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
  // HANDLE TEXT INPUT
  // ============================================================

  function handleInputChange(
    event
  ) {

    const value =
      event.target.value;

    setText(value);

    updateTypingStatus(
      value.trim().length > 0
    );

    if (
      typingTimeoutRef.current
    ) {

      clearTimeout(
        typingTimeoutRef.current
      );

    }

    if (
      value.trim().length > 0
    ) {

      typingTimeoutRef.current =
        setTimeout(() => {

          updateTypingStatus(
            false
          );

        }, 1500);

    }

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

        typingTimeoutRef.current =
          null;

      }

      setText("");

    } catch (error) {

      console.error(
        "Send message error:",
        error
      );

      alert(
        error?.message ||
          t("messageSendError")
      );

    } finally {

      setIsSending(false);

    }

  }


  // ============================================================
  // TRANSLATE MESSAGE
  // ============================================================

  async function translateMessage(
    message
  ) {

    if (
      !message?.id ||
      !message?.text ||
      !activeLanguage
    ) {

      return;

    }

    const messageId =
      message.id;

    if (
      translatingMessages[
        messageId
      ]
    ) {

      return;

    }

    const existingTranslation =
      messageTranslations[
        messageId
      ]?.[
        activeLanguage
      ];

    const displayedTranslation =
      translatedMessages[
        messageId
      ];


    if (
      typeof existingTranslation ===
        "string" &&
      existingTranslation.trim()
    ) {

      setTranslatedMessages(
        (previous) => ({
          ...previous,
          [messageId]:
            !displayedTranslation,
        })
      );

      return;

    }


    setTranslatingMessages(
      (previous) => ({
        ...previous,
        [messageId]: true,
      })
    );

    try {

      const result =
        await translateText({
          sourceId: messageId,
          sourceType:
            "message",
          text: message.text,
          targetLanguage:
            activeLanguage,
        });

      if (
        !result?.translatedText ||
        typeof result.translatedText !==
          "string"
      ) {

        throw new Error(
          "Translation service returned no translated text."
        );

      }

      const translatedText =
        result.translatedText.trim();

      if (!translatedText) {

        throw new Error(
          "Translation service returned empty text."
        );

      }


      try {

        await saveTranslation({
          sourceId:
            messageId,

          sourceType:
            "message",

          originalLanguage:
            result.originalLanguage ||
            message.originalLanguage ||
            "",

          targetLanguage:
            activeLanguage,

          translatedText,

          confidence:
            result.confidence || 0,
        });

      } catch (
        cacheSaveError
      ) {

        console.error(
          "Inclura Message Translation Cache Save Error:",
          cacheSaveError
        );

      }


      const updatedTranslations = {
        ...(messageTranslations[
          messageId
        ] || {}),
        [activeLanguage]:
          translatedText,
      };


      try {

        await updateDoc(
          doc(
            db,
            "chats",
            selectedChat.id,
            "messages",
            messageId
          ),
          {
            translatedText:
              updatedTranslations,
          }
        );

      } catch (
        messageUpdateError
      ) {

        console.error(
          "Inclura Message Translation Persistence Error:",
          messageUpdateError
        );

      }


      setMessageTranslations(
        (previous) => ({
          ...previous,
          [messageId]:
            updatedTranslations,
        })
      );


      setTranslatedMessages(
        (previous) => ({
          ...previous,
          [messageId]: true,
        })
      );

    } catch (error) {

      console.error(
        "Inclura Message Translation Error:",
        error
      );

      alert(
        error?.message ||
          t(
            "messageTranslationError"
          )
      );

    } finally {

      setTranslatingMessages(
        (previous) => {

          const next = {
            ...previous,
          };

          delete next[
            messageId
          ];

          return next;

        }
      );

    }

  }


  // ============================================================
  // INSERT EMOJI
  // ============================================================

  function insertEmoji(
    emoji
  ) {

    setText(
      (currentText) =>
        `${currentText}${emoji}`
    );

    setShowEmojiPicker(
      false
    );

  }


  // ============================================================
  // OPEN IMAGE PICKER
  // ============================================================

  function openImagePicker() {

    setShowAttachmentMenu(
      false
    );

    imageInputRef.current?.click();

  }


  // ============================================================
  // OPEN VIDEO PICKER
  // ============================================================

  function openVideoPicker() {

    setShowAttachmentMenu(
      false
    );

    videoInputRef.current?.click();

  }


  // ============================================================
  // OPEN DOCUMENT PICKER
  // ============================================================

  function openDocumentPicker() {

    setShowAttachmentMenu(
      false
    );

    documentInputRef.current?.click();

  }


  // ============================================================
  // IMAGE UPLOAD
  // ============================================================

  async function handleImageUpload(
    event
  ) {

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


    setIsUploadingImage(
      true
    );

    try {

      const storageRef =
        ref(
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

          fileName:
            file.name,

          fileType:
            file.type,

          fileSize:
            file.size,

          createdAt:
            serverTimestamp(),

          status:
            "sent",

          readBy: [
            auth.currentUser.uid,
          ],

          messageType:
            "image",
        }
      );


      event.target.value = "";

    } catch (error) {

      console.error(
        "Image upload error:",
        error
      );

      alert(
        error?.message ||
          t("imageUploadError")
      );

    } finally {

      setIsUploadingImage(
        false
      );

    }

  }


  // ============================================================
  // VIDEO UPLOAD
  // ============================================================

  async function handleVideoUpload(
    event
  ) {

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


    setIsUploadingAttachment(
      true
    );

    try {

      const storageRef =
        ref(
          storage,
          `chatVideos/${auth.currentUser.uid}/${Date.now()}-${file.name}`
        );


      await uploadBytes(
        storageRef,
        file
      );


      const videoUrl =
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

          videoUrl,

          fileName:
            file.name,

          fileType:
            file.type,

          fileSize:
            file.size,

          createdAt:
            serverTimestamp(),

          status:
            "sent",

          readBy: [
            auth.currentUser.uid,
          ],

          messageType:
            "video",
        }
      );


      event.target.value = "";

    } catch (error) {

      console.error(
        "Video upload error:",
        error
      );

      alert(
        error?.message ||
          t("videoUploadError")
      );

    } finally {

      setIsUploadingAttachment(
        false
      );

    }

  }


  // ============================================================
  // DOCUMENT / FILE UPLOAD
  // ============================================================

  async function handleDocumentUpload(
    event
  ) {

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


    const maximumFileSize =
      50 * 1024 * 1024;


    if (
      file.size >
      maximumFileSize
    ) {

      alert(
        "This file is larger than the 50 MB messaging limit."
      );

      event.target.value = "";

      return;

    }


    setIsUploadingAttachment(
      true
    );

    try {

      const storageRef =
        ref(
          storage,
          `chatFiles/${auth.currentUser.uid}/${Date.now()}-${file.name}`
        );


      await uploadBytes(
        storageRef,
        file
      );


      const fileUrl =
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

          fileUrl,

          fileName:
            file.name,

          fileType:
            file.type ||
            "application/octet-stream",

          fileSize:
            file.size,

          createdAt:
            serverTimestamp(),

          status:
            "sent",

          readBy: [
            auth.currentUser.uid,
          ],

          messageType:
            "file",
        }
      );


      event.target.value = "";

    } catch (error) {

      console.error(
        "Document upload error:",
        error
      );

      alert(
        error?.message ||
          t("fileUploadError")
      );

    } finally {

      setIsUploadingAttachment(
        false
      );

    }

  }


  // ============================================================
  // START VOICE RECORDING
  // ============================================================

  async function startRecording() {

    if (
      !selectedChat ||
      !auth.currentUser ||
      recording
    ) {

      return;

    }


    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {

      alert(
        t(
          "audioRecordingUnsupported"
        )
      );

      return;

    }


    if (
      typeof MediaRecorder ===
        "undefined"
    ) {

      alert(
        t(
          "audioRecordingUnsupported"
        )
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


      mediaStreamRef.current =
        stream;


      const recorder =
        new MediaRecorder(
          stream
        );


      const chunks = [];


      recorder.ondataavailable =
        (event) => {

          if (
            event.data.size > 0
          ) {

            chunks.push(
              event.data
            );

          }

        };


      recorder.onstop =
        async () => {

          try {

            const audioBlob =
              new Blob(
                chunks,
                {
                  type:
                    recorder.mimeType ||
                    "audio/webm",
                }
              );


            const storageRef =
              ref(
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

                fileName:
                  "Voice message",

                fileType:
                  audioBlob.type,

                fileSize:
                  audioBlob.size,

                createdAt:
                  serverTimestamp(),

                status:
                  "sent",

                readBy: [
                  auth.currentUser.uid,
                ],

                messageType:
                  "audio",
              }
            );

          } catch (error) {

            console.error(
              "Voice upload error:",
              error
            );

            alert(
              error?.message ||
                t(
                  "voiceMessageError"
                )
            );

          } finally {

            if (
              mediaStreamRef.current
            ) {

              mediaStreamRef.current
                .getTracks()
                .forEach(
                  (track) =>
                    track.stop()
                );

              mediaStreamRef.current =
                null;

            }

          }

        };


      recorder.onerror =
        (error) => {

          console.error(
            "Media recorder error:",
            error
          );

        };


      mediaRecorderRef.current =
        recorder;


      recorder.start();

      setRecording(
        true
      );

    } catch (error) {

      console.error(
        "Recording error:",
        error
      );

      if (
        mediaStreamRef.current
      ) {

        mediaStreamRef.current
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );

        mediaStreamRef.current =
          null;

      }

      alert(
        error?.message ||
          t(
            "microphonePermissionRequired"
          )
      );

    }

  }


  // ============================================================
  // STOP VOICE RECORDING
  // ============================================================

  function stopRecording() {

    const recorder =
      mediaRecorderRef.current;


    if (
      recorder &&
      recorder.state !==
        "inactive"
    ) {

      recorder.stop();

    }


    mediaRecorderRef.current =
      null;

    setRecording(
      false
    );

  }


  // ============================================================
  // SPEECH-TO-TEXT LANGUAGE MAPPING
  // ============================================================

  function getSpeechRecognitionLanguage() {

    const languageMap = {

      en: "en-US",

      yo: "yo-NG",

      ig: "ig-NG",

      ha: "ha-NG",

      fr: "fr-FR",

      es: "es-ES",

      pt: "pt-PT",

      sw: "sw-KE",

      ar: "ar-SA",

      zh: "zh-CN",

    };


    return (
      languageMap[
        activeLanguage
      ] ||
      "en-US"
    );

  }


  // ============================================================
  // SPEECH-TO-TEXT
  // ============================================================

  function startSpeechToText() {

    if (
      !speechSupported
    ) {

      alert(
        t(
          "speechRecognitionUnsupported"
        )
      );

      return;

    }


    if (
      typeof window ===
        "undefined"
    ) {

      return;

    }


    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

      return;

    }


    if (
      recognitionRef.current
    ) {

      try {

        recognitionRef.current.stop();

      } catch (error) {

        console.warn(
          "Existing speech recognition could not be stopped:",
          error
        );

      }

    }


    const recognition =
      new SpeechRecognition();


    recognition.lang =
      getSpeechRecognitionLanguage();


    recognition.interimResults =
      false;


    recognition.continuous =
      false;


    recognition.onresult =
      (event) => {

        const transcript =
          event
            .results?.[0]?.[0]
            ?.transcript || "";


        setText(
          (currentText) =>
            currentText
              ? `${currentText} ${transcript}`
              : transcript
        );

      };


    recognition.onerror =
      (error) => {

        console.error(
          "Speech recognition error:",
          error
        );

      };


    recognition.onend =
      () => {

        recognitionRef.current =
          null;

      };


    recognitionRef.current =
      recognition;


    try {

      recognition.start();

    } catch (error) {

      console.error(
        "Unable to start speech recognition:",
        error
      );

      recognitionRef.current =
        null;

    }

  }


  // ============================================================
  // TEXT-TO-SPEECH
  // ============================================================

  function speakText(value) {

    if (
      !value ||
      typeof window ===
        "undefined" ||
      !window.speechSynthesis
    ) {

      return;

    }


    window.speechSynthesis.cancel();


    const utterance =
      new SpeechSynthesisUtterance(
        value
      );


    utterance.lang =
      getSpeechRecognitionLanguage();


    utterance.onstart =
      () => {

        setSpeaking(true);

      };


    utterance.onend =
      () => {

        setSpeaking(false);

      };


    utterance.onerror =
      () => {

        setSpeaking(false);

      };


    window.speechSynthesis.speak(
      utterance
    );

  }


  // ============================================================
  // STOP TEXT-TO-SPEECH
  // ============================================================

  function stopSpeaking() {

    if (
      typeof window !==
        "undefined" &&
      window.speechSynthesis
    ) {

      window.speechSynthesis.cancel();

    }

    setSpeaking(false);

  }


  // ============================================================
  // HANDLE ENTER KEY
  // ============================================================

  function handleInputKeyDown(
    event
  ) {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();

    }

  }


  // ============================================================
  // FORMAT FILE SIZE
  // ============================================================

  function formatFileSize(
    bytes
  ) {

    if (
      !bytes ||
      bytes <= 0
    ) {

      return "";

    }


    const units = [
      "B",
      "KB",
      "MB",
      "GB",
    ];


    const index =
      Math.min(
        Math.floor(
          Math.log(bytes) /
            Math.log(1024)
        ),
        units.length - 1
      );


    const value =
      bytes /
      Math.pow(
        1024,
        index
      );


    return `${value.toFixed(
      index === 0
        ? 0
        : 1
    )} ${units[index]}`;

  }


  // ============================================================
  // NO CHAT SELECTED
  // ============================================================

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
        {t(
          "selectConversation"
        )}
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
        minHeight: 0,
        position: "relative",
      }}
    >

      {/* ======================================================
          CONVERSATION HEADER
          ====================================================== */}

      <header
        aria-label={t(
          "conversationHeader"
        )}
        style={{
          padding: "16px",
          borderBottom:
            "1px solid #1e293b",
          flexShrink: 0,
        }}
      >

        <strong>
          {selectedChat.name ||
            selectedChat.participantNames?.[
              selectedChat.participants?.find(
                (userId) =>
                  userId !==
                  currentUserId
              )
            ] ||
            t("conversation")}
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
            ? t(
                "someoneIsTyping"
              )
            : ""}
        </p>

      </header>


      {/* ======================================================
          MESSAGE LIST
          ====================================================== */}

      <main
        aria-label={t(
          "messages"
        )}
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          minHeight: 0,
        }}
      >

        {messages.length === 0 ? (

          <div
            role="status"
            style={{
              color: "#94a3b8",
              textAlign:
                "center",
              padding: "30px",
            }}
          >
            {t(
              "noMessagesYet"
            )}
          </div>

        ) : (

          messages.map(
            (msg) => {

              const isOwnMessage =
                msg.senderId ===
                currentUserId;

              const isTranslating =
                Boolean(
                  translatingMessages[
                    msg.id
                  ]
                );

              const translations =
                messageTranslations[
                  msg.id
                ] ||
                msg.translatedText ||
                {};

              const savedTranslation =
                translations[
                  activeLanguage
                ];

              const isShowingTranslation =
                Boolean(
                  translatedMessages[
                    msg.id
                  ]
                );

              const displayedText =
                isShowingTranslation &&
                typeof savedTranslation ===
                  "string" &&
                savedTranslation.trim()
                  ? savedTranslation
                  : msg.text;


              return (
                <article
                  key={msg.id}
                  aria-label={
                    isOwnMessage
                      ? t(
                          "yourMessage"
                        )
                      : t(
                          "receivedMessage"
                        )
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
                        "80%",
                      minWidth:
                        "80px",
                      overflow:
                        "hidden",
                    }}
                  >

                    {/* TEXT MESSAGE */}

                    {msg.text && (

                      <div
                        style={{
                          whiteSpace:
                            "pre-wrap",
                          wordBreak:
                            "break-word",
                        }}
                      >
                        {displayedText}
                      </div>

                    )}


                    {/* IMAGE MESSAGE */}

                    {msg.imageUrl && (

                      <img
                        src={
                          msg.imageUrl
                        }
                        alt={
                          msg.fileName ||
                          t(
                            "sharedImage"
                          )
                        }
                        style={{
                          display:
                            "block",
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


                    {/* VIDEO MESSAGE */}

                    {msg.videoUrl && (

                      <video
                        controls
                        preload="metadata"
                        style={{
                          display:
                            "block",
                          width:
                            "360px",
                          maxWidth:
                            "100%",
                          borderRadius:
                            "12px",
                          marginTop:
                            "8px",
                        }}
                      >

                        <source
                          src={
                            msg.videoUrl
                          }
                          type={
                            msg.fileType ||
                            "video/mp4"
                          }
                        />

                        Your browser does not
                        support video playback.

                      </video>

                    )}


                    {/* DOCUMENT / FILE MESSAGE */}

                    {msg.fileUrl && (

                      <a
                        href={
                          msg.fileUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={
                          msg.fileName
                            ? `Open ${msg.fileName}`
                            : t(
                                "sharedFile"
                              )
                        }
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap:
                            "12px",
                          marginTop:
                            "8px",
                          padding:
                            "12px",
                          borderRadius:
                            "12px",
                          background:
                            "rgba(15, 23, 42, 0.45)",
                          color:
                            "white",
                          textDecoration:
                            "none",
                          wordBreak:
                            "break-word",
                        }}
                      >

                        <span
                          aria-hidden="true"
                          style={{
                            fontSize:
                              "28px",
                            flexShrink:
                              0,
                          }}
                        >
                          📄
                        </span>

                        <span
                          style={{
                            minWidth:
                              0,
                          }}
                        >

                          <strong
                            style={{
                              display:
                                "block",
                            }}
                          >
                            {
                              msg.fileName ||
                              t(
                                "sharedFile"
                              )
                            }
                          </strong>

                          {msg.fileSize && (
                            <small
                              style={{
                                display:
                                  "block",
                                marginTop:
                                  "3px",
                                opacity:
                                  0.7,
                              }}
                            >
                              {
                                formatFileSize(
                                  msg.fileSize
                                )
                              }
                            </small>
                          )}

                        </span>

                      </a>

                    )}


                    {/* AUDIO MESSAGE */}

                    {msg.audioUrl && (

                      <audio
                        controls
                        preload="metadata"
                        aria-label={t(
                          "voiceMessage"
                        )}
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
                          type={
                            msg.fileType ||
                            "audio/webm"
                          }
                        />

                      </audio>

                    )}


                    {/* MESSAGE TRANSLATION */}

                    {msg.text && (

                      <div
                        style={{
                          marginTop:
                            "6px",
                          display:
                            "flex",
                          gap:
                            "8px",
                          flexWrap:
                            "wrap",
                          alignItems:
                            "center",
                        }}
                      >

                        <button
                          type="button"
                          aria-label={
                            isTranslating
                              ? t(
                                  "translating"
                                )
                              : isShowingTranslation
                              ? t(
                                  "showOriginal"
                                )
                              : t(
                                  "translateMessage"
                                )
                          }
                          title={
                            isTranslating
                              ? t(
                                  "translating"
                                )
                              : isShowingTranslation
                              ? t(
                                  "showOriginal"
                                )
                              : t(
                                  "translateMessage"
                                )
                          }
                          disabled={
                            isTranslating
                          }
                          style={{
                            background:
                              "transparent",
                            border:
                              "none",
                            color:
                              isOwnMessage
                                ? "#e0f2fe"
                                : "#93c5fd",
                            cursor:
                              isTranslating
                                ? "wait"
                                : "pointer",
                            padding:
                              "2px 0",
                            fontSize:
                              "12px",
                          }}
                          onClick={() =>
                            translateMessage(
                              msg
                            )
                          }
                        >
                          {isTranslating
                            ? `🌍 ${t(
                                "translating"
                              )}`
                            : isShowingTranslation
                            ? `🌍 ${t(
                                "showOriginal"
                              )}`
                            : `🌍 ${t(
                                "translateMessage"
                              )}`}
                        </button>

                        {isShowingTranslation &&
                          savedTranslation && (

                            <span
                              aria-live="polite"
                              style={{
                                fontSize:
                                  "11px",
                                opacity:
                                  0.7,
                              }}
                            >
                              {t(
                                "translated"
                              )}{" "}
                              {activeLanguage}
                            </span>

                          )}

                      </div>

                    )}


                    {/* MESSAGE STATUS */}

                    {isOwnMessage && (

                      <div
                        aria-label={
                          msg.status ===
                          "read"
                            ? t(
                                "messageRead"
                              )
                            : t(
                                "messageSent"
                              )
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
                          ? `✓✓ ${t(
                              "read"
                            )}`
                          : `✓ ${t(
                              "sent"
                            )}`}

                      </div>

                    )}

                  </div>

                </article>
              );

            }
          )

        )}

        <div
          ref={messagesEndRef}
          aria-hidden="true"
        />

      </main>


      {/* ========================================================
          EMOJI PICKER
          ======================================================== */}

      {showEmojiPicker && (

        <div
          role="dialog"
          aria-label="Emoji picker"
          style={{
            position:
              "absolute",
            left:
              "16px",
            bottom:
              "145px",
            width:
              "min(340px, calc(100% - 32px))",
            maxHeight:
              "280px",
            overflowY:
              "auto",
            background:
              "#0f172a",
            border:
              "1px solid #334155",
            borderRadius:
              "16px",
            padding:
              "12px",
            boxSizing:
              "border-box",
            zIndex:
              50,
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.45)",
          }}
        >

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(8, 1fr)",
              gap:
                "4px",
            }}
          >

            {emojis.map(
              (emoji) => (

                <button
                  key={
                    emoji
                  }
                  type="button"
                  onClick={() =>
                    insertEmoji(
                      emoji
                    )
                  }
                  aria-label={
                    `Insert ${emoji}`
                  }
                  style={{
                    border:
                      "none",
                    background:
                      "transparent",
                    borderRadius:
                      "8px",
                    padding:
                      "7px 2px",
                    cursor:
                      "pointer",
                    fontSize:
                      "21px",
                  }}
                >
                  {emoji}
                </button>

              )
            )}

          </div>

        </div>

      )}


      {/* ========================================================
          ATTACHMENT MENU
          ======================================================== */}

      {showAttachmentMenu && (

        <div
          role="menu"
          aria-label="Attachment options"
          style={{
            position:
              "absolute",
            left:
              "16px",
            bottom:
              "82px",
            width:
              "230px",
            background:
              "#0f172a",
            border:
              "1px solid #334155",
            borderRadius:
              "16px",
            padding:
              "8px",
            zIndex:
              60,
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.45)",
          }}
        >

          <button
            type="button"
            role="menuitem"
            onClick={
              openImagePicker
            }
            disabled={
              isUploadingImage ||
              isUploadingAttachment
            }
            style={{
              width:
                "100%",
              border:
                "none",
              background:
                "transparent",
              color:
                "white",
              padding:
                "12px",
              borderRadius:
                "10px",
              textAlign:
                "left",
              cursor:
                "pointer",
              fontSize:
                "14px",
            }}
          >
            🖼️{" "}
            {t(
              "image"
            )}
          </button>


          <button
            type="button"
            role="menuitem"
            onClick={
              openVideoPicker
            }
            disabled={
              isUploadingAttachment
            }
            style={{
              width:
                "100%",
              border:
                "none",
              background:
                "transparent",
              color:
                "white",
              padding:
                "12px",
              borderRadius:
                "10px",
              textAlign:
                "left",
              cursor:
                "pointer",
              fontSize:
                "14px",
            }}
          >
            🎥 Video
          </button>


          <button
            type="button"
            role="menuitem"
            onClick={
              openDocumentPicker
            }
            disabled={
              isUploadingAttachment
            }
            style={{
              width:
                "100%",
              border:
                "none",
              background:
                "transparent",
              color:
                "white",
              padding:
                "12px",
              borderRadius:
                "10px",
              textAlign:
                "left",
              cursor:
                "pointer",
              fontSize:
                "14px",
            }}
          >
            📄 Document / File
          </button>

        </div>

      )}


      {/* ========================================================
          MESSAGE COMPOSER
          ======================================================== */}

      <section
        aria-label={t(
          "messageComposer"
        )}
        style={{
          padding:
            "16px",
          borderTop:
            "1px solid #1e293b",
          flexShrink:
            0,
          position:
            "relative",
        }}
      >

        <textarea
          value={
            text
          }
          onChange={
            handleInputChange
          }
          onKeyDown={
            handleInputKeyDown
          }
          onBlur={() =>
            updateTypingStatus(
              false
            )
          }
          placeholder={t(
            "typeMessage"
          )}
          aria-label={t(
            "typeMessage"
          )}
          rows={3}
          disabled={
            isSending
          }
          style={{
            width:
              "100%",
            padding:
              "12px",
            borderRadius:
              "12px",
            border:
              "1px solid #374151",
            background:
              "#111827",
            color:
              "#fff",
            boxSizing:
              "border-box",
            resize:
              "vertical",
            marginBottom:
              "10px",
          }}
        />


        {/* ======================================================
            HIDDEN FILE INPUTS
            ====================================================== */}

        <input
          ref={
            imageInputRef
          }
          id="chat-image-upload"
          type="file"
          accept="image/*"
          onChange={
            handleImageUpload
          }
          disabled={
            isUploadingImage ||
            isUploadingAttachment
          }
          aria-label={t(
            "shareImage"
          )}
          style={{
            display:
              "none",
          }}
        />


        <input
          ref={
            videoInputRef
          }
          id="chat-video-upload"
          type="file"
          accept="video/*"
          onChange={
            handleVideoUpload
          }
          disabled={
            isUploadingAttachment
          }
          aria-label="Share video"
          style={{
            display:
              "none",
          }}
        />


        <input
          ref={
            documentInputRef
          }
          id="chat-document-upload"
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          onChange={
            handleDocumentUpload
          }
          disabled={
            isUploadingAttachment
          }
          aria-label="Share document or file"
          style={{
            display:
              "none",
          }}
        />


        {/* ======================================================
            UPLOAD STATUS
            ====================================================== */}

        {(isUploadingImage ||
          isUploadingAttachment) && (

          <div
            role="status"
            aria-live="polite"
            style={{
              marginBottom:
                "10px",
              padding:
                "9px 12px",
              borderRadius:
                "10px",
              background:
                "#172554",
              color:
                "#bfdbfe",
              fontSize:
                "13px",
            }}
          >
            {isUploadingImage
              ? "Uploading image..."
              : "Uploading attachment..."}
          </div>

        )}


        {/* ======================================================
            MESSAGE TOOLS
            ====================================================== */}

        <div
          role="toolbar"
          aria-label={t(
            "messageTools"
          )}
          style={{
            display:
              "flex",
            gap:
              "8px",
            flexWrap:
              "wrap",
            alignItems:
              "center",
          }}
        >

          {/* EMOJI */}

          <button
            type="button"
            onClick={() => {

              setShowEmojiPicker(
                (previous) =>
                  !previous
              );

              setShowAttachmentMenu(
                false
              );

            }}
            aria-expanded={
              showEmojiPicker
            }
            aria-label="Open emoji picker"
            title="Emoji"
            disabled={
              isSending
            }
            style={{
              border:
                "1px solid #334155",
              background:
                showEmojiPicker
                  ? "#1e3a5f"
                  : "#111827",
              color:
                "white",
              borderRadius:
                "10px",
              padding:
                "9px 11px",
              cursor:
                "pointer",
              fontSize:
                "18px",
            }}
          >
            😊
          </button>


          {/* ATTACHMENT SOURCE */}

          <button
            type="button"
            onClick={() => {

              setShowAttachmentMenu(
                (previous) =>
                  !previous
              );

              setShowEmojiPicker(
                false
              );

            }}
            aria-expanded={
              showAttachmentMenu
            }
            aria-haspopup="menu"
            aria-label="Open attachment options"
            title="Attach file"
            disabled={
              isUploadingImage ||
              isUploadingAttachment
            }
            style={{
              border:
                "1px solid #334155",
              background:
                showAttachmentMenu
                  ? "#1e3a5f"
                  : "#111827",
              color:
                "white",
              borderRadius:
                "10px",
              padding:
                "9px 11px",
              cursor:
                "pointer",
              fontSize:
                "18px",
            }}
          >
            📎
          </button>


          {/* VOICE RECORDING */}

          <button
            type="button"
            onClick={() =>
              recording
                ? stopRecording()
                : startRecording()
            }
            aria-pressed={
              recording
            }
            aria-label={
              recording
                ? t(
                    "stopVoiceRecording"
                  )
                : t(
                    "startVoiceRecording"
                  )
            }
            disabled={
              isSending ||
              isUploadingAttachment ||
              isUploadingImage
            }
            style={{
              border:
                "1px solid #334155",
              background:
                recording
                  ? "#7f1d1d"
                  : "#111827",
              color:
                "white",
              borderRadius:
                "10px",
              padding:
                "9px 11px",
              cursor:
                "pointer",
            }}
          >
            {recording
              ? `⏹ ${t(
                  "stop"
                )}`
              : `🎤 ${t(
                  "record"
                )}`}
          </button>


          {/* SPEECH TO TEXT */}

          <button
            type="button"
            onClick={
              startSpeechToText
            }
            disabled={
              !speechSupported ||
              isSending
            }
            aria-label={t(
              "speechToText"
            )}
            title={t(
              "speechToText"
            )}
            style={{
              border:
                "1px solid #334155",
              background:
                "#111827",
              color:
                "white",
              borderRadius:
                "10px",
              padding:
                "9px 11px",
              cursor:
                speechSupported
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            🎙
          </button>


          {/* TEXT TO SPEECH */}

          <button
            type="button"
            onClick={() =>
              speaking
                ? stopSpeaking()
                : speakText(text)
            }
            disabled={
              !text.trim() ||
              isSending
            }
            aria-label={
              speaking
                ? t(
                    "stopReadingAloud"
                  )
                : t(
                    "readAloud"
                  )
            }
            title={
              speaking
                ? t(
                    "stopReadingAloud"
                  )
                : t(
                    "readAloud"
                  )
            }
            style={{
              border:
                "1px solid #334155",
              background:
                "#111827",
              color:
                "white",
              borderRadius:
                "10px",
              padding:
                "9px 11px",
              cursor:
                "pointer",
            }}
          >
            {speaking
              ? "⏹"
              : "🔊"}
          </button>


          {/* SEND */}

          <button
            type="button"
            onClick={
              sendMessage
            }
            disabled={
              !text.trim() ||
              isSending
            }
            aria-label={t(
              "send"
            )}
            style={{
              border:
                "none",
              background:
                "#38bdf8",
              color:
                "#020617",
              borderRadius:
                "10px",
              padding:
                "10px 16px",
              cursor:
                text.trim() &&
                !isSending
                  ? "pointer"
                  : "not-allowed",
              fontWeight:
                "800",
              marginLeft:
                "auto",
            }}
          >
            {isSending
              ? t(
                  "sending"
                )
              : t(
                  "send"
                )}
          </button>

        </div>

      </section>

    </div>
  );

}


export default ChatWindow;
