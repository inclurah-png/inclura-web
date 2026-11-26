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

"Identity Verification",

"AI Payment Fraud Detection",

"Chargeback Protection",

"Velocity Monitoring",

"Device Fingerprinting",

"IP Reputation Analysis",

"Country Verification",

"AML Screening",

"Sanctions Screening",

"Continuous Transaction Monitoring",

"Executive Approval",

];

const transactionId = useMemo(() => {

return `IFSE-${Date.now()}`;

}, []);


const calculatePaymentRisk = () => {

let score = 0;

if (!paymentMethod)

score += 20;

if (!acceptedTerms)

score += 20;

if (!acceptedSecurity)

score += 25;

return Math.min(score, 100);

};

const paymentRiskScore =
calculatePaymentRisk();

const threatLevel =

paymentRiskScore >= 75

? "High"

: paymentRiskScore >= 40

? "Medium"

: "Low";

const selectedCategory =
  VERIFICATION_PLANS[verificationType] ||
  (verificationType === "Corporate" ? partnerships.corporate : null) ||
  (verificationType === "Government" ? partnerships.government : null) ||
  (verificationType === "Enterprise" ? partnerships.enterprise : null);

const selectedVerification = useMemo(() => {
  if (!selectedCategory) return null;
  const verificationTypes =
    selectedCategory.verificationTypes || selectedCategory.certification || [];
  const matchingTier = verificationTypes.find(
    (item) => item.id === selectedTier
  );
  return matchingTier || verificationTypes[0] || selectedCategory;
}, [selectedCategory, selectedTier]);

const paymentAmount = useMemo(() => {
  if (!selectedVerification) return 0;
  return Number(
    selectedVerification.monthlyUSD ??
    selectedVerification.yearlyUSD ??
    selectedVerification.monthlyFee ??
    selectedVerification.fee ??
    selectedVerification.contractUSD ??
    0
  );
}, [selectedVerification]);

const flutterwaveConfig = {

  public_key:
    import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,

  tx_ref: flutterwaveTxRef,

  amount: paymentAmount,

  currency: "USD",

  payment_options:
    paymentMethod === "Credit Card" || paymentMethod === "Debit Card"
      ? "card"
      : paymentMethod === "Bank Transfer"
        ? "banktransfer"
        : paymentMethod === "USSD"
          ? "ussd"
          : "card,banktransfer,ussd",

  customer: {

    email:
      currentUser?.email ||
      "user@inclura.com",

    phone_number:
      currentUser?.phoneNumber || "",

    name:
      currentUser?.displayName ||
      "Inclura User",

  },

  customizations: {

    title:
      "Inclura Verification Payment",

    description:
      `${verificationType} Verification`,

    logo: "",

  },

};

const handleFlutterPayment =
  useFlutterwave(flutterwaveConfig);

const paymentSummary = useMemo(() => {

return {

verificationType,

selectedTier,

transactionId,

paymentMethod,

pricing: selectedVerification,

riskScore: paymentRiskScore,

threatLevel,

};

}, [

verificationType,

selectedTier,

transactionId,

paymentMethod,

selectedVerification,

paymentRiskScore,

threatLevel,

]);
  
  const requiresExecutiveApproval =

verificationType === "Enterprise" ||

verificationType === "Corporate" ||

verificationType === "Government" ||

paymentRiskScore >= 60;

const paymentSecurityStatus =

paymentRiskScore >= 75

? "Payment Blocked"

: paymentRiskScore >= 40

? "Manual Review"

: "Approved for Processing";

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

<strong>IFSE Transaction ID:</strong>

{transactionId}

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
          <strong>{t("vaFee")}</strong>
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

<section>

<h2>IFSE Payment Security</h2>

<p>

Risk Score:

<strong>

{paymentRiskScore}%

</strong>

</p>

<p>

Threat Level:

<strong>

{threatLevel}

</strong>

</p>

<p>

Status:

<strong>

{paymentSecurityStatus}

</strong>

</p>

<p>

Executive Review:

<strong>

{requiresExecutiveApproval

? " Required"

: " Not Required"}

</strong>

</p>

</section>

  <section>

<h2>IFSE Protection Layers</h2>

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

I consent to IFSE payment verification,

fraud screening,

security monitoring,

and transaction auditing.

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

  <section className="ifse-payment-notice">

<h2>IFSE Notice</h2>

<p>

Every verification payment is protected by the

Inclura Fortress Security Engine (IFSE).

</p>

<ul>

<li>AI Fraud Detection</li>

<li>Transaction Risk Analysis</li>

<li>Identity Verification</li>

<li>Executive Approval</li>

<li>Audit Logging</li>

<li>Accessibility Compliance</li>

<li>Continuous Monitoring</li>

<li>Enterprise Security Review</li>

</ul>

</section>

  </form>

</div>

</DashboardLayout>

);

}

export default VerificationPaymentEngine;
