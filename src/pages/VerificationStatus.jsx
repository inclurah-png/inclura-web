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

const verificationSnapshot = await getDocs(verificationQuery);

if (!verificationSnapshot.empty) {
  const documents = verificationSnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });

  setVerification(documents[0]);
} else {
  setVerification(null);
}

  const documents = verificationSnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .sort((a, b) => {

      const aTime =
        a.createdAt?.seconds || 0;

      const bTime =
        b.createdAt?.seconds || 0;

      return bTime - aTime;

    });

  setVerification(documents[0]);

}

catch (err) {

console.error(err);

setError(

"Unable to load verification."

);

}

};

loadVerification();

} else {

  setVerification(null);

  setLoading(false);

}

}, [currentUser]);
  useEffect(() => {

if (!verification) return;

const loadTimeline = async () => {

  try {

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

    const items =
      snapshot.docs.map((doc) => ({

        id: doc.id,

        ...doc.data(),

      }));

    setTimeline(items);

  }

  catch (err) {

    console.error(err);

    setTimeline([]);

  }

};
    loadTimeline();

}, [verification]);

  useEffect(() => {

if (!verification) return;

const loadSecurity = async () => {

  try {

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

    const events =
      snapshot.docs.map((doc) => ({

        id: doc.id,

        ...doc.data(),

      }));

    setSecurityEvents(events);

  }

  catch (err) {

    console.error(err);

    setSecurityEvents([]);

  }

};

loadSecurity();

}, [verification]);
  useEffect(() => {

if (!verification) return;

const loadAuditLogs = async () => {

  try {

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

    const logs =
      snapshot.docs.map((doc) => ({

        id: doc.id,

        ...doc.data(),

      }));

    setAuditLogs(logs);

  }

  catch (err) {

    console.error(err);

    setAuditLogs([]);

  }

  finally {

    setLoading(false);

  }

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

<section
  style={{
    marginBottom: "24px",
    padding: "20px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "12px",
  }}
>

  <h2>Verification Summary</h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(250px,1fr))",
      gap: "18px",
      marginTop: "18px",
    }}
  >

    <div>

      <strong>Verification Type</strong>

      <p>{verification.verificationType}</p>

    </div>

    <div>

      <strong>Status</strong>

      <p>{verification.status}</p>

    </div>

    <div>

      <strong>Risk Score</strong>

      <p>{verification.riskScore}%</p>

    </div>

    <div>

      <strong>Threat Level</strong>

      <p>{verification.threatLevel}</p>

    </div>

    <div>

      <strong>Executive Review</strong>

      <p>
        {verification.executiveReviewRequired
          ? "Required"
          : "Not Required"}
      </p>

    </div>

    <div>

      <strong>Submitted</strong>

      <p>
        {verification.createdAt?.toDate?.().toLocaleString?.() ||
          "Pending"}
      </p>

    </div>

  </div>

</section>

)}
<section
  style={{
    marginBottom: "24px",
    padding: "20px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "12px",
  }}
>

  <h2>IFSE Verification Progress</h2>

  <p
    style={{
      marginBottom: "16px",
    }}
  >
    Overall Progress: <strong>{progress}%</strong>
  </p>

  <div
    style={{
      width: "100%",
      height: "14px",
      background: "#334155",
      borderRadius: "999px",
      overflow: "hidden",
      marginBottom: "24px",
    }}
  >

    <div
      style={{
        width: `${progress}%`,
        height: "100%",
        background:
          progress === 100
            ? "#22c55e"
            : "#3b82f6",
        transition: "0.4s",
      }}
    />

  </div>

  <div
    style={{
      display: "grid",
      gap: "14px",
    }}
  >

    {IFSE_PROGRESS.map((stage, index) => {

      const completed =
        index < timeline.length;

      return (

        <div
          key={stage}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >

          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: completed
                ? "#22c55e"
                : "#475569",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            {completed ? "✓" : index + 1}
          </div>

          <span>{stage}</span>

        </div>

      );

    })}

  </div>

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

  <h2>Verification Timeline</h2>

  {timeline.length === 0 ? (

    <p>No verification events yet.</p>

  ) : (

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        marginTop: "18px",
      }}
    >

      {timeline.map((item, index) => (

        <div
          key={item.id}
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "flex-start",
          }}
        >

          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "#2563eb",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              flexShrink: 0,
            }}
          >
            {index + 1}
          </div>

          <div
            style={{
              flex: 1,
              background: "#1e293b",
              padding: "14px",
              borderRadius: "10px",
            }}
          >

            <strong>{item.title}</strong>

            <br />

            <span>{item.status}</span>

            <br />

            <small
              style={{
                color: "#94a3b8",
              }}
            >
              {item.createdAt?.toDate?.().toLocaleString?.() ||
                "Pending"}
            </small>

          </div>

        </div>

      ))}

    </div>

  )}

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

  <h2>IFSE Security Events</h2>

  {securityEvents.length === 0 ? (

    <p>No IFSE security events recorded.</p>

  ) : (

    <div
      style={{
        display: "grid",
        gap: "16px",
        marginTop: "18px",
      }}
    >

      {securityEvents.map((event) => (

        <div
          key={event.id}
          style={{
            background: "#1e293b",
            padding: "16px",
            borderRadius: "10px",
            border: "1px solid #334155",
          }}
        >

          <h3
            style={{
              marginBottom: "12px",
            }}
          >
            {event.eventType}
          </h3>

          <p>

            <strong>Risk Score:</strong>{" "}

            {event.riskScore}%

          </p>

          <p>

            <strong>Threat Level:</strong>{" "}

            {event.threatLevel}

          </p>

          <p>

            <strong>Executive Review:</strong>{" "}

            {event.executiveReviewRequired
              ? "Required"
              : "Not Required"}

          </p>

          <p>

            <strong>Reviewed:</strong>{" "}

            {event.reviewed
              ? "Yes"
              : "Pending"}

          </p>

          <p>

            <strong>Date:</strong>{" "}

            {event.createdAt?.toDate?.().toLocaleString?.() ||
              "Pending"}

               </p>

        </div>

      ))}

    </div>

  )}

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

  <h2>IFSE Audit Logs</h2>

  {auditLogs.length === 0 ? (

    <p>No audit logs available.</p>

  ) : (

    <div
      style={{
        display: "grid",
        gap: "14px",
        marginTop: "18px",
      }}
    >

      {auditLogs.map((log) => (

        <div
          key={log.id}
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "10px",
            padding: "16px",
          }}
        >

          <p>

            <strong>Action</strong>

          </p>

          <p>

            {log.action}

          </p>

          <p
            style={{
              marginTop: "10px",
            }}
          >

            <strong>Actor</strong>

          </p>

          <p>

            {log.actor || "System"}

          </p>

          <p
            style={{
              marginTop: "10px",
            }}
          >

            <strong>Time</strong>

          </p>

          <p>

            {log.createdAt?.toDate?.().toLocaleString?.() ||
              "Pending"}

          </p>

        </div>

      ))}

    </div>

  )}

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

<section
  style={{
    marginTop: "30px",
    padding: "20px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "12px",
  }}
>

  <h2>IFSE Verification Centre</h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: "16px",
      marginTop: "20px",
    }}
  >

    <button
      type="button"
      onClick={() => navigate("/verification-center")}
    >
      Verification Centre
    </button>

    <button
      type="button"
      onClick={() => navigate("/verification-documents")}
    >
      Upload Additional Documents
    </button>

    <button
      type="button"
      onClick={() => navigate("/creator-verification-payment")}
    >
      Verification Payment
    </button>

    <button
      type="button"
      onClick={() => navigate("/home")}
    >
      Return Home
    </button>

  </div>

</section>

<footer
  style={{
    marginTop: "40px",
    padding: "20px",
    background: "#111827",
    borderRadius: "12px",
    textAlign: "center",
  }}
>

  <h3>Inclura Fortress Security Engine (IFSE)</h3>

  <p>

    Your verification is continuously protected through:

  </p>

  <ul
    style={{
      listStyle: "none",
      padding: 0,
      lineHeight: "2",
    }}
  >

    <li>✅ Identity Verification</li>

    <li>✅ Document Authentication</li>

    <li>✅ OCR Validation</li>

    <li>✅ AI Fraud Detection</li>

    <li>✅ Accessibility Compliance</li>

    <li>✅ Executive Review</li>

    <li>✅ Continuous Monitoring</li>

    <li>✅ Audit Logging</li>

  </ul>

  <p
    style={{
      marginTop: "20px",
      color: "#94a3b8",
    }}
  >

    Powered by the Inclura Fortress Security Engine (IFSE).

  </p>

</footer>

<p>

Verification requests are protected by the

Inclura Fortress Security Engine (IFSE).

Your documents, payment, audit history,

and verification progress are continuously

monitored until verification is completed.

</p>

</div>

</DashboardLayout>

);

}

export default VerificationStatus;
  
