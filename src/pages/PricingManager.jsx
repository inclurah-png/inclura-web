import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

function PricingManager() {
  const [pricing, setPricing] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadPricing();
  }, []);

  async function loadPricing() {
    try {
      const snap = await getDoc(
        doc(
          db,
          "pricing",
          "main"
        )
      );

      if (snap.exists()) {
        setPricing(snap.data());
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  async function savePricing() {
    try {
      setSaving(true);

      await updateDoc(
        doc(
          db,
          "pricing",
          "main"
        ),
        pricing
      );

      alert(
        "Pricing updated successfully"
      );
    } catch (error) {
      alert(error.message);
    }

    setSaving(false);
  }

  function updatePrice(
    key,
    value
  ) {
    setPricing((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        price: Number(value),
      },
    }));
  }
  function updateEnabled(
  key,
  enabled
) {
  setPricing((prev) => ({
    ...prev,
    [key]: {
      ...prev[key],
      enabled,
    },
  }));
}
  if (loading) {
    return (
      <DashboardLayout>
        <div
          style={{
            color: "white",
            padding: "40px",
          }}
        >
          Loading pricing...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div
        style={{
          color: "white",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <h1>
            💲 Inclura Pricing Manager
          </h1>

          <button
            onClick={savePricing}
            disabled={saving}
            style={{
              background:
                "#38bdf8",
              color: "white",
              border: "none",
              padding:
                "12px 20px",
              borderRadius:
                "12px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            {saving
              ? "Saving..."
              : "Save Pricing"}
          </button>
        </div>

        <Section title="📢 Advertising">

          <EditableCard
  title="Basic Banner Ad"
  value={
    pricing.basicBannerAd?.price || 0
  }
  enabled={
    pricing.basicBannerAd?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "basicBannerAd",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "basicBannerAd",
      !pricing.basicBannerAd?.enabled
    )
  }
/>

<EditableCard
  title="Premium Banner Ad"
  value={
    pricing.premiumBannerAd?.price || 0
  }
  enabled={
    pricing.premiumBannerAd?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "premiumBannerAd",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "premiumBannerAd",
      !pricing.premiumBannerAd?.enabled
    )
  }
/>

          <EditableCard
  title="Video Advertisement"
  value={
    pricing.videoAdvertisement?.price || 0
  }
  enabled={
    pricing.videoAdvertisement?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "videoAdvertisement",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "videoAdvertisement",
      !pricing.videoAdvertisement?.enabled
    )
  }
/>

  <EditableCard
  title="Sponsored Post"
  value={
    pricing.SponsoredPost?.price || 0
  }
  enabled={
    pricing.SponsoredPost?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "SponsoredPost",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "SponsoredPost",
      !pricing.SponsoredPost?.enabled
    )
  }
/>

        </Section>
        <Section title="📢 Advertising">

          <EditableCard
  title="Sponsored Reel"
  value={
    pricing.SponsoredReel?.price || 0
  }
  enabled={
    pricing.SponsoredReel?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "SponsoredReel",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "SponsoredReel",
      !pricing.SponsoredReel?.enabled
    )
  }
/>

          <EditableCard
  title="Country Targeting Fee"
  value={
    pricing.CountryTargetingFee?.price || 0
  }
  enabled={
    pricing.CountryTargetingFee?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "CountryTargetingFee",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "CountryTargetingFee",
      !pricing.CountryTargetingFee?.enabled
    )
  }
/>

          <EditableCard
  title="State Targeting Fee"
  value={
    pricing.StateTargetingFee?.price || 0
  }
  enabled={
    pricing.StateTargetingFee?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "StateTargetingFee",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "StateTargetingFee",
      !pricing.StateTargetingFee?.enabled
    )
  }
/>

          <EditableCard
  title="City Targeting Fee"
  value={
    pricing.CityTargetingFee?.price || 0
  }
  enabled={
    pricing.CityTargetingFee?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "CityTargetingFee",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "CityTargetingFee",
      !pricing.CityTargetingFee?.enabled
    )
  }
/>

<EditableCard
  title="Accessibility Audience Fee"
  value={
    pricing.AccessibilityAudienceFee?.price || 0
  }
  enabled={
    pricing.AccessibilityAudienceFee?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "AccessibilityAudienceFee",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "AccessibilityAudienceFee",
      !pricing.AccessibilityAudienceFee?.enabled
    )
  }
/>

        </Section>

        <Section title="🎥 Reels Economy">

          <EditableCard
  title="Reel Boost"
  value={
    pricing.ReelBoost?.price || 0
  }
  enabled={
    pricing.ReelBoost?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "ReelBoost",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "ReelBoost",
      !pricing.ReelBoost?.enabled
    )
  }
/>
          <EditableCard
  title="Featured Reel"
  value={
    pricing.FeaturedReel?.price || 0
  }
  enabled={
    pricing.FeaturedReel?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "FeaturedReel",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "FeaturedReel",
      !pricing.FeaturedReel?.enabled
    )
  }
/>
          <EditableCard
  title="Trending Placement"
  value={
    pricing.TrendingPlacement?.price || 0
  }
  enabled={
    pricing.TrendingPlacement?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "TrendingPlacement",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "TrendingPlacement",
      !pricing.TrendingPlacement?.enabled
    )
  }
/>

          <EditableCard
  title="Sponsored Reel Placement"
  value={
    pricing.SponsoredReelPlacement?.price || 0
  }
  enabled={
    pricing.SponsoredReelPlacement?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "SponsoredReelPlacement",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "SponsoredReelPlacement",
      !pricing.SponsoredReelPlacement?.enabled
    )
  }
/>

        </Section>

        <Section title="💵 Creator Economy">

          <EditableCard
  title="Creator Verification"
  value={
    pricing.CreatorVerification?.price || 0
  }
  enabled={
    pricing.CreatorVerification?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "CreatorVerification",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "CreatorVerification",
      !pricing.CreatorVerification?.enabled
    )
  }
/>

          <EditableCard
  title="Creator Subscription"
  value={
    pricing.CreatorSubscription?.price || 0
  }
  enabled={
    pricing.CreatorSubscription?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "CreatorSubscription",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "CreatorSubscription",
      !pricing.CreatorSubscription?.enabled
    )
  }
/>

          <EditableCard
  title="Sponsored Content Fee"
  value={
    pricing.SponsoredContentFee?.price || 0
  }
  enabled={
    pricing.SponsoredContentFee?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "SponsoredContentFee",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "SponsoredContentFee",
      !pricing.SponsoredContentFee?.enabled
    )
  }
/>

 <EditableCard
  title="Creator Analytics Pro"
  value={
    pricing.CreatorAnalyticsPro?.price || 0
  }
  enabled={
    pricing.CreatorAnalyticsPro?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "CreatorAnalyticsPro",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "CreatorAnalyticsPro",
      !pricing.CreatorAnalyticsPro?.enabled
    )
  }
/>
          <EditableCard
  title="Creator Withdrawal Fee"
  value={
    pricing.CreatorWithdrawalFee?.price || 0
  }
  enabled={
    pricing.CreatorWithdrawalFee?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "CreatorWithdrawalFee",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "CreatorWithdrawalFee",
      !pricing.CreatorWithdrawalFee?.enabled
    )
  }
/>

        </Section>
        <Section title="🏷 Verification & Badges">

          <EditableCard
  title="Verified User Badge"
  value={
    pricing.VerifiedUserBadge?.price || 0
  }
  enabled={
    pricing.VerifiedUserBadge?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "VerifiedUserBadge",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "VerifiedUserBadge",
      !pricing.VerifiedUserBadge?.enabled
    )
  }
/>

          <EditableCard
  title="Verified Creator Badge"
  value={
    pricing.VerifiedCreatorBadge?.price || 0
  }
  enabled={
    pricing.VerifiedCreatorBadge?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "VerifiedCreatorBadge",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "VerifiedCreatorBadge",
      !pricing.VerifiedCreatorBadge?.enabled
    )
  }
/>

          <EditableCard
  title="Verified Organization Badge"
  value={
    pricing.VerifiedOrganizationBadge?.price || 0
  }
  enabled={
    pricing.VerifiedOrganizationBadge?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "VerifiedOrganizationBadge",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "VerifiedOrganizationBadge",
      !pricing.VerifiedOrganizationBadge?.enabled
    )
  }
/>

          <EditableCard
  title="Verified NGO Badge"
  value={
    pricing.VerifiedNGOBadge?.price || 0
  }
  enabled={
    pricing.VerifiedNGOBadge?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "VerifiedNGOBadge",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "VerifiedNGOBadge",
      !pricing.VerifiedNGOBadge?.enabled
    )
  }
/>

          <EditableCard
  title="Verified University Badge"
  value={
    pricing.VerifiedUniversityBadge?.price || 0
  }
  enabled={
    pricing.VerifiedUniversityBadge?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "VerifiedUniversityBadge",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "VerifiedUniversityBadge",
      !pricing.VerifiedUniversityBadge?.enabled
    )
  }
/>

          <EditableCard
  title="Verified Hospital Badge"
  value={
    pricing.VerifiedHospitalBadge?.price || 0
  }
  enabled={
    pricing.VerifiedHospitalBadge?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "VerifiedHospitalBadge",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "VerifiedHospitalBadge",
      !pricing.VerifiedHospitalBadge?.enabled
    )
  }
/>

          <EditableCard
  title="Verified Government Badge"
  value={
    pricing.VerifiedGovernmentBadge?.price || 0
  }
  enabled={
    pricing.VerifiedGovernmentBadge?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "VerifiedGovernmentBadge",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "VerifiedGovernmentBadge",
      !pricing.VerifiedGovernmentBadge?.enabled
    )
  }
/>

        </Section>

        <Section title="⭐ Premium Membership">

          <EditableCard
  title="Premium Monthly"
  value={
    pricing.PremiumMonthly?.price || 0
  }
  enabled={
    pricing.PremiumMonthly?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "PremiumMonthly",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "PremiumMonthly",
      !pricing.PremiumMonthly?.enabled
    )
  }
/>

          <EditableCard
  title="Premium Yearly"
  value={
    pricing.PremiumYearly?.price || 0
  }
  enabled={
    pricing.PremiumYearly?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "PremiumYearly",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "PremiumYearly",
      !pricing.PremiumYearly?.enabled
    )
  }
/>

          <EditableCard
  title="Premium Profile"
  value={
    pricing.PremiumProfile?.price || 0
  }
  enabled={
    pricing.PremiumProfile?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "PremiumProfile",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "PremiumProfile",
      !pricing.PremiumProfile?.enabled
    )
  }
/>

          <EditableCard
  title="Premium Analytics"
  value={
    pricing.PremiumAnalytics?.price || 0
  }
  enabled={
    pricing.PremiumAnalytics?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "PremiumAnalytics",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "PremiumAnalytics",
      !pricing.PremiumAnalytics?.enabled
    )
  }
/>

          <EditableCard
  title="Priority Support"
  value={
    pricing.PrioritySupport?.price || 0
  }
  enabled={
    pricing.PrioritySupport?.enabled ?? true
  }
  onPriceChange={(value) =>
    updatePrice(
      "PrioritySupport",
      value
    )
  }
  onToggle={() =>
    updateEnabled(
      "PrioritySupport",
      !pricing.PrioritySupport?.enabled
    )
  }
/>
        </Section>

      </div>
    </DashboardLayout>
  );
  }
function Section({
  title,
  children,
}) {
  return (
    <div
      style={{
        marginBottom: "35px",
      }}
    >
      <h2
        style={{
          marginBottom: "15px",
        }}
      >
        {title}
      </h2>

      {children}
    </div>
  );
}

function RevenueCard({
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        padding: "20px",
        borderRadius: "16px",
      }}
    >
      <div>{title}</div>

      <h2>{value}</h2>
    </div>
  );
}

function EditableCard({
  title,
  value,
  enabled,
  onPriceChange,
  onToggle,
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        padding: "20px",
        borderRadius: "16px",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <strong>{title}</strong>

        <button
          onClick={onToggle}
          style={{
            background: enabled
              ? "#22c55e"
              : "#ef4444",
            color: "white",
            border: "none",
            padding:
              "8px 12px",
            borderRadius:
              "8px",
            cursor: "pointer",
          }}
        >
          {enabled
            ? "Enabled"
            : "Disabled"}
        </button>
      </div>

      <input
        type="number"
        value={value}
        onChange={(e) =>
          onPriceChange(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border:
            "1px solid #334155",
          background:
            "#1e293b",
          color: "white",
        }}
      />
    </div>
  );
}

export default PricingManager;
