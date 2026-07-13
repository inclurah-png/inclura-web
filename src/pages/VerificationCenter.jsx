import { useMemo } from "react";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import { VERIFICATION_PLANS } from "../config";

function VerificationCenter() {

  const navigate = useNavigate();

  const categories = useMemo(
    () => Object.keys(VERIFICATION_PLANS),
    []
  );

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

        <p>
          Secure your identity, organization,
          institution or business using the
          Inclura Fortress Security Engine
          (IFSE).
        </p>

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

        <footer
          style={{
            marginTop: "40px",
            textAlign: "center",
            color: "#94a3b8",
          }}
        >
          © Inclura Verification Center
          <br />
          Powered by the Inclura Fortress Security Engine
          (IFSE)
        </footer>
      </div>
    </DashboardLayout>
  );
}

export default VerificationCenter;
