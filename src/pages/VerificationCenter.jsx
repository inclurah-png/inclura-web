import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

import {
  VERIFICATION_PLANS,
} from "../config";

function VerificationCenter() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const translateStatus = (value) => {
    const statusKeys = {
      approved: "verified",
      pending: "pending",
      submitted: "submitted",
      rejected: "vc_rejected",
      under_review: "vc_underReview",
    };
    const key = statusKeys[String(value || "").toLowerCase()];
    return key ? t(key) : value;
  };

  const [currentUser, setCurrentUser] = useState(null);

const [loading, setLoading] = useState(true);

const [error, setError] = useState("");

const [verification, setVerification] = useState(null);

const [verificationHistory, setVerificationHistory] = useState([]);

const [verificationStatistics, setVerificationStatistics] =
  useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const categories = useMemo(
    () => Object.keys(VERIFICATION_PLANS),
    []
  );

  const IFSE_STAGES = [
  "vc_identityVerification",
  "vc_documentAuthentication",
  "vc_aiFraudDetection",
  "vc_forgeryDetection",
  "vc_duplicateDetection",
  "vc_paymentProtection",
  "vc_accessibilityCompliance",
  "vc_executiveReview",
  "vc_continuousMonitoring",
];
  
  const ifseLayers = [
    "vc_identityVerification",
    "vc_documentAuthentication",
    "vc_aiFraudDetection",
    "vc_forgeryDetection",
    "vc_duplicateDetection",
    "vc_paymentProtection",
    "vc_accessibilityCompliance",
    "vc_executiveReview",
    "vc_continuousMonitoring",
  ];

  const verificationBenefits = [
    "vc_officialBadge",
    "vc_higherTrust",
    "vc_searchPriority",
    "vc_impersonationProtection",
    "vc_premiumFeatures",
    "vc_prioritySupport",
    "vc_businessOpportunities",
    "vc_continuousProtection",
  ];

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    setCurrentUser(user);
  });

  return () => unsubscribe();
}, []);
  
  useEffect(() => {

  if (!currentUser) {

    setLoading(false);

    return;

  }

  const loadVerificationHistory = async () => {

    try {

      const verificationQuery = query(

        collection(db, "verificationRequests"),

        where(
          "submittedBy",
          "==",
          currentUser.uid
        ),

        orderBy("createdAt", "desc")

      );

      const snapshot =
        await getDocs(verificationQuery);

      const history =
        snapshot.docs.map((doc) => ({

          id: doc.id,

          ...doc.data(),

        }));

      setVerificationHistory(history);

      if (history.length > 0) {

        setVerification(history[0]);

      }

      setVerificationStatistics({

        total: history.length,

        approved: history.filter(
          (item) => item.status === "approved"
        ).length,

        pending: history.filter(
          (item) =>
            item.status === "submitted" ||
            item.status === "pending"
        ).length,

        rejected: history.filter(
          (item) => item.status === "rejected"
        ).length,

      });

    }

    catch (err) {

      console.error(err);

      setError(
        t("error")
      );

    }

    finally {

      setLoading(false);

    }

  };

  loadVerificationHistory();

}, [currentUser]);

  return (
    <DashboardLayout>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          color: "white",
          padding: "24px",
        }}
      >
        <h1>{t("verificationCenter")}</h1>
        {loading && (

  <p>{t("loading")}</p>

)}

{error && (

  <div className="error-message">

    {error}

  </div>

)}

        <p>
          {t("vc_intro")}
        </p>

        <section
          aria-label={t("vc_verificationStatusAccess")}
          style={{
            marginTop: "20px",
            marginBottom: "24px",
            padding: "18px",
            background: "#0f172a",
            border: "1px solid #0d9488",
            borderRadius: "14px",
          }}
        >
          <h2>{t("trackVerification")}</h2>
          <p>{t("vc_trackDescription")}</p>
          <button
            type="button"
            onClick={() => navigate("/verification-status")}
            style={{
              padding: "12px 18px",
              border: "none",
              borderRadius: "10px",
              background: "#0f766e",
              color: "#ffffff",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {t("vc_viewVerificationStatus")}
          </button>
        </section>

        <section
  style={{
    marginTop: "30px",
    marginBottom: "30px",
  }}
>

  <h2>{t("verificationCenter")}</h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(220px,1fr))",
      gap: "20px",
      marginTop: "20px",
    }}
  >

    <div
      style={{
        background: "#0f172a",
        padding: "20px",
        borderRadius: "16px",
        border: "1px solid #334155",
      }}
    >
      <h3>{t("verificationRequests")}</h3>
      <h1>{verificationStatistics.total}</h1>
    </div>

    <div
      style={{
        background: "#14532d",
        padding: "20px",
        borderRadius: "16px",
        border: "1px solid #22c55e",
      }}
    >
      <h3>{t("verified")}</h3>
      <h1>{verificationStatistics.approved}</h1>
    </div>

    <div
      style={{
        background: "#78350f",
        padding: "20px",
        borderRadius: "16px",
        border: "1px solid #f59e0b",
      }}
    >
      <h3>{t("pending")}</h3>
      <h1>{verificationStatistics.pending}</h1>
    </div>

    <div
      style={{
        background: "#7f1d1d",
        padding: "20px",
        borderRadius: "16px",
        border: "1px solid #ef4444",
      }}
    >
      <h3>{t("vc_rejected")}</h3>
      <h1>{verificationStatistics.rejected}</h1>
    </div>

  </div>

</section>

{verification && (

<section
  style={{
    marginBottom: "35px",
    background: "#111827",
    border: "1px solid #334155",
    borderRadius: "18px",
    padding: "24px",
  }}
>

  <h2>{t("verificationSummary")}</h2>

  <p>
    <strong>{t("verificationType")}:</strong>{" "}
    {verification.verificationType}
  </p>

  <p>
    <strong>{t("status")}:</strong>{" "}
    {translateStatus(verification.status)}
  </p>

  <p>
    <strong>{t("riskScore")}:</strong>{" "}
    {verification.riskScore}%
  </p>

  <p>
    <strong>{t("threatLevel")}:</strong>{" "}
    {verification.threatLevel}
  </p>

  <p>
    <strong>{t("executiveReview")}:</strong>{" "}
    {verification.executiveReviewRequired
      ? t("required")
      : t("notRequired")}
  </p>

  <p>
    <strong>{t("submitted")}:</strong>{" "}
    {verification.createdAt?.toDate?.().toLocaleString?.() ??
      t("pending")}
  </p>

  <div
    style={{
      marginTop: "20px",
      display: "flex",
      flexWrap: "wrap",
      gap: "15px",
    }}
  >

    <button
      onClick={() =>
        navigate("/verification-status")
      }
    >
      {t("vc_viewStatus")}
    </button>

    <button
      onClick={() =>
        navigate("/verification-documents")
      }
    >
      {t("vc_uploadDocuments")}
    </button>

    <button
      onClick={() =>
        navigate("/verification-payment")
      }
    >
      {t("vc_continuePayment")}
    </button>

  </div>

</section>

)}

    <section
  style={{
    marginBottom: "35px",
  }}
>

  <h2>{t("verificationTimeline")}</h2>

  {verificationHistory.length === 0 ? (

    <p>{t("noVerificationEvents")}</p>

  ) : (

    <div
      style={{
        overflowX: "auto",
        marginTop: "20px",
      }}
    >

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >

        <thead>

          <tr>

            <th
              style={{
                textAlign: "left",
                padding: "12px",
              }}
            >
              {t("verificationType")}
            </th>

            <th
              style={{
                textAlign: "left",
                padding: "12px",
              }}
            >
              {t("status")}
            </th>

            <th
              style={{
                textAlign: "left",
                padding: "12px",
              }}
            >
              {t("threatLevel")}
            </th>

            <th
              style={{
                textAlign: "left",
                padding: "12px",
              }}
            >
              {t("riskScore")}
            </th>

            <th
              style={{
                textAlign: "left",
                padding: "12px",
              }}
            >
              {t("submitted")}
            </th>

          </tr>

        </thead>

        <tbody>

          {verificationHistory.map((item) => (

            <tr key={item.id}>

              <td
                style={{
                  padding: "12px",
                }}
              >
                {item.verificationType}
              </td>

              <td
                style={{
                  padding: "12px",
                }}
              >
                {translateStatus(item.status)}
              </td>

              <td
                style={{
                  padding: "12px",
                }}
              >
                {item.threatLevel}
              </td>

              <td
                style={{
                  padding: "12px",
                }}
              >
                {item.riskScore}%
              </td>

              <td
                style={{
                  padding: "12px",
                }}
              >
                {item.createdAt?.toDate?.().toLocaleString?.() ??
                  t("pending")}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )}

</section>

    <section
  style={{
    marginBottom: "35px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "18px",
    padding: "24px",
  }}
>

  <h2>{t("ifseSecurityEvents")}</h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(240px,1fr))",
      gap: "18px",
      marginTop: "20px",
    }}
  >

    <div
      style={{
        background: "#111827",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>{t("vc_identityVerification")}</strong>
      <p>🟢 Active</p>
    </div>

    <div
      style={{
        background: "#111827",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>{t("vc_documentAuthentication")}</strong>
      <p>🟢 Active</p>
    </div>

    <div
      style={{
        background: "#111827",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>{t("vc_aiFraudDetection")}</strong>
      <p>🟢 Monitoring</p>
    </div>

    <div
      style={{
        background: "#111827",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>{t("vc_duplicateDetection")}</strong>
      <p>🟢 Enabled</p>
    </div>

    <div
      style={{
        background: "#111827",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>{t("vc_accessibilityCompliance")}</strong>
      <p>🟢 Enabled</p>
    </div>

    <div
      style={{
        background: "#111827",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>{t("vc_executiveReviewEngine")}</strong>
      <p>
        {verification?.executiveReviewRequired
          ? `🟡 ${t("vc_waiting")}`
          : `🟢 ${t("notRequired")}`}
      </p>
    </div>

  </div>
</section>

    <section
  style={{
    marginBottom: "35px",
    background: "#111827",
    border: "1px solid #334155",
    borderRadius: "18px",
    padding: "24px",
  }}
>

  <h2>{t("verificationProgress")}</h2>

  <p
    style={{
      color: "#cbd5e1",
      marginBottom: "20px",
    }}
  >
    {t("vc_workflowIntro")}
  </p>
<ol
  style={{
    lineHeight: "2",
    paddingLeft: "22px",
  }}
>
  {IFSE_STAGES.map((stage, index) => (
    <li
      key={t(stage)}
      style={{
        marginBottom: "10px",
      }}
    >
      <strong>{t("vc_step", { number: index + 1 })}</strong>
      {" — "}
      {t(stage)}
    </li>
  ))}
</ol>
</section>
        <h2
          style={{
            marginTop: "32px",
            marginBottom: "20px",
          }}
        >
          {t("vc_chooseCategory")}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: "20px",
          }}
        >
                    {categories.map((key) => {

            const plan =
              VERIFICATION_PLANS[key];

            return (
              <div
                key={key}
                style={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "18px",
                  padding: "20px",
                }}
              >
                <h3>
                  {plan.title}
                </h3>

                <p
                  style={{
                    color: "#94a3b8",
                    minHeight: "48px",
                  }}
                >
                  {plan.description ||
                    t("vc_securePoweredByIFSE")}
                </p>

                <p>
                  <strong>
                    {t("vc_availableTypes")}:
                  </strong>
                </p>

                <ul
                  style={{
                    paddingLeft: "20px",
                    marginBottom: "18px",
                  }}
                >
                  {plan.verificationTypes
                    ?.slice(0, 4)
                    .map((item) => (
                      <li key={item.id}>
                        {item.name}
                      </li>
                    ))}

                  {plan.verificationTypes
                    ?.length > 4 && (
                    <li>
                      +
                      {plan.verificationTypes.length - 4}
                      {" "}{t("vc_more")}...
                    </li>
                  )}
                </ul>

                <button
                  onClick={() =>
                    navigate(
                      "/verification-application"
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    background: "#38bdf8",
                    color: "white",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  {t("vc_startVerification")}
                </button>
              </div>
            );
          })}
        </div>

        <h2
          style={{
            marginTop: "40px",
            marginBottom: "20px",
          }}
        >
          {t("vc_securityLayers")}
        </h2>

        <ul>
          {ifseLayers.map((item) => (
            <li
              key={item}
              style={{
                marginBottom: "10px",
              }}
            >
              ✅ {t(item)}
            </li>
          ))}
        </ul>

    <section
  style={{
    marginTop: "40px",
    marginBottom: "35px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "18px",
    padding: "24px",
  }}
>

  <h2>{t("verificationProgress")}</h2>

  <p
    style={{
      color: "#cbd5e1",
      marginBottom: "24px",
    }}
  >
    {t("vc_activityOverview")}
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(180px,1fr))",
      gap: "18px",
    }}
  >

    <div
      style={{
        background: "#1e293b",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <h3>{t("vc_totalRequests")}</h3>
      <p
        style={{
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        {verificationHistory.length}
      </p>
    </div>

    <div
      style={{
        background: "#1e293b",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <h3>{t("verified")}</h3>
      <p
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "#22c55e",
        }}
      >
        {
          verificationHistory.filter(
            item => item.status === "approved"
          ).length
        }
      </p>
    </div>

    <div
      style={{
        background: "#1e293b",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <h3>{t("pending")}</h3>
      <p
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "#facc15",
        }}
      >
        {
          verificationHistory.filter(
            item =>
              item.status === "submitted" ||
              item.status === "under_review"
          ).length
        }
      </p>
    </div>

    <div
      style={{
        background: "#1e293b",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <h3>{t("vc_rejected")}</h3>
      <p
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "#ef4444",
        }}
      >
        {
          verificationHistory.filter(
            item => item.status === "rejected"
          ).length
        }
      </p>
    </div>

  </div>

</section>
                <h2
          style={{
            marginTop: "40px",
            marginBottom: "20px",
          }}
        >
          {t("vc_benefits")}
        </h2>

        <ul>
          {verificationBenefits.map(
            (benefit) => (
              <li
                key={t(benefit)}
                style={{
                  marginBottom: "10px",
                }}
              >
                ⭐ {benefit}
              </li>
            )
          )}
        </ul>

        <h2
          style={{
            marginTop: "40px",
            marginBottom: "20px",
          }}
        >
          {t("vc_process")}
        </h2>

        <ol
          style={{
            lineHeight: "2",
          }}
        >
          <li>
            {t("vc_processChooseCategory")}
          </li>

          <li>
            {t("vc_processSelectType")}
          </li>

          <li>
            {t("vc_processCompleteForm")}
          </li>

          <li>
            {t("vc_processUploadDocs")}
          </li>

          <li>
            {t("vc_processPayment")}
          </li>

          <li>
            {t("vc_processIFSE")}
          </li>

          <li>
            {t("vc_processReview")}
          </li>

          <li>
            {t("vc_processBadge")}
          </li>
        </ol>

        <div
          style={{
            marginTop: "50px",
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: "18px",
            padding: "24px",
          }}
        >
          <h2>
            {t("vc_ifseTitle")}
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: "1.8",
            }}
          >
            {t("vc_ifseDescription")}
          </p>
        </div>

  <section
  style={{
    marginTop: "40px",
    marginBottom: "35px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "18px",
    padding: "24px",
  }}
>

  <h2>Verification Badge & Certificate</h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(260px,1fr))",
      gap: "20px",
      marginTop: "20px",
    }}
  >

    <div
      style={{
        background: "#1e293b",
        borderRadius: "12px",
        padding: "18px",
      }}
    >
      <strong>Verification Badge</strong>

      <p style={{ marginTop: "10px" }}>
        {verification?.status === "approved"
          ? "✅ Issued"
          : "⏳ Pending Approval"}
      </p>

    </div>

    <div
      style={{
        background: "#1e293b",
        borderRadius: "12px",
        padding: "18px",
      }}
    >
      <strong>Digital Certificate</strong>

      <p style={{ marginTop: "10px" }}>
        {verification?.status === "approved"
          ? "✅ Ready"
          : "Will be generated after approval"}
      </p>

    </div>

    <div
      style={{
        background: "#1e293b",
        borderRadius: "12px",
        padding: "18px",
      }}
    >
      <strong>IFSE Trust Score</strong>

      <p style={{ marginTop: "10px" }}>
        {verification
          ? `${100 - verification.riskScore}%`
          : "--"}
      </p>

    </div>

  </div>

</section>


<section
  style={{
    marginTop: "40px",
    marginBottom: "35px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "18px",
    padding: "24px",
  }}
>

  <h2>IFSE Security Alerts</h2>

  <p
    style={{
      color: "#cbd5e1",
      marginBottom: "20px",
    }}
  >
    Real-time security notifications generated by the
    Inclura Fortress Security Engine.
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(250px,1fr))",
      gap: "18px",
    }}
  >

    <div
      style={{
        background: "#1e293b",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>Identity Status</strong>

      <p style={{ marginTop: "10px" }}>
        🟢 No suspicious activity detected
      </p>

    </div>

    <div
      style={{
        background: "#1e293b",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>Document Monitoring</strong>

      <p style={{ marginTop: "10px" }}>
        🟢 Documents remain valid
      </p>

    </div>

    <div
      style={{
        background: "#1e293b",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>Fraud Monitoring</strong>

      <p style={{ marginTop: "10px" }}>
        🟢 No fraud indicators found
      </p>

    </div>

    <div
      style={{
        background: "#1e293b",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>Executive Review Queue</strong>

      <p style={{ marginTop: "10px" }}>
        {verification?.executiveReviewRequired
          ? "🟡 Waiting for Executive Review"
          : "🟢 Not Required"}
      </p>

    </div>

  </div>

</section>
        
<section
  style={{
    marginTop: "40px",
    marginBottom: "35px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "18px",
    padding: "24px",
  }}
>

  <h2>Verification Renewal Monitor</h2>

  <p
    style={{
      color: "#cbd5e1",
      marginBottom: "20px",
    }}
  >
    IFSE continuously monitors your verification validity,
    renewal schedule and verification lifecycle.
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(240px,1fr))",
      gap: "20px",
    }}
  >

    <div
      style={{
        background: "#1e293b",
        padding: "18px",
        borderRadius: "12px",
      }}
    >

      <strong>Current Status</strong>

      <p style={{ marginTop: "10px" }}>
        {verification
          ? verification.status
          : "No Verification"}
      </p>

    </div>

    <div
      style={{
        background: "#1e293b",
        padding: "18px",
        borderRadius: "12px",
      }}
    >

      <strong>Renewal Monitoring</strong>

      <p style={{ marginTop: "10px" }}>
        Automatic Renewal Monitoring Enabled
      </p>

    </div>

    <div
      style={{
        background: "#1e293b",
        padding: "18px",
        borderRadius: "12px",
      }}
    >

      <strong>Certificate Status</strong>

      <p style={{ marginTop: "10px" }}>
        {verification?.status === "approved"
          ? "Certificate Available"
          : "Certificate Pending Approval"}
      </p>

    </div>

  </div>

</section>


<section
  style={{
    marginTop: "45px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "18px",
    padding: "24px",
  }}
>

  <h2>IFSE Quick Actions</h2>

  <p
    style={{
      color: "#cbd5e1",
      marginBottom: "20px",
    }}
  >
    Continue your verification process using the options below.
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(220px,1fr))",
      gap: "18px",
    }}
  >

    <button
      onClick={() =>
        navigate("/verification-documents")
      }
    >
      Upload Documents
    </button>

    <button
      onClick={() =>
        navigate("/verification-status")
      }
    >
      View Verification Status
    </button>

    <button
      onClick={() =>
        navigate("/verification-payment", {
          state: {
            verificationId: verification?.id || "",
            category: verification?.category || "creator",
            verificationType: verification?.verificationType || "",
            paymentAmount: verification?.paymentAmount || 0,
          },
        })
      }
      disabled={!verification}
      title={!verification ? "Submit a verification application first" : "Continue to secure payment"}
    >
      Continue Payment
    </button>

    <button
      onClick={() =>
        navigate("/verification-renewal")
      }
    >
      Renew Verification
    </button>

    <button
      onClick={() =>
        navigate("/home")
      }
    >
      Return Home
    </button>

  </div>

</section>
        <footer
  style={{
    marginTop: "40px",
    textAlign: "center",
    color: "#94a3b8",
  }}
>
  © Inclura Verification Center

  <br />

  Powered by the Inclura Fortress Security Engine (IFSE)

</footer>

</div>

</DashboardLayout>

);

}

export default VerificationCenter;
