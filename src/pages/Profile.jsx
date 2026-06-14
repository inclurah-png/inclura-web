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

console.log("PROFILE LOADED", profile);
  return (
  <div
    style={{
      background: "red",
      color: "white",
      minHeight: "100vh",
      padding: "40px",
      fontSize: "30px",
    }}
  >
    PROFILE PAGE WORKING
  </div>
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
