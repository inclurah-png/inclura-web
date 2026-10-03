import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

import DashboardLayout from "../components/DashboardLayout";

import {
  db,
  auth,
} from "../firebase";

import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function OpportunityDetails() {
  const { id } = useParams();

  const { t } = useTranslation();

  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);

  const [applying, setApplying] = useState(false);

  const [hasApplied, setHasApplied] = useState(false);

  const [error, setError] = useState("");

  const [statusMessage, setStatusMessage] =
    useState("");

  useEffect(() => {
    let mounted = true;

    async function loadOpportunity() {
      if (!id) {
        if (mounted) {
          setError(
            t(
              "opportunity.invalidId",
              {
                defaultValue:
                  "This opportunity could not be identified.",
              }
            )
          );

          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError("");

        const snap = await getDoc(
          doc(
            db,
            "opportunities",
            id
          )
        );

        if (!mounted) {
          return;
        }

        if (!snap.exists()) {
          setJob(null);
          return;
        }

        setJob({
          id: snap.id,
          ...snap.data(),
        });
      } catch (err) {
        console.error(
          "Unable to load opportunity:",
          err
        );

        if (mounted) {
          setError(
            t(
              "opportunity.loadError",
              {
                defaultValue:
                  "Unable to load this opportunity. Please try again.",
              }
            )
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOpportunity();

    return () => {
      mounted = false;
    };
  }, [id, t]);

  useEffect(() => {
    let mounted = true;

    async function checkExistingApplication() {
      const user = auth.currentUser;

      if (
        !user ||
        !id
      ) {
        if (mounted) {
          setHasApplied(false);
        }

        return;
      }

      try {
        const applicationsQuery =
          query(
            collection(
              db,
              "applications"
            ),
            where(
              "opportunityId",
              "==",
              id
            ),
            where(
              "applicantId",
              "==",
              user.uid
            )
          );

        const snapshot =
          await getDocs(
            applicationsQuery
          );

        if (mounted) {
          setHasApplied(
            !snapshot.empty
          );
        }
      } catch (err) {
        console.error(
          "Unable to check application status:",
          err
        );

        /*
         * Do not block the opportunity page
         * when the application-status lookup
         * fails.
         *
         * The final duplicate check is also
         * performed immediately before creating
         * an application.
         */
      }
    }

    checkExistingApplication();

    return () => {
      mounted = false;
    };
  }, [id]);

  function isOpportunityOpen() {
    if (!job) {
      return false;
    }

    if (
      job.status !==
      "active"
    ) {
      return false;
    }

    if (!job.deadline) {
      return true;
    }

    let deadlineDate = null;

    if (
      typeof job.deadline?.toDate ===
      "function"
    ) {
      deadlineDate =
        job.deadline.toDate();
    } else if (
      job.deadline instanceof Date
    ) {
      deadlineDate =
        job.deadline;
    } else if (
      typeof job.deadline ===
      "string"
    ) {
      const parsedDate =
        new Date(
          job.deadline
        );

      if (
        !Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        deadlineDate =
          parsedDate;
      }
    }

    if (!deadlineDate) {
      return true;
    }

    return (
      deadlineDate.getTime() >
      Date.now()
    );
  }

  function formatDeadline(
    deadline
  ) {
    if (!deadline) {
      return t(
        "opportunity.notSpecified",
        {
          defaultValue:
            "Not specified",
        }
      );
    }

    if (
      typeof deadline?.toDate ===
      "function"
    ) {
      return deadline
        .toDate()
        .toLocaleDateString();
    }

    if (
      deadline instanceof Date
    ) {
      return deadline.toLocaleDateString();
    }

    return String(
      deadline
    );
  }

  async function applyNow() {
    if (applying) {
      return;
    }

    const user =
      auth.currentUser;

    if (!user) {
      setStatusMessage(
        t(
          "opportunity.loginRequired",
          {
            defaultValue:
              "Please log in before applying for this opportunity.",
          }
        )
      );

      return;
    }

    if (!job) {
      return;
    }

    if (
      !isOpportunityOpen()
    ) {
      setStatusMessage(
        t(
          "opportunity.closed",
          {
            defaultValue:
              "This opportunity is no longer accepting applications.",
          }
        )
      );

      return;
    }

    setApplying(true);
    setStatusMessage("");

    try {
      /*
       * Perform the duplicate check again immediately
       * before writing the application.
       *
       * The earlier page-level check improves the UI,
       * while this check protects the actual submission
       * flow from repeated clicks or stale page state.
       */
      const applicationsQuery =
        query(
          collection(
            db,
            "applications"
          ),
          where(
            "opportunityId",
            "==",
            job.id
          ),
          where(
            "applicantId",
            "==",
            user.uid
          )
        );

      const existingApplications =
        await getDocs(
          applicationsQuery
        );

      if (
        !existingApplications.empty
      ) {
        setHasApplied(true);

        setStatusMessage(
          t(
            "opportunity.alreadyApplied",
            {
              defaultValue:
                "You have already applied for this opportunity.",
            }
          )
        );

        return;
      }

      await addDoc(
        collection(
          db,
          "applications"
        ),
        {
          opportunityId:
            job.id,

          recruiterId:
            job.recruiterId ||
            "",

          applicantId:
            user.uid,

          applicantName:
            user.displayName ||
            "",

          applicantEmail:
            user.email ||
            "",

          status:
            "pending",

          createdAt:
            serverTimestamp(),
        }
      );

      /*
       * Preserve the existing opportunity application
       * counter used by the current Opportunity Hub.
       */
      await updateDoc(
        doc(
          db,
          "opportunities",
          job.id
        ),
        {
          applications:
            increment(1),
        }
      );

      setHasApplied(true);

      setStatusMessage(
        t(
          "opportunity.applicationSuccess",
          {
            defaultValue:
              "Application submitted successfully.",
          }
        )
      );
    } catch (err) {
      console.error(
        "Unable to submit application:",
        err
      );

      setStatusMessage(
        t(
          "opportunity.applicationError",
          {
            defaultValue:
              "Unable to submit your application. Please try again.",
          }
        )
      );
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <main
          aria-busy="true"
          aria-live="polite"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "24px",
          }}
        >
          <h1
            style={{
              color: "white",
            }}
          >
            {t(
              "opportunity.loading",
              {
                defaultValue:
                  "Loading opportunity...",
              }
            )}
          </h1>
        </main>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <main
          role="alert"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "24px",
          }}
        >
          <section
            style={{
              background:
                "#0f172a",
              padding: "24px",
              borderRadius: "20px",
              color: "white",
            }}
          >
            <h1>
              {t(
                "opportunity.errorTitle",
                {
                  defaultValue:
                    "Unable to load opportunity",
                }
              )}
            </h1>

            <p
              style={{
                lineHeight: "1.7",
              }}
            >
              {error}
            </p>
          </section>
        </main>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <main
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "24px",
          }}
        >
          <section
            role="status"
            style={{
              background:
                "#0f172a",
              padding: "24px",
              borderRadius: "20px",
              color: "white",
            }}
          >
            <h1>
              {t(
                "opportunity.notFoundTitle",
                {
                  defaultValue:
                    "Opportunity not found",
                }
              )}
            </h1>

            <p>
              {t(
                "opportunity.notFoundMessage",
                {
                  defaultValue:
                    "This opportunity may have been removed or is no longer available.",
                }
              )}
            </p>
          </section>
        </main>
      </DashboardLayout>
    );
  }

  const opportunityOpen =
    isOpportunityOpen();

  const card = {
    background:
      "#0f172a",
    padding: "24px",
    borderRadius: "20px",
    marginBottom: "20px",
    color: "white",
  };

  const recruiterPlan =
    job.recruiterPlan ||
    t(
      "opportunity.notSpecified",
      {
        defaultValue:
          "Not specified",
      }
    );

  return (
    <DashboardLayout>
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 0 30px",
        }}
      >
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: "0",
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: "0",
          }}
        >
          {statusMessage}
        </div>

        {/* Header */}

        <section
          aria-labelledby="opportunity-title"
          style={card}
        >
          <h1 id="opportunity-title">
            {job.title ||
              t(
                "opportunity.untitled",
                {
                  defaultValue:
                    "Untitled Opportunity",
                }
              )}
          </h1>

          <h2
            style={{
              color: "#38bdf8",
              fontSize: "20px",
            }}
          >
            {job.company ||
              t(
                "opportunity.organizationNotSpecified",
                {
                  defaultValue:
                    "Organization not specified",
                }
              )}
          </h2>

          <dl
            style={{
              lineHeight: "1.8",
            }}
          >
            <div>
              <dt
                style={{
                  fontWeight: "700",
                }}
              >
                {t(
                  "opportunity.location",
                  {
                    defaultValue:
                      "Location",
                  }
                )}
              </dt>

              <dd>
                {job.location ||
                  t(
                    "opportunity.notSpecified",
                    {
                      defaultValue:
                        "Not specified",
                    }
                  )}
              </dd>
            </div>

            <div>
              <dt
                style={{
                  fontWeight: "700",
                }}
              >
                {t(
                  "opportunity.employmentType",
                  {
                    defaultValue:
                      "Employment Type",
                  }
                )}
              </dt>

              <dd>
                {job.employmentType ||
                  t(
                    "opportunity.notSpecified",
                    {
                      defaultValue:
                        "Not specified",
                    }
                  )}
              </dd>
            </div>

            <div>
              <dt
                style={{
                  fontWeight: "700",
                }}
              >
                {t(
                  "opportunity.salary",
                  {
                    defaultValue:
                      "Salary",
                  }
                )}
              </dt>

              <dd>
                {job.salary ||
                  t(
                    "opportunity.notSpecified",
                    {
                      defaultValue:
                        "Not specified",
                    }
                  )}
              </dd>
            </div>

            <div>
              <dt
                style={{
                  fontWeight: "700",
                }}
              >
                {t(
                  "opportunity.deadline",
                  {
                    defaultValue:
                      "Application Deadline",
                  }
                )}
              </dt>

              <dd>
                {formatDeadline(
                  job.deadline
                )}
              </dd>
            </div>

            <div>
              <dt
                style={{
                  fontWeight: "700",
                }}
              >
                {t(
                  "opportunity.applications",
                  {
                    defaultValue:
                      "Applications",
                  }
                )}
              </dt>

              <dd>
                {job.applications ||
                  0}
              </dd>
            </div>

            <div>
              <dt
                style={{
                  fontWeight: "700",
                }}
              >
                {t(
                  "opportunity.recruiterPlan",
                  {
                    defaultValue:
                      "Recruiter Plan",
                  }
                )}
              </dt>

              <dd>
                {recruiterPlan}
              </dd>
            </div>
          </dl>
        </section>

        {/* Description */}

        <section
          aria-labelledby="opportunity-description"
          style={card}
        >
          <h2 id="opportunity-description">
            {t(
              "opportunity.descriptionTitle",
              {
                defaultValue:
                  "Opportunity Description",
              }
            )}
          </h2>

          <p
            style={{
              whiteSpace:
                "pre-wrap",
              lineHeight: "1.8",
            }}
          >
            {job.description ||
              t(
                "opportunity.descriptionUnavailable",
                {
                  defaultValue:
                    "No description was provided.",
                }
              )}
          </p>
        </section>

        {/* Requirements */}

        <section
          aria-labelledby="opportunity-requirements"
          style={card}
        >
          <h2 id="opportunity-requirements">
            {t(
              "opportunity.requirementsTitle",
              {
                defaultValue:
                  "Requirements",
              }
            )}
          </h2>

          <p
            style={{
              whiteSpace:
                "pre-wrap",
              lineHeight: "1.8",
            }}
          >
            {job.requirements ||
              t(
                "opportunity.requirementsUnavailable",
                {
                  defaultValue:
                    "No specific requirements were provided.",
                }
              )}
          </p>
        </section>

        {/* Recruiter */}

        <section
          aria-labelledby="opportunity-recruiter"
          style={card}
        >
          <h2 id="opportunity-recruiter">
            {t(
              "opportunity.recruiterTitle",
              {
                defaultValue:
                  "Recruiter Information",
              }
            )}
          </h2>

          <dl
            style={{
              lineHeight: "1.8",
            }}
          >
            <div>
              <dt
                style={{
                  fontWeight: "700",
                }}
              >
                {t(
                  "opportunity.organization",
                  {
                    defaultValue:
                      "Organization",
                  }
                )}
              </dt>

              <dd>
                {job.company ||
                  t(
                    "opportunity.notSpecified",
                    {
                      defaultValue:
                        "Not specified",
                    }
                  )}
              </dd>
            </div>

            <div>
              <dt
                style={{
                  fontWeight: "700",
                }}
              >
                {t(
                  "opportunity.recruiterId",
                  {
                    defaultValue:
                      "Recruiter ID",
                  }
                )}
              </dt>

              <dd>
                {job.recruiterId ||
                  t(
                    "opportunity.notSpecified",
                    {
                      defaultValue:
                        "Not specified",
                    }
                  )}
              </dd>
            </div>

            <div>
              <dt
                style={{
                  fontWeight: "700",
                }}
              >
                {t(
                  "opportunity.status",
                  {
                    defaultValue:
                      "Status",
                  }
                )}
              </dt>

              <dd>
                {job.status ||
                  t(
                    "opportunity.notSpecified",
                    {
                      defaultValue:
                        "Not specified",
                    }
                  )}
              </dd>
            </div>
          </dl>
        </section>

        {/* Apply */}

        <section
          aria-labelledby="opportunity-application"
          style={{
            ...card,
            textAlign: "center",
          }}
        >
          <h2 id="opportunity-application">
            {t(
              "opportunity.applicationTitle",
              {
                defaultValue:
                  "Application",
              }
            )}
          </h2>

          {hasApplied && (
            <p
              role="status"
              style={{
                color: "#86efac",
                fontWeight: "700",
              }}
            >
              {t(
                "opportunity.alreadyApplied",
                {
                  defaultValue:
                    "You have already applied for this opportunity.",
                }
              )}
            </p>
          )}

          {!opportunityOpen &&
            !hasApplied && (
              <p
                role="status"
                style={{
                  color: "#fbbf24",
                  fontWeight: "700",
                }}
              >
                {t(
                  "opportunity.closed",
                  {
                    defaultValue:
                      "This opportunity is no longer accepting applications.",
                  }
                )}
              </p>
            )}

          <button
            type="button"
            onClick={applyNow}
            disabled={
              applying ||
              hasApplied ||
              !opportunityOpen
            }
            aria-describedby="application-help"
            style={{
              width: "100%",
              padding: "18px",
              border: "none",
              borderRadius: "14px",
              background:
                "#38bdf8",
              color: "white",
              fontWeight: "700",
              fontSize: "18px",
              cursor:
                applying ||
                hasApplied ||
                !opportunityOpen
                  ? "not-allowed"
                  : "pointer",
              opacity:
                applying ||
                hasApplied ||
                !opportunityOpen
                  ? 0.6
                  : 1,
            }}
          >
            {applying
              ? t(
                  "opportunity.submitting",
                  {
                    defaultValue:
                      "Submitting Application...",
                  }
                )
              : hasApplied
              ? t(
                  "opportunity.applied",
                  {
                    defaultValue:
                      "Application Submitted",
                  }
                )
              : !opportunityOpen
              ? t(
                  "opportunity.closedButton",
                  {
                    defaultValue:
                      "Opportunity Closed",
                  }
                )
              : t(
                  "opportunity.applyNow",
                  {
                    defaultValue:
                      "Apply Now",
                  }
                )}
          </button>

          <p
            id="application-help"
            style={{
              color: "#94a3b8",
              marginTop: "18px",
              lineHeight: "1.7",
            }}
          >
            {t(
              "opportunity.applicationHelp",
              {
                defaultValue:
                  "By applying, your profile will be submitted directly to the recruiter for review. Recruiters may contact successful applicants through their Inclura profile or registered email.",
              }
            )}
          </p>

          {statusMessage && (
            <p
              role="status"
              aria-live="polite"
              style={{
                color: "#e2e8f0",
                marginTop: "16px",
                lineHeight: "1.7",
              }}
            >
              {statusMessage}
            </p>
          )}
        </section>

        {/* Notice */}

        <aside
          aria-labelledby="opportunity-notice"
          style={{
            background:
              "#1e293b",
            padding: "18px",
            borderRadius: "16px",
            color: "#cbd5e1",
            marginBottom: "30px",
          }}
        >
          <h2
            id="opportunity-notice"
            style={{
              color: "white",
            }}
          >
            {t(
              "opportunity.importantNotice",
              {
                defaultValue:
                  "Important Notice",
              }
            )}
          </h2>

          <ul
            style={{
              lineHeight: "1.9",
            }}
          >
            <li>
              {t(
                "opportunity.noticeNoPayment",
                {
                  defaultValue:
                    "Never pay anyone to secure a job.",
                }
              )}
            </li>

            <li>
              {t(
                "opportunity.noticeVerification",
                {
                  defaultValue:
                    "Inclura only verifies recruiter identities; hiring decisions remain with recruiters.",
                }
              )}
            </li>

            <li>
              {t(
                "opportunity.noticeReport",
                {
                  defaultValue:
                    "Report suspicious opportunities immediately.",
                }
              )}
            </li>

            <li>
              {t(
                "opportunity.noticeNoEdit",
                {
                  defaultValue:
                    "Applications cannot be edited after submission.",
                }
              )}
            </li>

            <li>
              {t(
                "opportunity.noticeEarlyClose",
                {
                  defaultValue:
                    "Some opportunities may close before the deadline once positions are filled.",
                }
              )}
            </li>
          </ul>
        </aside>
      </main>
    </DashboardLayout>
  );
}

export default OpportunityDetails;
