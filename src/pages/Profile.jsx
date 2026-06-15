import DashboardLayout from "../components/DashboardLayout";
import ProfileHeader from "../components/ProfileHeader";
import DashboardStats from "../components/DashboardStats";
import StoriesSection from "../components/StoriesSection";
import CreatePost from "../components/CreatePost";
import Feed from "../components/Feed";

const demoProfile = {
  fullName: "Inclura User",
  bio: "Building an inclusive future.",
  category: "Member",
  role: "User",

  postCount: 0,

  followers: [],
  following: [],

  walletNaira: 0,
  walletUSD: 0,
  walletEUR: 0,
  walletGBP: 0,

  xp: 0,
};

function Profile() {
  return (
    <DashboardLayout>
      <ProfileHeader
        profile={demoProfile}
      />

      <DashboardStats
        profile={demoProfile}
      />

      <StoriesSection />

      <CreatePost />

      <Feed />
    </DashboardLayout>
  );
}

export default Profile;
