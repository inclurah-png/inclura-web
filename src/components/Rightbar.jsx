import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import FollowButton from "./FollowButton";

function isUsableName(value) {
  if (typeof value !== "string") return false;
  const name = value.trim();
  return Boolean(name) && ![
    "inclura user",
    "inclura member",
    "user",
    "member",
    "friend",
  ].includes(name.toLowerCase());
}

function getPostTopics(post) {
  const topics = new Set();
  const text = typeof post.text === "string" ? post.text : "";
  const matches = text.match(/#[\p{L}\p{N}_]+/gu) || [];

  matches.forEach((tag) => {
    const normalized = tag.toLowerCase();
    if (normalized.length > 1) topics.add(normalized);
  });

  const category = typeof post.category === "string"
    ? post.category.trim()
    : "";

  if (category && category.toLowerCase() !== "general") {
    topics.add("#" + category.replace(/^#/, "").replace(/\s+/g, ""));
  }

  return [...topics];
}

function Rightbar() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return undefined;
    }

    const stopPosts = onSnapshot(
      query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(100)
      ),
      (snapshot) => {
        setPosts(snapshot.docs.map((postDoc) => ({
          id: postDoc.id,
          ...postDoc.data(),
        })));
        setLoading(false);
        setLoadError(false);
      },
      (error) => {
        console.error("Community activity loading failed:", error);
        setLoadError(true);
        setLoading(false);
      }
    );

    const stopMembers = onSnapshot(
      query(
        collection(db, "memberDirectory"),
        orderBy("updatedAt", "desc"),
        limit(100)
      ),
      (snapshot) => {
        setMembers(snapshot.docs.map((memberDoc) => ({
          uid: memberDoc.id,
          ...memberDoc.data(),
        })));
      },
      (error) => {
        console.error("Member directory loading failed:", error);
        setLoadError(true);
      }
    );

    const stopProfile = onSnapshot(
      doc(db, "users", user.uid),
      (snapshot) => {
        const data = snapshot.exists() ? snapshot.data() : {};
        setFollowing(Array.isArray(data.following) ? data.following : []);
      },
      (error) => {
        console.error("Following list loading failed:", error);
      }
    );

    return () => {
      stopPosts();
      stopMembers();
      stopProfile();
    };
  }, []);

  const trendingTopics = useMemo(() => {
    const counts = new Map();
    posts.forEach((post) => {
      getPostTopics(post).forEach((topic) => {
        counts.set(topic, (counts.get(topic) || 0) + 1);
      });
    });

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));
  }, [posts]);

  const suggestedPeople = useMemo(() => {
    const currentUid = auth.currentUser?.uid;
    const excluded = new Set([currentUid, ...following]);

    return members
      .filter((member) => {
        const name = member.fullName || member.name || "";
        return member.uid && !excluded.has(member.uid) && isUsableName(name);
      })
      .slice(0, 3)
      .map((member) => ({
        uid: member.uid,
        name: member.fullName || member.name,
        photo: member.photoURL || "",
        role: member.accountType || member.category || "",
      }));
  }, [members, following]);

  const panel = {
    background: "#0f172a",
    padding: "20px",
    borderRadius: "20px",
    marginBottom: "16px",
    border: "1px solid #1e293b",
    color: "white",
  };

  return (
    <aside
      aria-label={t("communitySidebarLabel")}
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        padding: "0",
        marginBottom: "24px",
        background: "transparent",
      }}
    >
      <section aria-labelledby="trending-heading" style={panel}>
        <h3 id="trending-heading" style={{ marginTop: 0, marginBottom: "14px" }}>
          <span aria-hidden="true">🔥 </span>{t("communityTrending")}
        </h3>
        {loading ? (
          <p role="status">{t("loading")}</p>
        ) : trendingTopics.length > 0 ? (
          <ul aria-label={t("communityTrending")} style={listStyle}>
            {trendingTopics.map(({ topic, count }) => (
              <li key={topic} style={listItemStyle}>
                <span>{topic}</span>
                <span style={countStyle}>{count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={mutedStyle}>
            {loadError ? t("error") : t("noResults")}
          </p>
        )}
      </section>

      <section
        aria-labelledby="suggested-connections-heading"
        style={{ ...panel, marginBottom: 0 }}
      >
        <h3 id="suggested-connections-heading" style={{ marginTop: 0, marginBottom: "14px" }}>
          <span aria-hidden="true">🤝 </span>{t("communitySuggestedConnections")}
        </h3>
        {loading ? (
          <p role="status">{t("loading")}</p>
        ) : suggestedPeople.length > 0 ? (
          <ul aria-label={t("communitySuggestedConnections")} style={listStyle}>
            {suggestedPeople.map((person) => (
              <li key={person.uid} style={personStyle}>
                <Link
                  to={`/user/${person.uid}`}
                  style={profileLinkStyle}
                  aria-label={person.name}
                >
                  {person.photo ? (
                    <img
                      src={person.photo}
                      alt=""
                      aria-hidden="true"
                      style={avatarStyle}
                    />
                  ) : (
                    <span aria-hidden="true" style={avatarFallbackStyle}>
                      {person.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span style={{ minWidth: 0 }}>
                    <strong style={personNameStyle}>{person.name}</strong>
                    {person.role ? <small style={mutedStyle}>{person.role}</small> : null}
                  </span>
                </Link>
                <FollowButton targetUserId={person.uid} />
              </li>
            ))}
          </ul>
        ) : (
          <p style={mutedStyle}>
            {loadError ? t("error") : t("noResults")}
          </p>
        )}
      </section>
    </aside>
  );
}

const listStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const listItemStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  padding: "7px 0",
  lineHeight: 1.5,
};

const countStyle = {
  color: "#94a3b8",
  fontSize: "12px",
  flexShrink: 0,
};

const personStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  padding: "9px 0",
  borderBottom: "1px solid #1e293b",
  flexWrap: "wrap",
};

const profileLinkStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: "white",
  textDecoration: "none",
  minWidth: 0,
  flex: "1 1 120px",
};

const avatarStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  objectFit: "cover",
  flexShrink: 0,
};

const avatarFallbackStyle = {
  ...avatarStyle,
  display: "grid",
  placeItems: "center",
  background: "#334155",
  fontWeight: 700,
};

const personNameStyle = {
  display: "block",
  overflowWrap: "anywhere",
};

const mutedStyle = {
  color: "#94a3b8",
  fontSize: "13px",
  lineHeight: 1.5,
};

export default Rightbar;
