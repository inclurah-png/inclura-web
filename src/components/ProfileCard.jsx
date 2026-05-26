function ProfileCard() {
  return (
    <div
      style={{
        background: "#0f172a",
        padding: "22px",
        borderRadius: "22px",
        marginBottom: "24px",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "#38bdf8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "18px",
        }}
      >
        I
      </div>

      <h2
        style={{
          marginBottom: "8px",
        }}
      >
        Inclura User
      </h2>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "18px",
          lineHeight: "1.6",
        }}
      >
        Accessibility-first creator & community member.
      </p>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "18px",
        }}
      >
        <div>
          <h3>128</h3>
          <p style={small}>Followers</p>
        </div>

        <div>
          <h3>54</h3>
          <p style={small}>Posts</p>
        </div>

        <div>
          <h3>12</h3>
          <p style={small}>Badges</p>
        </div>
      </div>

      {/* Wallet */}
      <div
        style={{
          background: "#1e293b",
          padding: "14px",
          borderRadius: "16px",
        }}
      >
        💳 Wallet Balance: $240
      </div>
    </div>
  );
}

const small = {
  color: "#94a3b8",
  fontSize: "13px",
};

export default ProfileCard;
