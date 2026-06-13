import { useState } from "react";

import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

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
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

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
