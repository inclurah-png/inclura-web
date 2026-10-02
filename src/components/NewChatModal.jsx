import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db, auth } from "../firebase";

function NewChatModal() {
  const { t } = useTranslation();

  const [targetUid, setTargetUid] = useState("");
  const [creatingChat, setCreatingChat] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function createChat() {
    const trimmedTargetUid = targetUid.trim();

    setError("");
    setSuccess("");

    if (!auth.currentUser) {
      setError(
        t("messages.authenticationRequired", {
          defaultValue:
            "You must be signed in to start a conversation.",
        })
      );
      return;
    }

    if (!trimmedTargetUid) {
      setError(
        t("messages.enterUserUid", {
          defaultValue: "Please enter a user UID.",
        })
      );
      return;
    }

    if (trimmedTargetUid === auth.currentUser.uid) {
      setError(
        t("messages.cannotMessageYourself", {
          defaultValue:
            "You cannot start a conversation with yourself.",
        })
      );
      return;
    }

    if (creatingChat) {
      return;
    }

    setCreatingChat(true);

    try {
      /*
       * Keep one deterministic one-to-one chat ID.
       *
       * This matches the chat creation logic already used
       * by Messages.jsx and prevents duplicate conversations
       * between the same two users.
       */
      const participantIds = [
        auth.currentUser.uid,
        trimmedTargetUid,
      ].sort();

      const chatId = participantIds.join("_");

      const chatRef = doc(
        db,
        "chats",
        chatId
      );

      await setDoc(
        chatRef,
        {
          participants: participantIds,

          createdBy:
            auth.currentUser.uid,

          updatedAt:
            serverTimestamp(),

          lastMessage: "",

          lastSenderId: "",
        },
        {
          merge: true,
        }
      );

      setTargetUid("");

      setSuccess(
        t("messages.conversationCreated", {
          defaultValue:
            "Conversation created successfully.",
        })
      );
    } catch (createError) {
      console.error(
        "Inclura New Chat Creation Error:",
        createError
      );

      setError(
        t("messages.startConversationError", {
          defaultValue:
            "Unable to start the conversation. Please try again.",
        })
      );
    } finally {
      setCreatingChat(false);
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder={t(
          "messages.userUidPlaceholder",
          {
            defaultValue: "User UID",
          }
        )}
        aria-label={t(
          "messages.userUid",
          {
            defaultValue: "User UID",
          }
        )}
        value={targetUid}
        onChange={(event) =>
          setTargetUid(event.target.value)
        }
        disabled={creatingChat}
      />

      <button
        type="button"
        onClick={createChat}
        disabled={creatingChat}
      >
        {creatingChat
          ? t("messages.creatingChat", {
              defaultValue: "Creating...",
            })
          : t("messages.startChat", {
              defaultValue: "Start Chat",
            })}
      </button>

      {error && (
        <div
          role="alert"
          style={{
            marginTop: "8px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          style={{
            marginTop: "8px",
          }}
        >
          {success}
        </div>
      )}
    </div>
  );
}

export default NewChatModal;
