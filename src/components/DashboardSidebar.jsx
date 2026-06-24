import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function DashboardSidebar() {
  const navigate = useNavigate();

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
        Inclura
      </h2>

      <div
        style={itemStyle}
        onClick={() => navigate("/profile")}
      >
        🏠 Dashboard
      </div>

      <div
        style={itemStyle}
        onClick={() => navigate("/notifications")}
      >
        🔔 Notifications
      </div>

      <div
        style={itemStyle}
        onClick={() => navigate("/messages")}
      >
        💬 Messages
      </div>

      <div
        style={itemStyle}
        onClick={() => navigate("/wallet")}
      >
        💰 Wallet
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
          navigate("/premium-dashboard")
        }
      >
        ⭐ Premium Dashboard
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
        🚪 Logout
      </div>
    </div>
  );
}

export default DashboardSidebar;
