function ProfileHeader({ profile }) {
const getBadge = () => {
if (!profile?.verified) return null;

switch (profile?.badgeType) {
  case "creator":
    return "🎥 Verified Creator";

  case "organization":
    return "🏢 Verified Organization";

  case "ngo":
    return "🤝 Verified NGO";

  case "hospital":
    return "🏥 Verified Hospital";

  case "university":
    return "🎓 Verified University";

  case "government":
    return "🏛 Verified Government";

  default:
    return "✅ Verified User";
}

};

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
border:
"4px solid #38bdf8",
}}
/>

    <div>
      <h2>
        {profile?.fullName ||
          "Inclura User"}
      </h2>

      {profile?.verified && (
        <div
          style={{
            display: "inline-block",
            background:
              "#16a34a",
            color: "white",
            padding:
              "6px 12px",
            borderRadius:
              "999px",
            fontSize:
              "13px",
            fontWeight:
              "700",
            marginBottom:
              "10px",
          }}
        >
          {getBadge()}
        </div>
      )}

      <p
        style={{
          color: "#94a3b8",
        }}
      >
        {profile?.bio ||
          "No bio yet"}
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "10px",
        }}
      >
        <span style={tag}>
          🏷️
          {profile?.category ||
            "Member"}
        </span>

        <span style={tag}>
          📍
          {profile?.location ||
            "Unknown"}
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
