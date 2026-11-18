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
  "{t("verificationType")}",
  "{t("secureUploadedDocuments")}",
  "AI Fraud Detection",
  "Forgery Detection",
  "Duplicate Detection",
  "Payment Protection",
  "Accessibility Compliance",
  "Executive Review",
  "Continuous Monitoring",
];
  
  const ifseLayers = [
    "{t("verificationType")}",
    "{t("secureUploadedDocuments")}",
    "AI Fraud Detection",
    "Forgery Detection",
    "Duplicate Detection",
    "Payment Protection",
    "Accessibility Compliance",
    "Executive Review",
    "Continuous Monitoring",
  ];

  const verificationBenefits = [
    "Official Verified Badge",
    "Higher Trust",
    "Search Priority",
    "Protection Against Impersonation",
    "Premium Features",
    "Priority Support",
    "Business Opportunities",
    "Continuous IFSE Protection",
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
        "{t("error")}"
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
        <h1>
          {t("verificationCenter")}
        </h1>
        {loading && (

  <p>{t("loading")}</p>

)}

{error && (

  <div className="error-message">

    {error}

  </div>

)}

        <p>
          Secure your identity, organization,
          institution or business using the
          Inclura Fortress Security Engine
          (IFSE).
        </p>

        <section
          aria-label="Verification status access"
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
          <p>{t("privateDocumentsNotice")}</p>
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
            {t("verificationStatusTitle")}
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
      <h3>{t("rejected", { defaultValue: "Rejected" })}</h3>
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
    <strong>{t("verification{t("verificationType")}")}:</strong>{" "}
    {verification.verification{t("verificationType")}}
  </p>

  <p>
    <strong>{t("status")}:</strong>{" "}
    {verification.status}
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
    {verification.executiveReview{t("required")}
      ? "{t("required")}"
      : "Not {t("required")}"}
  </p>

  <p>
    <strong>{t("submitted")}:</strong>{" "}
    {verification.createdAt?.toDate?.().toLocaleString?.() ??
      "{t("pending")}"}
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
      {t("verificationStatusTitle")}
    </button>

    <button
      onClick={() =>
        navigate("/verification-documents")
      }
    >
      {t("uploadAdditionalDocuments")}
    </button>

    <button
      onClick={() =>
        navigate("/verification-payment")
      }
    >
      {t("verificationPayment")}
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
              Status
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
                {item.verification{t("verificationType")}}
              </td>

              <td
                style={{
                  padding: "12px",
                }}
              >
                {item.status}
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
                  "{t("pending")}"}
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
      <strong>{t("verificationType")}</strong>
      <p>🟢 Active</p>
    </div>

    <div
      style={{
        background: "#111827",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>{t("secureUploadedDocuments")}</strong>
      <p>🟢 Active</p>
    </div>

    <div
      style={{
        background: "#111827",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>AI Fraud Detection</strong>
      <p>🟢 Monitoring</p>
    </div>

    <div
      style={{
        background: "#111827",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>Duplicate Detection</strong>
      <p>🟢 Enabled</p>
    </div>

    <div
      style={{
        background: "#111827",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>{t("accessibilityNeeds")}</strong>
      <p>🟢 Enabled</p>
    </div>

    <div
      style={{
        background: "#111827",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>{t("executiveReview")}</strong>
      <p>
        {verification?.executiveReview{t("required")}
          ? "🟡 Waiting"
          : "🟢 Not {t("required")}"}
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
    Every verification passes through the complete
    Inclura Fortress Security Engine workflow.
  </p>
<ol
  style={{
    lineHeight: "2",
    paddingLeft: "22px",
  }}
>
  {IFSE_STAGES.map((stage, index) => (
    <li
      key={stage}
      style={{
        marginBottom: "10px",
      }}
    >
      <strong>Step {index + 1}</strong>
      {" — "}
      {stage}
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
          {t("verificationCenter")}
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
                    "Secure verification powered by IFSE."}
                </p>

                <p>
                  <strong>
                    Available {t("verificationType")}s:
                  </strong>
                </p>

                <ul
                  style={{
                    paddingLeft: "20px",
                    marginBottom: "18px",
                  }}
                >
                  {plan.verification{t("verificationType")}s
                    ?.slice(0, 4)
                    .map((item) => (
                      <li key={item.id}>
                        {item.name}
                      </li>
                    ))}

                  {plan.verification{t("verificationType")}s
                    ?.length > 4 && (
                    <li>
                      +
                      {plan.verification{t("verificationType")}s.length - 4}
                      {" "}more...
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
                  {t("continue")}
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
          {t("ifseProtection")}
        </h2>

        <ul>
          {ifseLayers.map((item) => (
            <li
              key={item}
              style={{
                marginBottom: "10px",
              }}
            >
              ✅ {item}
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
    Overview of your verification activity.
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
      <h3>{t("verificationRequests")}</h3>
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
      <h3>{t("rejected", { defaultValue: "Rejected" })}</h3>
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
          {t("verified")}
        </h2>

        <ul>
          {verificationBenefits.map(
            (benefit) => (
              <li
                key={benefit}
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
          {t("verificationProgress")}
        </h2>

        <ol
          style={{
            lineHeight: "2",
          }}
        >
          <li>
            Choose your verification category.
          </li>

          <li>
            Select the appropriate verification type.
          </li>

          <li>
            Complete your application form.
          </li>

          <li>
            Upload supporting documents.
          </li>

          <li>
            Complete payment (if applicable).
          </li>

          <li>
            IFSE performs identity, document and fraud verification.
          </li>

          <li>
            Your application is reviewed.
          </li>

          <li>
            Your verification badge is issued after approval.
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
            Inclura Fortress Security Engine (IFSE)
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: "1.8",
            }}
          >
            Every verification request submitted through
            Inclura is protected by IFSE. The system
            performs identity verification, document
            authentication, AI fraud detection,
            accessibility compliance, payment protection,
            continuous monitoring and executive review to
            ensure trusted verification across the
            platform.
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
          : "⏳ {t("pending")} Approval"}
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
        {verification?.executiveReview{t("required")}
          ? "🟡 Waiting for Executive Review"
          : "🟢 Not {t("required")}"}
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
          : "Certificate {t("pending")} Approval"}
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
      {t("uploadAdditionalDocuments")}
    </button>

    <button
      onClick={() =>
        navigate("/verification-status")
      }
    >
      {t("verificationStatusTitle")}
    </button>

    <button
      onClick={() =>
        navigate("/verification-payment", {
          state: {
            verificationId: verification?.id || "",
            category: verification?.category || "creator",
            verification{t("verificationType")}: verification?.verification{t("verificationType")} || "",
            paymentAmount: verification?.paymentAmount || 0,
          },
        })
      }
      disabled={!verification}
      title={!verification ? "Submit a verification application first" : "Continue to secure payment"}
    >
      {t("verificationPayment")}
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
  © {t("verificationCenter")}

  <br />

  Powered by the Inclura Fortress Security Engine (IFSE)

</footer>

</div>

</DashboardLayout>

);

}

export default VerificationCenter;
