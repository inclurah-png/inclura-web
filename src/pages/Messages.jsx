import { useState } from "react";

import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";

function Messages() {
  const [selectedChat,
    setSelectedChat] =
    useState(null);

  const chats = [];

  const messages = [];

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
