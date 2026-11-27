import React from "react";
import { useTranslation } from "react-i18next";

function ChatList({ chats = [], selectedChat, setSelectedChat, currentUserId }) {
  const { t } = useTranslation();
  const getOtherUserId = (chat) => chat.participants?.find((userId) => userId !== currentUserId);
  const getChatName = (chat) => {
    const otherUserId = getOtherUserId(chat);
    return chat.name || chat.participantNames?.[otherUserId] || t("messagesMemberFallback");
  };
  const getChatProfile = (chat) => {
    const otherUserId = getOtherUserId(chat);
    return chat.participantProfiles?.[otherUserId] || {};
  };
  const getInitials = (name) => String(name || "I").trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("");

  return (
    <div style={{ width: "100%", boxSizing: "border-box", borderRight: "1px solid #1e293b", overflowY: "auto" }} role="navigation" aria-label={t("messagesYourConversations")}>
      {chats.length > 0 && (
        <section aria-label={t("messagesRecentContacts")} style={{ padding: "16px 14px 12px", borderBottom: "1px solid #1e293b" }}>
          <h2 style={{ margin: "0 0 12px", fontSize: "14px", color: "#cbd5e1" }}>{t("messagesRecentContacts")}</h2>
          <div style={{ display: "flex", gap: "14px", overflowX: "auto", paddingBottom: "4px" }}>
            {chats.map((chat) => {
              const name = getChatName(chat), profile = getChatProfile(chat);
              return (
                <button type="button" key={chat.id} onClick={() => setSelectedChat(chat)} aria-label={t("messagesOpenConversation", { name })} aria-pressed={selectedChat?.id === chat.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: "0 0 64px", border: 0, padding: "2px", background: "transparent", color: "#e2e8f0", cursor: "pointer", font: "inherit" }}>
                  {profile.photoURL ? <img src={profile.photoURL} alt="" loading="lazy" style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", border: "2px solid #38bdf8" }} /> : <span aria-hidden="true" style={{ width: "44px", height: "44px", borderRadius: "50%", display: "grid", placeItems: "center", background: "#1e3a5f", color: "#bae6fd", fontWeight: 800, border: "2px solid #38bdf8" }}>{getInitials(name)}</span>}
                  <span style={{ width: "64px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "11px" }}>{name}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}
      <section aria-label={t("messagesYourConversations")}>
        <h2 style={{ margin: 0, padding: "16px 16px 8px", fontSize: "14px", color: "#cbd5e1" }}>{t("messagesYourConversations")}</h2>
        {chats.length === 0 ? (
          <div role="status" style={{ padding: "20px", color: "#94a3b8", textAlign: "center" }}>{t("messagesEmptyState")}</div>
        ) : chats.map((chat) => {
          const isSelected = selectedChat?.id === chat.id, unreadCount = Number(chat.unreadCount) || 0, name = getChatName(chat), profile = getChatProfile(chat);
          return (
            <button type="button" key={chat.id} onClick={() => setSelectedChat(chat)} aria-current={isSelected ? "true" : undefined} aria-label={unreadCount > 0 ? t("messagesUnreadCount", { count: unreadCount }) + ": " + name : name} style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", border: 0, borderBottom: "1px solid #172033", font: "inherit", color: "inherit", textAlign: "left", padding: "14px 16px", cursor: "pointer", background: isSelected ? "#1e293b" : "transparent" }}>
              {profile.photoURL ? <img src={profile.photoURL} alt="" loading="lazy" style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} /> : <span aria-hidden="true" style={{ width: "42px", height: "42px", borderRadius: "50%", display: "grid", placeItems: "center", background: "#1e3a5f", color: "#bae6fd", fontWeight: 800, flexShrink: 0 }}>{getInitials(name)}</span>}
              <span style={{ display: "block", minWidth: 0, flex: 1 }}>
                <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                  <strong style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</strong>
                  {unreadCount > 0 && <span style={{ background: "#ef4444", borderRadius: "999px", minWidth: "22px", height: "22px", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px", boxSizing: "border-box", fontSize: "12px", fontWeight: 700 }} aria-label={t("messagesUnreadCount", { count: unreadCount })}>{unreadCount}</span>}
                </span>
                <span style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginTop: "5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.lastMessage || t("messagesStartConversation")}</span>
              </span>
            </button>
          );
        })}
      </section>
    </div>
  );
}

export default ChatList;
