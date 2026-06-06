
import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
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
      where("targetUserId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setNotifications(data);
      }
    );

    return () => unsubscribe();
  }, []);

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
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            marginBottom: "24px",
          }}
        >
          🔔 Notifications
        </h1>

        {notifications.length === 0 ? (
          <div
            style={{
              background: "#0f172a",
              padding: "24px",
              borderRadius: "20px",
              textAlign: "center",
              color: "#94a3b8",
            }}
          >
            No notifications yet
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#0f172a",
                padding: "20px",
                borderRadius: "18px",
                marginBottom: "14px",
              }}
            >
              {item.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
