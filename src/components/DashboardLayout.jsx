import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import LanguageSelector from "./LanguageSelector";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  async function savePreferredLanguage(languageCode) {
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        preferredLanguage: languageCode,
      });
      console.log("Preferred language saved:", languageCode);
    } catch (error) {
      console.error("Failed to save language:", error);
    }
  }

  return (
    <>
      <style>{`@media (max-width: 760px) {
        .inclura-mobile-menu-button { display: block !important; }
        .inclura-mobile-sidebar {
          display: none !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          height: 100vh !important;
          max-height: none !important;
          z-index: 1000 !important;
          border-radius: 0 !important;
        }
        .inclura-mobile-sidebar.open { display: block !important; }
        .inclura-dashboard-shell {
          display: block !important;
          padding: 70px 12px 20px !important;
        }
      }`}</style>

      <button
        type="button"
        className="inclura-mobile-menu-button"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
        style={{
          display: "none",
          position: "fixed",
          top: "16px",
          left: "16px",
          zIndex: 1001,
          border: "none",
          borderRadius: "10px",
          background: "#0f766e",
          color: "#fff",
          padding: "10px 12px",
          fontSize: "22px",
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      <div
        className="inclura-dashboard-shell"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "24px",
          padding: "24px",
          background: "#020617",
          minHeight: "100vh",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        <div className={sidebarOpen ? "inclura-mobile-sidebar open" : "inclura-mobile-sidebar"}>
          <DashboardSidebar />
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              position: "relative",
              zIndex: 3,
            }}
          >
            <LanguageSelector onLanguageChange={savePreferredLanguage} />
          </div>

          <div style={{ position: "relative", zIndex: 3 }}>
            {children}
          </div>

        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
