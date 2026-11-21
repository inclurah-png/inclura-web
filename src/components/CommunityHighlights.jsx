import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "../firebase";

function CommunityHighlights() {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Read the wider member directory, not chats, follows, or interaction history.
    const directoryQuery = query(
      collection(db, "memberDirectory"),
      orderBy("updatedAt", "desc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      directoryQuery,
      (snapshot) => {
        const currentUid = auth.currentUser?.uid;
        const uniqueMembers = new Map();

        snapshot.docs.forEach((memberDoc) => {
          const member = { uid: memberDoc.id, ...memberDoc.data() };
          const name = typeof member.fullName === "string"
            ? member.fullName.trim()
            : typeof member.name === "string"
              ? member.name.trim()
              : "";

          if (
            !member.uid ||
            member.uid === currentUid ||
            !name ||
            ["inclura user", "inclura member", "user", "member", "friend"].includes(name.toLowerCase())
          ) return;

          uniqueMembers.set(member.uid, { ...member, displayName: name });
        });

        setMembers([...uniqueMembers.values()]);
        setLoading(false);
        setLoadError(false);
      },
      (error) => {
        console.error("Community highlights loading failed:", error);
        setLoadError(true);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Rotate discovery order daily so the same recently updated profiles do not
  // permanently occupy the first positions. This is independent of interactions.
  const featuredMembers = useMemo(() => {
    const day = Math.floor(Date.now() / 86400000);
    const score = (uid) => {
      let value = day + 2166136261;
      for (let i = 0; i < uid.length; i += 1) {
        value ^= uid.charCodeAt(i);
        value = Math.imul(value, 16777619);
      }
      return value >>> 0;
    };

    return [...members]
      .sort((a, b) => score(a.uid) - score(b.uid))
      .slice(0, 8);
  }, [members]);

  return (
    <section
      aria-labelledby="community-highlights-heading"
      style={{
        background: "linear-gradient(135deg, #063b35 0%, #0f2929 58%, #172b25 100%)",
        border: "1px solid rgba(212, 175, 55, 0.35)",
        padding: "18px",
        borderRadius: "18px",
        marginBottom: "16px",
        color: "#f8fafc",
      }}
    >
      <h2 id="community-highlights-heading" style={{ marginTop: 0 }}>
        <span aria-hidden="true">🌟 </span>{t("communityHighlightsTitle")}
      </h2>
      <p style={{ color: "#cbd5e1", marginTop: "-4px", lineHeight: 1.5 }}>
        Discover members across Inclura — including people you have not connected with yet.
      </p>

      {loading ? (
        <p role="status">{t("loading")}</p>
      ) : loadError ? (
        <p role="status">{t("error")}</p>
      ) : featuredMembers.length === 0 ? (
        <p>{t("noResults")}</p>
      ) : (
        <ul
          aria-label={t("communityHighlightsTitle")}
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "12px",
          }}
        >
          {featuredMembers.map((member) => {
            const role = member.accountType || member.category || "";
            const bio = typeof member.bio === "string" ? member.bio.trim() : "";

            return (
              <li
                key={member.uid}
                style={{
                  minWidth: 0,
                  background: "rgba(2, 22, 20, 0.72)",
                  border: "1px solid rgba(45, 212, 191, 0.28)",
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <Link
                  to={`/user/${member.uid}`}
                  aria-label={member.displayName}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#f8fafc",
                    textDecoration: "none",
                    fontWeight: 700,
                    overflowWrap: "anywhere",
                  }}
                >
                  {member.photoURL ? (
                    <img
                      src={member.photoURL}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        background: "#115e59",
                        color: "#fef3c7",
                        fontSize: "18px",
                      }}
                    >
                      {member.displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span>{member.displayName}</span>
                </Link>

                {role ? (
                  <p style={{ color: "#fbbf24", fontSize: "13px", margin: "10px 0 0" }}>
                    {role}
                  </p>
                ) : null}

                {member.location ? (
                  <p style={{ color: "#99f6e4", fontSize: "12px", margin: "6px 0 0" }}>
                    {member.location}
                  </p>
                ) : null}

                {bio ? (
                  <p
                    style={{
                      color: "#cbd5e1",
                      fontSize: "13px",
                      lineHeight: 1.5,
                      margin: "8px 0 0",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {bio.length > 150 ? `${bio.slice(0, 147)}…` : bio}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default CommunityHighlights;
