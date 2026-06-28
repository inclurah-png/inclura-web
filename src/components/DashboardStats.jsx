function DashboardStats({ profile }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(180px,1fr))",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      <div style={card}>
        <h3>📝 Posts</h3>
        <h2>
          {profile?.postCount || 0}
        </h2>
      </div>

      <div style={card}>
        <h3>👥 Followers</h3>
        <h2>
          {profile?.followers
            ?.length || 0}
        </h2>
      </div>

      <div style={card}>
        <h3>➡ Following</h3>
        <h2>
          {profile?.following
            ?.length || 0}
        </h2>
      </div>

      <div style={card}>
        <h3>💰 Wallet</h3>
        <h2>
          ₦
          {profile?.walletBalance ||
            0}
        </h2>
      </div>

      <div style={card}>
        <h3>✔ Verified</h3>
        <h2>
          {profile?.verified
            ? "Yes"
            : "No"}
        </h2>
      </div>

      <div style={card}>
        <h3>🏷 Role</h3>
        <h2>
          {profile?.role ||
            "User"}
        </h2>
      </div>
      <div style={card}>
  <h3>⭐ Creator Score</h3>
  <h2>
    {profile?.creatorScore || 0}
  </h2>
</div>

<div style={card}>
  <h3>📌 Saved Posts</h3>
  <h2>
    {profile?.savedPosts?.length || 0}
  </h2>
</div>

<div style={card}>
  <h3>📤 Cross-Posts</h3>
  <h2>
    {profile?.crossPostCount || 0}
  </h2>
</div>

<div style={card}>
  <h3>👥 Referrals</h3>
  <h2>
    {profile?.referralCount || 0}
  </h2>
</div>

<div style={card}>
  <h3>📈 XP</h3>
  <h2>
    {profile?.xp || 0}
  </h2>
</div>

<div style={card}>
  <h3>🌍 Languages</h3>
  <h2>
    {profile?.languagesTranslated || 0}
  </h2>
</div>
</div>
);
}

const card = {
  background: "#1e293b",
  padding: "18px",
  borderRadius: "18px",
  color: "white",
};

export default DashboardStats;
