import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";

function CommunityHighlights() {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const membersQuery = query(
      collection(db, "memberDirectory"),
      orderBy("updatedAt", "desc"),
      limit(4)
    );

    const unsubscribe = onSnapshot(
      membersQuery,
      (snapshot) => {
        const visibleMembers = snapshot.docs
          .map((memberDoc) => ({
            uid: memberDoc.id,
            ...memberDoc.data(),
          }))
          .filter((member) => {
            const name = member.fullName || member.name;
            return typeof name === "string" && name.trim().length > 0;
          });

        setMembers(visibleMembers);
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

  return (
    <section
      aria-labelledby="community-highlights-heading"
      style={{
        background: "#1e293b",
        padding: "18px",
        borderRadius: "18px",
        marginBottom: "16px",
        color: "#f8fafc",
      }}
    >
      <h2 id="community-highlights-heading">
        <span aria-hidden="true">🌟 </span>{t("communityHighlightsTitle")}
      </h2>

      {loading ? (
        <p role="status">{t("loading")}</p>
      ) : loadError ? (
        <p role="status">{t("error")}</p>
      ) : members.length === 0 ? (
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
          {members.map((member) => {
            const name = (member.fullName || member.name).trim();
            const role = member.accountType || member.category || "";
            const bio = typeof member.bio === "string" ? member.bio.trim() : "";

            return (
              <li
                key={member.uid}
                style={{
                  minWidth: 0,
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <Link
                  to={`/user/${member.uid}`}
                  aria-label={name}
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
                      {name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span>{name}</span>
                </Link>

                {role ? (
                  <p style={{ color: "#fbbf24", fontSize: "13px", margin: "10px 0 0" }}>
                    {role}
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
