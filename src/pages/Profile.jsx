import { useEffect, useRef, useState } from "react";

import { sendNotification } from "../utils/notificationHelper";
import DashboardLayout from "../components/DashboardLayout";
import ProfileHeader from "../components/ProfileHeader";
import DashboardStats from "../components/DashboardStats";
import StoriesSection from "../components/StoriesSection";
import CommunityHighlights from "../components/CommunityHighlights";
import CreatePost from "../components/CreatePost";
import Feed from "../components/Feed";
import Rightbar from "../components/Rightbar";

import {
  getVerificationBadge,
  getPremiumBadge,
  getVerificationMetadata,
} from "../config/verificationTypes";

import {
  migrateVerificationId,
} from "../config/verificationMigration";

import { auth, db } from "../firebase";

import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const premiumNoticeHandled = useRef(null);
  const premiumExpiryHandled = useRef(null);
  const memberDirectorySyncKey = useRef("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return undefined;

    const userRef = doc(db, "users", user.uid);
    const postsQuery = query(
      collection(db, "posts"),
      where("userId", "==", user.uid)
    );

    const stopProfile = onSnapshot(
      userRef,
      async (snapshot) => {
        if (!snapshot.exists()) {
          setProfile({});
          return;
        }

        const data = snapshot.data() || {};
        setProfile(data);

        // Publish only the approved public profile fields used for discovery.
        // Private email, phone and accessibility preferences are never copied.
        const directoryProfile = {
          uid: user.uid,
          fullName: data.fullName || data.name || user.displayName || "",
          photoURL: data.profilePhoto || data.photoURL || user.photoURL || "",
          location: typeof data.location === "string" ? data.location : "",
          category: typeof data.category === "string" ? data.category : "",
          accountType: typeof data.accountType === "string" ? data.accountType : "individual",
          bio: typeof data.bio === "string" ? data.bio : "",
        };
        const directoryKey = JSON.stringify(directoryProfile);
        if (directoryKey !== memberDirectorySyncKey.current) {
          memberDirectorySyncKey.current = directoryKey;
          setDoc(doc(db, "memberDirectory", user.uid), {
            ...directoryProfile,
            updatedAt: serverTimestamp(),
          }, { merge: true }).catch((error) => {
            memberDirectorySyncKey.current = "";
            console.warn("Public member directory sync failed:", error);
          });
        }

        const expiryValue = data.premiumExpiryDate;
        const expiryDate = expiryValue && typeof expiryValue.toDate === "function"
          ? expiryValue.toDate()
          : expiryValue
            ? new Date(expiryValue)
            : null;

        if (!expiryDate || Number.isNaN(expiryDate.getTime())) return;

        const expiryKey = expiryDate.getTime();
        const daysLeft = Math.ceil(
          (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        if (
          daysLeft <= 7 &&
          daysLeft > 0 &&
          premiumNoticeHandled.current !== expiryKey
        ) {
          premiumNoticeHandled.current = expiryKey;
          try {
            await sendNotification({
              receiverId: user.uid,
              senderId: "system",
              type: "premium",
              text: "Your premium subscription expires in " + daysLeft + " days",
            });
          } catch (error) {
            console.warn("Premium expiry notification failed:", error);
          }
        }

        if (
          expiryDate < new Date() &&
          data.premium === true &&
          premiumExpiryHandled.current !== expiryKey
        ) {
          premiumExpiryHandled.current = expiryKey;
          try {
            await updateDoc(userRef, {
              premium: false,
              premiumActive: false,
              premiumTier: "",
            });
          } catch (error) {
            console.warn("Premium expiry status update requires authorized processing:", error);
          }
        }
      },
      (error) => {
        console.error("Live profile loading failed:", error);
      }
    );

    const stopPosts = onSnapshot(
      postsQuery,
      (snapshot) => setPostCount(snapshot.size),
      (error) => {
        console.error("Live post count loading failed:", error);
      }
    );

    return () => {
      stopProfile();
      stopPosts();
    };
  }, []);

  return (
    <DashboardLayout>
      <ProfileHeader profile={profile} />

      <DashboardStats profile={profile ? { ...profile, postCount } : null} />

      <StoriesSection />

      <CommunityHighlights />

      <Rightbar />

      <CreatePost />

      <Feed profile={profile} />
    </DashboardLayout>
  );
}

export default Profile;
