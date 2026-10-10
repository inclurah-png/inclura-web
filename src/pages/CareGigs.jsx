import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";
import { db } from "../firebase";

function CareGigs() {
  const { t, i18n } = useTranslation();

  const [careRequests, setCareRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    const auth = getAuth();
    let active = true;

    async function loadCareRequests(user) {
      if (!user) {
        if (active) {
          setCareRequests([]);
          setRequestError("AUTHENTICATION_REQUIRED");
          setLoadingRequests(false);
        }
        return;
      }

      if (active) {
        setLoadingRequests(true);
        setRequestError("");
      }

      try {
        const requestsQuery = query(
          collection(db, "careRequests"),
          where("requesterId", "==", user.uid)
        );

        const snapshot = await getDocs(requestsQuery);

        if (!active) return;

        const requests = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        // Sort locally to avoid requiring an additional Firestore index.
        requests.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() ?? 0;
          const timeB = b.createdAt?.toMillis?.() ?? 0;
          return timeB - timeA;
        });

        setCareRequests(requests);
      } catch (error) {
        console.error("Failed to load CareGig requests:", error);

        if (active) {
          setRequestError("CARE_REQUESTS_LOAD_FAILED");
        }
      } finally {
        if (active) {
          setLoadingRequests(false);
        }
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      void loadCareRequests(user);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const services = [
    {
      id: "caregiverRequests",
      icon: "🧑‍⚕️",
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
        defaultValue:
          "Find or request assistance with everyday home needs.",
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

  function formatDate(value) {
    if (!value) {
      return t("careGigs.dateNotSet", {
        defaultValue: "Not specified",
      });
    }

    let date;

    if (typeof value?.toDate === "function") {
      date = value.toDate();
    } else if (typeof value === "string") {
      // Preferred dates are stored as YYYY-MM-DD strings.
      const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
      date = dateOnly
        ? new Date(`${value}T12:00:00`)
        : new Date(value);
    } else {
      date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) {
      return t("careGigs.dateNotSet", {
        defaultValue: "Not specified",
      });
    }

    try {
      return new Intl.DateTimeFormat(i18n.language || "en", {
        dateStyle: "medium",
      }).format(date);
    } catch {
      return date.toLocaleDateString();
    }
  }

  function getServiceTypeLabel(serviceType) {
    const knownTypes = [
      "caregiver",
      "home_assistance",
      "transportation",
      "support",
    ];

    if (!knownTypes.includes(serviceType)) {
      return serviceType || t("careGigs.unknownService", {
        defaultValue: "Other care service",
      });
    }

    const defaults = {
      caregiver: "Caregiver",
      home_assistance: "Home Assistance",
      transportation: "Transportation",
      support: "Support Services",
    };

    return t(`careGigs.serviceTypes.${serviceType}`, {
      defaultValue: defaults[serviceType],
    });
  }

  function getStatusLabel(status) {
    const normalizedStatus = String(status || "open").toLowerCase();

    const knownStatuses = [
      "open",
      "pending",
      "assigned",
      "accepted",
      "in_progress",
      "completed",
      "cancelled",
      "closed",
    ];

    if (!knownStatuses.includes(normalizedStatus)) {
      return status || t("careGigs.statusUnknown", {
        defaultValue: "Unknown",
      });
    }

    const defaults = {
      open: "Open",
      pending: "Pending",
      assigned: "Assigned",
      accepted: "Accepted",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
      closed: "Closed",
    };

    return t(`careGigs.statuses.${normalizedStatus}`, {
      defaultValue: defaults[normalizedStatus],
    });
  }

  return (
    <DashboardLayout>
      <main aria-labelledby="care-gigs-title" style={page}>
        <header style={header}>
          <h1 id="care-gigs-title">
            <span aria-hidden="true">🤝 </span>
            {t("careGigs.title", {
              defaultValue: "Care-Gigs",
            })}
          </h1>

          <p style={intro}>
            {t("careGigs.introduction", {
              defaultValue:
                "Connect people who need care and support with people who can provide it.",
            })}
          </p>

          <Link
            to="/care-gigs/request"
            style={requestButton}
            aria-label={t("careGigs.createRequestAriaLabel", {
              defaultValue: "Create a new Care-Gig request",
            })}
          >
            {t("careGigs.createRequest", {
              defaultValue: "Create a Care Request",
            })}
          </Link>
        </header>

        <section
          aria-labelledby="my-care-requests-title"
          style={section}
        >
          <h2 id="my-care-requests-title">
            {t("careGigs.myRequestsTitle", {
              defaultValue: "My Care Requests",
            })}
          </h2>

          <p style={description}>
            {t("careGigs.myRequestsIntroduction", {
              defaultValue:
                "View the care requests you have submitted and check their current status.",
            })}
          </p>

          {loadingRequests && (
            <p role="status" aria-live="polite">
              {t("careGigs.loadingRequests", {
                defaultValue: "Loading your care requests...",
              })}
            </p>
          )}

          {!loadingRequests && requestError && (
            <div role="alert" style={errorNotice}>
              <p>
                {requestError === "AUTHENTICATION_REQUIRED"
                  ? t("careGigs.authenticationRequired", {
                      defaultValue:
                        "Please sign in to view your care requests.",
                    })
                  : t("careGigs.loadRequestsError", {
                      defaultValue:
                        "We could not load your care requests. Please try again.",
                    })}
              </p>

              {requestError !== "AUTHENTICATION_REQUIRED" && (
                <button
                  type="button"
                  style={retryButton}
                  onClick={() => {
                    setLoadingRequests(true);
                    setRequestError("");

                    const user = getAuth().currentUser;

                    if (user) {
                      const retryQuery = query(
                        collection(db, "careRequests"),
                        where("requesterId", "==", user.uid)
                      );

                      getDocs(retryQuery)
                        .then((snapshot) => {
                          const requests = snapshot.docs.map(
                            (document) => ({
                              id: document.id,
                              ...document.data(),
                            })
                          );

                          requests.sort((a, b) => {
                            const timeA =
                              a.createdAt?.toMillis?.() ?? 0;
                            const timeB =
                              b.createdAt?.toMillis?.() ?? 0;
                            return timeB - timeA;
                          });

                          setCareRequests(requests);
                        })
                        .catch((error) => {
                          console.error(
                            "CareGig request retry failed:",
                            error
                          );
                          setRequestError(
                            "CARE_REQUESTS_LOAD_FAILED"
                          );
                        })
                        .finally(() => {
                          setLoadingRequests(false);
                        });
                    } else {
                      setRequestError("AUTHENTICATION_REQUIRED");
                      setLoadingRequests(false);
                    }
                  }}
                >
                  {t("careGigs.retry", {
                    defaultValue: "Try Again",
                  })}
                </button>
              )}
            </div>
          )}

          {!loadingRequests &&
            !requestError &&
            careRequests.length === 0 && (
              <div style={emptyNotice}>
                <p>
                  {t("careGigs.noRequests", {
                    defaultValue:
                      "You have not submitted any care requests yet.",
                  })}
                </p>

                <Link to="/care-gigs/request" style={requestButton}>
                  {t("careGigs.createFirstRequest", {
                    defaultValue: "Create Your First Request",
                  })}
                </Link>
              </div>
            )}

          {!loadingRequests &&
            !requestError &&
            careRequests.length > 0 && (
              <div style={requestList}>
                {careRequests.map((request) => (
                  <article
                    key={request.id}
                    style={requestCard}
                    aria-labelledby={`care-request-${request.id}`}
                  >
                    <div style={requestCardHeader}>
                      <h3
                        id={`care-request-${request.id}`}
                        style={requestTitle}
                      >
                        {getServiceTypeLabel(request.serviceType)}
                      </h3>

                      <span style={statusBadge}>
                        {getStatusLabel(request.status)}
                      </span>
                    </div>

                    <p style={description}>
                      {request.description ||
                        t("careGigs.noDescription", {
                          defaultValue: "No description provided.",
                        })}
                    </p>

                    <dl style={detailsList}>
                      <div>
                        <dt style={detailLabel}>
                          {t("careGigs.locationLabel", {
                            defaultValue: "Location",
                          })}
                        </dt>
                        <dd style={detailValue}>
                          {request.location ||
                            t("careGigs.notSpecified", {
                              defaultValue: "Not specified",
                            })}
                        </dd>
                      </div>

                      <div>
                        <dt style={detailLabel}>
                          {t("careGigs.preferredDateLabel", {
                            defaultValue: "Preferred Date",
                          })}
                        </dt>
                        <dd style={detailValue}>
                          {formatDate(request.preferredDate)}
                        </dd>
                      </div>

                      <div>
                        <dt style={detailLabel}>
                          {t("careGigs.submittedDateLabel", {
                            defaultValue: "Submitted",
                          })}
                        </dt>
                        <dd style={detailValue}>
                          {formatDate(request.createdAt)}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            )}
        </section>

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
                <div style={iconContainer} aria-hidden="true">
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
              defaultValue:
                "CareGig is being developed with verification, accessibility preferences, privacy controls, reporting, and IFSE security protections.",
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
  width: "100%",
  boxSizing: "border-box",
};

const header = {
  marginBottom: "28px",
};

const section = {
  marginBottom: "36px",
};

const intro = {
  color: "#cbd5e1",
  lineHeight: "1.7",
  maxWidth: "760px",
};

const requestButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  zIndex: 1,
  marginTop: "18px",
  padding: "14px 20px",
  borderRadius: "12px",
  background: "#38bdf8",
  color: "#0f172a",
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
  overflowWrap: "anywhere",
};

const notice = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "18px",
  color: "#cbd5e1",
  lineHeight: "1.7",
};

const emptyNotice = {
  background: "#0f172a",
  padding: "24px",
  borderRadius: "16px",
  marginTop: "16px",
};

const errorNotice = {
  background: "#451a1a",
  color: "#fecaca",
  padding: "18px",
  borderRadius: "12px",
  marginTop: "16px",
};

const retryButton = {
  border: "1px solid #fecaca",
  borderRadius: "8px",
  padding: "10px 16px",
  background: "transparent",
  color: "white",
  cursor: "pointer",
};

const requestList = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: "16px",
  marginTop: "20px",
};

const requestCard = {
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "16px",
  padding: "20px",
  minWidth: 0,
  overflowWrap: "anywhere",
};

const requestCardHeader = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "12px",
};

const requestTitle = {
  margin: 0,
  fontSize: "18px",
  lineHeight: "1.5",
};

const statusBadge = {
  display: "inline-block",
  background: "#164e63",
  color: "#cffafe",
  padding: "5px 10px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "600",
};

const detailsList = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "16px",
  marginTop: "20px",
  marginBottom: 0,
};

const detailLabel = {
  color: "#94a3b8",
  fontSize: "13px",
  marginBottom: "5px",
};

const detailValue = {
  color: "#f8fafc",
  margin: 0,
  lineHeight: "1.5",
  overflowWrap: "anywhere",
};

export default CareGigs;

