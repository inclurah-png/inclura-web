import { useState } from "react";

const makeTxRef = (uid) => "INCLURA-CREATOR-" + (uid || "USER") + "-" + (globalThis.crypto?.randomUUID?.() || (Date.now() + "-" + Math.random().toString(36).slice(2, 10)));
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { auth } from "../firebase";
import { VERIFICATION_PLANS } from "../config";
import { verifyFlutterwavePayment } from "../services/verifyFlutterwavePayment";

function CreatorVerificationPayment() {
  const [loading, setLoading] = useState(false);
  const [txRef, setTxRef] = useState(() => makeTxRef(auth.currentUser?.uid));
  const verificationFee = Number(
    VERIFICATION_PLANS.creator.verificationTypes.find((item) => item.id === "verified_creator")?.monthlyUSD || 0
  );
  const publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;

  const handleFlutterPayment = useFlutterwave({
    public_key: publicKey,
    tx_ref: txRef,
    amount: verificationFee,
    currency: "USD",
    payment_options: "card,banktransfer,ussd",
    customer: {
      email: auth.currentUser?.email || "",
      phone_number: auth.currentUser?.phoneNumber || "",
      name: auth.currentUser?.displayName || "Inclura User",
    },
    customizations: {
      title: "Creator Verification",
      description: "Creator verification application fee",
    },
  });

  function payNow() {
    if (!auth.currentUser) {
      alert("Please sign in before making payment.");
      return;
    }
    if (!publicKey || verificationFee <= 0) {
      alert("Creator verification payment is temporarily unavailable.");
      return;
    }

    setLoading(true);
    handleFlutterPayment({
      callback: async (response) => {
        try {
          if (response.status !== "successful" || !response.transaction_id) {
            throw new Error("Flutterwave did not report a successful transaction.");
          }
          const result = await verifyFlutterwavePayment({
            purpose: "creator_verification",
            transactionId: String(response.transaction_id),
            txRef: response.tx_ref || txRef,
          });
          alert(result.message || "Payment confirmed. Your creator identity is awaiting review.");
        } catch (error) {
          console.error("Creator payment verification failed:", error);
          alert(error.message || "Payment verification is pending. Please contact support.");
        } finally {
          setLoading(false);
          setTxRef(makeTxRef(auth.currentUser?.uid));
          closePaymentModal();
        }
      },
      onClose: () => { setLoading(false); setTxRef(makeTxRef(auth.currentUser?.uid)); },
    });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "white", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "400px", background: "#0f172a", padding: "30px", borderRadius: "20px" }}>
        <h1>Creator Verification</h1>
        <h2>${verificationFee.toLocaleString()} USD</h2>
        <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
          Pay the creator verification application fee. Payment confirmation does not itself approve identity or award a verified badge; the application remains subject to review.
        </p>
        <button type="button" onClick={payNow} disabled={loading || !publicKey} style={{ width: "100%", padding: "15px", border: "none", borderRadius: "12px", background: "#38bdf8", color: "white", fontWeight: "700", cursor: "pointer" }}>
          {loading ? "Verifying payment…" : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

export default CreatorVerificationPayment;
