import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import DashboardLayout from "../components/DashboardLayout";
import OpportunityCard from "../components/OpportunityCard";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

function OpportunitiesHub() {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    {
      id: "All",
      label: t("opportunities.categories.all", {
        defaultValue: "All",
      }),
    },
    {
      id: "Remote",
      label: t("opportunities.categories.remote", {
        defaultValue: "Remote",
      }),
    },
    {
      id: "Enterprise",
      label: t("opportunities.categories.enterprise", {
        defaultValue: "Enterprise",
      }),
    },
    {
      id: "Internship",
      label: t("opportunities.categories.internship", {
        defaultValue: "Internship",
      }),
    },
    {
      id: "Volunteer",
      label: t("opportunities.categories.volunteer", {
        defaultValue: "Volunteer",
      }),
    },
    {
      id: "Scholarship",
      label: t("opportunities.categories.scholarship", {
        defaultValue: "Scholarship",
      }),
    },
    {
      id: "Grant",
      label: t("opportunities.categories.grant", {
        defaultValue: "Grant",
      }),
    },
    {
      id: "Competition",
      label: t("opportunities.categories.competition", {
        defaultValue: "Competition",
      }),
    },
    {
      id: "Freelance",
      label: t("opportunities.categories.freelance", {
        defaultValue: "Freelance",
      }),
    },
    {
      id: "Full Time",
      label: t("opportunities.categories.fullTime", {
        defaultValue: "Full Time",
      }),
    },
    {
      id: "Part Time",
      label: t("opportunities.categories.partTime", {
        defaultValue: "Part Time",
      }),
    },
  ];

  useEffect(() => {
    let mounted = true;

    async function loadOpportunities() {
      setLoading(true);
      setError("");

      try {
        const q = query(
          collection(db, "opportunities"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        if (!mounted) return;

        const jobs = [];

        snapshot.forEach((opportunityDoc) => {
          const data = opportunityDoc.data();

          jobs.push({
            id: opportunityDoc.id,
            ...data,
          });
        });

        setOpportunities(jobs);
      } catch (loadError) {
        console.error(
          "Unable to load opportunities:",
          loadError
        );

        if (!mounted) return;

        setOpportunities([]);
        setError(
          t("opportunities.errors.loadFailed", {
            defaultValue:
              "We couldn't load opportunities right now. Please try again.",
          })
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOpportunities();

    return () => {
      mounted = false;
    };
  }, [t]);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredJobs = useMemo(() => {
    return opportunities.filter((job) => {
      const title = String(job.title || "").toLowerCase();
      const company = String(job.company || "").toLowerCase();
      const location = String(job.location || "").toLowerCase();
      const description = String(
        job.description || ""
      ).toLowerCase();
      const requirements = String(
        job.requirements || ""
      ).toLowerCase();
      const employmentType = String(
        job.employmentType || ""
      ).toLowerCase();
      const opportunityType = String(
        job.opportunityType || ""
      ).toLowerCase();
      const categoryValue = String(
        job.category || ""
      ).toLowerCase();
      const workType = String(
        job.workType || ""
      ).toLowerCase();
      const recruiterPlan = String(
        job.recruiterPlan || ""
      ).toLowerCase();

      const matchesSearch =
        normalizedSearch === "" ||
        title.includes(normalizedSearch) ||
        company.includes(normalizedSearch) ||
        location.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        requirements.includes(normalizedSearch) ||
        employmentType.includes(normalizedSearch) ||
        opportunityType.includes(normalizedSearch) ||
        categoryValue.includes(normalizedSearch);

      if (category === "All") {
        return matchesSearch;
      }

      const normalizedCategory =
        category.toLowerCase();

      const categoryMatches = [
        employmentType,
        opportunityType,
        categoryValue,
        workType,
        recruiterPlan,
        location,
      ].some((value) =>
        value.includes(normalizedCategory)
      );

      return (
        matchesSearch &&
        categoryMatches
      );
    });
  }, [opportunities, normalizedSearch, category]);

  const featured = useMemo(() => {
    return filteredJobs.filter(
      (job) => job.featured === true
    );
  }, [filteredJobs]);

  const latest = useMemo(() => {
    const featuredIds = new Set(
      featured.map((job) => job.id)
    );

    return filteredJobs.filter(
      (job) => !featuredIds.has(job.id)
    );
  }, [filteredJobs, featured]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  const handleCategoryChange = (categoryId) => {
    setCategory(categoryId);
  };

  return (
    <DashboardLayout>
      <main
        aria-labelledby="opportunities-hub-title"
        style={{
          color: "white",
        }}
      >
        <header>
          <h1
            id="opportunities-hub-title"
            style={{
              fontSize: "34px",
            }}
          >
            💼{" "}
            {t("opportunities.title", {
              defaultValue: "Opportunities Hub",
            })}
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginBottom: "24px",
              lineHeight: "1.7",
            }}
          >
            {t("opportunities.description", {
              defaultValue:
                "Discover jobs, internships, grants, scholarships, competitions and freelance opportunities.",
            })}
          </p>
        </header>

        <section
          aria-labelledby="opportunities-search-title"
          style={{
            marginBottom: "24px",
          }}
        >
          <h2
            id="opportunities-search-title"
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: 0,
              margin: "-1px",
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            {t("opportunities.searchSection", {
              defaultValue: "Search opportunities",
            })}
          </h2>

          <form
            onSubmit={handleSearchSubmit}
            role="search"
          >
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <label
                htmlFor="opportunity-search"
                style={{
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  padding: 0,
                  margin: "-1px",
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              >
                {t("opportunities.searchLabel", {
                  defaultValue:
                    "Search opportunities",
                })}
              </label>

              <input
                id="opportunity-search"
                type="search"
                placeholder={t(
                  "opportunities.searchPlaceholder",
                  {
                    defaultValue:
                      "Search opportunities...",
                  }
                )}
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                autoComplete="off"
                aria-describedby="opportunity-search-help"
                style={{
                  flex: 1,
                  minWidth: "240px",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid #334155",
                  background: "#1e293b",
                  color: "white",
                  fontSize: "16px",
                }}
              />

              <button
                type="submit"
                style={{
                  padding: "14px 24px",
                  border: "none",
                  borderRadius: "12px",
                  background: "#38bdf8",
                  color: "white",
                  fontWeight: "700",
                  cursor: "pointer",
                  minHeight: "48px",
                }}
              >
                🔍{" "}
                {t("opportunities.searchButton", {
                  defaultValue: "Search",
                })}
              </button>
            </div>

            <p
              id="opportunity-search-help"
              style={{
                color: "#94a3b8",
                marginTop: "8px",
                fontSize: "14px",
              }}
            >
              {t("opportunities.searchHelp", {
                defaultValue:
                  "Search by title, organization, location, opportunity type, description or requirements.",
              })}
            </p>
          </form>
        </section>

        <section
          aria-labelledby="opportunity-categories-title"
          style={{
            marginBottom: "30px",
          }}
        >
          <h2
            id="opportunity-categories-title"
            style={{
              fontSize: "20px",
              marginBottom: "14px",
            }}
          >
            {t("opportunities.categoriesTitle", {
              defaultValue:
                "Opportunity categories",
            })}
          </h2>

          <div
            role="group"
            aria-labelledby="opportunity-categories-title"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  handleCategoryChange(item.id)
                }
                aria-pressed={
                  category === item.id
                }
                style={{
                  padding: "10px 18px",
                  borderRadius: "999px",
                  border:
                    category === item.id
                      ? "2px solid #ffffff"
                      : "1px solid #334155",
                  cursor: "pointer",
                  fontWeight: "700",
                  background:
                    category === item.id
                      ? "#38bdf8"
                      : "#1e293b",
                  color: "white",
                  minHeight: "44px",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          {loading
            ? t("opportunities.loading", {
                defaultValue:
                  "Loading opportunities.",
              })
            : t("opportunities.resultsCount", {
                defaultValue:
                  "{{count}} opportunities found.",
                count: filteredJobs.length,
              })}
        </div>

        {error && (
          <section
            role="alert"
            aria-labelledby="opportunity-error-title"
            style={{
              background: "#450a0a",
              border: "1px solid #991b1b",
              padding: "18px",
              borderRadius: "16px",
              marginBottom: "24px",
              color: "#fecaca",
            }}
          >
            <h2
              id="opportunity-error-title"
              style={{
                marginTop: 0,
                color: "white",
              }}
            >
              {t("opportunities.errors.title", {
                defaultValue:
                  "Unable to load opportunities",
              })}
            </h2>

            <p>{error}</p>
          </section>
        )}

        {loading ? (
          <section
            aria-labelledby="opportunity-loading-title"
            aria-busy="true"
            style={{
              background: "#0f172a",
              padding: "40px",
              borderRadius: "18px",
              textAlign: "center",
            }}
          >
            <h2
              id="opportunity-loading-title"
              style={{
                marginTop: 0,
              }}
            >
              {t("opportunities.loadingTitle", {
                defaultValue:
                  "Loading opportunities...",
              })}
            </h2>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              {t(
                "opportunities.loadingDescription",
                {
                  defaultValue:
                    "Please wait while available opportunities are loaded.",
                }
              )}
            </p>
          </section>
        ) : (
          <>
            {featured.length > 0 && (
              <section
                aria-labelledby="featured-opportunities-title"
              >
                <h2
                  id="featured-opportunities-title"
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  ⭐{" "}
                  {t(
                    "opportunities.featuredTitle",
                    {
                      defaultValue:
                        "Featured Opportunities",
                    }
                  )}
                </h2>

                {featured.map((job) => (
                  <OpportunityCard
                    key={job.id}
                    opportunity={job}
                  />
                ))}
              </section>
            )}

            <section
              aria-labelledby="latest-opportunities-title"
              style={{
                marginTop: "40px",
              }}
            >
              <h2
                id="latest-opportunities-title"
                style={{
                  marginBottom: "20px",
                }}
              >
                🆕{" "}
                {t(
                  "opportunities.latestTitle",
                  {
                    defaultValue:
                      "Latest Opportunities",
                  }
                )}
              </h2>

              {latest.length === 0 ? (
                <div
                  role="status"
                  style={{
                    background: "#0f172a",
                    padding: "40px",
                    borderRadius: "18px",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  <h3
                    style={{
                      color: "white",
                    }}
                  >
                    {t(
                      "opportunities.noResultsTitle",
                      {
                        defaultValue:
                          "No opportunities found",
                      }
                    )}
                  </h3>

                  <p>
                    {t(
                      "opportunities.noResultsDescription",
                      {
                        defaultValue:
                          "Try another search term or choose a different category.",
                      }
                    )}
                  </p>
                </div>
              ) : (
                latest.map((job) => (
                  <OpportunityCard
                    key={job.id}
                    opportunity={job}
                  />
                ))
              )}
            </section>
          </>
        )}

        <section
          aria-labelledby="opportunity-tips-title"
          style={{
            marginTop: "50px",
            padding: "24px",
            borderRadius: "18px",
            background: "#0f172a",
            color: "#94a3b8",
          }}
        >
          <h2
            id="opportunity-tips-title"
            style={{
              color: "white",
            }}
          >
            {t("opportunities.tipsTitle", {
              defaultValue:
                "Opportunity Tips",
            })}
          </h2>

          <ul
            style={{
              lineHeight: "1.9",
              paddingLeft: "24px",
            }}
          >
            <li>
              {t("opportunities.tips.profile", {
                defaultValue:
                  "Keep your Inclura profile updated.",
              })}
            </li>

            <li>
              {t("opportunities.tips.resume", {
                defaultValue:
                  "Upload your latest resume.",
              })}
            </li>

            <li>
              {t("opportunities.tips.applyEarly", {
                defaultValue:
                  "Apply early before deadlines.",
              })}
            </li>

            <li>
              {t("opportunities.tips.noPayment", {
                defaultValue:
                  "Never pay anyone for a job opportunity.",
              })}
            </li>

            <li>
              {t(
                "opportunities.tips.verifiedRecruiters",
                {
                  defaultValue:
                    "Verified recruiters display their subscription badges for transparency.",
                }
              )}
            </li>
          </ul>
        </section>
      </main>
    </DashboardLayout>
  );
}

export default OpportunitiesHub;
