import DashboardLayout from "../components/DashboardLayout";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function CareGigs() {
  const { t } = useTranslation();

  const services = [
    {
      id: "caregiverRequests",
      icon: "🧑‍⚕",
      title: t("careGigs.caregiverRequests", {
        defaultValue: "Caregiver Requests",
      }),
      description: t("careGigs.caregiverRequestsDescription", {
        defaultValue: "Create and find requests for caregiver support.",
      }),
    },
    {
      id: "homeAssistance",
      icon: "🏠",
      title: t("careGigs.homeAssistance", {
        defaultValue: "Home Assistance",
      }),
      description: t("careGigs.homeAssistanceDescription", {
        defaultValue: "Find or request assistance with everyday home needs.",
      }),
    },
    {
      id: "transportationSupport",
      icon: "🚗",
      title: t("careGigs.transportationSupport", {
        defaultValue: "Transportation Support",
      }),
      description: t("careGigs.transportationSupportDescription", {
        defaultValue: "Find or request transportation assistance.",
      }),
    },
    {
      id: "supportServices",
      icon: "💬",
      title: t("careGigs.supportServices", {
        defaultValue: "Support Services",
      }),
      description: t("careGigs.supportServicesDescription", {
        defaultValue: "Explore other care and support services.",
      }),
    },
  ];

  return (
    <DashboardLayout>
      <main
        aria-labelledby="care-gigs-title"
        style={page}
      >
        <header style={header}>
          <h1 id="care-gigs-title">
            <span aria-hidden="true">🤝 </span>
            {t("careGigs.title", {
              defaultValue: "Care-Gigs",
            })}
          </h1>

          <p style={intro}>
            {t("careGigs.introduction", {
              defaultValue: "Connect people who need care and support with people who can provide it.",
            })}
          </p>

          <Link
            to="/care-gigs/request"
            style={requestButton} // Using the improved requestButton style
            aria-label={t("careGigs.createRequestAriaLabel", {
              defaultValue: "Create a new Care-Gig request",
            })}
          >
            {t("careGigs.createRequest", {
              defaultValue: "Create a Care Request",
            })}
          </Link>
        </header>

        <section aria-labelledby="care-gigs-services-title">
          <h2 id="care-gigs-services-title">
            {t("careGigs.servicesTitle", {
              defaultValue: "Care and Support Services",
            })}
          </h2>

          <div
            role="list"
            aria-label={t("careGigs.servicesLabel", {
              defaultValue: "Available Care-Gig service categories",
            })}
          >
            {services.map((service) => (
              <article
                key={service.id}
                role="listitem"
                style={card}
              >
                <div
                  style={iconContainer}
                  aria-hidden="true"
                >
                  {service.icon}
                </div>

                <div>
                  <h3 style={{ marginTop: 0 }}>
                    {service.title}
                  </h3>

                  <p style={description}>
                    {service.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside
          aria-labelledby="care-gigs-safety-title"
          style={notice}
        >
          <h2 id="care-gigs-safety-title">
            {t("careGigs.safetyTitle", {
              defaultValue: "Safety and Trust",
            })}
          </h2>

          <p>
            {t("careGigs.safetyMessage", {
              defaultValue: "CareGig will include verification, accessibility preferences, privacy controls, reporting, and IFSE security protections as the service is developed.",
            })}
          </p>
        </aside>
      </main>
    </DashboardLayout>
  );
}

const page = {
  color: "white",
  maxWidth: "1000px",
  margin: "0 auto",
  paddingBottom: "32px",
};

const header = {
  marginBottom: "28px",
};

const intro = {
  color: "#cbd5e1",
  lineHeight: "1.7",
  maxWidth: "760px",
};

// Improved requestButton style
const requestButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  zIndex: 200, // Updated zIndex
  marginTop: "18px",
  padding: "14px 20px",
  borderRadius: "12px",
  background: "#38bdf8",
  color: "white",
  textDecoration: "none",
  fontWeight: "700",
  lineHeight: "1.4",
  cursor: "pointer",
  pointerEvents: "auto",
  touchAction: "manipulation",
  WebkitTapHighlightColor: "transparent",
};

const card = {
  display: "flex",
  alignItems: "flex-start",
  gap: "18px",
  background: "#0f172a",
  padding: "24px",
  borderRadius: "20px",
  marginBottom: "20px",
  color: "white",
};

const iconContainer = {
  fontSize: "30px",
  lineHeight: "1",
  flexShrink: 0,
};

const description = {
  color: "#cbd5e1",
  lineHeight: "1.7",
  marginBottom: 0,
};

const notice = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "18px",
  color: "#cbd5e1",
  lineHeight: "1.7",
};

export default CareGigs;

