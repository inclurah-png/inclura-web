function ProfileHeader({ profile }) {
  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: "24px",
        padding: "24px",
        marginBottom: "24px",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <img
          src={
            profile?.photoURL ||
            "https://via.placeholder.com/120"
          }
          alt="Profile"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "4px solid #38bdf8",
          }}
        />

        <div>
          <h2
            style={{
              margin: 0,
            }}
          >
            {profile?.fullName ||
              "Inclura User"}
          </h2>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "8px",
            }}
          >
            {profile?.bio ||
              "No bio added yet"}
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "12px",
            }}
          >
            <span style={tag}>
              🏷 {profile?.category ||
                "Member"}
            </span>

            <span style={tag}>
              🛡 {profile?.role ||
                "User"}
            </span>

            <span style={tag}>
              ⭐ XP:
              {profile?.xp || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const tag = {
  background: "#1e293b",
  padding: "8px 12px",
  borderRadius: "999px",
};

export default ProfileHeader;
