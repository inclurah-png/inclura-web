function AdminMonetization() {
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
🛡 Inclura Economic Engine </h1>


    <p
      style={{
        color: "#cbd5e1",
        lineHeight: "1.8",
        maxWidth: "900px",
        fontSize: "18px",
      }}
    >
      Manage creator economy,
      accessibility subsidies,
      enterprise billing,
      monetization systems,
      compliance governance,
      wallet infrastructure,
      livestream economy,
      AI monetization,
      and platform-wide financial controls.
    </p>
  </section>

  {/* GRID */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(320px,1fr))",
      gap: "24px",
    }}
  >
    {/* CREATOR ECONOMY */}
    <AdminCard
  title="🎥 Creator Economy"
  items={[
    "💰 Total Creator Content Revenue",
    "🏦 Creator Reserve",
    "🚀 Platform Growth Reserve (Admin Only)",
    "📤 Released Creator Pool",
    "👥 Qualified Creators",
    "📈 Current Release Stage",
    "📊 Current Release Percentage",
    "💵 Total Creator Wallet Balance",
    "🧾 Monthly Creator Payout",
    "📜 Creator Transaction History",
    "⭐ Creator Weight Distribution",
    "🔒 Premium Qualified Creators",
  ]}
/>

      <AdminCard
  title="📊 Revenue Policy"
  items={[
    "Creator Allocation",
    "Platform Allocation",
    "Growth Reserve Default",
    "Release Tiers",
    "Creator Thresholds",
    "Monthly Distribution Status",
    "Creator Revenue Version",
    "Payout Frequency",
  ]}
/>
