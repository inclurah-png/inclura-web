import { useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

function ShareLiveLocation() {
  const [loading, setLoading] = useState(false);

  async function shareLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await updateDoc(
            doc(db, "users", auth.currentUser.uid),
            {
              liveLatitude: position.coords.latitude,
              liveLongitude: position.coords.longitude,
              locationAccuracy: position.coords.accuracy,
              liveLocationUpdatedAt: serverTimestamp(),
            }
          );

          alert("Live location updated successfully.");
        } catch (err) {
          console.error(err);
          alert(err.message);
        }

        setLoading(false);
      },
      (err) => {
        console.error(err);
        alert("Unable to retrieve location.");
        setLoading(false);
      }
    );
  }

  return (
    <div
      style={{
        background: "#0f172a",
        padding: "24px",
        borderRadius: "20px",
        marginBottom: "20px",
      }}
    >
      <h3>📍 Share Live Location</h3>

      <p>
        Update your current GPS location for emergency responders.
      </p>

      <button
        onClick={shareLocation}
        disabled={loading}
        style={{
          padding: "12px 18px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "700",
        }}
      >
        {loading ? "Updating..." : "Share Current Location"}
      </button>
    </div>
  );
}

export default ShareLiveLocation;
