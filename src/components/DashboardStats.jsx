import { useTranslation } from "react-i18next";
import {
  getVerificationMetadata,
} from "../config/verificationTypes";

import {
  migrateVerificationId,
} from "../config/verificationMigration";

function DashboardStats({ profile }) {
  const { t } = useTranslation();
  const verificationMeta =
    profile?.verified
      ? getVerificationMetadata(
          migrateVerificationId(profile.badgeType)
        )
      : null;

  const cards = [
    { id: "posts", icon: "📝", label: t("statsPosts"), value: profile?.postCount || 0 },
    { id: "followers", icon: "👥", label: t("statsFollowers"), value: profile?.followers?.length || 0 },
    { id: "following", icon: "➡️", label: t("statsFollowing"), value: profile?.following?.length || 0 },
    { id: "wallet", icon: "💰", label: t("statsWallet"), value: `₦${profile?.walletBalance || 0}` },
    { id: "verification", icon: "🛡️", label: t("statsVerification"), value: profile?.verified ? t("statsVerified") : t("statsNotVerified") },
    { id: "role", icon: "🏷️", label: t("statsRole"), value: profile?.role || profile?.accountType || t("statsUser") },
    { id: "creator-score", icon: "⭐", label: t("statsCreatorScore"), value: profile?.creatorEconomy?.creatorScore ?? profile?.creatorScore ?? 0 },
    { id: "saved-posts", icon: "📌", label: t("statsSavedPosts"), value: profile?.savedPosts?.length || 0 },
    { id: "cross-posts", icon: "📤", label: t("statsCrossPosts"), value: profile?.creatorEconomy?.monthlyCrossPosts ?? profile?.crossPostCount ?? 0 },
    { id: "referrals", icon: "👥", label: t("statsReferrals"), value: profile?.referralsTotal ?? profile?.referralCount ?? 0 },
    { id: "xp", icon: "📈", label: t("statsXP"), value: profile?.creatorEconomy?.xp ?? profile?.xp ?? 0 },
    { id: "languages", icon: "🌍", label: t("statsLanguages"), value: profile?.languagesTranslated ?? (Array.isArray(profile?.languages) ? profile.languages.length : 0) },
  ];

  return (
    <section
      aria-label={t("dashboardStatsLabel")}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))",
        gap: "12px",
        marginBottom: "24px",
      }}
    >
      {cards.map((item) => (
        <article
          key={item.id}
          aria-labelledby={`dashboard-stat-${item.id}`}
          style={card}
        >
          <span aria-hidden="true" style={iconStyle}>{item.icon}</span>
          <h3 id={`dashboard-stat-${item.id}`} style={heading}>{item.label}</h3>
          <strong
            aria-label={`${item.label}: ${item.value}`}
            style={item.id === "verification" || item.id === "role" ? valueText : value}
          >
            {item.value}
          </strong>
          {item.id === "verification" && verificationMeta && (
            <div aria-label={`${t("statsTrustLevel")}: ${verificationMeta.trustLevel}`}>
              <span style={detail}>
                {t("statsTrustLevel")}: {verificationMeta.trustLevel}
              </span>
              <span style={detail}>{verificationMeta.category}</span>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}

const card = {
  background: "#1e293b",
  padding: "16px",
  borderRadius: "18px",
  color: "white",
  minWidth: 0,
  boxSizing: "border-box",
  border: "1px solid #334155",
};

const iconStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "12px",
  background: "#0f172a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "19px",
  marginBottom: "10px",
};

const heading = {
  margin: "0 0 8px",
  fontSize: "15px",
  lineHeight: 1.4,
};

const value = {
  display: "block",
  fontSize: "22px",
  lineHeight: 1.35,
  overflowWrap: "anywhere",
};

const valueText = {
  ...value,
  fontSize: "16px",
};

const detail = {
  display: "block",
  fontSize: "12px",
  color: "#cbd5e1",
  marginTop: "5px",
};

export default DashboardStats;
