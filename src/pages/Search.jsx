import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

function Search() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      setLoading(true);
      setError("");

      try {
        const snapshot = await getDocs(
          collection(db, "users")
        );

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (isMounted) {
          setUsers(data);
        }
      } catch (err) {
        console.error(
          "Failed to load search users:",
          err
        );

        if (isMounted) {
          setError(
            "Unable to load users. Please try again later."
          );
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

  const filteredUsers = users.filter((user) =>
    typeof user.fullName === "string" &&
    user.fullName
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

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
        ← Back
      </button>

      <h1>Search Users</h1>

      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(event) =>
          setQuery(event.target.value)
        }
        aria-label="Search users"
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "16px",
          borderRadius: "14px",
          border: "none",
          marginBottom: "20px",
        }}
      />

      {loading && <p>Loading users...</p>}

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
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filteredUsers.length === 0 && (
        <p>No users found.</p>
      )}

      {!loading &&
        !error &&
        filteredUsers.map((user) => (
          <div
            key={user.id}
            role="button"
            tabIndex={0}
            onClick={() =>
              navigate(`/user/${user.id}`)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
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
            <h3>{user.fullName || "Unnamed user"}</h3>
            <p>{user.category || "Member"}</p>
          </div>
        ))}
    </div>
  );
}

export default Search;
