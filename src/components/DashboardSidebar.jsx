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
import Logo from "./Logo";
import Icon from "./Icon";

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

  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      alert(t("error"));
      setLoggingOut(false);
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
<div style={{ marginBottom: "24px", display: "flex", alignItems: "center", minWidth: 0 }}>
  <Logo />
</div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        aria-label={t("logout")}
        style={{
          ...itemStyle,
          width: "100%",
          border: "none",
          textAlign: "left",
          background: "#dc2626",
          marginTop: "20px",
          opacity: loggingOut ? 0.7 : 1,
          cursor: loggingOut ? "wait" : "pointer",
        }}
      >
        <><Icon name="logout" /> {loggingOut ? t("loading") : t("logout")}</>
      </button>

      <button
        type="button"
        aria-label={t("dashboard")}
        title={t("dashboard")}
        onClick={() => navigate("/profile")}
        style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}
      >
        <><Icon name="home" /> {t("dashboard")}</>
      </button>

      <button
        type="button"
        aria-label={t("notifications")}
        title={t("notifications")}
        onClick={() => navigate("/notifications")}
        style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}
      >
        <><Icon name="bell" /> {t("notifications")}</>
      </button>

      <button
        type="button"
        aria-label={t("messages")}
        title={t("messages")}
        onClick={() => navigate("/messages")}
        style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}
      >
        <><Icon name="message" /> {t("messages")}</>
      </button>

      <button
        type="button"
        aria-label={t("accountActivity")}
        title={t("accountActivity")}
        onClick={() => navigate("/wallet")}
        style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}
      >
        <><Icon name="link" /> {t("accountActivity")}</>
      </button>

      <button
        type="button"
        aria-label={t("socialConnections", { defaultValue: "Social Connections" })}
        title={t("socialConnections", { defaultValue: "Social Connections" })}
        onClick={() => navigate("/social-connections")}
        style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}
      >
        <><Icon name="link" /> {t("socialConnections", { defaultValue: "Social Connections" })}</>
      </button>

      <button
        type="button"
        aria-label={t("digitalServicesTitle")}
        title={t("digitalServicesTitle")}
        onClick={() => navigate("/digital-services")}
        style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}
      >
        <><Icon name="phone" /> {t("digitalServicesTitle")}</>
      </button>

      <button
        type="button"
        aria-label={t("savedPosts")}
        title={t("savedPosts")}
        onClick={() => navigate("/saved-posts")}
        style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}
      >
        <><Icon name="bookmark" /> {t("savedPosts")}</>
      </button>

      <button
        type="button"
        aria-label={t("search")}
        title={t("search")}
        onClick={() => navigate("/search")}
        style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}
      >
        <><Icon name="search" /> {t("search")}</>
      </button>

      <button
        type="button"
        aria-label={t("editProfile")}
        title={t("editProfile")}
        onClick={() => navigate("/edit-profile")}
        style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}
      >
        <><Icon name="settings" /> {t("editProfile")}</>
      </button>

      <button type="button" aria-label={t("verificationCenter")} title={t("verificationCenter")} onClick={() => navigate("/verification-center")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="lock" /> {t("verificationCenter")}</>
      </button>

      <button type="button" aria-label={t("accessibilityHub")} title={t("accessibilityHub")} onClick={() => navigate("/accessibility")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="accessibility" /> {t("accessibilityHub")}</>
      </button>

      <button type="button" aria-label={t("opportunitiesHub")} title={t("opportunitiesHub")} onClick={() => navigate("/opportunities")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="briefcase" /> {t("opportunitiesHub")}</>
      </button>

      <button type="button" aria-label={t("careGigs")} title={t("careGigs")} onClick={() => navigate("/care-gigs")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="handshake" /> {t("careGigs")}</>
      </button>

      <button type="button" aria-label={t("mentorHub")} title={t("mentorHub")} onClick={() => navigate("/mentor-hub")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="graduation" /> {t("mentorHub")}</>
      </button>

      <button type="button" aria-label={t("marketplace")} title={t("marketplace")} onClick={() => navigate("/marketplace")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="cart" /> {t("marketplace")}</>
      </button>

      <button type="button" aria-label={t("reels")} title={t("reels")} onClick={() => navigate("/reels-system")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="video" /> {t("reels")}</>
      </button>

      <button type="button" aria-label={t("creatorMonetization")} title={t("creatorMonetization")} onClick={() => navigate("/creator-monetization")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="sparkle" /> {t("creatorMonetization")}</>
      </button>



{isAdvertiser && (
  <>
    <button type="button" aria-label={t("advertiserDashboard")} title={t("advertiserDashboard")} onClick={() => navigate("/advertiser-dashboard")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="megaphone" /> {t("advertiserDashboard")}</>
      </button>

    <button type="button" aria-label={t("adManager")} title={t("adManager")} onClick={() => navigate("/ad-manager")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="megaphone" /> {t("adManager")}</>
      </button>
  </>
)}

{isEnterprise && (
  <>
    <button type="button" aria-label={t("enterprise")} title={t("enterprise")} onClick={() => navigate("/enterprise")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="building" /> {t("enterprise")}</>
      </button>

    <button type="button" aria-label={t("enterpriseAds")} title={t("enterpriseAds")} onClick={() => navigate("/enterprise-ads")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="building" /> {t("enterpriseAds")}</>
      </button>

    <button type="button" aria-label={t("enterpriseCampaigns")} title={t("enterpriseCampaigns")} onClick={() => navigate("/enterprise-campaigns")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="building" /> {t("enterpriseCampaigns")}</>
      </button>

    <button type="button" aria-label={t("enterpriseAnalytics")} title={t("enterpriseAnalytics")} onClick={() => navigate("/enterprise-analytics")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="chart" /> {t("enterpriseAnalytics")}</>
      </button>
  </>
)}
      
{isAdmin && (
  <>
    <button type="button" aria-label={t("creatorAnalytics")} title={t("creatorAnalytics")} onClick={() => navigate("/creator-analytics")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="chart" /> {t("creatorAnalytics")}</>
      </button>

    <button type="button" aria-label={t("platformAnalytics")} title={t("platformAnalytics")} onClick={() => navigate("/platform-analytics")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="chart" /> {t("platformAnalytics")}</>
      </button>

    <button type="button" aria-label={t("pricingManager")} title={t("pricingManager")} onClick={() => navigate("/pricing-manager")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="dollar" /> {t("pricingManager")}</>
      </button>

    <button type="button" aria-label={t("usersManagement")} title={t("usersManagement")} onClick={() => navigate("/users-management")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="users" /> {t("usersManagement")}</>
      </button>

    <button type="button" aria-label={t("reportsViolations")} title={t("reportsViolations")} onClick={() => navigate("/reports-violations")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="alert" /> {t("reportsViolations")}</>
      </button>

    <button type="button" aria-label={t("verificationRequests")} title={t("verificationRequests")} onClick={() => navigate("/verification-requests")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="clipboard" /> {t("verificationRequests")}</>
      </button>

    <button type="button" aria-label={t("verificationManager")} title={t("verificationManager")} onClick={() => navigate("/verification-manager")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="check" /> {t("verificationManager")}</>
      </button>

    <button type="button" aria-label={t("adApprovalQueue")} title={t("adApprovalQueue")} onClick={() => navigate("/ad-approval")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="clipboard" /> {t("adApprovalQueue")}</>
      </button>

    <button type="button" aria-label={t("adminPanel")} title={t("adminPanel")} onClick={() => navigate("/admin")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="admin" /> {t("adminPanel")}</>
      </button>
  </>
)}

      <button type="button" aria-label={t("sos")} title={t("sos")} onClick={() => navigate("/sos")} style={{ ...itemStyle, width: "100%", border: "none", textAlign: "left", font: "inherit" }}>
        <><Icon name="sos" /> {t("sos")}</>
      </button>

    </div>
  );
}

export default DashboardSidebar;
