import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function OpportunityCard({ opportunity }) {
  const { t } = useTranslation();

  const safeOpportunity = opportunity || {};

  const {
    id = "",
    title = "",
    company = "",
    location = "",
    employmentType = "",
    salary = "",
    deadline = "",
    applications = 0,
    status = "",
    description = "",
    recruiterPlan = "",
    featured = false,
    createdAt = null,
  } = safeOpportunity;

  const cardStyle = {
    background: "#0f172a",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "20px",
    color: "white",
    border: "1px solid #1e293b",
  };

  const badgeStyle = {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
    marginRight: "8px",
    marginBottom: "8px",
  };

  const normalizedStatus = String(status).toLowerCase();

  const statusLabel =
    normalizedStatus === "active"
      ? t("opportunities.status.active", {
          defaultValue: "Active",
        })
      : normalizedStatus === "closed"
      ? t("opportunities.status.closed", {
          defaultValue: "Closed",
        })
      : normalizedStatus === "expired"
      ? t("opportunities.status.expired", {
          defaultValue: "Expired",
        })
      : status ||
        t("opportunities.status.unknown", {
          defaultValue: "Status unavailable",
        });

  const statusIsActive =
    normalizedStatus === "active";

  const formattedCreatedDate =
    createdAt?.seconds
      ? new Date(
          createdAt.seconds * 1000
        ).toLocaleDateString()
      : createdAt?.toDate
      ? createdAt.toDate().toLocaleDateString()
      : t("opportunities.recently", {
          defaultValue: "Recently",
        });

  const truncatedDescription =
    String(description).substring(0, 180);

  return (
    <article
      aria-labelledby={`opportunity-title-${id}`}
      style={cardStyle}
    >
      {/* Top Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h2
            id={`opportunity-title-${id}`}
            style={{
              margin: 0,
              lineHeight: "1.4",
            }}
          >
            {title ||
              t("opportunities.untitled", {
                defaultValue:
                  "Untitled opportunity",
              })}
          </h2>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "8px",
            }}
          >
            {company ||
              t("opportunities.organizationUnavailable", {
                defaultValue:
                  "Organization unavailable",
              })}
          </p>
        </div>

        <div
          aria-label={t(
            "opportunities.badgesLabel",
            {
              defaultValue:
                "Opportunity badges",
            }
          )}
        >
          {featured && (
            <span
              style={{
                ...badgeStyle,
                background: "#f59e0b",
                color: "white",
              }}
            >
              ⭐{" "}
              {t("opportunities.badges.featured", {
                defaultValue: "Featured",
              })}
            </span>
          )}

          {recruiterPlan === "business" && (
            <span
              style={{
                ...badgeStyle,
                background: "#10b981",
                color: "white",
              }}
            >
              {t(
                "opportunities.badges.businessRecruiter",
                {
                  defaultValue:
                    "Business Recruiter",
                }
              )}
            </span>
          )}

          {recruiterPlan === "enterprise" && (
            <span
              style={{
                ...badgeStyle,
                background: "#7c3aed",
                color: "white",
              }}
            >
              {t(
                "opportunities.badges.enterpriseHiring",
                {
                  defaultValue:
                    "Enterprise Hiring",
                }
              )}
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <dl
        style={{
          marginTop: "20px",
          color: "#cbd5e1",
          lineHeight: "1.8",
        }}
      >
        <div>
          <dt
            style={{
              display: "inline",
              fontWeight: "700",
            }}
          >
            📍{" "}
            {t("opportunities.details.location", {
              defaultValue: "Location",
            })}
            :{" "}
          </dt>
          <dd
            style={{
              display: "inline",
              margin: 0,
            }}
          >
            {location ||
              t("opportunities.notSpecified", {
                defaultValue: "Not specified",
              })}
          </dd>
        </div>

        <div>
          <dt
            style={{
              display: "inline",
              fontWeight: "700",
            }}
          >
            💼{" "}
            {t(
              "opportunities.details.employment",
              {
                defaultValue: "Employment",
              }
            )}
            :{" "}
          </dt>
          <dd
            style={{
              display: "inline",
              margin: 0,
            }}
          >
            {employmentType ||
              t("opportunities.notSpecified", {
                defaultValue: "Not specified",
              })}
          </dd>
        </div>

        <div>
          <dt
            style={{
              display: "inline",
              fontWeight: "700",
            }}
          >
            💰{" "}
            {t("opportunities.details.salary", {
              defaultValue: "Salary",
            })}
            :{" "}
          </dt>
          <dd
            style={{
              display: "inline",
              margin: 0,
            }}
          >
            {salary ||
              t("opportunities.notSpecified", {
                defaultValue: "Not specified",
              })}
          </dd>
        </div>

        <div>
          <dt
            style={{
              display: "inline",
              fontWeight: "700",
            }}
          >
            📅{" "}
            {t("opportunities.details.deadline", {
              defaultValue: "Deadline",
            })}
            :{" "}
          </dt>
          <dd
            style={{
              display: "inline",
              margin: 0,
            }}
          >
            {deadline ||
              t("opportunities.notSpecified", {
                defaultValue: "Not specified",
              })}
          </dd>
        </div>

        <div>
          <dt
            style={{
              display: "inline",
              fontWeight: "700",
            }}
          >
            👥{" "}
            {t(
              "opportunities.details.applications",
              {
                defaultValue: "Applications",
              }
            )}
            :{" "}
          </dt>
          <dd
            style={{
              display: "inline",
              margin: 0,
            }}
          >
            {Number.isFinite(Number(applications))
              ? Number(applications)
              : 0}
          </dd>
        </div>

        <div>
          <dt
            style={{
              display: "inline",
              fontWeight: "700",
            }}
          >
            🟢{" "}
            {t("opportunities.details.status", {
              defaultValue: "Status",
            })}
            :{" "}
          </dt>
          <dd
            style={{
              display: "inline",
              margin: 0,
            }}
          >
            <span
              aria-label={`${t(
                "opportunities.details.status",
                {
                  defaultValue: "Status",
                }
              )}: ${statusLabel}`}
            >
              {statusLabel}
            </span>
          </dd>
        </div>
      </dl>

      {/* Description Preview */}
      <div
        style={{
          marginTop: "18px",
          color: "#94a3b8",
          lineHeight: "1.7",
        }}
      >
        <p
          style={{
            margin: 0,
          }}
        >
          {truncatedDescription ||
            t(
              "opportunities.descriptionUnavailable",
              {
                defaultValue:
                  "No description is available for this opportunity.",
              }
            )}

          {String(description).length > 180
            ? "..."
            : ""}
        </p>
      </div>

      {/* Bottom Row */}
      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {recruiterPlan && (
          <span
            style={{
              color: "#38bdf8",
              fontWeight: "700",
            }}
          >
            {t(
              "opportunities.recruiterPlan",
              {
                defaultValue:
                  "Recruiter Plan",
              }
            )}
            : {recruiterPlan}
          </span>
        )}

        {id ? (
          <Link
            to={`/opportunity/${id}`}
            aria-label={t(
              "opportunities.viewOpportunityAria",
              {
                defaultValue:
                  "View opportunity: {{title}}",
                title:
                  title ||
                  t("opportunities.untitled", {
                    defaultValue:
                      "Untitled opportunity",
                  }),
              }
            )}
            style={{
              textDecoration: "none",
            }}
          >
            <span
              role="button"
              tabIndex={0}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 22px",
                borderRadius: "12px",
                background: "#38bdf8",
                color: "white",
                fontWeight: "700",
                fontSize: "15px",
                minHeight: "44px",
              }}
            >
              {t(
                "opportunities.viewOpportunity",
                {
                  defaultValue:
                    "View Opportunity",
                }
              )}
            </span>
          </Link>
        ) : (
          <span
            aria-disabled="true"
            style={{
              padding: "12px 22px",
              borderRadius: "12px",
              background: "#475569",
              color: "#cbd5e1",
              fontWeight: "700",
              fontSize: "15px",
            }}
          >
            {t(
              "opportunities.unavailable",
              {
                defaultValue:
                  "Opportunity unavailable",
              }
            )}
          </span>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: "20px",
          paddingTop: "16px",
          borderTop: "1px solid #1e293b",
          color: "#64748b",
          fontSize: "13px",
        }}
      >
        <p
          style={{
            margin: 0,
          }}
        >
          {t("opportunities.postedBy", {
            defaultValue: "Posted by",
          })}{" "}
          <strong>
            {company ||
              t("opportunities.organizationUnavailable", {
                defaultValue:
                  "Organization unavailable",
              })}
          </strong>

          {" • "}

          {formattedCreatedDate}
        </p>

        {!statusIsActive && (
          <p
            role="status"
            style={{
              marginTop: "8px",
              color: "#fbbf24",
            }}
          >
            {t("opportunities.statusNotice", {
              defaultValue:
                "This opportunity is not currently accepting applications.",
            })}
          </p>
        )}
      </footer>
    </article>
  );
}

export default OpportunityCard;
