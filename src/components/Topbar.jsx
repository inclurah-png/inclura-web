import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

function Topbar() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        position: "sticky",
        top: "0",
        zIndex: "100",
        background: "#020617",
        borderBottom: "1px solid #1e293b",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Search */}
      <input
        placeholder={t("searchPlaceholder")}
        style={{
          width: "35%",
          padding: "14px 18px",
          borderRadius: "14px",
          border: "none",
          background: "#0f172a",
          color: "white",
          fontSize: "15px",
          outline: "none",
        }}
      />

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <LanguageSelector />

        <button style={iconBtn} title={t("notifications")}>🔔</button>

        <button style={iconBtn} title={t("messages")}>💬</button>

        <button style={iconBtn} title={t("add")}>➕</button>

        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "#38bdf8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          I
        </div>
      </div>
    </div>
  );
}

const iconBtn = {
  background: "#0f172a",
  border: "none",
  color: "white",
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: "18px",
};

export default Topbar;
