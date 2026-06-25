import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";

function PremiumDashboard() {
  const [prices, setPrices] =
  useState({});

useEffect(() => {
  loadPrices();
}, []);

async function loadPrices() {
  try {
    const snapshot =
      await getDocs(
        collection(
          db,
          "pricing"
        )
      );

    const data = {};

    snapshot.forEach((doc) => {
      data[doc.id] =
        doc.data();
    });

    setPrices(data);
  } catch (error) {
    console.log(error);
  }
}
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div
        style={{
          color: "white",
          maxWidth: "1000px",
          margin: "0 auto",
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

        {/* SILVER */}
        <div style={card}>
          <h2>🥈 Silver Badge</h2>

          <h3>
  ₦
  {prices.SilverBadge?.price?.toLocaleString() ||
    "0"}
  {" "}
  / month
</h3>

          <ul>
            <li>Priority profile</li>
            <li>5 boosted posts monthly</li>
            <li>Premium support</li>
          </ul>

          <button
            style={button}
            onClick={() =>
  navigate("/premium-payment?tier=silver")
}
          >
            Upgrade to Silver
          </button>
        </div>

        {/* GOLD */}
        <div style={card}>
          <h2>🥇 Gold Badge</h2>

          <h3>
  ₦
  {prices.GoldBadge?.price?.toLocaleString() ||
    "0"}
  {" "}
  / month
</h3>

          <ul>
            <li>Creator analytics</li>
            <li>20 boosted posts monthly</li>
            <li>Priority support</li>
          </ul>

          <button
            style={button}
            onClick={() =>
  navigate("/premium-payment?tier=gold")
}
          >
            Upgrade to Gold
          </button>
        </div>

        {/* PLATINUM */}
        <div style={card}>
          <h2>💎 Platinum Badge</h2>

          <h3>
  ₦
  {prices.PlatinumBadge?.price?.toLocaleString() ||
    "0"}
  {" "}
  / month
</h3>

          <ul>
            <li>Unlimited boosts</li>
            <li>Advanced creator analytics</li>
            <li>Premium visibility</li>
            <li>Higher search ranking</li>
          </ul>

          <button
            style={button}
            onClick={() =>
  navigate("/premium-payment?tier=platinum")
}
          >
            Upgrade to Platinum
          </button>
        </div>

        {/* ENTERPRISE */}
        <div style={card}>
          <h2>🏆 Enterprise Badge</h2>

          <h3>
  ₦
  {prices.EnterpriseBadge?.price?.toLocaleString() ||
    "0"}
  {" "}
  / month
</h3>

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
  navigate("/premium-payment?tier=enterprise")
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
  marginTop: "16px",
  padding: "12px 18px",
  border: "none",
  borderRadius: "12px",
  background: "#38bdf8",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

export default PremiumDashboard;
