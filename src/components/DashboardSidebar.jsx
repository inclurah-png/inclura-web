import { useState } from "react";
import { useTranslation } from "react-i18next";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

function DashboardSidebar() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = auth.currentUser;
  

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
        🔖 Saved Posts
      </div>

      <div
        style={itemStyle}
        onClick={() => navigate("/search")}
      >
        🔍 Search
      </div>

      <div
        style={itemStyle}
        onClick={() => navigate("/edit-profile")}
      >
        ⚙ Edit Profile
      </div>

      <div
        style={itemStyle}
        onClick={() =>
          navigate("/verification-center")
        }
      >
        🔐 Verification Center
      </div>

      <div
        style={itemStyle}
        onClick={() =>
          navigate("/accessibility")
        }
      >
        ♿ Accessibility Hub
      </div>

      <div
        style={itemStyle}
        onClick={() =>
          navigate("/opportunities")
        }
      >
        💼 Opportunities Hub
      </div>

      <div
        style={itemStyle}
        onClick={() =>
          navigate("/care-gigs")
        }
      >
        🤝 Care-Gigs
      </div>

      <div
        style={itemStyle}
        onClick={() =>
          navigate("/mentor-hub")
        }
      >
        🎓 Mentor Hub
      </div>

      <div
        style={itemStyle}
        onClick={() =>
          navigate("/marketplace")
        }
      >
        🛒 Marketplace
      </div>

      <div
        style={itemStyle}
        onClick={() =>
          navigate("/reels-system")
        }
      >
        🎥 Reels
      </div>

      {isCreator && (
  <>
    <div
      style={itemStyle}
      onClick={() =>
        navigate("/creator-earnings")
      }
    >
      💵 Creator Earnings
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/creator-monetization")
      }
    >
      💵 Creator Monetization
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/creator-analytics")
      }
    >
      📈 Creator Analytics
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
      📢 Advertiser Dashboard
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/ad-manager")
      }
    >
      📢 Ad Manager
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
      🏢 Enterprise
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/enterprise-ads")
      }
    >
      🏢 Enterprise Ads
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/enterprise-campaigns")
      }
    >
      🏢 Enterprise Campaigns
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/enterprise-analytics")
      }
    >
      🏢 Enterprise Analytics
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
      📊 Platform Analytics
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/pricing-manager")
      }
    >
      💲 Pricing Manager
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/users-management")
      }
    >
      👥 Users Management
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/reports-violations")
      }
    >
      🚨 Reports & Violations
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/verification-requests")
      }
    >
      📋 Verification Requests
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/verification-manager")
      }
    >
      ✅ Verification Manager
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/wallet-monitoring")
      }
    >
      💰 Wallet Monitoring
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/ad-approval")
      }
    >
      📋 Ad Approval Queue
    </div>

    <div
      style={itemStyle}
      onClick={() =>
        navigate("/admin")
      }
    >
      👨‍💼 Admin Panel
    </div>
  </>
)}

      <div
        style={itemStyle}
        onClick={() =>
          navigate("/sos")
        }
      >
        🚨 SOS
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
