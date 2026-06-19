import DashboardLayout from "../components/DashboardLayout";
import { useState } from "react";

function PricingManager() {
  const [pricing, setPricing] =
    useState({
      creatorVerification: 5000,
      verifiedCreatorBadge: 10000,
      marketplaceCommission: 5,
      careGigCommission: 8,
      mentorCommission: 10,
      premiumMonthly: 3000,
      premiumYearly: 30000,
    });

  function updatePrice(
    key,
    value
  ) {
    setPricing((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <DashboardLayout>
      <div
        style={{
          color: "white",
        }}
      >
        <h1
          style={{
            marginBottom:
              "30px",
          }}
        >
          💲 Inclura Pricing Manager
        </h1>

        {/* Revenue Overview */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "14px",
            marginBottom:
              "40px",
          }}
        >
          <RevenueCard
            title="Today's Revenue"
            value="₦0"
          />

          <RevenueCard
            title="Monthly Revenue"
            value="₦0"
          />

          <RevenueCard
            title="Subscriptions"
            value="₦0"
          />

          <RevenueCard
            title="Marketplace Revenue"
            value="₦0"
          />
        </div>

        <Section title="📢 Advertising">
          <PricingCard
            title="Basic Banner Ad"
          />
          <PricingCard
            title="Premium Banner Ad"
          />
          <PricingCard
            title="Video Advertisement"
          />
          <PricingCard
            title="Sponsored Post"
          />
          <PricingCard
            title="Sponsored Reel"
          />
          <PricingCard
            title="Country Targeting Fee"
          />
          <PricingCard
            title="State Targeting Fee"
          />
          <PricingCard
            title="City Targeting Fee"
          />
          <PricingCard
            title="Accessibility Audience Fee"
          />
        </Section>

        <Section title="🎥 Reels Economy">
          <PricingCard
            title="Reel Boost"
          />
          <PricingCard
            title="Featured Reel"
          />
          <PricingCard
            title="Trending Placement"
          />
          <PricingCard
            title="Sponsored Reel Placement"
          />
        </Section>

        <Section title="💵 Creator Economy">
          <EditableCard
            title="Creator Verification"
            value={
              pricing.creatorVerification
            }
            onChange={(value) =>
              updatePrice(
                "creatorVerification",
                value
              )
            }
          />

          <PricingCard
            title="Creator Subscription"
          />

          <PricingCard
            title="Sponsored Content Fee"
          />

          <PricingCard
            title="Creator Analytics Pro"
          />

          <PricingCard
            title="Creator Withdrawal Fee"
          />
        </Section>

        <Section title="🛒 Marketplace Economy">
          <PricingCard
            title="Listing Fee"
          />

          <PricingCard
            title="Featured Listing"
          />

          <EditableCard
            title="Marketplace Commission (%)"
            value={
              pricing.marketplaceCommission
            }
            onChange={(value) =>
              updatePrice(
                "marketplaceCommission",
                value
              )
            }
          />

          <PricingCard
            title="Store Verification"
          />

          <PricingCard
            title="Premium Store Subscription"
          />
        </Section>

        <Section title="🤝 Care-Gigs Economy">
          <PricingCard
            title="Gig Posting Fee"
          />

          <PricingCard
            title="Gig Promotion Fee"
          />

          <EditableCard
            title="Care-Gig Commission (%)"
            value={
              pricing.careGigCommission
            }
            onChange={(value) =>
              updatePrice(
                "careGigCommission",
                value
              )
            }
          />
        </Section>

        <Section title="🎓 Mentor Economy">
          <PricingCard
            title="Mentor Subscription"
          />

          <PricingCard
            title="Premium Mentor Badge"
          />

          <EditableCard
            title="Session Commission (%)"
            value={
              pricing.mentorCommission
            }
            onChange={(value) =>
              updatePrice(
                "mentorCommission",
                value
              )
            }
          />
        </Section>

        <Section title="🏢 Enterprise Economy">
          <PricingCard
            title="Enterprise Verification"
          />

          <PricingCard
            title="Enterprise Subscription"
          />

          <PricingCard
            title="Recruitment Campaign Fee"
          />

          <PricingCard
            title="Accessibility Program Fee"
          />

          <PricingCard
            title="Grant Campaign Fee"
          />

          <PricingCard
            title="Government Campaign Fee"
          />

          <PricingCard
            title="Enterprise Analytics Pro"
          />
        </Section>

        <Section title="💰 Wallet Economy">
          <PricingCard
            title="Top-Up Fee"
          />

          <PricingCard
            title="Transfer Fee"
          />

          <PricingCard
            title="Withdrawal Fee"
          />

          <PricingCard
            title="International Withdrawal Fee"
          />

          <PricingCard
            title="Currency Conversion Fee"
          />
        </Section>

        <Section title="🏷 Verification & Badges">
          <PricingCard
            title="Verified User Badge"
          />

          <EditableCard
            title="Verified Creator Badge"
            value={
              pricing.verifiedCreatorBadge
            }
            onChange={(value) =>
              updatePrice(
                "verifiedCreatorBadge",
                value
              )
            }
          />

          <PricingCard
            title="Verified Organization Badge"
          />

          <PricingCard
            title="Verified NGO Badge"
          />

          <PricingCard
            title="Verified University Badge"
          />

          <PricingCard
            title="Verified Hospital Badge"
          />

          <PricingCard
            title="Verified Government Badge"
          />
        </Section>

        <Section title="🧰 Premium Business Tools">
          <PricingCard
            title="HubSpot Integration"
          />

          <PricingCard
            title="Canva Pro Add-On"
          />

          <PricingCard
            title="HubSpot + Canva Bundle"
          />

          <PricingCard
            title="Business Tools Suite"
          />

          <PricingCard
            title="Analytics Pro"
          />
        </Section>

        <Section title="⭐ Premium Membership">
          <EditableCard
            title="Inclura Plus Monthly"
            value={
              pricing.premiumMonthly
            }
            onChange={(value) =>
              updatePrice(
                "premiumMonthly",
                value
              )
            }
          />

          <EditableCard
            title="Inclura Plus Yearly"
            value={
              pricing.premiumYearly
            }
            onChange={(value) =>
              updatePrice(
                "premiumYearly",
                value
              )
            }
          />

          <PricingCard
            title="Premium Profile"
          />

          <PricingCard
            title="Premium Analytics"
          />

          <PricingCard
            title="Priority Support"
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
          marginBottom:
            "15px",
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

function PricingCard({
  title,
}) {
  const [enabled, setEnabled] =
    useState(true);

  return (
    <div
      style={{
        background: "#0f172a",
        padding: "20px",
        borderRadius: "16px",
        marginBottom: "12px",
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
      }}
    >
      <span>{title}</span>

      <button
        onClick={() =>
          setEnabled(
            !enabled
          )
        }
      >
        {enabled
          ? "Enabled"
          : "Disabled"}
      </button>
    </div>
  );
}

function EditableCard({
  title,
  value,
  onChange,
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
          marginBottom:
            "10px",
        }}
      >
        {title}
      </div>

      <input
        type="number"
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          border: "none",
        }}
      />
    </div>
  );
}

export default PricingManager;
