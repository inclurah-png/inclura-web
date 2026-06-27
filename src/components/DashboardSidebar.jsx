import {
  useState,
  useEffect,
} from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

function DashboardSidebar() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  

const [role, setRole] = useState("");

useEffect(() => {
  async function loadRole() {
    if (!user) return;

    const snap = await getDoc(
      doc(db, "users", user.uid)
    );

    if (snap.exists()) {
      setRole(snap.data().role || "creator");
    }
  }

  loadRole();
}, [user]);
const isCreator = role === "creator";
const isAdvertiser = role === "advertiser";
const isEnterprise = role === "enterprise";
const isAdmin = role === "admin";

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  const itemStyle = {
    padding: "14px",
    borderRadius: "12px",
    cursor: "pointer",
    marginBottom: "10px",
    background: "#1e293b",
    color: "white",
    fontWeight: "600",
    transition: "0.2s",
  };

  return (
    <div
      style={{
        width: "260px",
        background: "#0f172a",
        padding: "20px",
        borderRadius: "20px",
        overflowY: "auto",
        maxHeight: "95vh",
        flexShrink: 0,
      }}
    >
<h2
  style={{
    marginBottom: "24px",
    color: "white",
  }}
>
  {t("appName")}
</h2>

      <div
        style={itemStyle}
        onClick={() => navigate("/profile")}
      >
        🏠 {t("dashboard")}
      </div>

      <div
        style={itemStyle}
        onClick={() => navigate("/notifications")}
      >
        🔔 {t("notifications")}
      </div>

      <div
        style={itemStyle}
        onClick={() => navigate("/messages")}
      >
        💬 {t("messages")}
      </div>

      <div
        style={itemStyle}
        onClick={() => navigate("/wallet")}
      >
        💰 {t("wallet")}
      </div>

      <div
        style={itemStyle}
        onClick={() => navigate("/saved-posts")}
      >
        🔖 {t("savedPosts")}
      </div>

      <div
        style={itemStyle}
        onClick={() => navigate("/search")}
      >
        🔍 {t("search")}
      </div>

      <div
        style={itemStyle}
        onClick={() => navigate("/edit-profile")}
      >
        ⚙ {t("editProfile")}
      </div>

      <div
        style={itemStyle}
        onClick={() =>
          navigate("/verification-center")
        }
      >
        🔐 {t("verificationCenter")}
      </div>

      <div
        style={itemStyle}
        onClick={() =>
          navigate("/accessibility")
        }
      >
        ♿ {t("accessibilityHub")}
      </div>

      <div
        style={itemStyle}
        onClick={() =>
          navigate("/opportunities")
        }
      >
        💼 {t("opportunitiesHub")}
      </div>

      <div
        style={itemStyle}
        onClick={() =>
          navigate("/care-gigs")
        }
      >
        🤝 {t("careGigs")}
      </div>

      <div
        style={itemStyle}
        onClick={() =>
          navigate("/mentor-hub")
        }
      >
        🎓 {t("mentorHub")}
      </div>

      <div
        style={itemStyle}
        onClick={() =>
          navigate("/marketplace")
        }
      >
        🛒 {t("marketplace")}
      </div>

      <div
        style={itemStyle}
        onClick={() =>
          navigate("/reels-system")
        }
      >
        🎥 {t("reels")}
      </div>

      {isCreator && (
  <>
    <div
      style={itemStyle}
      onClick={() =>
        navigate("/creator-earnings")
      }
    >
      💵 {t("creatorEarnings")}
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/creator-monetization")
      }
    >
      💵 {t("creatorMonetization")}
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/creator-analytics")
      }
    >
    📈 {t("creatorAnalytics")}
    </div>
  </>
)}

{isAdvertiser && (
  <>
    <div
      style={itemStyle}
      onClick={() =>
        navigate("/advertiser-dashboard")
      }
    >
      📢 {t("advertiserDashboard")}
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/ad-manager")
      }
    >
      📢 {t("adManager")}
    </div>
  </>
)}

{isEnterprise && (
  <>
    <div
      style={itemStyle}
      onClick={() =>
        navigate("/enterprise")
      }
    >
      🏢 {t("enterprise")}
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/enterprise-ads")
      }
    >
      🏢 {t("enterpriseAds")}
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/enterprise-campaigns")
      }
    >
      🏢 {t("enterpriseCampaigns")}
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/enterprise-analytics")
      }
    >
      🏢 {t("enterpriseAnalytics")}
    </div>
  </>
)}
      
{isAdmin && (
  <>
    <div
      style={itemStyle}
      onClick={() =>
        navigate("/platform-analytics")
      }
    >
      📊 {t("platformAnalytics")}
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/pricing-manager")
      }
    >
      💲 {t("pricingManager")}
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/users-management")
      }
    >
      👥 {t("usersManagement")}
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/reports-violations")
      }
    >
      🚨 {t("reportsViolations")}
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/verification-requests")
      }
    >
      📋 {t("verificationRequests")}
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/verification-manager")
      }
    >
      ✅ {t("verificationManager")}
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/wallet-monitoring")
      }
    >
      💰 {t("walletMonitoring")}
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/ad-approval")
      }
    >
      📋 {t("adApprovalQueue")}
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/admin")
      }
    >
      👨‍💼 {t("adminPanel")}
    </div>
  </>
)}

      <div
        style={itemStyle}
        onClick={() =>
          navigate("/sos")
        }
      >
        🚨 {t("sos")}
      </div>

      <div
        onClick={handleLogout}
        style={{
          ...itemStyle,
          background: "#dc2626",
          marginTop: "20px",
        }}
      >
        🚪 {t("logout")}
      </div>
    </div>
  );
}

export default DashboardSidebar;
