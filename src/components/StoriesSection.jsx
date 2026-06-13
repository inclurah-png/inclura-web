import { useState } from "react";

function StoriesSection() {
const stories = [
{ name: "You" },
{ name: "Ade" },
{ name: "Tolu" },
{ name: "Mary" },
{ name: "David" },
{ name: "Grace" },
{ name: "Amina" },
{ name: "John" },
{ name: "Sarah" },
{ name: "Emeka" },
{ name: "Bola" },
{ name: "Femi" },
{ name: "Ngozi" },
{ name: "Paul" },
];

return (
<div
style={{
background: "#1e293b",
padding: "18px",
borderRadius: "18px",
marginBottom: "16px",
}}
>
<h2>📸 Stories</h2>

  <div
    style={{
      display: "flex",
      gap: "12px",
      overflowX: "auto",
      paddingTop: "10px",
    }}
  >
    {stories.map((story, index) => (
      <div
        key={index}
        style={{
          minWidth: "90px",
          height: "150px",
          borderRadius: "16px",
          background: "#2563eb",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          flexDirection: "column",
          paddingBottom: "12px",
          color: "white",
          fontWeight: "600",
        }}
      >
        {story.name}
      </div>
    ))}
  </div>
</div>

);
}

export default StoriesSection;
