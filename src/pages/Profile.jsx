import CreatePost from "../components/CreatePost";
import StoriesSection from "../components/StoriesSection";
import DashboardLayout from "../components/DashboardLayout";
import DashboardStats from "../components/DashboardStats";

function Profile() {
  const profile = {
    postCount: 0,
    followers: [],
    following: [],
    walletBalance: 0,
  };

  return (
    <DashboardLayout>
      {/* Profile Header */}
      <div
        style={{
          background: "#0f172a",
          color: "white",
          padding: "24px",
          borderRadius: "20px",
          marginBottom: "20px",
        }}
      >
        <h1>👤 Adebamiji Adedokun</h1>

        <p>@adedokun</p>

        <p>Creator</p>

        <p>Lagos, Nigeria</p>

        <button
          style={{
            padding: "12px 18px",
            border: "none",
            borderRadius: "12px",
            background: "#38bdf8",
            color: "white",
            cursor: "pointer",
          }}
        >
          Edit Profile
        </button>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats profile={profile} />

      {/* Stories */}
<StoriesSection />

<CreatePost />

      {/* Create Post */}
      <div
        style={{
          background: "#0f172a",
          color: "white",
          padding: "20px",
          borderRadius: "20px",
          marginBottom: "20px",
        }}
      >
        ✍ Create Post
      </div>

      {/* Feed */}
      <div
        style={{
          background: "#0f172a",
          color: "white",
          padding: "20px",
          borderRadius: "20px",
          marginBottom: "20px",
        }}
      >
        📰 Feed
      </div>

      {/* Accessibility Hub */}
      <div
        style={{
          background: "#0f172a",
          color: "white",
          padding: "20px",
          borderRadius: "20px",
          marginBottom: "20px",
        }}
      >
        ♿ Accessibility Hub
      </div>

      {/* Opportunities */}
      <div
        style={{
          background: "#0f172a",
          color: "white",
          padding: "20px",
          borderRadius: "20px",
          marginBottom: "20px",
        }}
      >
        💼 Opportunities Hub
      </div>

      {/* Mentorship */}
      <div
        style={{
          background: "#0f172a",
          color: "white",
          padding: "20px",
          borderRadius: "20px",
          marginBottom: "20px",
        }}
      >
        🎓 Mentorship Hub
      </div>

      {/* Marketplace */}
      <div
        style={{
          background: "#0f172a",
          color: "white",
          padding: "20px",
          borderRadius: "20px",
          marginBottom: "20px",
        }}
      >
        🛒 Marketplace
      </div>

      {/* SOS */}
      <div
        style={{
          background: "#7f1d1d",
          color: "white",
          padding: "20px",
          borderRadius: "20px",
          marginBottom: "20px",
        }}
      >
        🚨 SOS Emergency
      </div>

      {/* Community */}
      <div
        style={{
          background: "#0f172a",
          color: "white",
          padding: "20px",
          borderRadius: "20px",
          marginBottom: "20px",
        }}
      >
        🌍 Community Highlights
      </div>

      {/* Reels */}
      <div
        style={{
          background: "#0f172a",
          color: "white",
          padding: "20px",
          borderRadius: "20px",
        }}
      >
        🎥 Reels
      </div>
    </DashboardLayout>
  );
}

export default Profile;
