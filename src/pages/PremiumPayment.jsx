import { useState } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

import { auth, db } from "../firebase";

import {
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

function PremiumPayment() {
  const [loading, setLoading] = useState(false);

  const upgrade = async (
    tier,
    amount
  ) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Login first");
      return;
    }

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
        if (
          response.status ===
          "successful"
        ) {
          await updateDoc(
            doc(
              db,
              "users",
              user.uid
            ),
            {
              premium: true,

              premiumTier:
                tier,

              premiumStartedAt:
                serverTimestamp(),

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

        closePaymentModal();
      },

      onClose: () => {
        setLoading(false);
      },
    });
  };

  return (
    <div>
      <button
        onClick={() =>
          upgrade(
            "silver",
            49000
          )
        }
      >
        Silver
      </button>

      <button
        onClick={() =>
          upgrade(
            "gold",
            69000
          )
        }
      >
        Gold
      </button>

      <button
        onClick={() =>
          upgrade(
            "platinum",
            138000
          )
        }
      >
        Platinum
      </button>

      <button
        onClick={() =>
          upgrade(
            "enterprise",
            1373000
          )
        }
      >
        Enterprise
      </button>
    </div>
  );
}

export default PremiumPayment;
