  import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db, auth } from "../firebase";

function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where(
        "receiverId",
        "==",
        user.uid
      ),
      orderBy(
        "createdAt",
        "desc"
      )
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {
        const data =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setNotifications(data);

        setUnreadCount(
          data.filter(
            (item) => !item.read
          ).length
        );
      });

    return () => unsubscribe();
  }, []);

  async function markAsRead(id) {
    try {
      await updateDoc(
        doc(
          db,
          "notifications",
          id
        ),
        {
          read: true,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  function getNotificationIcon(
    type
  ) {
    switch (type) {
      case "follow":
        return "👥";

      case "like":
        return "❤️";

      case "comment":
        return "💬";

      case "story":
        return "📸";

      case "message":
        return "✉️";

      case "verification":
        return "✅";

      case "premium":
        return "⭐";

      default:
        return "🔔";
    }
  }

  return (
    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        padding: "24px",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            marginBottom: "8px",
          }}
        >
          🔔 Notifications
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "24px",
          }}
        >
          {unreadCount} unread
          notification
          {unreadCount !== 1
            ? "s"
            : ""}
        </p>

        {notifications.length ===
        0 ? (
          <div
            style={{
              background:
                "#0f172a",
              padding: "24px",
              borderRadius:
                "20px",
              textAlign:
                "center",
              color:
                "#94a3b8",
            }}
          >
            No notifications yet
          </div>
        ) : (
          notifications.map(
            (
              notification
            ) => (
              <div
                key={
                  notification.id
                }
                onClick={() =>
                  markAsRead(
                    notification.id
                  )
                }
                style={{
                  background:
                    notification.read
                      ? "#0f172a"
                      : "#1e293b",

                  padding:
                    "20px",

                  borderRadius:
                    "20px",

                  marginBottom:
                    "14px",

                  cursor:
                    "pointer",

                  border:
                    notification.read
                      ? "1px solid transparent"
                      : "1px solid #38bdf8",

                  transition:
                    "0.2s",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "flex-start",
                    gap: "12px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "10px",
                        marginBottom:
                          "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize:
                            "20px",
                        }}
                      >
                        {getNotificationIcon(
                          notification.type
                        )}
                      </span>

                      {!notification.read && (
                        <span
                          style={{
                            background:
                              "#38bdf8",
                            color:
                              "white",
                            fontSize:
                              "11px",
                            padding:
                              "4px 8px",
                            borderRadius:
                              "999px",
                            fontWeight:
                              "700",
                          }}
                        >
                          NEW
                        </span>
                      )}
                    </div>

                    <p
                      style={{
                        margin: 0,
                        lineHeight:
                          "1.7",
                      }}
                    >
                      {
                        notification.text
                      }
                    </p>
                  </div>

                  <div
                    style={{
                      color:
                        "#64748b",
                      fontSize:
                        "12px",
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {notification.createdAt
                      ? "Recent"
                      : ""}
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default Notifications;
