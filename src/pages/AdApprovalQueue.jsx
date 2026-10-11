
import { useEffect, useState } from "react";
import { getIdTokenResult } from "firebase/auth";
import DashboardLayout from "../components/DashboardLayout";
import { auth } from "../firebase";

const sections = [
  {
    title: "Pending Advertisements",
    description: "Advertisements awaiting moderation.",
    icon: "🕒",
  },
  {
    title: "Approved Advertisements",
    description: "Advertisements approved for publication.",
    icon: "✅",
  },
  {
    title: "Rejected Advertisements",
    description: "Advertisements rejected during review.",
    icon: "❌",
  },
  {
    title: "Paused Campaigns",
    description: "Campaigns paused pending review or further action.",
    icon: "⏸️",
  },
  {
    title: "Reported Advertisements",
    description: "Advertisements flagged for investigation.",
    icon: "🚫",
  },
  {
    title: "Enterprise Campaign Reviews",
    description: "Enterprise campaign compliance and approval reviews.",
    icon: "🏢",
  },
  {
    title: "Government Campaign Reviews",
    description: "Government campaign verification and approval reviews.",
    icon: "🏛️",
  },
  {
    title: "Ad Approval Analytics",
    description: "Approval activity and moderation performance metrics.",
    icon: "📊",
  },
];

function AdApprovalQueue() {
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
            setError("Please sign in with an administrator account.");
          }
          return;
        }

        const tokenResult = await getIdTokenResult(currentUser, true);

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
          "Ad approval queue access verification failed:",
          accessError
        );

        if (active) {
          setError("Unable to verify administrator access.");
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
        <h1>📋 Ad Approval Queue</h1>

        <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
          Review and manage advertising moderation workflows across
          Inclura. Approval actions and campaign statistics will only
          be shown when connected to the verified advertising data source.
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
              border: "1px solid #991b1b",
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
              role="status"
              style={{
                ...cardStyle,
                background: "#172554",
                borderColor: "#1d4ed8",
              }}
            >
              <strong>Advertising workflow integration pending</strong>
              <p style={{ lineHeight: 1.6 }}>
                These sections are navigation and planning placeholders.
                No live campaign records, approval decisions, or analytics
                are being reported by this page yet.
              </p>
            </div>

            {sections.map((section) => (
              <section key={section.title} style={cardStyle}>
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
                    marginBottom: "12px",
                  }}
                >
                  {section.description}
                </p>

                <span
                  style={{
                    display: "inline-block",
                    fontSize: "12px",
                    color: "#fcd34d",
                    background: "#422006",
                    padding: "5px 9px",
                    borderRadius: "8px",
                  }}
                >
                  Awaiting data integration
                </span>
              </section>
            ))}
          </>
        )}
      </main>
    </DashboardLayout>
  );
}

export default AdApprovalQueue;
