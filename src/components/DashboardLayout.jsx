import AccessibilityButton from "./AccessibilityButton";
import DashboardSidebar from "./DashboardSidebar";
import LanguageSelector from "./LanguageSelector";
import {
  signOut,
} from "firebase/auth";
import {
  auth,
  db,
} from "../firebase";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

function DashboardLayout({ children }) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await signOut(auth);

      navigate("/login");
    } catch (error) {
      console.log(error);
      alert(error.message);
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
      }}
    >
      <DashboardSidebar />

      <div
        style={{
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "12px 18px",
              borderRadius: "12px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        {children}

        <AccessibilityButton />
      </div>
    </div>
  );
}

export default DashboardLayout;
