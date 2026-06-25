import { useState, useEffect } from "react";

import {
useFlutterwave,
closePaymentModal,
} from "flutterwave-react-v3";

import { auth, db } from "../firebase";

import {
doc,
updateDoc,
serverTimestamp,
getDoc,
} from "firebase/firestore";

function PremiumPayment() {
const [pricing, setPricing] =
useState({});

const [loading, setLoading] =
useState(false);

useEffect(() => {
loadPricing();
}, []);

async function loadPricing() {
try {
const silver =
await getDoc(
doc(
db,
"pricing",
"SilverBadge"
)
);

  const gold =
    await getDoc(
      doc(
        db,
        "pricing",
        "GoldBadge"
      )
    );

  const platinum =
    await getDoc(
      doc(
        db,
        "pricing",
        "PlatinumBadge"
      )
    );

  const enterprise =
    await getDoc(
      doc(
        db,
        "pricing",
        "EnterpriseBadge"
      )
    );

  setPricing({
    SilverBadge:
      silver.exists()
        ? silver.data()
        : {},

    GoldBadge:
      gold.exists()
        ? gold.data()
        : {},

    PlatinumBadge:
      platinum.exists()
        ? platinum.data()
        : {},

    EnterpriseBadge:
      enterprise.exists()
        ? enterprise.data()
        : {},
  });
} catch (error) {
  console.log(error);
}

}

const upgrade = async (
tier,
amount
) => {
const user =
auth.currentUser;

if (!user) {
  alert("Login first");
  return;
}

setLoading(true);

const config = {
  public_key:
    "FLWPUBK_TEST-1ee584892828ffa6942ef2e45a970768-X",

  tx_ref:
    Date.now().toString(),

  amount,

  currency: "NGN",

  payment_options:
    "card,banktransfer,ussd",

  customer: {
    email:
      user.email,

    name:
      user.displayName ||
      "Inclura User",
  },

  customizations: {
    title:
      "Premium Upgrade",

    description:
      `Upgrade to ${tier}`,

    logo: "",
  },
};

const payment =
  useFlutterwave(config);

payment({
  callback: async (
    response
  ) => {
    try {
      if (
        response.status ===
        "successful"
      ) {
        const expiry =
          new Date();

        expiry.setMonth(
          expiry.getMonth() + 1
        );

        await updateDoc(
          doc(
            db,
            "users",
            user.uid
          ),
          {
            premium: true,

            premiumActive:
              true,

            premiumTier:
              tier,

            premiumStartedAt:
              serverTimestamp(),

            premiumExpiryDate:
              expiry,

            premiumReference:
              response.tx_ref,

            premiumTransactionId:
              String(
                response.transaction_id
              ),
          }
        );

        alert(
          `${tier.toUpperCase()} activated successfully`
        );
      }
    } catch (error) {
      console.log(error);
      alert(
        error.message
      );
    }

    closePaymentModal();
  },

  onClose: () => {
    setLoading(false);
  },
});

};

return (
<div
style={{
padding: "24px",
color: "white",
}}
>
<h1>
⭐ Premium Membership
</h1>

  <button
    onClick={() =>
      upgrade(
        "silver",
        pricing
          ?.SilverBadge
          ?.price || 0
      )
    }
  >
    Silver — ₦
    {pricing?.SilverBadge?.price ||
      0}
  </button>

  <br />
  <br />

  <button
    onClick={() =>
      upgrade(
        "gold",
        pricing
          ?.GoldBadge
          ?.price || 0
      )
    }
  >
    Gold — ₦
    {pricing?.GoldBadge?.price ||
      0}
  </button>

  <br />
  <br />

  <button
    onClick={() =>
      upgrade(
        "platinum",
        pricing
          ?.PlatinumBadge
          ?.price || 0
      )
    }
  >
    Platinum — ₦
    {pricing?.PlatinumBadge
      ?.price || 0}
  </button>

  <br />
  <br />

  <button
    onClick={() =>
      upgrade(
        "enterprise",
        pricing
          ?.EnterpriseBadge
          ?.price || 0
      )
    }
  >
    Enterprise — ₦
    {pricing
      ?.EnterpriseBadge
      ?.price || 0}
  </button>
</div>

);
}

export default PremiumPayment;
