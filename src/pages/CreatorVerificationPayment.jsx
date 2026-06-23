import {
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  db,
  auth,
} from "../firebase";

import { useState } from "react";

import {
  useFlutterwave,
  closePaymentModal,
} from "flutterwave-react-v3";

function CreatorVerificationPayment() {
  const [loading, setLoading] =
    useState(false);

  const config = {
    public_key:
      "FLWPUBK_TEST-1ee584892828ffa6942ef2e45a970768-X",

    tx_ref:
      Date.now().toString(),

    const VERIFICATION_FEE = 5000;

const config = {
  amount: VERIFICATION_FEE,
};

    currency: "NGN",

    payment_options:
      "card,banktransfer,ussd",

    customer: {
      email:
        "test@inclura.com",

      phone_number:
        "08000000000",

      name:
        "Inclura User",
    },

    customizations: {
      title:
        "Creator Verification",

      description:
        "Pay for Creator Verification",

      logo:
        "",
    },
  };

  const handleFlutterPayment =
    useFlutterwave(config);

  function payNow() {
    setLoading(true);

    handleFlutterPayment({
      callback: async (
  response
) => {
  console.log(response);

  const user =
    auth.currentUser;

  if (
  response.status === "successful" &&
  user
) {
  await updateDoc(
    doc(
      db,
      "users",
      user.uid
    ),
    {
      verified: true,
      badgeType: "creator",
      creatorVerified: true,
      creatorVerifiedAt:
        serverTimestamp(),
      paymentReference:
        response.tx_ref,
      transactionId:
        response.transaction_id,
    }
  );
}

  alert(
    "Creator verification submitted successfully. Awaiting admin review."
  );

  closePaymentModal();
},

if (user) {
  await updateDoc(
    doc(db, "users", user.uid),
    {
      verified: true,
      badgeType: "creator",
      creatorVerified: true,
      verificationDate:
        serverTimestamp(),
    }
  );
}

alert(
  "Creator Verification Successful"
);
        closePaymentModal();
      },

      onClose: () => {
        setLoading(false);
      },
    });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "#020617",
        color: "white",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
      }}
    >
      <div
        style={{
          width: "400px",
          background:
            "#0f172a",
          padding: "30px",
          borderRadius:
            "20px",
        }}
      >
        <h1>
          Creator Verification
        </h1>

        <h2>
          ₦5,000
        </h2>

        <button
          onClick={payNow}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius:
              "12px",
            background:
              "#38bdf8",
            color: "white",
            fontWeight:
              "700",
          }}
        >
          {loading
            ? "Loading..."
            : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

export default CreatorVerificationPayment;
