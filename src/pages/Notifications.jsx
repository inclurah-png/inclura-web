import { useEffect, useState } from "react";
import { auth, db } from "../firebase";

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("receiverId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

        setNotifications(data);
      });

    return () => unsubscribe();
  }, []);

  async function markAsRead(id) {
    await updateDoc(
      doc(db, "notifications", id),
      {
        read: true,
      }
    );
  }

  return (
    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        color: "white",
        padding: "24px",
      }}
    >
      <h1>🔔 Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications yet</p>
      ) : (
        notifications.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              markAsRead(item.id)
            }
            style={{
              background: item.read
                ? "#1e293b"
                : "#2563eb",
              padding: "16px",
              borderRadius: "14px",
              marginTop: "12px",
              cursor: "pointer",
            }}
          >
            <p>{item.text}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;
