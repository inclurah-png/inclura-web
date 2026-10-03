import DashboardLayout from "../components/DashboardLayout";

import { useTranslation } from "react-i18next";

function CareGigs() {
  const { t } = useTranslation();

  const careGigServices = [
    {
      id: "caregiverRequests",
      icon: "🧑‍⚕",
      label: t(
        "careGigs.caregiverRequests",
        {
          defaultValue:
            "Caregiver Requests",
        }
      ),
    },
    {
      id: "homeAssistance",
      icon: "🏠",
      label: t(
        "careGigs.homeAssistance",
        {
          defaultValue:
            "Home Assistance",
        }
      ),
    },
    {
      id: "transportationSupport",
      icon: "🚗",
      label: t(
        "careGigs.transportationSupport",
        {
          defaultValue:
            "Transportation Support",
        }
      ),
    },
    {
      id: "supportServices",
      icon: "💬",
      label: t(
        "careGigs.supportServices",
        {
          defaultValue:
            "Support Services",
        }
      ),
    },
  ];

  return (
    <DashboardLayout>
      <main
        style={page}
        aria-labelledby="care-gigs-title"
      >
        <header>
          <h1 id="care-gigs-title">
            <span aria-hidden="true">
              🤝{" "}
            </span>

            {t(
              "careGigs.title",
              {
                defaultValue:
                  "Care-Gigs",
              }
            )}
          </h1>
        </header>

        <section
          aria-labelledby="care-gigs-services-title"
        >
          <h2
            id="care-gigs-services-title"
            className="sr-only"
          >
            {t(
              "careGigs.servicesTitle",
              {
                defaultValue:
                  "Care-Gig Services",
              }
            )}
          </h2>

          <div
            role="list"
            aria-label={t(
              "careGigs.servicesLabel",
              {
                defaultValue:
                  "Available Care-Gig services",
              }
            )}
          >
            {careGigServices.map(
              (service) => (
                <article
                  key={service.id}
                  role="listitem"
                  style={card}
                  tabIndex={0}
                  aria-label={service.label}
                >
                  <span
                    aria-hidden="true"
                  >
                    {service.icon}{" "}
                  </span>

                  <span>
                    {service.label}
                  </span>
                </article>
              )
            )}
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
}

const page = {
  color: "white",
};

const card = {
  background: "#0f172a",
  padding: "24px",
  borderRadius: "20px",
  marginBottom: "20px",
};

export default CareGigs;
