import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../components/DashboardLayout";
import CreatePost from "../components/CreatePost";

function CreateReelPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          ← {t("backToReels")}
        </button>
        <h1 style={{ marginBottom: "8px" }}>🎬 {t("createReel")}</h1>
        <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
          {t("createReelInstructions")}
        </p>
        <CreatePost />
      </main>
    </DashboardLayout>
  );
}

export default CreateReelPage;
