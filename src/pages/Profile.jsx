import DashboardStats from "../components/DashboardStats";
import OpportunitiesWidget from "../components/OpportunitiesWidget";
import CommunityHighlights from "../components/CommunityHighlights";
import ReelsSection from "../components/ReelsSection";
import DashboardLayout from "../components/DashboardLayout";
import CreatePost from "../components/CreatePost";
import StoriesSection from "../components/StoriesSection";
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
      {/* PROFILE HEADER */}
      <div
        style={{
          background: "#0f172a",
          padding: "32px",
          borderRadius: "30px",
          border: "1px solid #1e293b",
          marginBottom: "24px",
        }}
      >
        {/* Existing profile image section */}

        {/* Existing profile details section */}

        {/* Existing Category */}
        <div style={cardStyle}>
          🏷 Category:
          {profile.category || "Not selected"}
        </div>

        {/* Existing Role */}
        <div style={cardStyle}>
          🛡 Role:
          {profile.role || "Member"}
        </div>

        {/* Existing Verified */}
        <div style={cardStyle}>
          🏅 Verified:
          {profile.verified ? "Yes" : "No"}
        </div>

        {/* Existing Wallet */}
        <div style={cardStyle}>
          💳 Wallet:
          ${profile.walletBalance || 0}
        </div>

        {/* Existing Accessibility */}
        <div style={cardStyle}>
          <h3>♿ Accessibility Needs</h3>

          <div
            style={{
              marginTop: "12px",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {profile.accessibilityNeeds?.length > 0
              ? profile.accessibilityNeeds.map(
                  (item) => (
                    <div
                      key={item}
                      style={{
                        background: "#2563eb",
                        padding: "10px 14px",
                        borderRadius: "999px",
                      }}
                    >
                      {item}
                    </div>
                  )
                )
              : "No accessibility needs selected"}
          </div>
        </div>
      </div>

      {/* DASHBOARD STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(200px,1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={cardStyle}>
          <h3>📝 Posts</h3>
          <h2>{profile.postCount || 0}</h2>
        </div>

        <div style={cardStyle}>
          <h3>👥 Followers</h3>
          <h2>
            {profile.followers?.length || 0}
          </h2>
        </div>

        <div style={cardStyle}>
          <h3>➡ Following</h3>
          <h2>
            {profile.following?.length || 0}
          </h2>
        </div>

        <div style={cardStyle}>
          <h3>🏆 XP</h3>
          <h2>{profile.xp || 0}</h2>
        </div>
      </div>

      {/* OPPORTUNITIES */}
      <div style={cardStyle}>
        <h2>🚀 Opportunities</h2>

        <ul>
          <li>Remote Jobs</li>
          <li>Scholarships</li>
          <li>Mentorship Programs</li>
          <li>Volunteer Opportunities</li>
        </ul>
      </div>

      {/* COMMUNITY HIGHLIGHTS */}
      <div style={cardStyle}>
        <h2>🌟 Community Highlights</h2>

        <p>
          Featured creators,
          entrepreneurs,
          students,
          advocates,
          employers and caregivers
          from the Inclura community.
        </p>
      </div>

      {/* REELS SECTION */}
      <div style={cardStyle}>
        <h2>🎬 Inclura Reels</h2>

        <p>
          Accessibility tips,
          disability stories,
          creator content,
          job wins and
          community highlights.
        </p>
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
