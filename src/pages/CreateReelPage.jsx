import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import CreatePost from "../components/CreatePost";

function CreateReelPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <main style={{ maxWidth: "850px", margin: "0 auto", color: "white" }}>
        <button
          type="button"
          onClick={() => navigate("/reels-system")}
          style={{
            background: "#1e293b",
            color: "white",
            border: "1px solid #475569",
            borderRadius: "10px",
            padding: "10px 14px",
            marginBottom: "18px",
            cursor: "pointer",
          }}
        >
          ← Back to Reels
        </button>
        <h1 style={{ marginBottom: "8px" }}>🎬 Create a Reel</h1>
        <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
          Upload a video, add a description, and choose the accessibility features available in your video.
        </p>
        <CreatePost />
      </main>
    </DashboardLayout>
  );
}

export default CreateReelPage;
