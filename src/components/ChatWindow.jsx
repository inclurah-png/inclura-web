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

  const [speaking, setSpeaking] =
    useState(false);

  const [speechSupported, setSpeechSupported] =
    useState(false);

  const [translatingMessages, setTranslatingMessages] =
    useState({});

  const [messageTranslations, setMessageTranslations] =
    useState({});

  const [translatedMessages, setTranslatedMessages] =
    useState({});

  const recognitionRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  const typingTimeoutRef =
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
  // CLEAN UP SPEECH, TYPING AND MEDIA
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

      }

      if (
        typingTimeoutRef.current
      ) {

        clearTimeout(
          typingTimeoutRef.current
        );

      }

      if (
        mediaRecorder &&
        mediaRecorder.state !==
          "inactive"
      ) {

        try {

          mediaRecorder.stop();

        } catch (error) {

          console.warn(
            "Media recorder cleanup error:",
            error
          );

        }

      }

      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {

        window.speechSynthesis.cancel();

      }

    };

  }, [mediaRecorder]);


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

    /*
     * If the current language already has
     * a saved translation, toggle between
     * the translation and the original.
     */
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

    /*
     * Mark only this message as translating.
     */
    setTranslatingMessages(
      (previous) => ({
        ...previous,
        [messageId]: true,
      })
    );

    try {

      /*
       * Use the same secure translation engine
       * already proven on Feed and PostPage.
       */
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

      /*
       * Save the translation to the central
       * Firestore translation cache.
       *
       * A cache-save failure does not prevent
       * the translation from being displayed.
       */
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

      /*
       * Keep all language translations together
       * on the individual message.
       */
      const updatedTranslations = {
        ...(messageTranslations[
          messageId
        ] || {}),
        [activeLanguage]:
          translatedText,
      };

      /*
       * Persist the translation directly
       * on the Firestore message.
       */
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

      /*
       * Update local translation cache.
       */
      setMessageTranslations(
        (previous) => ({
          ...previous,
          [messageId]:
            updatedTranslations,
        })
      );

      /*
       * Immediately display the translation.
       */
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
  // START VOICE RECORDING
  // ============================================================

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
                  type: "audio/webm",
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

            stream
              .getTracks()
              .forEach(
                (track) =>
                  track.stop()
              );

          }

        };

      recorder.start();

      setMediaRecorder(
        recorder
      );

      setRecording(
        true
      );

    } catch (error) {

      console.error(
        "Recording error:",
        error
      );

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

    if (
      mediaRecorder &&
      mediaRecorder.state !==
        "inactive"
    ) {

      mediaRecorder.stop();

    }

    setMediaRecorder(
      null
    );

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
        }}
      >

        <strong>
          {selectedChat.name ||
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
                        "70%",
                    }}
                  >

                    {/* TEXT MESSAGE */}

                    {msg.text && (

                      <div>

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
                          type="audio/webm"
                        />

                      </audio>

                    )}


                    {/* =================================================
                        MESSAGE TRANSLATION
                        ================================================= */}

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
          MESSAGE COMPOSER
          ======================================================== */}

      <section
        aria-label={t(
          "messageComposer"
        )}
        style={{
          padding: "16px",
          borderTop:
            "1px solid #1e293b",
        }}
      >

        <textarea
          value={text}
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
          disabled={isSending}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius:
              "12px",
            border:
              "1px solid #374151",
            background:
              "#111827",
            color: "#fff",
            boxSizing:
              "border-box",
            resize:
              "vertical",
            marginBottom:
              "10px",
          }}
        />


        {/* ======================================================
            MESSAGE TOOLS
            ====================================================== */}

        <div
          role="toolbar"
          aria-label={t(
            "messageTools"
          )}
          style={{
            display: "flex",
            gap: "10px",
            flexWrap:
              "wrap",
          }}
        >

          {/* IMAGE UPLOAD */}

          <label
            htmlFor="chat-image-upload"
            style={{
              cursor:
                isUploadingImage
                  ? "wait"
                  : "pointer",
              opacity:
                isUploadingImage
                  ? 0.6
                  : 1,
            }}
          >
            🖼️{" "}
            {isUploadingImage
              ? t(
                  "uploading"
                )
              : t(
                  "image"
                )}
          </label>

          <input
            id="chat-image-upload"
            type="file"
            accept="image/*"
            onChange={
              handleImageUpload
            }
            disabled={
              isUploadingImage
            }
            aria-label={t(
              "shareImage"
            )}
            style={{
              position:
                "absolute",
              width: "1px",
              height: "1px",
              overflow:
                "hidden",
              clip:
                "rect(0, 0, 0, 0)",
            }}
          />


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
              isSending
            }
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
          >
            🎙{" "}
            {t(
              "speechToText"
            )}
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
          >
            {speaking
              ? `⏹ ${t(
                  "stop"
                )}`
              : `📝 ${t(
                  "readAloud"
                )}`}
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
