
import { useEffect, useState } from "react";
import { getIdTokenResult } from "firebase/auth";
import DashboardLayout from "../components/DashboardLayout";
import { auth } from "../firebase";

const sections = [
  {
    title: "Create Advertisement",
    icon: "➕",
    description:
      "Create and submit an advertisement for moderation.",
  },
  {
    title: "Ad Analytics",
    icon: "📊",
    description:
      "Review campaign performance using verified advertising data.",
  },
  {
    title: "Audience Targeting",
    icon: "🎯",
    description:
      "Manage appropriate audience settings with privacy safeguards.",
  },
  {
    title: "Active Campaigns",
    icon: "📈",
    description:
      "Monitor campaign status and publication activity.",
  },
  {
    title: "Ad Spend",
    icon: "💰",
    description:
      "Review campaign budgets and verified spending records.",
  },
  {
    title: "Ad Approval Queue",
    icon: "📋",
    description:
      "Review pending advertisements and moderation decisions.",
  },
];

function AdManager() {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function verifyAdminAccess() {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          if (active) {
            setError(
              "Please sign in with an administrator account."
            );
          }
          return;
        }

        const tokenResult = await getIdTokenResult(
          currentUser,
          true
        );

        if (!active) return;

        if (tokenResult.claims.admin !== true) {
          setError(
            "Access denied. Administrator permission is required."
          );
          return;
        }

        setIsAdmin(true);
      } catch (accessError) {
        console.error(
          "Ad Manager access verification failed:",
          accessError
        );

        if (active) {
          setError(
            "Unable to verify administrator access. Please try again."
          );
        }
      } finally {
        if (active) {
          setCheckingAccess(false);
        }
      }
    }

    verifyAdminAccess();

    return () => {
      active = false;
    };
  }, []);

  const cardStyle = {
    background: "#0f172a",
    padding: "22px",
    borderRadius: "16px",
    border: "1px solid #334155",
    marginBottom: "16px",
  };

  return (
    <DashboardLayout>
      <main
        style={{
          color: "white",
          padding: "8px",
          maxWidth: "1000px",
        }}
      >
        <h1>📢 Ad Manager</h1>

        <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
          Manage Inclura advertising workflows while protecting
          user privacy and maintaining accountable moderation.
        </p>

        {checkingAccess && (
          <div style={cardStyle} role="status">
            Verifying administrator access...
          </div>
        )}

        {!checkingAccess && error && (
          <div
            role="alert"
            style={{
              ...cardStyle,
              background: "#451a1a",
              borderColor: "#991b1b",
              color: "#fecaca",
            }}
          >
            <strong>Administrator access unavailable</strong>
            <p>{error}</p>
          </div>
        )}

        {!checkingAccess && isAdmin && !error && (
          <>
            <div
              style={{
                ...cardStyle,
                background: "#172554",
                borderColor: "#1d4ed8",
              }}
            >
              <strong>Advertising integration pending</strong>
              <p style={{ lineHeight: 1.6 }}>
                These sections are currently informational placeholders.
                Campaign creation, analytics, targeting, spending, and
                approval actions are not implemented by this page.
              </p>
            </div>

            {sections.map((section) => (
              <section
                key={section.title}
                style={cardStyle}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    marginTop: 0,
                    marginBottom: "8px",
                  }}
                >
                  {section.icon} {section.title}
                </h2>

                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: 1.6,
                  }}
                >
                  {section.description}
                </p>

                <span
                  style={{
                    display: "inline-block",
                    background: "#422006",
                    color: "#fcd34d",
                    padding: "5px 9px",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                >
                  Awaiting integration
                </span>
              </section>
            ))}
          </>
        )}
      </main>
    </DashboardLayout>
  );
}

export default AdManager;
