import { useState, useEffect } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import { db, auth } from "../firebase";

function Messages() {
  const [selectedChat,
    setSelectedChat] =
    useState(null);

  const [chats, setChats] = useState([]);
const [messages, setMessages] = useState([]);

  useEffect(() => {
  if (!selectedChat) return;

  const q = query(
    collection(
      db,
      "chats",
      selectedChat.id,
      "messages"
    ),
    orderBy("createdAt", "asc")
  );

  const unsubscribe =
    onSnapshot(q, (snapshot) => {
      const loadedMessages =
  snapshot.docs.map((docSnap) => {
    const data =
      docSnap.data();

    if (
      data.senderId !==
      auth.currentUser.uid
    ) {
      updateDoc(
        doc(
          db,
          "chats",
          selectedChat.id,
          "messages",
          docSnap.id
        ),
        {
          status: "read",
          readBy: arrayUnion(
            auth.currentUser.uid
          ),
        }
      );
    }

    return {
      id: docSnap.id,
      ...data,
    };
  });

setMessages(
  loadedMessages
);
    });

  return () => unsubscribe();
}, [selectedChat]);
  
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        background:
          "#020617",
        color: "white",
      }}
    >
      <ChatList
        chats={chats}
        selectedChat={
          selectedChat
        }
        setSelectedChat={
          setSelectedChat
        }
      />

      <ChatWindow
        selectedChat={
          selectedChat
        }
        messages={messages}
      />
    </div>
  );
}

export default Messages;
