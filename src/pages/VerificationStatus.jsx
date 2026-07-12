import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {

collection,

getDocs,

orderBy,

query,

where,

} from "firebase/firestore";

import { auth, db } from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

import { IFSE_CONFIG } from "../config";

function VerificationStatus() {

const navigate = useNavigate();

const currentUser = auth.currentUser;

const [loading, setLoading] = useState(true);

const [error, setError] = useState("");

const [verification, setVerification] = useState(null);

const [timeline, setTimeline] = useState([]);

const [securityEvents, setSecurityEvents] = useState([]);

const [auditLogs, setAuditLogs] = useState([]);

const VERIFICATION_STATUS = {

SUBMITTED: "Submitted",

PAYMENT_PENDING: "Payment Pending",

PAYMENT_COMPLETED: "Payment Completed",

DOCUMENT_REVIEW: "Document Review",

IDENTITY_VERIFICATION: "Identity Verification",

SECURITY_SCAN: "IFSE Security Scan",

ACCESSIBILITY_REVIEW: "Accessibility Review",

EXECUTIVE_REVIEW: "Executive Review",

APPROVED: "Approved",

REJECTED: "Rejected",

BADGE_ISSUED: "Badge Issued",

CERTIFICATE_GENERATED: "Certificate Generated",

ACTIVE: "Verification Active",

};

const IFSE_PROGRESS = [

"Application Submitted",

"Payment Verified",

"Documents Verified",

"Identity Confirmed",

"AI Fraud Detection",

"Accessibility Validation",

"Risk Assessment",

"Executive Approval",

"Badge Generated",

"Certificate Generated",

"Verification Activated",

];

const progress = useMemo(() => {

if (!timeline.length) return 0;

return Math.round(

(timeline.length /

IFSE_PROGRESS.length)

* 100

);

}, [timeline]);

useEffect(() => {

if (!currentUser) {

setLoading(false);

return;

}

const loadVerification = async () => {

try {

const verificationQuery = query(

collection(db, "verificationRequests"),

where("submittedBy", "==", currentUser.uid)

);

const verificationSnapshot =

await getDocs(verificationQuery);

if (!verificationSnapshot.empty) {

const doc = verificationSnapshot.docs[0];

setVerification({

id: doc.id,

...doc.data(),

});

}

}

catch (err) {

console.error(err);

setError(

"Unable to load verification."

);

}

};

loadVerification();

}, [currentUser]);
  useEffect(() => {

if (!verification) return;

const loadTimeline = async () => {

const timelineQuery = query(

collection(db, "verificationTimeline"),

where(

"verificationId",

"==",

verification.id

),

orderBy("createdAt", "asc")

);

const snapshot =

await getDocs(timelineQuery);

setTimeline(

snapshot.docs.map(doc=>({

id: doc.id,

...doc.data(),

}))

);

};

loadTimeline();

}, [verification]);
  useEffect(() => {

if (!verification) return;

const loadSecurity = async () => {

const securityQuery = query(

collection(db, "ifseSecurityEvents"),

where(

"verificationId",

"==",

verification.id

)

);

const snapshot =

await getDocs(securityQuery);

setSecurityEvents(

snapshot.docs.map(doc=>({

id: doc.id,

...doc.data(),

}))

);

};

loadSecurity();

}, [verification]);
  useEffect(() => {

if (!verification) return;

const loadAuditLogs = async () => {

const auditQuery = query(

collection(db, "verificationAuditLogs"),

where(

"verificationId",

"==",

verification.id

),

orderBy("createdAt", "desc")

);

const snapshot =

await getDocs(auditQuery);

setAuditLogs(

snapshot.docs.map(doc=>({

id: doc.id,

...doc.data(),

}))

);

setLoading(false);

};

loadAuditLogs();

}, [verification]);
  return (

<DashboardLayout>

<div className="verification-status-page">

<h1>Verification Status</h1>

<p>

Track your verification progress through the

<strong> Inclura Fortress Security Engine (IFSE)</strong>.

</p>

{loading && <p>Loading verification...</p>}

{error && (

<div className="error-message">

{error}

</div>

)}

  {verification && (

<section>

<h2>Verification Summary</h2>

<p>

<strong>Verification Type:</strong>

{verification.verificationType}

</p>

<p>

<strong>Status:</strong>

{verification.status}

</p>

<p>

<strong>Submitted:</strong>

{verification.createdAt?.toDate?.().toLocaleString?.() || "Pending"}

</p>

</section>

)}
  <section>

<h2>IFSE Progress</h2>

<p>

Progress: {progress}%

</p>

<progress

value={progress}

max="100"

/>

</section>

  <section>

<h2>Verification Timeline</h2>

<ul>

{timeline.map(item => (

<li key={item.id}>

<strong>{item.title}</strong>

<br />

{item.status}

</li>

))}

</ul>

</section>

  <section>

<h2>IFSE Security Events</h2>

<ul>

{securityEvents.map(event => (

<li key={event.id}>

<strong>{event.eventType}</strong>

<br />

Risk Score: {event.riskScore}

<br />

Threat Level: {event.threatLevel}

</li>

))}

</ul>

</section>

  <section>

<h2>Audit Logs</h2>

<ul>

{auditLogs.map(log => (

<li key={log.id}>

{log.action}

</li>

))}

</ul>

</section>

  <section>

<h2>IFSE Protection</h2>

<ul>

<li>✅ Identity Verification</li>

<li>✅ Document Authentication</li>

<li>✅ AI Fraud Detection</li>

<li>✅ Malware Protection</li>

<li>✅ Accessibility Validation</li>

<li>✅ Executive Review</li>

<li>✅ Continuous Monitoring</li>

<li>✅ Audit Logging</li>

</ul>

</section>

  <div className="verification-actions">

<button

type="button"

onClick={() => navigate("/home")}

>

Return Home

</button>

<button

type="button"

onClick={() => navigate("/verification-documents")}

>

Upload More Documents

</button>

</div>

  <footer>

<p>

Verification requests are protected by the

Inclura Fortress Security Engine (IFSE).

Your documents, payment, audit history,

and verification progress are continuously

monitored until verification is completed.

</p>

</footer>

</div>

</DashboardLayout>

);

}

export default VerificationStatus;
  
