import { useEffect, useState } from "react";

import DashboardLayout from "../components/DashboardLayout";
import ProfileHeader from "../components/ProfileHeader";
import DashboardStats from "../components/DashboardStats";
import StoriesSection from "../components/StoriesSection";
import CreatePost from "../components/CreatePost";
import Feed from "../components/Feed";

import { auth, db } from "../firebase";

import {
  doc,
  getDoc,
} from "firebase/firestore";

function Profile() {
  const [profile, setProfile] =
    useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const user =
          auth.currentUser;

        if (!user) return;

        const snap =
          await getDoc(
            doc(
              db,
              "users",
              user.uid
            )
          );

if (snap.exists()) {
  const data =
    snap.data();

  if (
    data?.premiumExpiryDate &&
    data.premiumExpiryDate.toDate() <
      new Date()
  ) {
    await updateDoc(
      doc(
        db,
        "users",
        user.uid
      ),
      {
        premium: false,
        premiumActive: false,
        premiumTier: "",
      }
    );

    data.premium = false;
    data.premiumActive =
      false;
    data.premiumTier = "";
  }

  setProfile(data);
}
      } catch (error) {
        console.log(error);
      }
    }

    loadProfile();
  }, []);

  return (
    <DashboardLayout>
      <ProfileHeader
        profile={profile}
      />

      <DashboardStats
        profile={profile}
      />

      <StoriesSection />

      <CreatePost />

      <Feed />
    </DashboardLayout>
  );
}

export default Profile;
