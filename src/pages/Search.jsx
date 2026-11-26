import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useTranslation } from "react-i18next";

function Search() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      setLoading(true);
      setError("");

      try {
        // Safely publish the signed-in member's own existing profile.
        // This repairs older accounts that were created before memberDirectory
        // publishing was added, without exposing other private user records.
        const currentUser = auth.currentUser;

        if (currentUser) {
          try {
            const ownProfileSnapshot = await getDoc(
              doc(db, "users", currentUser.uid)
            );

            if (ownProfileSnapshot.exists()) {
              const profile = ownProfileSnapshot.data();
              const fullName =
                typeof profile.fullName === "string" && profile.fullName.trim()
                  ? profile.fullName.trim()
                  : (currentUser.displayName || "").trim();

              if (fullName) {
                await setDoc(
                  doc(db, "memberDirectory", currentUser.uid),
                  {
                    uid: currentUser.uid,
                    fullName,
                    photoURL:
                      typeof profile.photoURL === "string"
                        ? profile.photoURL
                        : (profile.profilePhoto || currentUser.photoURL || ""),
                    location:
                      typeof profile.location === "string"
                        ? profile.location
                        : "",
                    category:
                      typeof profile.category === "string"
                        ? profile.category
                        : (typeof profile.verificationCategory === "string"
                            ? profile.verificationCategory
                            : ""),
                    accountType:
                      typeof profile.accountType === "string"
                        ? profile.accountType
                        : "individual",
                    bio: typeof profile.bio === "string" ? profile.bio : "",
                    updatedAt: serverTimestamp(),
                  },
                  { merge: true }
                );
              }
            }
          } catch (publishError) {
            // Do not prevent directory search if this member's own profile
            // cannot be synchronized; report the issue for diagnosis.
            console.warn("Own member directory sync failed:", publishError);
          }
        }

        const snapshot = await getDocs(
          collection(db, "memberDirectory")
        );

        const data = snapshot.docs.map((directoryDoc) => ({
          id: directoryDoc.id,
          ...directoryDoc.data(),
        }));

        if (isMounted) {
          setUsers(data);
        }
      } catch (err) {
        console.error("Failed to load search users:", err);

        if (isMounted) {
          setError(t("error"));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      typeof user.fullName === "string" &&
      user.fullName.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const handleSearch = () => {
    setSearchTerm(query);
  };

  return (
    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        padding: "24px",
        color: "white",
      }}
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          background: "#334155",
          color: "white",
          padding: "10px 16px",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        ← {t("back")}
      </button>

      <h1>{t("search")} {t("statsUser")}</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "stretch",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          aria-label={t("search")}
          style={{
            flex: 1,
            minWidth: 0,
            boxSizing: "border-box",
            padding: "16px",
            borderRadius: "14px",
            border: "none",
          }}
        />

        <button
          type="button"
          onClick={handleSearch}
          style={{
            background: "#16a34a",
            color: "white",
            padding: "0 18px",
            border: "none",
            borderRadius: "14px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          {t("search")}
        </button>
      </div>

      {loading && <p>{t("loading")}</p>}

      {!loading && error && (
        <div>
          <p role="alert">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 16px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {t("retry")}
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        searchTerm.trim() !== "" &&
        filteredUsers.length === 0 && <p>{t("noResults")}</p>}

      {!loading &&
        !error &&
        searchTerm.trim() !== "" &&
        filteredUsers.map((user) => (
          <div
            key={user.id}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/user/${user.id}`)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate(`/user/${user.id}`);
              }
            }}
            style={{
              background: "#1e293b",
              padding: "16px",
              borderRadius: "14px",
              marginBottom: "12px",
              cursor: "pointer",
            }}
          >
            <h3>{user.fullName || t("statsUser")}</h3>
            <p>{user.category || t("statsUser")}</p>
          </div>
        ))}
    </div>
  );
}

export default Search;
