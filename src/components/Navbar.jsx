import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { db, auth } from "../firebase";

import Logo from "./Logo";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

function Navbar() {
  const { t } = useTranslation();
  const [unreadCount, setUnreadCount] =
    useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("receiverId", "==", user.uid),
      where("read", "==", false)
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {
        setUnreadCount(
          snapshot.docs.length
        );
      });

    return () => unsubscribe();
  }, []);

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        background: "#020617",
        borderBottom:
          "1px solid rgba(255,255,255,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Logo />

      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
        }}
      >
        <LanguageSelector />
        {auth.currentUser && (
          <>
            <button
              type="button"
              aria-label={t("notifications", { defaultValue: "Notifications" })}
              title={t("notifications", { defaultValue: "Notifications" })}
              onClick={() =>
                navigate("/notifications")
              }
              style={{
                position: "relative",
                padding: "12px 18px",
                borderRadius: "10px",
                border: "none",
                background: "#1e293b",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              <span aria-hidden="true">🔔</span>

              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    background: "#ef4444",
                    color: "white",
                    borderRadius: "50%",
                    minWidth: "22px",
                    height: "22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              type="button"
              aria-label={t("messages", { defaultValue: "Messages" })}
              onClick={() =>
                navigate("/messages")
              }
              style={{
                padding: "12px 18px",
                borderRadius: "10px",
                border: "none",
                background: "#2563eb",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              <span aria-hidden="true">💬</span> {t("messages", { defaultValue: "Messages" })}
            </button>

            <button
              type="button"
              aria-label={t("dashboard", { defaultValue: "Dashboard" })}
              onClick={() =>
                navigate("/profile")
              }
              style={{
                padding: "12px 18px",
                borderRadius: "10px",
                border: "none",
                background: "#38bdf8",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              <span aria-hidden="true">👤</span> {t("dashboard", { defaultValue: "Dashboard" })}
            </button>
          </>
        )}

        {!auth.currentUser && (
          <>
            <Link
              to="/login"
              style={{
                textDecoration: "none",
              }}
            >
              <button
                type="button"
                style={{
                  padding: "12px 24px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  background: "white",
                  color: "#020617",
                  fontWeight: "600",
                }}
              >
                {t("login", { defaultValue: "Login" })}
              </button>
            </Link>

            <Link
              to="/signup"
              style={{
                textDecoration: "none",
              }}
            >
              <button
                type="button"
                style={{
                  padding: "12px 24px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#38bdf8",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {t("signup", { defaultValue: "Sign Up" })}
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
