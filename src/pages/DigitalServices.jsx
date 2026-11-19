import { ExternalLink, Smartphone, Wifi, Zap, Tv, Globe, ReceiptText, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../components/DashboardLayout";

const STOREFRONT_URL = "https://inclura.rechargewebsite.com";

function DigitalServices() {
  const { t } = useTranslation();
  const services = [
    { key: "digitalAirtime", icon: Smartphone },
    { key: "digitalData", icon: Wifi },
    { key: "digitalElectricity", icon: Zap },
    { key: "digitalCableTv", icon: Tv },
    { key: "digitalInternet", icon: Globe },
    { key: "digitalOtherBills", icon: ReceiptText },
  ];

  return (
    <DashboardLayout>
      <main style={{ color: "#f8fafc", maxWidth: 1050, margin: "0 auto" }} aria-labelledby="digital-services-title">
        <header style={{ background: "linear-gradient(135deg,#064e3b,#0f766e)", border: "1px solid #bda65a", borderRadius: 22, padding: "28px 24px", marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <Smartphone size={30} aria-hidden="true" />
            <span style={{ fontWeight: 800, letterSpacing: 1 }}>INCLURA</span>
          </div>
          <h1 id="digital-services-title" style={{ fontSize: "clamp(26px,4vw,36px)", margin: "0 0 10px" }}>{t("digitalServicesTitle")}</h1>
          <p style={{ color: "#e2e8f0", lineHeight: 1.65, margin: 0 }}>{t("digitalServicesIntro")}</p>
        </header>

        <section aria-labelledby="digital-service-options" style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 18, padding: 22, marginBottom: 20 }}>
          <h2 id="digital-service-options" style={{ marginTop: 0 }}>{t("digitalChooseService")}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(145px,1fr))", gap: 12 }}>
            {services.map(({ key, icon: Icon }) => (
              <div key={key} style={{ background: "#1e293b", border: "1px solid #475569", borderRadius: 14, padding: 17, minHeight: 86, display: "flex", alignItems: "center", gap: 12 }}>
                <Icon size={23} color="#d6bd72" aria-hidden="true" />
                <span style={{ fontWeight: 650 }}>{t(key)}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 18, padding: 22 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
            <ShieldCheck size={25} color="#34d399" aria-hidden="true" />
            <div>
              <h2 style={{ margin: "0 0 7px" }}>{t("digitalSecureCheckoutTitle")}</h2>
              <p style={{ color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{t("digitalExternalNotice")}</p>
            </div>
          </div>
          <a href={STOREFRONT_URL} target="_blank" rel="noopener noreferrer" aria-label={t("digitalOpenStorefront")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#d6bd72", color: "#10231d", fontWeight: 800, textDecoration: "none", borderRadius: 12, padding: "15px 20px", minHeight: 48, boxSizing: "border-box" }}>
            {t("digitalOpenStorefront")} <ExternalLink size={18} aria-hidden="true" />
          </a>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.5, marginBottom: 0 }}>{t("digitalWalletSeparation")}</p>
        </section>
      </main>
    </DashboardLayout>
  );
}

export default DigitalServices;
