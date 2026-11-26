import {
  useFlutterwave,
  closePaymentModal,
} from "flutterwave-react-v3";

import {
  IFSE_CONFIG,
  VERIFICATION_PLANS,
  partnerships,
} from "../config";

import { useEffect, useMemo, useState } from "react";

const makeVerificationTxRef = (uid) => "INCLURA-VERIFICATION-" + (uid || "USER") + "-" + (globalThis.crypto?.randomUUID?.() || (Date.now() + "-" + Math.random().toString(36).slice(2, 10)));

import { useLocation, useNavigate } from "react-router-dom";

import { auth } from "../firebase";
import { verifyFlutterwavePayment } from "../services/verifyFlutterwavePayment";
import { onAuthStateChanged } from "firebase/auth";

import DashboardLayout from "../components/DashboardLayout";

function VerificationPaymentEngine() {

const navigate = useNavigate();
const location = useLocation();
const routeState = location.state || {};
const verificationId = routeState.verificationId || "";

const [currentUser, setCurrentUser] = useState(null);

const [loading, setLoading] = useState(false);
const [flutterwaveTxRef, setFlutterwaveTxRef] = useState(() => makeVerificationTxRef(auth.currentUser?.uid));

const [error, setError] = useState("");

const [success, setSuccess] = useState("");

const [verificationType, setVerificationType] =
useState(routeState.category || "creator");

const [selectedTier, setSelectedTier] =
useState(routeState.verificationType || "");

const [paymentMethod, setPaymentMethod] =
useState("");

const [acceptedTerms, setAcceptedTerms] =
useState(false);

const [acceptedSecurity, setAcceptedSecurity] =
useState(false);

// Resolve the selected fee from Inclura's published verification catalogue.
// Never use a browser-supplied amount as the source of truth.
const selectedVerification = useMemo(() => {
  const category = String(verificationType || "").toLowerCase();
  const catalogue = VERIFICATION_PLANS[category];
  const entries = catalogue?.verificationTypes || catalogue?.certification || [];
  return entries.find((item) => item.id === selectedTier) || null;
}, [verificationType, selectedTier]);

const paymentAmount = Number(
  selectedVerification?.monthlyUSD ??
  selectedVerification?.yearlyUSD ??
  selectedVerification?.monthlyFee ??
  selectedVerification?.fee ??
  selectedVerification?.contractUSD ??
  0
);

const flutterwaveConfig = {
  public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || "",
  tx_ref: flutterwaveTxRef,
  amount: paymentAmount,
  currency: "USD",
  payment_options: paymentMethod === "Bank Transfer" ? "banktransfer" :
    paymentMethod === "USSD" ? "ussd" : "card",
  customer: {
    email: currentUser?.email || "",
    name: currentUser?.displayName || "Inclura Member",
  },
  customizations: {
    title: "Inclura Verification",
    description: "IFSE verification application payment",
    logo: "",
  },
};
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(
    auth,
    (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    }
  );

  return () => unsubscribe();
}, []);
  const PAYMENT_METHODS = [

"Credit Card",

"Debit Card",

"Bank Transfer",

"USSD",

];

const IFSE_PAYMENT_SECURITY = [
  "Authenticated Inclura account required",
  "Server-side Flutterwave transaction verification",
  "Transaction ID and reference validation",
  "Account email, amount and currency matching",
  "Duplicate transaction protection",
  "Payment and identity approval kept separate",
];

const handleFlutterPayment =
  useFlutterwave(flutterwaveConfig);

const handlePayment = async (e) => {

  e.preventDefault();

  setError("");
  setSuccess("");

  if (!currentUser) {
    setError("Please sign in before making a payment.");
    return;
  }

  if (!paymentMethod) {
    setError("Please select a payment method.");
    return;
  }

  if (!acceptedTerms) {
    setError("You must accept the payment terms.");
    return;
  }

  if (!acceptedSecurity) {
    setError("You must consent to IFSE payment verification.");
    return;
  }

  if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
    setError("A valid verification fee was not found for this application. Please return to your verification application and select a priced verification type.");
    return;
  }

  if (!import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY) {
    setError("Payment is temporarily unavailable because the payment gateway is not configured.");
    return;
  }

  setLoading(true);

  handleFlutterPayment({

    callback: async (response) => {

      try {

        if (response.status !== "successful") {

          setError("Payment was not successful.");

          closePaymentModal();

          setLoading(false);

          return;

        }

        if (!verificationId) {
          throw new Error("The verification application reference is missing. Please reopen payment from your submitted application.");
        }

        await verifyFlutterwavePayment({
          purpose: "verification",
          verificationId,
          transactionId: String(response.transaction_id),
          txRef: response.tx_ref || flutterwaveTxRef,
          paymentMethod,
        });

        setSuccess(

          "Verification payment completed successfully."

        );

        closePaymentModal();

        navigate("/verification-status");

      } catch (err) {

        console.error(err);

        setError(

          "Unable to finalize verification payment."

        );

      }

      setLoading(false);
      setFlutterwaveTxRef(makeVerificationTxRef(currentUser?.uid));

    },

    onClose: () => {

      setLoading(false);
      setFlutterwaveTxRef(makeVerificationTxRef(currentUser?.uid));

    },

  });

};

  return (

<DashboardLayout>

<div className="verification-payment-engine">

<h1>IFSE Verification Payment</h1>

<p>

Complete your verification payment securely through the

<strong> Inclura Fortress Security Engine (IFSE)</strong>.

</p>

{error && (

<div className="error-message">

{error}

</div>

)}

{success && (

<div className="success-message">

{success}

</div>

)}

<form onSubmit={handlePayment}>
  <section>

<h2>Verification Summary</h2>

<p>

<strong>Verification:</strong>

{verificationType}

</p>

<p>

<strong>Selected Tier:</strong>

{selectedTier || "Not Selected"}

</p>

<p>

<strong>Checkout Reference:</strong>

{flutterwaveTxRef}

</p>

</section>
  
<section
  style={{
    marginBottom: "24px",
    padding: "20px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "12px",
  }}
>
  <h2>Verification Pricing</h2>

  {!selectedVerification ? (

    <p>No pricing found.</p>

  ) : (

    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: "18px",
          marginTop: "18px",
        }}
      >

        <div>
          <strong>Verification fee</strong>
          <p>
            $
            {selectedVerification.monthlyUSD ??
              selectedVerification.yearlyUSD ??
              selectedVerification.monthlyFee ??
              selectedVerification.fee ??
              selectedVerification.contractUSD ??
              0}
          </p>
        </div>

        <div>
          <strong>Renewal</strong>
          <p>
            {selectedVerification.renewal ??
              "Monthly"}
          </p>
        </div>

        <div>
          <strong>Badge</strong>
          <p>
            {selectedVerification.badge ??
              "Verified"}
          </p>
        </div>

        <div>
          <strong>Status</strong>
          <p>
            Awaiting Payment
          </p>
          <small style={{ color: "#facc15" }}>
            Verification becomes active only after payment is confirmed and the application is approved.
          </small>
        </div>

      </div>

      {selectedVerification.features && (

        <div
          style={{
            marginTop: "24px",
          }}
        >

          <h3>Benefits</h3>

          <ul>

            {selectedVerification.features.map(
              (feature) => (

                <li key={feature}>
                  ✅ {feature}
                </li>

              )
            )}

          </ul>

        </div>

      )}
    </>

  )}

</section>
  
  <section>

<h2>Payment Method</h2>

<select

value={paymentMethod}

onChange={(e)=>

setPaymentMethod(e.target.value)

}

>

<option value="">

Select Payment Method

</option>

{PAYMENT_METHODS.map(method=>(

<option

key={method}

value={method}

>

{method}

</option>

))}

</select>

</section>

<section aria-label="Additional payment guidance">
  <p>
    Enterprise invoices and negotiated contract fees are handled through
    Inclura's Corporate and Enterprise Partnership applications, not this
    online checkout.
  </p>
</section>

<section aria-label="Payment verification status">
  <h2>Payment Verification</h2>
  <p>
    IFSE verifies successful payments directly with Flutterwave and checks the
    transaction reference, account email, amount and currency. Payment
    confirmation does not itself approve identity or issue a verification badge.
  </p>
</section>

  <section>

<h2>IFSE Payment Verification Checks</h2>

<ul>

{IFSE_PAYMENT_SECURITY.map(layer => (

<li key={layer}>

✅ {layer}

</li>

))}

</ul>

</section>

  <section>

<h2>Payment Agreements</h2>

<label>

<input

type="checkbox"

checked={acceptedTerms}

onChange={(e)=>

setAcceptedTerms(

e.target.checked

)

}

/>

I agree to the Verification Payment Terms.

</label>

<br /><br />

<label>

<input

type="checkbox"

checked={acceptedSecurity}

onChange={(e)=>

setAcceptedSecurity(

e.target.checked

)

}

/>

I consent to IFSE verifying the transaction details with Flutterwave and recording the payment confirmation for security and audit purposes.

</label>

</section>

<div className="payment-actions">

<button

type="submit"

disabled={

loading ||

!acceptedTerms ||

!acceptedSecurity

}

>

{

loading

?

"Processing Payment..."

:

"Proceed to Secure Payment"

}

</button>

<button

type="button"

onClick={()=>

navigate("/verification-documents")

}

>

Back

</button>

</div>

  

  </form>

</div>

</DashboardLayout>

);

}

export default VerificationPaymentEngine;
