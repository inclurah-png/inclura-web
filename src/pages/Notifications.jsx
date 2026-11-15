import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsubscribeNotifications = null;

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (user) => {
        if (unsubscribeNotifications) {
          unsubscribeNotifications();
          unsubscribeNotifications = null;
        }

        if (!user) {
          setNotifications([]);
          return;
        }

        const q = query(
          collection(db, "notifications"),
          where("receiverId", "==", user.uid)
        );

        unsubscribeNotifications = onSnapshot(
          q,
          (snapshot) => {
            const data = snapshot.docs
              .map((notificationDoc) => ({
                id: notificationDoc.id,
                ...notificationDoc.data(),
              }))
              .sort((a, b) => {
                const aTime = a.createdAt?.toMillis?.() ?? 0;
                const bTime = b.createdAt?.toMillis?.() ?? 0;
                return bTime - aTime;
              });

            setError("");
            setNotifications(data);
          },
          (snapshotError) => {
            console.error("Notifications listener error:", snapshotError);
            setError("Unable to load notifications.");
          }
        );
      }
    );

    return () => {
      unsubscribeAuth();
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
      }
    };
  }, []);

  async function markAsRead(id) {
    try {
      await updateDoc(
        doc(db, "notifications", id),
        {
          read: true,
        }
      );
    } catch (error) {
      console.error("Unable to mark notification as read:", error);
    }
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

      {error ? (
        <p>{error}</p>
      ) : notifications.length === 0 ? (
        <p>No notifications yet</p>
      ) : (
        notifications.map((item) => (
          <div
            key={item.id}
            onClick={() => markAsRead(item.id)}
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
