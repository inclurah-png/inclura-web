import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

function Home() {
  const { t } = useTranslation();
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* NAVBAR */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 40px",
          borderBottom:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Logo />

        <div
          style={{
            display: "flex",
            gap: "14px",
          }}
        >
          <Link to="/login">
            <button
              style={{
                padding: "12px 22px",
                borderRadius: "12px",
                border: "none",
                background: "white",
                color: "#020617",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              {t("login")}
            </button>
          </Link>

          <Link to="/signup">
            <button
              style={{
                padding: "12px 22px",
                borderRadius: "12px",
                border: "none",
                background: "#38bdf8",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              {t("signup")}
            </button>
          </Link>
        </div>
      </div>

      {/* HERO */}

      <section
        style={{
          textAlign: "center",
          padding: "100px 24px 80px",
        }}
      >
        <h1
          style={{
            fontSize: "56px",
            marginBottom: "20px",
          }}
        >
          {t("welcome")}
        </h1>

        <p
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            color: "#94a3b8",
            fontSize: "18px",
            lineHeight: "1.7",
          }}
        >
          {t("slogan")}
        </p>

        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <Link to="/signup">
            <button
              style={{
                padding: "14px 28px",
                borderRadius: "14px",
                border: "none",
                background: "#38bdf8",
                color: "white",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              {t("createAccount")}
            </button>
          </Link>

          <button
            style={{
              padding: "14px 28px",
              borderRadius: "14px",
              border:
                "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "white",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            {t("learnMore")}
          </button>
        </div>
      </section>

      {/* FEATURES */}

      <section
        style={{
          padding: "20px 24px 80px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
          }}
        >
          <FeatureCard
            icon="♿"
            title={t("accessibilityHub")}
description={t("featureAccessibility")}
          />

          <FeatureCard
            icon="💼"
            title={t("jobs")}
description={t("featureJobs")}
          />

          <FeatureCard
            icon="🎓"
            title={t("mentorHub")}
description={t("featureMentorship")}
          />

          <FeatureCard
            icon="🛒"
            title={t("marketplace")}
description={t("featureMarketplace")}
          />

          <FeatureCard
            icon="🚨"
            title={t("sos")}
description={t("featureSOS")}
          />

          <FeatureCard
            icon="🌍"
            title={t("community")}
description={t("featureCommunity")}
          />
        </div>
      </section>

      {/* FOOTER */}

      <footer
        style={{
          borderTop:
            "1px solid rgba(255,255,255,0.08)",
          padding: "30px",
          textAlign: "center",
          color: "#94a3b8",
        }}
      >
© 2026 Inclura. {t("footerText")}
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: "24px",
        padding: "24px",
        border:
          "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          fontSize: "40px",
          marginBottom: "14px",
        }}
      >
        {icon}
      </div>

      <h3>{title}</h3>

      <p
        style={{
          color: "#94a3b8",
          lineHeight: "1.6",
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default Home;
