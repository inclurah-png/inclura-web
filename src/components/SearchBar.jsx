import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

function SearchBar({ posts = [], onResults }) {
  const [query, setQuery] = useState("");
  const { t } = useTranslation();
  const onResultsRef = useRef(onResults);

  // Keep the latest callback without making the filtering
  // effect depend on a potentially changing function identity.
  useEffect(() => {
    onResultsRef.current = onResults;
  }, [onResults]);

  useEffect(() => {
    const searchValue = query.trim().toLowerCase();

    const filtered = !searchValue
      ? posts
      : posts.filter((post) => {
          const text = String(post.text || "").toLowerCase();
          const user = String(post.userName || "").toLowerCase();

          return (
            text.includes(searchValue) ||
            user.includes(searchValue)
          );
        });

    onResultsRef.current?.(filtered);
  }, [posts, query]);

  return (
    <div style={{ marginBottom: "24px" }}>
      <input
        type="search"
        aria-label={t("feed.searchLabel", {
          defaultValue: "Search posts or users",
        })}
        placeholder={t("feed.searchPlaceholder", {
          defaultValue: "Search posts or users...",
        })}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "18px",
          border: "1px solid #334155",
          background: "#0f172a",
          color: "white",
          fontSize: "15px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

export default SearchBar;
