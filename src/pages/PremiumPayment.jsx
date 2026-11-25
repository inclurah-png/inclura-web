import { useEffect, useMemo, useState } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { verifyFlutterwavePayment } from "../services/verifyFlutterwavePayment";

function PremiumPayment() {
  const [pricing, setPricing] = useState({});
  const [loading, setLoading] = useState(false);
  const publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;

  useEffect(() => {
    let active = true;
    async function loadPricing() {
      try {
        const ids = ["SilverBadge", "GoldBadge", "PlatinumBadge", "EnterpriseBadge"];
        const entries = await Promise.all(ids.map(async (id) => {
          const snapshot = await getDoc(doc(db, "pricing", id));
          return [id, snapshot.exists() ? snapshot.data() : {}];
        }));
        if (active) setPricing(Object.fromEntries(entries));
      } catch (error) {
        console.error("Premium pricing load failed:", error);
      }
    }
    loadPricing();
    return () => { active = false; };
  }, []);

  const silverRef = useMemo(() => `INCLURA-SILVER-${Date.now()}`, []);
  const goldRef = useMemo(() => `INCLURA-GOLD-${Date.now()}`, []);
  const platinumRef = useMemo(() => `INCLURA-PLATINUM-${Date.now()}`, []);
  const enterpriseRef = useMemo(() => `INCLURA-ENTERPRISE-${Date.now()}`, []);

  const silverPayment = useFlutterwave({
    public_key: publicKey, tx_ref: silverRef, amount: Number(pricing.SilverBadge?.price || 0),
    currency: "NGN", payment_options: "card,banktransfer,ussd",
    customer: { email: auth.currentUser?.email || "", name: auth.currentUser?.displayName || "Inclura User" },
    customizations: { title: "Inclura Premium Upgrade", description: "Silver membership" },
  });
  const goldPayment = useFlutterwave({
    public_key: publicKey, tx_ref: goldRef, amount: Number(pricing.GoldBadge?.price || 0),
    currency: "NGN", payment_options: "card,banktransfer,ussd",
    customer: { email: auth.currentUser?.email || "", name: auth.currentUser?.displayName || "Inclura User" },
    customizations: { title: "Inclura Premium Upgrade", description: "Gold membership" },
  });
  const platinumPayment = useFlutterwave({
    public_key: publicKey, tx_ref: platinumRef, amount: Number(pricing.PlatinumBadge?.price || 0),
    currency: "NGN", payment_options: "card,banktransfer,ussd",
    customer: { email: auth.currentUser?.email || "", name: auth.currentUser?.displayName || "Inclura User" },
    customizations: { title: "Inclura Premium Upgrade", description: "Platinum membership" },
  });
  const enterprisePayment = useFlutterwave({
    public_key: publicKey, tx_ref: enterpriseRef, amount: Number(pricing.EnterpriseBadge?.price || 0),
    currency: "NGN", payment_options: "card,banktransfer,ussd",
    customer: { email: auth.currentUser?.email || "", name: auth.currentUser?.displayName || "Inclura User" },
    customizations: { title: "Inclura Premium Upgrade", description: "Enterprise membership" },
  });

  async function startPayment(tier, amount, txRef, paymentHandler) {
    if (!auth.currentUser) { alert("Please sign in first."); return; }
    if (!publicKey) { alert("Payment is temporarily unavailable. Please contact support."); return; }
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) { alert("This plan is not currently available for payment."); return; }

    setLoading(true);
    paymentHandler({
      callback: async (response) => {
        try {
          if (response.status !== "successful" || !response.transaction_id) {
            throw new Error("Flutterwave did not report a successful transaction.");
          }
          await verifyFlutterwavePayment({
            purpose: "premium",
            plan: tier,
            transactionId: String(response.transaction_id),
            txRef: response.tx_ref || txRef,
          });
          alert(`${tier.toUpperCase()} membership activated after server verification.`);
        } catch (error) {
          console.error("Premium payment verification failed:", error);
          alert(error.message || "Payment verification is pending. Please contact support before retrying.");
        } finally {
          setLoading(false);
          closePaymentModal();
        }
      },
      onClose: () => setLoading(false),
    });
  }

  return (
    <div style={{ padding: "24px", color: "white" }}>
      <h1>⭐ Premium Membership</h1>
      {[
        ["silver", "SilverBadge", silverRef, silverPayment],
        ["gold", "GoldBadge", goldRef, goldPayment],
        ["platinum", "PlatinumBadge", platinumRef, platinumPayment],
        ["enterprise", "EnterpriseBadge", enterpriseRef, enterprisePayment],
      ].map(([tier, key, txRef, handler]) => (
        <div key={tier} style={{ margin: "18px 0" }}>
          <button
            type="button"
            disabled={loading || !publicKey}
            onClick={() => startPayment(tier, pricing[key]?.price, txRef, handler)}
          >
            {tier[0].toUpperCase() + tier.slice(1)} — ₦{Number(pricing[key]?.price || 0).toLocaleString()}
          </button>
        </div>
      ))}
      {loading && <p role="status">Verifying payment securely…</p>}
    </div>
  );
}

export default PremiumPayment;
