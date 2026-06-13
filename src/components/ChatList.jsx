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
        ><div
  style={{
    display: "flex",
    justifyContent: "space-between",
  }}
>
  <h4>{chat.name}</h4>

  {chat.unreadCount > 0 && (
    <div
      style={{
        background: "#ef4444",
        borderRadius: "50%",
        width: "22px",
        height: "22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {chat.unreadCount}
    </div>
  )}
</div>

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
