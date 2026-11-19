import {
  getVerificationMetadata,
} from "../config/verificationTypes";

import {
  migrateVerificationId,
} from "../config/verificationMigration";

function DashboardStats({ profile }) {
  const verificationMeta =
    profile?.verified
      ? getVerificationMetadata(
          migrateVerificationId(profile.badgeType)
        )
      : null;

  return (
    <section
      aria-label="Account activity and statistics"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))",
        gap: "12px",
        marginBottom: "24px",
      }}
    >
      <div style={card}>
        <div style={icon}>📝</div>
        <h3>Posts</h3>
        <strong>{profile?.postCount || 0}</strong>
      </div>

      <div style={card}>
        <div style={icon}>👥</div>
        <h3>Followers</h3>
        <strong>{profile?.followers?.length || 0}</strong>
      </div>

      <div style={card}>
        <div style={icon}>➡️</div>
        <h3>Following</h3>
        <strong>{profile?.following?.length || 0}</strong>
      </div>

      <div style={card}>
        <div style={icon}>💰</div>
        <h3>Wallet</h3>
        <strong>₦{profile?.walletBalance || 0}</strong>
      </div>

      <div style={card}>
        <div style={icon}>🛡️</div>
        <h3>Verification</h3>
        <strong style={{ fontSize: "16px" }}>
          {profile?.verified ? "Verified" : "Not Verified"}
        </strong>
        {verificationMeta && (
          <>
            <span style={detail}>Trust Level: {verificationMeta.trustLevel}</span>
            <span style={detail}>{verificationMeta.category}</span>
          </>
        )}
      </div>

      <div style={card}>
        <div style={icon}>🏷️</div>
        <h3>Role</h3>
        <strong style={{ fontSize: "16px" }}>{profile?.role || "User"}</strong>
      </div>

      <div style={card}>
        <div style={icon}>⭐</div>
        <h3>Creator Score</h3>
        <strong>{profile?.creatorScore || 0}</strong>
      </div>

      <div style={card}>
        <div style={icon}>📌</div>
        <h3>Saved Posts</h3>
        <strong>{profile?.savedPosts?.length || 0}</strong>
      </div>

      <div style={card}>
        <div style={icon}>📤</div>
        <h3>Cross-Posts</h3>
        <strong>{profile?.crossPostCount || 0}</strong>
      </div>

      <div style={card}>
        <div style={icon}>👥</div>
        <h3>Referrals</h3>
        <strong>{profile?.referralCount || 0}</strong>
      </div>

      <div style={card}>
        <div style={icon}>📈</div>
        <h3>XP</h3>
        <strong>{profile?.xp || 0}</strong>
      </div>

      <div style={card}>
        <div style={icon}>🌍</div>
        <h3>Languages</h3>
        <strong>{profile?.languagesTranslated || 0}</strong>
      </div>
    </section>
  );
}

const card = {
  background: "#1e293b",
  padding: "16px",
  borderRadius: "18px",
  color: "white",
  minWidth: 0,
  boxSizing: "border-box",
  border: "1px solid #334155",
};

const icon = {
  width: "38px",
  height: "38px",
  borderRadius: "12px",
  background: "#0f172a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "19px",
  marginBottom: "10px",
};

const detail = {
  display: "block",
  fontSize: "12px",
  color: "#94a3b8",
  marginTop: "5px",
};

export default DashboardStats;
