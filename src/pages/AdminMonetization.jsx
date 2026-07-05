import { useEffect, useState } from "react";
import { getAdminRevenueSummary } from "../utils/adminAnalytics";

function AdminMonetization() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function loadAnalytics() {
      const data = await getAdminRevenueSummary();
      setAnalytics(data);
    }

    loadAnalytics();
  }, []);

  return (
    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        color: "white",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HERO */}
      <section
        style={{
          background:
            "linear-gradient(135deg, rgba(47,124,255,0.2), rgba(0,212,255,0.15))",
          padding: "40px",
          borderRadius: "32px",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "52px",
            marginBottom: "18px",
          }}
        >
          🛡 Inclura Economic Engine
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: "1.8",
            maxWidth: "900px",
            fontSize: "18px",
          }}
        >
          Manage creator economy, accessibility subsidies,
          enterprise billing, monetization systems,
          compliance governance, wallet infrastructure,
          livestream economy, AI monetization,
          and platform-wide financial controls.
        </p>
      </section>

      {/* OVERVIEW */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <OverviewCard
          title="Creator Revenue"
          value={`₦${analytics?.creatorRevenue ?? 0}`}
        />

        <OverviewCard
          title="Creator Reserve"
          value={`₦${analytics?.creatorReserve ?? 0}`}
        />

        <OverviewCard
          title="Growth Reserve"
          value={`₦${analytics?.platformGrowthReserve ?? 0}`}
        />

        <OverviewCard
          title="Platform Revenue"
          value={`₦${analytics?.platformRevenue ?? 0}`}
        />

        <OverviewCard
          title="Marketplace Revenue"
          value={`₦${analytics?.marketplaceRevenue ?? 0}`}
        />

        <OverviewCard
          title="Platform Services"
          value={`₦${analytics?.platformServiceRevenue ?? 0}`}
        />

        <OverviewCard
          title="Qualified Creators"
          value={analytics?.qualifiedCreators ?? 0}
        />

        <OverviewCard
          title="Creator Allocation"
          value={`${analytics?.creatorAllocation ?? 55}%`}
        />

        <OverviewCard
          title="Platform Allocation"
          value={`${analytics?.platformAllocation ?? 45}%`}
        />

        <OverviewCard
          title="Growth Reserve Rule"
          value={`${analytics?.growthReserve ?? 20}%`}
        />
      </div>

      {/* MAIN GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(340px,1fr))",
          gap: "25px",
        }}
      >
        <AdminCard
          title="🎥 Creator Economy"
          items={[
            "Total Creator Content Revenue",
            "Creator Reserve",
            "Released Creator Pool",
            "Qualified Creators",
            "Premium Qualified Creators",
            "Creator Wallet Balance",
            "Monthly Creator Payout",
            "Creator Transactions",
            "Creator Weight Distribution",
            "Watch Time Statistics",
            "Engagement Statistics",
            "Translation Contribution",
          ]}
        />

        <AdminCard
          title="🏛 Platform Revenue"
          items={[
            "Platform Allocation (45%)",
            "Marketplace Revenue",
            "Platform Service Revenue",
            "Affiliate Revenue",
            "Escrow Revenue",
            "Sponsored Listings",
            "Enterprise Revenue",
            "MentorHub Revenue",
            "CareGig Revenue",
            "Job Placement Revenue",
            "Platform Growth Reserve",
          ]}
        />

        <AdminCard
          title="📊 Revenue Policy"
          items={[
            "Creator Allocation",
            "Platform Allocation",
            "Growth Reserve",
            "Tier Release Percentages",
            "Creator Thresholds",
            "Current Release Stage",
            "Current Release %",
            "Last Monthly Distribution",
            "Policy Version",
          ]}
        />
      </div>
    </div>
  );
}

function AdminCard({ title, items }) {
  return (
    <div
      style={{
        background: "#0f172a",
        padding: "25px",
        borderRadius: "24px",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          fontSize: "26px",
        }}
      >
        {title}
      </h2>

      {items.map((item, index) => (
        <div
          key={index}
          style={{
            padding: "10px 0",
            borderBottom:
              "1px solid rgba(255,255,255,0.05)",
            color: "#cbd5e1",
          }}
        >
          • {item}
        </div>
      ))}
    </div>
  );
}

function OverviewCard({ title, value }) {
  return (
    <div
      style={{
        background: "#0f172a",
        padding: "22px",
        borderRadius: "20px",
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: "14px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: "12px",
          fontSize: "30px",
          fontWeight: "700",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default AdminMonetization;
