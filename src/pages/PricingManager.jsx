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
              pricing
                .basicBannerAd
                ?.price || 0
            }
            enabled={
              pricing
                .basicBannerAd
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "basicBannerAd",
                value
              )
            }
            onToggle={(
              enabled
            ) =>
              updateEnabled(
                "basicBannerAd",
                enabled
              )
            }
          />

          <EditableCard
            title="Premium Banner Ad"
            value={
              pricing
                .premiumBannerAd
                ?.price || 0
            }
            enabled={
              pricing
                .premiumBannerAd
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "premiumBannerAd",
                value
              )
            }
            onToggle={(
              enabled
            ) =>
              updateEnabled(
                "premiumBannerAd",
                enabled
              )
            }
          />

          <EditableCard
            title="Video Advertisement"
            value={
              pricing
                .videoAdvertisement
                ?.price || 0
            }
            enabled={
              pricing
                .videoAdvertisement
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "videoAdvertisement",
                value
              )
            }
            onToggle={(
              enabled
            ) =>
              updateEnabled(
                "videoAdvertisement",
                enabled
              )
            }
          />

          <EditableCard
            title="Sponsored Post"
            value={
              pricing
                .sponsoredPost
                ?.price || 0
            }
            enabled={
              pricing
                .sponsoredPost
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "sponsoredPost",
                value
              )
            }
            onToggle={(
              enabled
            ) =>
              updateEnabled(
                "sponsoredPost",
                enabled
              )
            }
          />

        </Section>
        <Section title="📢 Advertising">

          <EditableCard
            title="Sponsored Reel"
            value={
              pricing
                .sponsoredReel
                ?.price || 0
            }
            enabled={
              pricing
                .sponsoredReel
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "sponsoredReel",
                value
              )
            }
            onToggle={(enabled) =>
              updateEnabled(
                "sponsoredReel",
                enabled
              )
            }
          />

          <EditableCard
            title="Country Targeting Fee"
            value={
              pricing
                .countryTargetingFee
                ?.price || 0
            }
            enabled={
              pricing
                .countryTargetingFee
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "countryTargetingFee",
                value
              )
            }
            onToggle={(enabled) =>
              updateEnabled(
                "countryTargetingFee",
                enabled
              )
            }
          />

          <EditableCard
            title="State Targeting Fee"
            value={
              pricing
                .stateTargetingFee
                ?.price || 0
            }
            enabled={
              pricing
                .stateTargetingFee
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "stateTargetingFee",
                value
              )
            }
            onToggle={(enabled) =>
              updateEnabled(
                "stateTargetingFee",
                enabled
              )
            }
          />

          <EditableCard
            title="City Targeting Fee"
            value={
              pricing
                .cityTargetingFee
                ?.price || 0
            }
            enabled={
              pricing
                .cityTargetingFee
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "cityTargetingFee",
                value
              )
            }
            onToggle={(enabled) =>
              updateEnabled(
                "cityTargetingFee",
                enabled
              )
            }
          />

          <EditableCard
            title="Accessibility Audience Fee"
            value={
              pricing
                .accessibilityAudienceFee
                ?.price || 0
            }
            enabled={
              pricing
                .accessibilityAudienceFee
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "accessibilityAudienceFee",
                value
              )
            }
            onToggle={(enabled) =>
              updateEnabled(
                "accessibilityAudienceFee",
                enabled
              )
            }
          />

        </Section>

        <Section title="🎥 Reels Economy">

          <EditableCard
            title="Reel Boost"
            value={
              pricing.reelBoost
                ?.price || 0
            }
            enabled={
              pricing.reelBoost
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "reelBoost",
                value
              )
            }
            onToggle={(enabled) =>
              updateEnabled(
                "reelBoost",
                enabled
              )
            }
          />

          <EditableCard
            title="Featured Reel"
            value={
              pricing
                .featuredReel
                ?.price || 0
            }
            enabled={
              pricing
                .featuredReel
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "featuredReel",
                value
              )
            }
            onToggle={(enabled) =>
              updateEnabled(
                "featuredReel",
                enabled
              )
            }
          />

          <EditableCard
            title="Trending Placement"
            value={
              pricing
                .trendingPlacement
                ?.price || 0
            }
            enabled={
              pricing
                .trendingPlacement
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "trendingPlacement",
                value
              )
            }
            onToggle={(enabled) =>
              updateEnabled(
                "trendingPlacement",
                enabled
              )
            }
          />

          <EditableCard
            title="Sponsored Reel Placement"
            value={
              pricing
                .sponsoredReelPlacement
                ?.price || 0
            }
            enabled={
              pricing
                .sponsoredReelPlacement
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "sponsoredReelPlacement",
                value
              )
            }
            onToggle={(enabled) =>
              updateEnabled(
                "sponsoredReelPlacement",
                enabled
              )
            }
          />

        </Section>

        <Section title="💵 Creator Economy">

          <EditableCard
            title="Creator Verification"
            value={
              pricing
                .creatorVerification
                ?.price || 0
            }
            enabled={
              pricing
                .creatorVerification
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "creatorVerification",
                value
              )
            }
            onToggle={(enabled) =>
              updateEnabled(
                "creatorVerification",
                enabled
              )
            }
          />

          <EditableCard
            title="Creator Subscription"
            value={
              pricing
                .creatorSubscription
                ?.price || 0
            }
            enabled={
              pricing
                .creatorSubscription
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "creatorSubscription",
                value
              )
            }
            onToggle={(enabled) =>
              updateEnabled(
                "creatorSubscription",
                enabled
              )
            }
          />

          <EditableCard
            title="Sponsored Content Fee"
            value={
              pricing
                .sponsoredContentFee
                ?.price || 0
            }
            enabled={
              pricing
                .sponsoredContentFee
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "sponsoredContentFee",
                value
              )
            }
            onToggle={(enabled) =>
              updateEnabled(
                "sponsoredContentFee",
                enabled
              )
            }
          />

          <EditableCard
            title="Creator Analytics Pro"
            value={
              pricing
                .creatorAnalyticsPro
                ?.price || 0
            }
            enabled={
              pricing
                .creatorAnalyticsPro
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "creatorAnalyticsPro",
                value
              )
            }
            onToggle={(enabled) =>
              updateEnabled(
                "creatorAnalyticsPro",
                enabled
              )
            }
          />

          <EditableCard
            title="Creator Withdrawal Fee"
            value={
              pricing
                .creatorWithdrawalFee
                ?.price || 0
            }
            enabled={
              pricing
                .creatorWithdrawalFee
                ?.enabled || false
            }
            onChange={(value) =>
              updatePrice(
                "creatorWithdrawalFee",
                value
              )
            }
            onToggle={(enabled) =>
              updateEnabled(
                "creatorWithdrawalFee",
                enabled
              )
            }
          />

        </Section>
        <Section title="🏷 Verification & Badges">

          <EditableCard
            title="Verified User Badge"
            value={
              pricing.verifiedUserBadge
                ?.price || 0
            }
            enabled={
              pricing.verifiedUserBadge
                ?.enabled
            }
            onPriceChange={(value) =>
              updatePrice(
                "verifiedUserBadge",
                value
              )
            }
            onToggle={() =>
              toggleEnabled(
                "verifiedUserBadge"
              )
            }
          />

          <EditableCard
            title="Verified Creator Badge"
            value={
              pricing.verifiedCreatorBadge
                ?.price || 0
            }
            enabled={
              pricing.verifiedCreatorBadge
                ?.enabled
            }
            onPriceChange={(value) =>
              updatePrice(
                "verifiedCreatorBadge",
                value
              )
            }
            onToggle={() =>
              toggleEnabled(
                "verifiedCreatorBadge"
              )
            }
          />

          <EditableCard
            title="Verified Organization Badge"
            value={
              pricing.verifiedOrganizationBadge
                ?.price || 0
            }
            enabled={
              pricing.verifiedOrganizationBadge
                ?.enabled
            }
            onPriceChange={(value) =>
              updatePrice(
                "verifiedOrganizationBadge",
                value
              )
            }
            onToggle={() =>
              toggleEnabled(
                "verifiedOrganizationBadge"
              )
            }
          />

          <EditableCard
            title="Verified NGO Badge"
            value={
              pricing.verifiedNGOBadge
                ?.price || 0
            }
            enabled={
              pricing.verifiedNGOBadge
                ?.enabled
            }
            onPriceChange={(value) =>
              updatePrice(
                "verifiedNGOBadge",
                value
              )
            }
            onToggle={() =>
              toggleEnabled(
                "verifiedNGOBadge"
              )
            }
          />

          <EditableCard
            title="Verified University Badge"
            value={
              pricing.verifiedUniversityBadge
                ?.price || 0
            }
            enabled={
              pricing.verifiedUniversityBadge
                ?.enabled
            }
            onPriceChange={(value) =>
              updatePrice(
                "verifiedUniversityBadge",
                value
              )
            }
            onToggle={() =>
              toggleEnabled(
                "verifiedUniversityBadge"
              )
            }
          />

          <EditableCard
            title="Verified Hospital Badge"
            value={
              pricing.verifiedHospitalBadge
                ?.price || 0
            }
            enabled={
              pricing.verifiedHospitalBadge
                ?.enabled
            }
            onPriceChange={(value) =>
              updatePrice(
                "verifiedHospitalBadge",
                value
              )
            }
            onToggle={() =>
              toggleEnabled(
                "verifiedHospitalBadge"
              )
            }
          />

          <EditableCard
            title="Verified Government Badge"
            value={
              pricing.verifiedGovernmentBadge
                ?.price || 0
            }
            enabled={
              pricing.verifiedGovernmentBadge
                ?.enabled
            }
            onPriceChange={(value) =>
              updatePrice(
                "verifiedGovernmentBadge",
                value
              )
            }
            onToggle={() =>
              toggleEnabled(
                "verifiedGovernmentBadge"
              )
            }
          />

        </Section>

        <Section title="⭐ Premium Membership">

          <EditableCard
            title="Premium Monthly"
            value={
              pricing.premiumMonthly
                ?.price || 0
            }
            enabled={
              pricing.premiumMonthly
                ?.enabled
            }
            onPriceChange={(value) =>
              updatePrice(
                "premiumMonthly",
                value
              )
            }
            onToggle={() =>
              toggleEnabled(
                "premiumMonthly"
              )
            }
          />

          <EditableCard
            title="Premium Yearly"
            value={
              pricing.premiumYearly
                ?.price || 0
            }
            enabled={
              pricing.premiumYearly
                ?.enabled
            }
            onPriceChange={(value) =>
              updatePrice(
                "premiumYearly",
                value
              )
            }
            onToggle={() =>
              toggleEnabled(
                "premiumYearly"
              )
            }
          />

          <EditableCard
            title="Premium Profile"
            value={
              pricing.premiumProfile
                ?.price || 0
            }
            enabled={
              pricing.premiumProfile
                ?.enabled
            }
            onPriceChange={(value) =>
              updatePrice(
                "premiumProfile",
                value
              )
            }
            onToggle={() =>
              toggleEnabled(
                "premiumProfile"
              )
            }
          />

          <EditableCard
            title="Premium Analytics"
            value={
              pricing.premiumAnalytics
                ?.price || 0
            }
            enabled={
              pricing.premiumAnalytics
                ?.enabled
            }
            onPriceChange={(value) =>
              updatePrice(
                "premiumAnalytics",
                value
              )
            }
            onToggle={() =>
              toggleEnabled(
                "premiumAnalytics"
              )
            }
          />

          <EditableCard
            title="Priority Support"
            value={
              pricing.prioritySupport
                ?.price || 0
            }
            enabled={
              pricing.prioritySupport
                ?.enabled
            }
            onPriceChange={(value) =>
              updatePrice(
                "prioritySupport",
                value
              )
            }
            onToggle={() =>
              toggleEnabled(
                "prioritySupport"
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
