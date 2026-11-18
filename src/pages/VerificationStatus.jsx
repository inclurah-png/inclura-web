import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {

collection,

getDocs,

orderBy,

query,

where,

} from "firebase/firestore";

import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import DashboardLayout from "../components/DashboardLayout";
import { getVerificationDocumentAccess } from "../services/cloudinaryUpload";

function VerificationStatus() {
  
const navigate = useNavigate();
const { t } = useTranslation();

// Track the currently signed-in user
const [currentUser, setCurrentUser] = useState(null);

const [loading, setLoading] = useState(true);

const [error, setError] = useState("");

const [verification, setVerification] = useState(null);

const [timeline, setTimeline] = useState([]);

const [securityEvents, setSecurityEvents] = useState([]);

const [auditLogs, setAuditLogs] = useState([]);
const [openingDocument, setOpeningDocument] = useState("");
const [documentError, setDocumentError] = useState("");

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

const completedStages = timeline.filter(
(item) =>
item.status === "Completed" ||
item.status === "Approved"
).length;

return Math.round(
(completedStages / IFSE_PROGRESS.length) * 100
);

}, [timeline]);

// Listen for Firebase Authentication changes
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  });

  return () => unsubscribe();
}, []);

// Load the user's verification request
useEffect(() => {
  if (!currentUser) {
    setVerification(null);
    setLoading(false);
    return;
  }

  const loadVerification = async () => {
    try {
      setLoading(true);

      const verificationQuery = query(
        collection(db, "verificationRequests"),
        where("userId", "==", currentUser.uid)
      );

      const verificationSnapshot = await getDocs(
        verificationQuery
      );

      if (!verificationSnapshot.empty) {
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
      } else {
        setVerification(null);
      }
    } catch (err) {
      console.error(err);

      setError(
        t("error")
      );

      setVerification(null);
    } finally {
      setLoading(false);
    }
  };

  loadVerification();
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

const openVerificationDocument = async (documentRecord) => {
  const popup = window.open("about:blank", "_blank");
  if (!popup) {
    setDocumentError(t("allowPopups"));
    return;
  }
  try {
    setOpeningDocument(documentRecord.fileName || documentRecord.cloudinaryPublicId);
    setDocumentError("");
    popup.document.title = t("openingSecureDocument");
    popup.document.body.innerText = t("authorizingDocument");
    const access = await getVerificationDocumentAccess(verification.id, documentRecord.cloudinaryPublicId);
    popup.location.replace(access.downloadUrl);
  } catch (err) {
    popup.close();
    setDocumentError(err.message || t("error"));
  } finally {
    setOpeningDocument("");
  }
};

  return (

<DashboardLayout>

<div className="verification-status-page">

<h1>{t("verificationStatusTitle")}</h1>

<p>

{t("trackVerification")} 

<strong> Inclura Fortress Security Engine (IFSE)</strong>.

</p>

{loading && <p>{t("loading")}</p>}

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

  <h2>{t("verificationSummary")}</h2>

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

      <strong>{t("verificationType")}</strong>

      <p>{t(verification.verificationType, { defaultValue: String(verification.verificationType || "").replaceAll("_", " ") })}</p>

    </div>

    <div>

      <strong>{t("status")}</strong>

      <p>{t(String(verification.status || "").toLowerCase(), { defaultValue: verification.status })}</p>

    </div>

    <div>

      <strong>{t("riskScore")}</strong>

      <p>
  {Number(
    verification.riskScore ??
    verification.ifseScore ??
    0
  ).toFixed(0)}%
</p>

    </div>

    <div>

      <strong>{t("threatLevel")}</strong>

<p>
  {t(String(verification.threatLevel ?? verification.ifseStatus ?? "pending").toLowerCase(), { defaultValue: verification.threatLevel ?? verification.ifseStatus ?? "Pending Assessment" })}
</p>

    </div>

    <div>

      <strong>{t("executiveReview")}</strong>

      <p>
        {verification.executiveReview
  ? t("required")
  : t("notRequired")}
      </p>

    </div>

    <div>

      <strong>{t("submitted")}</strong>

      <p>
        {verification.createdAt?.toDate?.().toLocaleString?.() ||
          t("pending")}
      </p>

    </div>

  </div>

</section>

)}

{verification && (
  <section style={{ marginBottom: "24px", padding: "20px", background: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }}>
    <h2>{t("secureUploadedDocuments")}</h2>
    <p>{t("privateDocumentsNotice")}</p>
    {documentError && <p role="alert" style={{ color: "#fca5a5" }}>{documentError}</p>}
    {Object.entries(verification.uploadedDocuments || {}).length === 0 ? (
      <p>{t("noDocumentsUploaded")}</p>
    ) : (
      <div style={{ display: "grid", gap: "12px" }}>
        {Object.entries(verification.uploadedDocuments || {}).map(([documentName, documentRecord]) => (
          <div key={documentName} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px", background: "#1e293b", borderRadius: "8px" }}>
            <div><strong>{documentName}</strong><p style={{ margin: "4px 0 0", color: "#cbd5e1" }}>{documentRecord.fileName || t("secureUploadedDocuments")}</p></div>
            {documentRecord.cloudinaryPublicId ? (
              <button type="button" disabled={Boolean(openingDocument)} onClick={() => openVerificationDocument(documentRecord)} style={{ padding: "10px 14px", borderRadius: "8px", border: "none", background: "#0f766e", color: "white", cursor: openingDocument ? "wait" : "pointer" }}>
                {openingDocument === (documentRecord.fileName || documentRecord.cloudinaryPublicId) ? t("authorizing") : t("openSecurely")}
              </button>
            ) : <span style={{ color: "#fbbf24" }}>{t("privateDocumentsNotice")}</span>}
          </div>
        ))}
      </div>
    )}
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

  <h2>{t("verificationProgress")}</h2>

  <p
    style={{
      marginBottom: "16px",
    }}
  >
    {t("overallProgress")}: <strong>{progress}%</strong>
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

  <h2>{t("verificationTimeline")}</h2>

  {timeline.length === 0 ? (

    <p>{t("noVerificationEvents")}</p>

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
                t("pending")}
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

  <h2>{t("ifseSecurityEvents")}</h2>

  {securityEvents.length === 0 ? (

    <p>{t("noSecurityEvents")}</p>

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

            <strong>{t("riskScore")}:</strong>{" "}

            {event.riskScore}%

          </p>

          <p>

            <strong>{t("threatLevel")}:</strong>{" "}

            {event.threatLevel}

          </p>

          <p>

<strong>{t("executiveReview")}:</strong>{" "}

{event.executiveReview
? t("required")
: t("notRequired")}

</p>

<p>

<strong>{t("resolved")}:</strong>{" "}

{event.resolved
? "Yes"
: t("pending")}

</p>

          <p>

            <strong>{t("submitted")}:</strong>{" "}

            {event.createdAt?.toDate?.().toLocaleString?.() ||
              t("pending")}

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

  <h2>{t("ifseAuditLogs")}</h2>

  {auditLogs.length === 0 ? (

    <p>{t("noAuditLogs")}</p>

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

            <strong>{t("verificationRequests")}</strong>

          </p>

          <p>

            {log.action}

          </p>

          <p
            style={{
              marginTop: "10px",
            }}
          >

            <strong>{t("profile")}</strong>

          </p>

          <p>

{log.performedBy || "System"}

</p>

          <p
            style={{
              marginTop: "10px",
            }}
          >

            <strong>{t("submitted")}</strong>

          </p>

          <p>

            {log.createdAt?.toDate?.().toLocaleString?.() ||
              t("pending")}

          </p>

        </div>

      ))}

    </div>

  )}

</section>

  <section>

<h2>{t("ifseProtection")}</h2>

<ul>

<li>✅ {t("verificationType")}</li>

<li>✅ {t("secureUploadedDocuments")}</li>

<li>✅ AI Fraud Detection</li>

<li>✅ Malware Protection</li>

<li>✅ Accessibility Validation</li>

<li>✅ Executive Review</li>

<li>✅ Continuous Monitoring</li>

<li>✅ {t("ifseAuditLogs")}</li>

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

  <h2>{t("verificationCentre")}</h2>

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
      {t("uploadAdditionalDocuments")}
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

    <li>✅ {t("verificationType")}</li>

    <li>✅ {t("secureUploadedDocuments")}</li>

    <li>✅ OCR Validation</li>

    <li>✅ AI Fraud Detection</li>

    <li>✅ Accessibility Compliance</li>

    <li>✅ Executive Review</li>

    <li>✅ Continuous Monitoring</li>

    <li>✅ {t("ifseAuditLogs")}</li>

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
  
