import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";
import DashboardLayout from "../components/DashboardLayout";

function FamilyEmergencyNotifications() {

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

  const unsubscribe = loadNotifications();

  return () => unsubscribe && unsubscribe();

}, []);

  async function loadNotifications() {

    try {

      const q = query(

        collection(db, "emergencyNotifications"),

        where("visibleToFamily", "==", true),

        orderBy("createdAt", "desc")

      );

      const unsubscribe = onSnapshot(q, (snapshot) => {

  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  setNotifications(data);

});

return unsubscribe;

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  return (

    <DashboardLayout>

      <div style={container}>

        <h1>🔔 Family Emergency Notifications</h1>

        {loading ? (

          <p>Loading notifications...</p>

        ) : notifications.length === 0 ? (

          <p>No notifications.</p>

        ) : (

          notifications.map(notification => (

            <div
              key={notification.id}
              style={card}
            >

              <h3>

                {notification.notificationTitle}

              </h3>

              <p>

                {notification.notificationMessage}

              </p>

              <p>

                <strong>Status:</strong>{" "}

                {notification.notificationStatus}

              </p>

              <p>

                <strong>Emergency:</strong>{" "}

                {notification.emergencyId}

              </p>

            </div>

          ))

        )}

      </div>

    </DashboardLayout>

  );

}

const container = {

  color: "#fff",

};

const card = {

  marginTop: "18px",

  padding: "18px",

  background: "#111827",

  borderRadius: "12px",

};

export default FamilyEmergencyNotifications;
