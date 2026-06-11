
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import { auth, db, storage } from "../firebase";

import { signOut } from "firebase/auth";

import FollowButton from "../components/FollowButton";

import {
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

function Profile() {

  const [profile, setProfile] = useState(null);

  const [uploading, setUploading] =
    useState(false);

  const navigate = useNavigate();
  
async function handleLogout() {
  try {
    await signOut(auth);
    navigate("/");
  } catch (error) {
    alert(error.message);
  }
}
  
  async function handleLogout() {
  await signOut(auth);
  navigate("/");
    }

  if (!file) return;

  try {
    setUploading(true);

    const user = auth.currentUser;

    const storageRef = ref(
      storage,
      `profilePhotos/${user.uid}`
    );

    await uploadBytes(
      storageRef,
      file
    );

    const photoURL =
      await getDownloadURL(
        storageRef
      );

    await updateDoc(
      doc(
        db,
        "users",
        user.uid
      ),
      {
        photoURL,
      }
    );

    alert(
      "Profile photo updated!"
    );

  } catch (error) {
    alert(error.message);
  } finally {
    setUploading(false);
  }
}

  useEffect(() => {
  const user = auth.currentUser;

  if (!user) return;

  const unsubscribe = onSnapshot(
    doc(db, "users", user.uid),
    (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    }
  );

  return () => unsubscribe();
}, []);

  if (!profile) {
    return (
      <div
        style={{
          background: "#020617",
          minHeight: "100vh",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial",
        }}
      >
        Loading profile...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        padding: "24px",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#0f172a",
            padding: "32px",
            borderRadius: "30px",
            border: "1px solid #1e293b",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
        
<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  }}
>
  {profile.photoURL ? (
    <img
      src={profile.photoURL}
      alt="Profile"
      style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        objectFit: "cover",
        border: "3px solid #38bdf8",
      }}
    />
  ) : (
    <div
      style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: "#38bdf8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "42px",
        fontWeight: "700",
      }}
    >
      {profile.fullName?.charAt(0)}
    </div>
  )}

  <input
    type="file"
    accept="image/*"
    onChange={handlePhotoUpload}
  />
</div>

            {uploading && (
  <p style={{ color: "#38bdf8" }}>
    Uploading...
  </p>
)}
            
            <div>
              <h1
                style={{
                  marginBottom: "8px",
                }}
              >
                {profile.fullName}
              </h1>

              <button
  onClick={() =>
    navigate("/edit-profile")
  }
  style={{
    marginBottom: "12px",
    padding: "12px 18px",
    borderRadius: "14px",
    border: "none",
    background: "#38bdf8",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  }}
>
  Edit Profile
</button>

<button
  onClick={() =>
    navigate("/search")
  }
  style={{
    marginLeft: "10px",
    padding: "12px 18px",
    borderRadius: "14px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  }}
>
  Search Users
</button>

<button
  onClick={() =>
    navigate("/notifications")
  }
  style={{
    marginLeft: "10px",
    padding: "12px 18px",
    borderRadius: "14px",
    border: "none",
    background: "#f59e0b",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  }}
>
  Notifications
</button>

<button
  onClick={handleLogout}
  style={{
    marginLeft: "10px",
    padding: "12px 18px",
    borderRadius: "14px",
    border: "none",
    background: "#ef4444",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  }}
>
  Logout
</button>
>
  Search Users
</button>

              <p
                style={{
                  color: "#94a3b8",
                  marginTop: "12px",
                  fontSize: "14px",
                }}
              >
                Followers: {profile.followers?.length || 0}
                &nbsp;•&nbsp;
                Following: {profile.following?.length || 0}
              </p>

              {profile.bio && (
                <p
                  style={{
                    marginTop: "18px",
                    lineHeight: "1.8",
                    color: "#cbd5e1",
                  }}
                >
                  {profile.bio}
                </p>
              )}

              {profile.accessibility && (
                <p
                  style={{
                    marginTop: "10px",
                    color: "#94a3b8",
                  }}
                >
                  ♿ {profile.accessibility}
                </p>
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div style={cardStyle}>
              ♿ Accessibility Mode:{" "}
              {profile.accessibilityMode
                ? "Enabled"
                : "Disabled"}
            </div>

            <div style={cardStyle}>
              🏅 Verified:{" "}
              {profile.verified
                ? "Yes"
                : "No"}
            </div>

            <div style={cardStyle}>
              💳 Wallet Balance: $
              {profile.walletBalance || 0}
            </div>

            <div style={cardStyle}>
              📄 Resume Completed:{" "}
              {profile.resumeCompleted
                ? "Yes"
                : "No"}
            </div>

            <div style={cardStyle}>
              🛡 Role: {profile.role}
            </div>
            
<div style={cardStyle}>
🏷 Category:
{profile.category || "Not selected"}
</div>
            
            <div style={cardStyle}>
              <h3
                style={{
                  marginBottom: "12px",
                }}
              >
                ♿ Accessibility Needs
              </h3>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {profile.accessibilityNeeds?.length > 0 ? (
  profile.accessibilityNeeds.map((item) => (
    <div
      key={item}
      style={{
        background: "#2563eb",
        color: "white",
        padding: "12px 16px",
        borderRadius: "999px",
        fontSize: "14px",
        fontWeight: "600",
        border: "1px solid #60a5fa",
      }}
    >
      ♿ {item}
    </div>
  ))
) : (
  <p
    style={{
      color: "#94a3b8",
    }}
  >
    No accessibility needs selected
  </p>
)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#1e293b",
  padding: "18px",
  borderRadius: "18px",
};

export default Profile;
