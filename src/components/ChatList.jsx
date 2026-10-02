import React from "react";

function ChatList({
  chats = [],
  selectedChat,
  setSelectedChat,
}) {
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleKeyDown = (event, chat) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelectChat(chat);
    }
  };

  return (
    <div
      style={{
        width: "320px",
        borderRight: "1px solid #1e293b",
        overflowY: "auto",
      }}
      role="navigation"
      aria-label="Conversations"
    >
      {chats.length === 0 ? (
        <div
          style={{
            padding: "20px",
            color: "#94a3b8",
            textAlign: "center",
          }}
        >
          No conversations yet.
        </div>
      ) : (
        chats.map((chat) => {
          const isSelected = selectedChat?.id === chat.id;
          const unreadCount = Number(chat.unreadCount) || 0;

          return (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              onKeyDown={(event) =>
                handleKeyDown(event, chat)
              }
              role="button"
              tabIndex={0}
              aria-current={
                isSelected ? "true" : undefined
              }
              aria-label={
                unreadCount > 0
                  ? `${chat.name || "Conversation"}, ${unreadCount} unread message${
                      unreadCount === 1 ? "" : "s"
                    }`
                  : chat.name || "Conversation"
              }
              style={{
                padding: "16px",
                cursor: "pointer",
                background: isSelected
                  ? "#1e293b"
                  : "transparent",
                outline: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {chat.name || "Conversation"}
                </h4>

                {unreadCount > 0 && (
                  <div
                    style={{
                      background: "#ef4444",
                      borderRadius: "50%",
                      width: "22px",
                      height: "22px",
                      minWidth: "22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                    aria-hidden="true"
                  >
                    {unreadCount}
                  </div>
                )}
              </div>

              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "14px",
                  margin: "6px 0 0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {chat.lastMessage || ""}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ChatList;
