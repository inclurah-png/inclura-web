import { useEffect, useState } from "react";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { getIdTokenResult } from "firebase/auth";
import { Link } from "react-router-dom";

import { auth, db } from "../firebase";
import DashboardLayout from "../components/DashboardLayout";

function AdminPanel() {
  const [stats, setStats] = useState({
    users: 0,
    verification: 0,
    reports: 0,
    wallet: 0,
    enterprise: 0,
    adsPending: 0,
    emergencySOS: 0,
    verifiedUsers: 0,
    creators: 0,
    organizations: 0,
    governments: 0,
    mentors: 0,
    caregivers: 0,
    employers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminAuthorized, setAdminAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setError("");
      setAdminAuthorized(false);

      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error(
            "You must sign in before accessing the Admin Control Center."
          );
        }

        // Refresh the token and check the server-issued admin claim.
        const tokenResult = await getIdTokenResult(currentUser, true);

        if (tokenResult.claims.admin !== true) {
          throw new Error(
            "Administrator access is required to view this dashboard."
          );
        }

        if (cancelled) return;

        setAdminAuthorized(true);

        // Load exact counts. Do not subtract placeholder records.
        const [
          usersSnap,
          verificationSnap,
          reportsSnap,
          walletSnap,
          enterpriseSnap,
          adsPendingSnap,
          sosSnap,
          verifiedSnap,
          creatorSnap,
          organizationSnap,
          governmentSnap,
          caregiverSnap,
          mentorSnap,
          employerSnap,
        ] = await Promise.all([
          getCountFromServer(collection(db, "users")),

          getCountFromServer(
            query(
              collection(db, "verificationRequests"),
              where("status", "==", "pending")
            )
          ),

          getCountFromServer(
            query(
              collection(db, "reports"),
              where("status", "==", "open")
            )
          ),

          getCountFromServer(
            query(
              collection(db, "walletAlerts"),
              where("status", "==", "open")
            )
          ),

          getCountFromServer(collection(db, "enterprisePartners")),

          getCountFromServer(
            query(
              collection(db, "advertisements"),
              where("status", "==", "pending")
            )
          ),

          getCountFromServer(
            query(
              collection(db, "emergencySOS"),
              where("status", "==", "open")
            )
          ),

          getCountFromServer(
            query(
              collection(db, "users"),
              where("verified", "==", true)
            )
          ),

          getCountFromServer(
            query(
              collection(db, "users"),
              where("accountType", "==", "Creator")
            )
          ),

          getCountFromServer(
            query(
              collection(db, "users"),
              where("accountType", "==", "Organization")
            )
          ),

          getCountFromServer(
            query(
              collection(db, "users"),
              where("accountType", "==", "Government")
            )
          ),

          getCountFromServer(
            query(
              collection(db, "users"),
              where("accountType", "==", "Caregiver")
            )
          ),

          getCountFromServer(
            query(
              collection(db, "users"),
              where("accountType", "==", "Mentor")
            )
          ),

          getCountFromServer(
            query(
              collection(db, "users"),
              where("accountType", "==", "Employer")
            )
          ),
        ]);

        if (cancelled) return;

        setStats({
          users: usersSnap.data().count,
          verification: verificationSnap.data().count,
          reports: reportsSnap.data().count,
          wallet: walletSnap.data().count,
          enterprise: enterpriseSnap.data().count,
          adsPending: adsPendingSnap.data().count,
          emergencySOS: sosSnap.data().count,
          verifiedUsers: verifiedSnap.data().count,
          creators: creatorSnap.data().count,
          organizations: organizationSnap.data().count,
          governments: governmentSnap.data().count,
          mentors: mentorSnap.data().count,
          caregivers: caregiverSnap.data().count,
          employers: employerSnap.data().count,
        });
      } catch (err) {
        console.error("Admin dashboard error:", err);

        if (!cancelled) {
          setError(
            err?.code === "permission-denied"
              ? "Firebase denied access. Check the published Firestore rules and administrator permissions."
              : err?.message ||
                  "The dashboard could not load. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const summaryCards = [
    { title: "Users", value: stats.users, description: "Total registered" },
    {
      title: "Verification",
      value: stats.verification,
      description: "Pending requests",
    },
    { title: "Reports", value: stats.reports, description: "Open cases" },
    { title: "Wallet", value: stats.wallet, description: "Open alerts" },
    {
      title: "Enterprise",
      value: stats.enterprise,
      description: "Partners",
    },
    {
      title: "Pending Ads",
      value: stats.adsPending,
      description: "Waiting approval",
    },
    {
      title: "Emergency SOS",
      value: stats.emergencySOS,
      description: "Open SOS cases",
    },
    {
      title: "Verified Users",
      value: stats.verifiedUsers,
      description: "Users marked verified",
    },
    {
      title: "Creators",
      value: stats.creators,
      description: "Creator accounts",
    },
    {
      title: "Organizations",
      value: stats.organizations,
      description: "Organization accounts",
    },
    {
      title: "Governments",
      value: stats.governments,
      description: "Government accounts",
    },
    {
      title: "Mentors",
      value: stats.mentors,
      description: "Mentor accounts",
    },
    {
      title: "Caregivers",
      value: stats.caregivers,
      description: "Caregiver accounts",
    },
    {
      title: "Employers",
      value: stats.employers,
      description: "Employer accounts",
    },
  ];

  const adminSections = [
    {
      title: "Platform Administration",
      links: [
        ["/users-management", "👥 Users Management"],
        ["/verification-manager", "✅ Verification Manager"],
        ["/verification-requests", "📄 Verification Requests"],
      ],
    },
    {
      title: "Security & IFSE",
      links: [
        ["/admin/ifse-risk", "🛡️ IFSE Risk Monitoring"],
        ["/reports-violations", "🚨 Reports & Violations"],
        ["/sos", "🚨 SOS Monitoring"],
        ["/sos-responder", "🚑 SOS Responder Dashboard"],
        ["/responder-assignments", "📋 Responder Assignments"],
      ],
    },
    {
      title: "Finance & Revenue",
      links: [
        ["/wallet-monitoring", "💰 Wallet Monitoring"],
        ["/creator-monetization", "💵 Creator Economy & Revenue"],
        ["/pricing-manager", "⚙️ Creator Revenue Policy"],
      ],
    },
    {
      title: "Enterprise",
      links: [
        ["/enterprise-campaigns", "🏢 Enterprise Marketplace"],
        ["/enterprise-analytics", "📈 Enterprise Analytics"],
      ],
    },
    {
      title: "Platform Intelligence",
      links: [
        ["/platform-analytics", "📊 Platform Analytics"],
        ["/ad-approval", "📢 Advertisement Approval"],
      ],
    },
  ];

  return (
    <DashboardLayout>
      <main style={page}>
        <h1>👨‍💼 Inclura Admin Control Center</h1>

        {loading && (
          <p role="status" style={notice}>
            Checking administrator permissions and loading dashboard…
          </p>
        )}

        {!loading && error && (
          <div role="alert" style={errorBox}>
            <strong>Dashboard unavailable</strong>
            <p>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={retryButton}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && adminAuthorized && (
          <>
            <p style={statusNotice}>
              Administrator access verified. Dashboard counts are based on
              the available Firestore records.
            </p>

            <div style={dashboardGrid}>
              {summaryCards.map((item) => (
                <div style={summaryCard} key={item.title}>
                  <h3>{item.title}</h3>
                  <h2>{item.value.toLocaleString()}</h2>
                  <p>{item.description}</p>
                </div>
              ))}

              <div style={summaryCard}>
                <h3>🛡️ IFSE</h3>
                <h2 style={{ color: "#fbbf24" }}>Not confirmed</h2>
                <p>
                  Live health and threat status must come from actual IFSE
                  monitoring data.
                </p>
              </div>
            </div>

            {adminSections.map((section) => (
              <section key={section.title}>
                <h2 style={sectionTitle}>{section.title}</h2>

                <div style={navigationGrid}>
                  {section.links.map(([path, label]) => (
                    <Link key={path} to={path} style={link}>
                      <div style={navigationCard}>{label}</div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </main>
    </DashboardLayout>
  );
}

const page = {
  color: "white",
};

const dashboardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
  marginBottom: "30px",
};

const summaryCard = {
  background: "#111827",
  borderRadius: "18px",
  padding: "20px",
  border: "1px solid #1f2937",
  overflowWrap: "anywhere",
};

const sectionTitle = {
  marginTop: "35px",
  marginBottom: "15px",
  color: "#60a5fa",
  fontSize: "22px",
  fontWeight: "700",
};

const navigationGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
};

const link = {
  color: "white",
  textDecoration: "none",
};

const navigationCard = {
  background: "#0f172a",
  border: "1px solid #1f2937",
  padding: "24px",
  borderRadius: "16px",
  marginBottom: "4px",
  cursor: "pointer",
};

const notice = {
  background: "#172554",
  padding: "14px",
  borderRadius: "10px",
};

const statusNotice = {
  background: "#132b24",
  border: "1px solid #166534",
  padding: "14px",
  borderRadius: "10px",
  marginBottom: "20px",
};

const errorBox = {
  background: "#450a0a",
  border: "1px solid #991b1b",
  borderRadius: "12px",
  padding: "18px",
  margin: "20px 0",
  overflowWrap: "anywhere",
};

const retryButton = {
  background: "#1f2937",
  color: "white",
  border: "1px solid #6b7280",
  borderRadius: "8px",
  padding: "10px 16px",
  cursor: "pointer",
};

export default AdminPanel;
