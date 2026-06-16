import DashboardLayout from "../components/DashboardLayout";

function PricingManager() {
return (
<DashboardLayout>
<div style={{ color: "white" }}>
<h1
style={{
marginBottom: "30px",
}}
>
💲 Inclura Pricing Manager
</h1>

    {/* ADVERTISING */}

    <Section title="📢 Advertising">

      <Card title="Basic Banner Ad" />
      <Card title="Premium Banner Ad" />
      <Card title="Video Advertisement" />
      <Card title="Sponsored Post" />
      <Card title="Sponsored Reel" />

      <Card title="Country Targeting Fee" />
      <Card title="State Targeting Fee" />
      <Card title="City Targeting Fee" />
      <Card title="Accessibility Audience Fee" />

    </Section>

    {/* REELS */}

    <Section title="🎥 Reels Economy">

      <Card title="Reel Boost" />
      <Card title="Featured Reel" />
      <Card title="Trending Placement" />
      <Card title="Sponsored Reel Placement" />

    </Section>

    {/* CREATORS */}

    <Section title="💵 Creator Economy">

      <Card title="Creator Verification" />
      <Card title="Creator Subscription" />
      <Card title="Sponsored Content Fee" />
      <Card title="Creator Analytics Pro" />
      <Card title="Creator Withdrawal Fee" />

    </Section>

    {/* MARKETPLACE */}

    <Section title="🛒 Marketplace Economy">

      <Card title="Listing Fee" />
      <Card title="Featured Listing" />
      <Card title="Marketplace Commission %" />
      <Card title="Store Verification" />
      <Card title="Premium Store Subscription" />

    </Section>

    {/* CARE-GIGS */}

    <Section title="🤝 Care-Gigs Economy">

      <Card title="Gig Posting Fee" />
      <Card title="Gig Promotion Fee" />
      <Card title="Care-Gig Commission %" />

    </Section>

    {/* MENTORS */}

    <Section title="🎓 Mentor Economy">

      <Card title="Mentor Subscription" />
      <Card title="Premium Mentor Badge" />
      <Card title="Session Commission %" />

    </Section>

    {/* ENTERPRISE */}

    <Section title="🏢 Enterprise Economy">

      <Card title="Enterprise Verification" />
      <Card title="Enterprise Subscription" />
      <Card title="Recruitment Campaign Fee" />
      <Card title="Accessibility Program Fee" />
      <Card title="Grant Campaign Fee" />
      <Card title="Government Campaign Fee" />
      <Card title="Enterprise Analytics Pro" />

    </Section>

    {/* WALLET */}

    <Section title="💰 Wallet Economy">

      <Card title="Top-Up Fee" />
      <Card title="Transfer Fee" />
      <Card title="Withdrawal Fee" />
      <Card title="International Withdrawal Fee" />
      <Card title="Currency Conversion Fee" />

    </Section>

    {/* VERIFICATION */}

    <Section title="🏷 Verification & Badges">

      <Card title="Verified User Badge" />
      <Card title="Verified Creator Badge" />
      <Card title="Verified Organization Badge" />
      <Card title="Verified NGO Badge" />
      <Card title="Verified University Badge" />
      <Card title="Verified Hospital Badge" />
      <Card title="Verified Government Badge" />

    </Section>

    {/* BUSINESS TOOLS */}

    <Section title="🧰 Premium Business Tools">

      <Card title="HubSpot Integration" />
      <Card title="Canva Pro Add-On" />
      <Card title="HubSpot + Canva Bundle" />
      <Card title="Business Tools Suite" />
      <Card title="Analytics Pro" />

    </Section>

    {/* MEMBERSHIP */}

    <Section title="⭐ Premium Membership">

      <Card title="Inclura Plus Monthly" />
      <Card title="Inclura Plus Yearly" />
      <Card title="Premium Profile" />
      <Card title="Premium Analytics" />
      <Card title="Priority Support" />

    </Section>

  </div>
</DashboardLayout>

);
}

function Section({ title, children }) {
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

function Card({ title }) {
return (
<div
style={{
background: "#0f172a",
padding: "20px",
borderRadius: "16px",
marginBottom: "12px",
fontWeight: "600",
}}
>
{title}
</div>
);
}

export default PricingManager;
