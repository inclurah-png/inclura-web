import { useTranslation } from "react-i18next";

function OpportunitiesWidget() {
  const { t } = useTranslation();

  const opportunities = [
    {
      id: "remoteJobs",
      label: t(
        "opportunityWidget.remoteJobs",
        {
          defaultValue:
            "Remote Jobs",
        }
      ),
    },
    {
      id: "scholarships",
      label: t(
        "opportunityWidget.scholarships",
        {
          defaultValue:
            "Scholarships",
        }
      ),
    },
    {
      id: "mentorshipPrograms",
      label: t(
        "opportunityWidget.mentorshipPrograms",
        {
          defaultValue:
            "Mentorship Programs",
        }
      ),
    },
    {
      id: "volunteerOpportunities",
      label: t(
        "opportunityWidget.volunteerOpportunities",
        {
          defaultValue:
            "Volunteer Opportunities",
        }
      ),
    },
  ];

  return (
    <section
      aria-labelledby="opportunities-widget-title"
      style={{
        background: "#1e293b",
        padding: "18px",
        borderRadius: "18px",
        marginBottom: "16px",
      }}
    >
      <h2
        id="opportunities-widget-title"
        style={{
          color: "white",
        }}
      >
        <span aria-hidden="true">
          🚀{" "}
        </span>

        {t(
          "opportunityWidget.title",
          {
            defaultValue:
              "Opportunities",
          }
        )}
      </h2>

      <ul
        aria-label={t(
          "opportunityWidget.listLabel",
          {
            defaultValue:
              "Available opportunity categories",
          }
        )}
        style={{
          lineHeight: "1.8",
        }}
      >
        {opportunities.map(
          (opportunity) => (
            <li
              key={
                opportunity.id
              }
            >
              {opportunity.label}
            </li>
          )
        )}
      </ul>
    </section>
  );
}

export default OpportunitiesWidget;
