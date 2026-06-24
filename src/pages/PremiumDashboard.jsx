import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";

function PremiumDashboard() {
const navigate = useNavigate();

return (
<DashboardLayout>
<div
style={{
color: "white",
maxWidth: "1000px",
}}
>
<h1>⭐ Premium Dashboard</h1>

    <p
      style={{
        color: "#94a3b8",
        marginBottom: "24px",
      }}
    >
      Upgrade your Inclura experience with premium plans.
    </p>

    <div style={card}>
      <h2>🥈 Silver Badge</h2>
      <h3>₦49,000 / month</h3>

      <ul>
        <li>Priority profile</li>
        <li>5 boosted posts monthly</li>
        <li>Premium support</li>
      </ul>

      <button
        style={button}
        onClick={() =>
          navigate("/premium-payment")
        }
      >
        Upgrade to Silver
      </button>
    </div>

    <div style={card}>
      <h2>🥇 Gold Badge</h2>
      <h3>₦69,000 / month</h3>

      <ul>
        <li>Creator analytics</li>
        <li>20 boosted posts monthly</li>
        <li>Priority support</li>
      </ul>

      <button
        style={button}
        onClick={() =>
          navigate("/premium-payment")
        }
      >
        Upgrade to Gold
      </button>
    </div>

    <div style={card}>
      <h2>💎 Platinum Badge</h2>
      <h3>₦138,000 / month</h3>

      <ul>
        <li>Unlimited boosts</li>
        <li>Advanced creator analytics</li>
        <li>Premium visibility</li>
        <li>Higher search ranking</li>
      </ul>

      <button
        style={button}
        onClick={() =>
          navigate("/premium-payment")
        }
      >
        Upgrade to Platinum
      </button>
    </div>

    <div style={card}>
      <h2>🏆 Enterprise Badge</h2>
      <h3>₦1,373,000 / month</h3>

      <ul>
        <li>Organization branding</li>
        <li>Advertising tools</li>
        <li>Team accounts</li>
        <li>Enterprise analytics</li>
        <li>Dedicated support</li>
      </ul>

      <button
        style={button}
        onClick={() =>
          navigate("/premium-payment")
        }
      >
        Upgrade to Enterprise
      </button>
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
border: "1px solid #1e293b",
};

const button = {
background: "#38bdf8",
color: "white",
border: "none",
padding: "12px 18px",
borderRadius: "12px",
cursor: "pointer",
fontWeight: "700",
marginTop: "16px",
};

export default PremiumDashboard;
