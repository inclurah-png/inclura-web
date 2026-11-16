import AccessibilityButton from "./AccessibilityButton";
import DashboardSidebar from "./DashboardSidebar";
import LanguageSelector from "./LanguageSelector";
import {
  db,
} from "../firebase";

import {
  doc,
  updateDoc,
} from "firebase/firestore";


import {
  useAuth,
} from "../context/AuthContext";

function DashboardLayout({ children }) {
  const {
    user,
  } = useAuth();

  async function savePreferredLanguage(languageCode) {
    if (!user) return;

    try {
      await updateDoc(
        doc(
          db,
          "users",
          user.uid
        ),
        {
          preferredLanguage:
            languageCode,
        }
      );

      console.log(
        "Preferred language saved:",
        languageCode
      );
    } catch (error) {
      console.error(
        "Failed to save language:",
        error
      );
    }
  }


  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        padding: "24px",
        background: "#020617",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <DashboardSidebar />

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
          <LanguageSelector
            onLanguageChange={
              savePreferredLanguage
            }
          />

        </div>

        <div
          style={{
            position: "relative",
            zIndex: 3,
          }}
        >
          {children}
        </div>

        <AccessibilityButton />
      </div>
    </div>
  );
}

export default DashboardLayout;
