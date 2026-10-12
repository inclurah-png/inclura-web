import DashboardLayout from "../components/DashboardLayout";

const sections = [
  {
    id: "create",
    title: "Create Enterprise Campaign",
    icon: "➕",
    description:
      "Campaign creation is disabled until server-side authorization and validation are connected.",
    status: "Not connected",
  },
  {
    id: "active",
    title: "Active Campaigns",
    icon: "📢",
    description:
      "Campaign records will appear here after authorized data access is implemented.",
    status: "Not connected",
  },
  {
    id: "history",
    title: "Campaign History",
    icon: "📜",
    description:
      "Historical campaign records are not loaded by this page.",
    status: "Not connected",
  },
  {
    id: "recruitment",
    title: "Recruitment Campaigns",
    icon: "💼",
    description:
      "Recruitment campaign management is not yet connected.",
    status: "Not connected",
  },
  {
    id: "accessibility",
    title: "Accessibility Programs",
    icon: "♿",
    description:
      "Accessibility program management is not yet connected.",
    status: "Not connected",
  },
  {
    id: "scholarships",
    title: "Scholarship Campaigns",
    icon: "🎓",
    description:
      "Scholarship campaign management is not yet connected.",
    status: "Not connected",
  },
  {
    id: "community",
    title: "Community Outreach",
    icon: "🤝",
    description:
      "Community outreach campaign management is not yet connected.",
    status: "Not connected",
  },
  {
    id: "government",
    title: "Government Initiatives",
    icon: "🏛",
    description:
      "Government initiative management requires verified permissions.",
    status: "Not connected",
  },
  {
    id: "international",
    title: "International Programs",
    icon: "🌍",
    description:
      "International program management is not yet connected.",
    status: "Not connected",
  },
  {
    id: "budget",
    title: "Campaign Budget Management",
    icon: "💰",
    description:
      "Budget changes are disabled until trusted authorization and validation are implemented.",
    status: "Protected",
  },
  {
    id: "analytics",
    title: "Campaign Analytics",
    icon: "📈",
    description:
      "Analytics will require access to authorized campaign records.",
    status: "Not connected",
  },
  {
    id: "audience",
    title: "Audience Targeting",
    icon: "🎯",
    description:
      "Targeting is disabled until privacy safeguards and permitted targeting rules are implemented.",
    status: "Protected",
  },
  {
    id: "location",
    title: "Location Targeting",
    icon: "📍",
    description:
      "Location targeting is disabled until privacy and authorization checks are implemented.",
    status: "Protected",
  },
  {
    id: "insights",
    title: "Enterprise Insights",
    icon: "📊",
    description:
      "Existing enterprise insights integration must be inspected before connecting campaign data.",
    status: "Not connected",
  },
];

const card = {
  background: "#0f172a",
  border: "1px solid #334155",
  padding: "24px",
  borderRadius: "20px",
  marginBottom: "20px",
  color: "#f8fafc",
};

const statusStyle = {
  display: "inline-block",
  marginTop: "12px",
  padding: "5px 10px",
  borderRadius: "8px",
  background: "#334155",
  color: "#e2e8f0",
  fontSize: "12px",
  fontWeight: "600",
};

function EnterpriseCampaignManager() {
  return (
    <DashboardLayout>
      <main
        style={{
          color: "white",
          padding: "0 0 24px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            marginBottom: "12px",
          }}
        >
          🏢 Enterprise Campaign Manager
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: 1.6,
            marginBottom: "24px",
          }}
        >
          Enterprise campaign management workspace.
          Campaign operations remain disabled until the
          existing authentication, authorization, and
          campaign data architecture have been verified.
        </p>

        <section
          aria-label="Campaign management security notice"
          role="status"
          style={{
            ...card,
            borderColor: "#92400e",
            background: "#1c1917",
          }}
        >
          <h2
            style={{
              fontSize: "17px",
              marginTop: 0,
              color: "#fde68a",
            }}
          >
            🔒 Security safeguards
          </h2>

          <ul
            style={{
              paddingLeft: "22px",
              lineHeight: 1.8,
              color: "#e7e5e4",
            }}
          >
            <li>
              This page does not create, modify, or delete
              campaign records.
            </li>
            <li>
              No campaign budgets or audience data are
              retrieved by this component.
            </li>
            <li>
              Frontend visibility is not a substitute for
              backend authorization or Firestore rules.
            </li>
            <li>
              Campaign approval permissions must remain
              separate from enterprise campaign ownership.
            </li>
          </ul>
        </section>

        <section aria-label="Enterprise campaign management areas">
          {sections.map((section) => (
            <article
              key={section.id}
              style={card}
            >
              <h2
                style={{
                  fontSize: "18px",
                  margin: "0 0 12px",
                }}
              >
                {section.icon} {section.title}
              </h2>

              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {section.description}
              </p>

              <span style={statusStyle}>
                {section.status}
              </span>
            </article>
          ))}
        </section>
      </main>
    </DashboardLayout>
  );
}

export default EnterpriseCampaignManager;
