import DashboardLayout from "../components/DashboardLayout";

function CreatorEarnings() {
return (
<DashboardLayout>
<div style={{ color: "white" }}>
<h1>💵 Creator Earnings</h1>

    <div style={card}>
      Current Earnings: $0.00
    </div>

    <div style={card}>
      Pending Earnings: $0.00
    </div>

    <div style={card}>
      Lifetime Earnings: $0.00
    </div>

    <div style={card}>
      Revenue Sources
      <ul>
        <li>Advertisements</li>
        <li>Marketplace</li>
        <li>Mentorship</li>
        <li>Care-Gigs</li>
        <li>Enterprise Partnerships</li>
      </ul>
    </div>
  </div>
</DashboardLayout>

);
}

const card = {
background: "#0f172a",
padding: "24px",
borderRadius: "20px",
marginBottom: "20px",
};

export default CreatorEarnings;
