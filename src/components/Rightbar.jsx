import ProfileCard from "./ProfileCard";

function Rightbar() {
  return (
    <div
      style={{
        width: "300px",
        padding: "24px",
        borderLeft: "1px solid #1e293b",
        background: "#020617",
      }}
    >
      <ProfileCard />

      {/* Trending */}
      <div
        style={{
          background: "#0f172a",
          padding: "20px",
          borderRadius: "20px",
          marginBottom: "24px",
        }}
      >
        <h3
          style={{
            marginBottom: "16px",
          }}
        >
          Trending
        </h3>

        <p>#Accessibility</p>
        <p>#Inclusion</p>
        <p>#AI</p>
        <p>#Creators</p>
      </div>

      {/* Suggested Connections */}
      <div
        style={{
          background: "#0f172a",
          padding: "20px",
          borderRadius: "20px",
        }}
      >
        <h3
          style={{
            marginBottom: "16px",
          }}
        >
          Suggested Connections
        </h3>

        <p>👤 Jane Doe</p>
        <p>👤 Michael Smith</p>
        <p>👤 Sophia Lee</p>
      </div>
    </div>
  );
}

export default Rightbar;
