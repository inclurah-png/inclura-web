import DashboardLayout from "../components/DashboardLayout";
import CreatePost from "../components/CreatePost";
import Feed from "../components/Feed";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { auth, db, storage } from "../firebase";

import { signOut } from "firebase/auth";

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

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files[0];

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
        await getDownloadURL(storageRef);

      await updateDoc(
        doc(db, "users", user.uid),
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
      }}
    >
      Loading Profile...
    </div>
  );
}

return (
  <DashboardLayout>
    <div
      style={{
        color: "white",
      }}
    >
      <div
        style={{
          background: "#0f172a",
          padding: "32px",
          borderRadius: "30px",
          border: "1px solid #1e293b",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginBottom: "30px",
          }}
        >
          <div>
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
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
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
              style={{
                marginTop: "12px",
              }}
            />
          </div>

          <div>
            <h1>{profile.fullName}</h1>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Followers:
              {profile.followers?.length || 0}
              {" • "}
              Following:
              {profile.following?.length || 0}
            </p>

            {profile.bio && (
              <p>{profile.bio}</p>
            )}

            {uploading && (
              <p
                style={{
                  color: "#38bdf8",
                }}
              >
                Uploading...
              </p>
            )}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() =>
                  navigate("/edit-profile")
                }
                style={btnBlue}
              >
                Edit Profile
              </button>

              <button
                onClick={() =>
                  navigate("/search")
                }
                style={btnIndigo}
              >
                Search Users
              </button>

              <button
                onClick={() =>
                  navigate("/notifications")
                }
                style={btnOrange}
              >
                Notifications
              </button>

              <button
                onClick={() =>
                  navigate("/saved-posts")
                }
                style={btnGreen}
              >
                Saved Posts
              </button>

              <button
                onClick={handleLogout}
                style={btnRed}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          🏷 Category:
          {" "}
          {profile.category ||
            "Not selected"}
        </div>

        <div style={cardStyle}>
          🛡 Role:
          {" "}
          {profile.role ||
            "Member"}
        </div>

        <div style={cardStyle}>
          🏅 Verified:
          {" "}
          {profile.verified
            ? "Yes"
            : "No"}
        </div>

        <div style={cardStyle}>
          💳 Wallet:
          {" "}
          $
          {profile.walletBalance || 0}
        </div>

        <div style={cardStyle}>
          ♿ Accessibility Needs

          <div
            style={{
              marginTop: "12px",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {profile.accessibilityNeeds?.length >
            0 ? (
              profile.accessibilityNeeds.map(
                (item) => (
                  <div
                    key={item}
                    style={{
                      background:
                        "#2563eb",
                      padding:
                        "10px 14px",
                      borderRadius:
                        "999px",
                    }}
                  >
                    {item}
                  </div>
                )
              )
            ) : (
              <p>
                No accessibility
                needs selected
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CREATE POST */}
      <CreatePost />

      {/* FEED */}
      <div
        style={{
          marginTop: "24px",
        }}
      >
        <Feed />
      </div>
    </div>
  </DashboardLayout>
);
}

const cardStyle = {
  background: "#1e293b",
  padding: "18px",
  borderRadius: "18px",
  marginBottom: "16px",
};

const btnBlue = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "14px",
  background: "#38bdf8",
  color: "white",
  cursor: "pointer",
};

const btnIndigo = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "14px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
};

const btnOrange = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "14px",
  background: "#f59e0b",
  color: "white",
  cursor: "pointer",
};

const btnGreen = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "14px",
  background: "#10b981",
  color: "white",
  cursor: "pointer",
};

const btnRed = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "14px",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
};

export default Profile;
  
