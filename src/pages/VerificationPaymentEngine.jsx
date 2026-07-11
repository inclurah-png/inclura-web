import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {

addDoc,

collection,

serverTimestamp,

} from "firebase/firestore";

import { auth, db } from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

import {

VERIFICATION_PLANS,

IFSE_CONFIG,

} from "../config/pricing";
function VerificationPaymentEngine() {

const navigate = useNavigate();

const currentUser = auth.currentUser;

const [loading, setLoading] = useState(false);

const [error, setError] = useState("");

const [success, setSuccess] = useState("");

const [verificationType, setVerificationType] =
useState("Creator");

const [selectedTier, setSelectedTier] =
useState("");

const [paymentMethod, setPaymentMethod] =
useState("");

const [couponCode, setCouponCode] =
useState("");

const [invoiceRequested, setInvoiceRequested] =
useState(false);

const [acceptedTerms, setAcceptedTerms] =
useState(false);

const [acceptedSecurity, setAcceptedSecurity] =
useState(false);

const PAYMENT_METHODS = [

"Credit Card",

"Debit Card",

"Bank Transfer",

"Enterprise Invoice",

"Private Negotiation",

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

if (paymentMethod === "Private Negotiation")

score += 15;

if (paymentMethod === "Enterprise Invoice")

score += 10;

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

const selectedVerification = useMemo(() => {

switch (verificationType) {

case "Creator":
return VERIFICATION_PLANS.creator;

case "Group":
return VERIFICATION_PLANS.group;

case "Organization":
return VERIFICATION_PLANS.organization;

case "NGO":
return VERIFICATION_PLANS.ngo;

case "Institution":
return VERIFICATION_PLANS.institution;

case "Healthcare":
return VERIFICATION_PLANS.healthcare;

case "Media":
return VERIFICATION_PLANS.media;

case "Corporate":
return VERIFICATION_PLANS.corporate;

case "Government":
return VERIFICATION_PLANS.government;

case "Enterprise":
return VERIFICATION_PLANS.enterprise;

default:
return null;

}

}, [verificationType]);

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

const PAYMENT_COLLECTION =

"verificationPayments";

const AUDIT_COLLECTION =

"paymentAuditLogs";

const SECURITY_COLLECTION =

"ifsePaymentEvents";

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

setLoading(true);

try {

const paymentRef = await addDoc(

collection(db, PAYMENT_COLLECTION),

{

transactionId,

verificationType,

selectedTier,

paymentMethod,

couponCode,

invoiceRequested,

paymentRiskScore,

threatLevel,

paymentSecurityStatus,

requiresExecutiveApproval,

userId: currentUser.uid,

status: "pending",

createdAt: serverTimestamp(),

updatedAt: serverTimestamp(),

}

);

const paymentId = paymentRef.id;

await addDoc(

collection(db, SECURITY_COLLECTION),

{

paymentId,

transactionId,

eventType: "verification_payment_created",

riskScore: paymentRiskScore,

threatLevel,

requiresExecutiveApproval,

reviewed: false,

createdAt: serverTimestamp(),

}

);

  await addDoc(

collection(db, AUDIT_COLLECTION),

{

paymentId,

transactionId,

action: "Verification Payment Submitted",

actor: currentUser.uid,

createdAt: serverTimestamp(),

}

);
  await addDoc(

collection(db, "paymentTimeline"),

{

paymentId,

transactionId,

title: "Payment Submitted",

status: "Pending",

createdAt: serverTimestamp(),

}

);
  setSuccess(

"Verification payment successfully submitted."

);

navigate("/verification-status");

}

catch (err) {

console.error(err);

setError(

"Unable to process verification payment."

);

}

finally {

setLoading(false);

}

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
  <section>

<h2>Pricing</h2>

<pre>

{JSON.stringify(

selectedVerification,

null,

2

)}

</pre>

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

<section>

<h2>Payment Options</h2>

<input

type="text"

placeholder="Coupon Code"

value={couponCode}

onChange={(e)=>

setCouponCode(

e.target.value

)

}

/>

<label>

<input

type="checkbox"

checked={invoiceRequested}

onChange={(e)=>

setInvoiceRequested(

e.target.checked

)

}

/>

Request Enterprise Invoice

</label>

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
