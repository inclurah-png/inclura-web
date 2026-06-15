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
          {profile?.walletNaira ||
            0}
        </h2>
        <small>
          $
          {profile?.walletUSD ||
            0}
          {" | "}
          €
          {profile?.walletEUR ||
            0}
          {" | "}
          £
          {profile?.walletGBP ||
            0}
        </small>
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
