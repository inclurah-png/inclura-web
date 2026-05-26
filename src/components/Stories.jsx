import Avatar from "./Avatar";

function Stories() {
const stories = [
"Sarah",
"David",
"Michael",
"Sophia",
"Alex",
"Emma",
"Daniel",
"Grace",
"James",
"Olivia",
"Ethan",
"Ava",
"Noah",
"Mia",
];

return (
<div
style={{
display: "flex",
gap: "14px",
overflowX: "auto",
paddingBottom: "10px",
marginBottom: "20px",
scrollbarWidth: "none",
}}
>
{stories.map((name) => (
<div
key={name}
style={{
minWidth: "84px",
height: "120px",
borderRadius: "22px",
background:
"linear-gradient(180deg, #38bdf8 0%, #1e293b 100%)",
padding: "10px",
display: "flex",
flexDirection: "column",
justifyContent: "space-between",
boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
flexShrink: 0,
}}
> <Avatar name={name} />

'''
      <div
        style={{
          fontSize: "13px",
          fontWeight: "600",
          color: "white",
        }}
      >
        🧑 {name}
      </div>
    </div>
  ))}
</div>

);
}

export default Stories;
