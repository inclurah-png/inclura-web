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
      <StatCard
        title="📝 Posts"
        value={profile.postCount || 0}
      />

      <StatCard
        title="👥 Followers"
        value={
          profile.followers?.length || 0
        }
      />

      <StatCard
        title="➡ Following"
        value={
          profile.following?.length || 0
        }
      />

      <StatCard
        title="🏆 XP"
        value={profile.xp || 0}
      />
    </div>
  );
}

function StatCard({
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "20px",
        borderRadius: "18px",
      }}
    >
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}

export default DashboardStats;
