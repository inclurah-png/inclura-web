import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  "Identity Verification",
  "Document Authentication",
  "AI Fraud Detection",
  "Forgery Detection",
  "Duplicate Detection",
  "Payment Protection",
  "Accessibility Compliance",
  "Executive Review",
  "Continuous Monitoring",
];
  
  const ifseLayers = [
    "Identity Verification",
    "Document Authentication",
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
        "Unable to load verification history."
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
          Inclura Verification Center
        </h1>
        {loading && (

  <p>Loading verification centre...</p>

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
  style={{
    marginTop: "30px",
    marginBottom: "30px",
  }}
>

  <h2>Your Verification Dashboard</h2>

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
      <h3>Total Applications</h3>
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
      <h3>Approved</h3>
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
      <h3>Pending</h3>
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
      <h3>Rejected</h3>
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

  <h2>Latest Verification</h2>

  <p>
    <strong>Verification Type:</strong>{" "}
    {verification.verificationType}
  </p>

  <p>
    <strong>Status:</strong>{" "}
    {verification.status}
  </p>

  <p>
    <strong>Risk Score:</strong>{" "}
    {verification.riskScore}%
  </p>

  <p>
    <strong>Threat Level:</strong>{" "}
    {verification.threatLevel}
  </p>

  <p>
    <strong>Executive Review:</strong>{" "}
    {verification.executiveReviewRequired
      ? "Required"
      : "Not Required"}
  </p>

  <p>
    <strong>Submitted:</strong>{" "}
    {verification.createdAt?.toDate?.().toLocaleString?.() ??
      "Pending"}
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
      View Status
    </button>

    <button
      onClick={() =>
        navigate("/verification-documents")
      }
    >
      Upload Documents
    </button>

    <button
      onClick={() =>
        navigate("/creator-verification-payment")
      }
    >
      Continue Payment
    </button>

  </div>

</section>

)}

    <section
  style={{
    marginBottom: "35px",
  }}
>

  <h2>Verification History</h2>

  {verificationHistory.length === 0 ? (

    <p>No previous verification requests.</p>

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
              Type
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
              Threat
            </th>

            <th
              style={{
                textAlign: "left",
                padding: "12px",
              }}
            >
              Risk
            </th>

            <th
              style={{
                textAlign: "left",
                padding: "12px",
              }}
            >
              Submitted
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
                  "Pending"}
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

  <h2>IFSE Live Security Dashboard</h2>

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
      <strong>Identity Verification</strong>
      <p>🟢 Active</p>
    </div>

    <div
      style={{
        background: "#111827",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>Document Authentication</strong>
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
      <strong>Accessibility Validation</strong>
      <p>🟢 Enabled</p>
    </div>

    <div
      style={{
        background: "#111827",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <strong>Executive Review Engine</strong>
      <p>
        {verification?.executiveReviewRequired
          ? "🟡 Waiting"
          : "🟢 Not Required"}
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

  <h2>IFSE Verification Workflow</h2>

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
          Choose Verification Category
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
                    Available Types:
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
                  Start Verification
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
          IFSE Security Layers
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

  <h2>IFSE Verification Analytics</h2>

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
      <h3>Total Requests</h3>
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
      <h3>Approved</h3>
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
      <h3>Pending</h3>
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
      <h3>Rejected</h3>
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
          Benefits of Verification
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
          Verification Process
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
        navigate("/creator-verification-payment")
      }
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
