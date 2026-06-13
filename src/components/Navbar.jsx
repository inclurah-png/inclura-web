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

function Navbar() {
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
        {auth.currentUser && (
          <>
            <button
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
              🔔

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
              💬 Messages
            </button>

            <button
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
              👤 Dashboard
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
                Login
              </button>
            </Link>

            <Link
              to="/signup"
              style={{
                textDecoration: "none",
              }}
            >
              <button
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
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
