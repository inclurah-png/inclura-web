import { useState } from "react";

import {
  useFlutterwave,
  closePaymentModal,
} from "flutterwave-react-v3";

import {
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  db,
  auth,
} from "../firebase";

import { VERIFICATION_PLANS } from "../config";

function CreatorVerificationPayment() {
  const [loading, setLoading] =
    useState(false);

const VERIFICATION_FEE =
VERIFICATION_PLANS.creator.verificationTypes.find(
(item)=>item.id==="verified_creator"
)?.monthlyUSD || 0;

  const config = {
    public_key:
import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    
    tx_ref:
      Date.now().toString(),

    amount:
      VERIFICATION_FEE,

    currency: "USD",

    payment_options:
      "card,banktransfer,ussd",

    customer: {
  email:
    auth.currentUser?.email ||
    "user@inclura.com",

  phone_number:
    auth.currentUser?.phoneNumber ||
    "",

  name:
    auth.currentUser?.displayName ||
    "Inclura User",
},

    customizations: {
      title:
        "Creator Verification",

      description:
        "Pay for Creator Verification",

      logo: "",
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
  try {
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

    alert(
      "Creator Verification Successful"
    );
  } catch (error) {
    console.error(error);

    alert(
      "Verification update failed."
    );
  }
}
        setLoading(false);

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
        background: "#020617",
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
          background: "#0f172a",
          padding: "30px",
          borderRadius: "20px",
        }}
      >
        <h1>
          Creator Verification
        </h1>

        <h2>
          ₦{VERIFICATION_FEE.toLocaleString()}
        </h2>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "20px",
          }}
        >
          Get your verified creator badge.
        </p>

        <button
          onClick={payNow}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: "12px",
            background: "#38bdf8",
            color: "white",
            fontWeight: "700",
            cursor: "pointer",
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
