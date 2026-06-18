function PostCard({
name,
text,
verified,
badgeType,
}) {
const getBadge = () => {
if (!verified) return null;

switch (badgeType) {
  case "creator":
    return "🎥";

  case "organization":
    return "🏢";

  case "ngo":
    return "🤝";

  case "hospital":
    return "🏥";

  case "university":
    return "🎓";

  case "government":
    return "🏛";

  default:
    return "✅";
}

};

return (
<div
style={{
background: "#0f172a",
padding: "22px",
borderRadius: "20px",
marginBottom: "22px",
}}
>
<div
style={{
display: "flex",
alignItems: "center",
gap: "10px",
marginBottom: "12px",
}}
>
<h3
style={{
margin: 0,
}}
>
{name}
</h3>

    {verified && (
      <span
        style={{
          background: "#16a34a",
          color: "white",
          padding: "4px 10px",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: "700",
        }}
      >
        {getBadge()} Verified
      </span>
    )}
  </div>

  <p
    style={{
      color: "#cbd5e1",
      lineHeight: "1.7",
      marginBottom: "18px",
    }}
  >
    {text}
  </p>

  <div
    style={{
      display: "flex",
      gap: "14px",
    }}
  >
    <button style={btn}>
      ❤️ Like
    </button>

    <button style={btn}>
      💬 Comment
    </button>

    <button style={btn}>
      🔁 Share
    </button>
  </div>
</div>

);
}

const btn = {
background: "#1e293b",
border: "none",
color: "white",
padding: "10px 16px",
borderRadius: "12px",
cursor: "pointer",
};

export default PostCard;
