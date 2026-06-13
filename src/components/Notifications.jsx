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

  return (
    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        padding: "24px",
        color: "white",
      }}
    >
      <h1>
        🔔 Notifications
      </h1>

      {notifications.length === 0 ? (
        <div
          style={{
            marginTop: "20px",
            background: "#0f172a",
            padding: "20px",
            borderRadius: "20px",
          }}
        >
          No notifications yet
        </div>
      ) : (
        notifications.map(
          (notification) => (
            <div
              key={notification.id}
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
                padding: "20px",
                borderRadius:
                  "20px",
                marginTop: "12px",
                cursor: "pointer",
                border:
                  notification.read
                    ? "none"
                    : "1px solid #38bdf8",
              }}
            >
              <p>
                {notification.text}
              </p>

              {!notification.read && (
                <span
                  style={{
                    color:
                      "#38bdf8",
                    fontSize:
                      "13px",
                  }}
                >
                  NEW
                </span>
              )}
            </div>
          )
        )
      )}
    </div>
  );
}

export default Notifications;
