function ChatList({
  chats,
  selectedChat,
  setSelectedChat,
}) {
  return (
    <div
      style={{
        width: "320px",
        borderRight:
          "1px solid #1e293b",
        overflowY: "auto",
      }}
    >
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() =>
            setSelectedChat(chat)
          }
          style={{
            padding: "16px",
            cursor: "pointer",
            background:
              selectedChat?.id ===
              chat.id
                ? "#1e293b"
                : "transparent",
          }}
        >
          <h4>{chat.name}</h4>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            {chat.lastMessage}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
