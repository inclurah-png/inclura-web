import FollowButton from "../components/FollowButton";
import PostCard from "../components/PostCard";

import { auth, db } from "../firebase";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function UserProfile() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");

  const [userLoading, setUserLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  const [userError, setUserError] = useState("");
  const [postsError, setPostsError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    async function loadUser() {
      setUser(null);
      setUserError("");
      setUserLoading(true);

      if (!userId) {
        setUserError("No user profile was specified.");
        setUserLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (!isCurrent) return;

        if (docSnap.exists()) {
          setUser(docSnap.data());
        } else {
          setUserError("This user profile could not be found.");
        }
      } catch (error) {
        console.error("User profile loading failed:", error);

        if (isCurrent) {
          setUserError(
            "Unable to load this profile. Check your connection and Firestore permissions."
          );
        }
      } finally {
        if (isCurrent) {
          setUserLoading(false);
        }
      }
    }

    async function loadPosts() {
      setPosts([]);
      setPostsError("");
      setPostsLoading(true);

      if (!userId) {
        setPostsLoading(false);
        return;
      }

      try {
        const postsQuery = query(
          collection(db, "posts"),
          where("userId", "==", userId)
        );

        const snapshot = await getDocs(postsQuery);

        if (!isCurrent) return;

        const data = snapshot.docs.map((postDoc) => ({
          id: postDoc.id,
          ...postDoc.data(),
        }));

        setPosts(data);
      } catch (error) {
        console.error("User posts loading failed:", error);

        if (isCurrent) {
          setPostsError(
            "Unable to load posts. Check your connection and Firestore permissions."
          );
        }
      } finally {
        if (isCurrent) {
          setPostsLoading(false);
        }
      }
    }

    loadUser();
    loadPosts();

    return () => {
      isCurrent = false;
    };
  }, [userId, reloadKey]);

  const getBadge = () => {
    if (!user?.verified) return null;

    switch (user.badgeType) {
      case "creator":
        return "🎥 Verified Creator";

      case "organization":
        return "🏢 Verified Organization";

      case "ngo":
        return "🤝 Verified NGO";

      case "hospital":
        return "🏥 Verified Hospital";

      case "university":
        return "🎓 Verified University";

      case "government":
        return "🏛 Verified Government";

      default:
        return "✅ Verified User";
    }
  };

  const pageStyle = {
    background: "#020617",
    minHeight: "100vh",
    padding: "24px",
    color: "white",
  };

  const panelStyle = {
    maxWidth: "700px",
    margin: "0 auto",
    background: "#0f172a",
    padding: "30px",
    borderRadius: "24px",
    overflowWrap: "anywhere",
  };

  const actionButtonStyle = {
    padding: "10px 16px",
    borderRadius: "12px",
    border: "none",
    background: "#38bdf8",
    color: "#020617",
    cursor: "pointer",
    fontWeight: "600",
  };

  if (userLoading) {
    return (
      <div
        style={{
          ...pageStyle,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        role="status"
        aria-live="polite"
      >
        Loading profile...
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div style={pageStyle}>
        <div style={panelStyle}>
          <button
            type="button"
            onClick={() => window.history.back()}
            style={{
              ...actionButtonStyle,
              marginBottom: "20px",
            }}
          >
            ← Back
          </button>

          <h1>Profile unavailable</h1>

          <p role="alert">
            {userError || "This user profile could not be found."}
          </p>

          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            style={actionButtonStyle}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const profileName =
    typeof user.fullName === "string" && user.fullName.trim()
      ? user.fullName.trim()
      : "Inclura User";

  const profilePhoto =
    typeof user.profilePhoto === "string" && user.profilePhoto.trim()
      ? user.profilePhoto
      : typeof user.photoURL === "string" && user.photoURL.trim()
        ? user.photoURL
        : "";

  const publicAccessibilityNeeds =
    user.accessibilityNeedsPublic === true &&
    Array.isArray(user.accessibilityNeeds)
      ? user.accessibilityNeeds.filter(
          (need) => typeof need === "string" && need.trim()
        )
      : null;

  return (
    <div style={pageStyle}>
      <div style={panelStyle}>
        <button
          type="button"
          onClick={() => window.history.back()}
          style={{
            ...actionButtonStyle,
            marginBottom: "20px",
          }}
        >
          ← Back
        </button>

        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={`${profileName}'s profile`}
            referrerPolicy="no-referrer"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "20px",
            }}
          />
        ) : (
          <div
            aria-label={`${profileName}'s profile initials`}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "#38bdf8",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "40px",
              fontWeight: "700",
              marginBottom: "20px",
              color: "#020617",
            }}
          >
            {profileName.charAt(0).toUpperCase()}
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <h1>{profileName}</h1>

          {user.verified === true && (
            <div
              style={{
                background: "#16a34a",
                color: "white",
                padding: "6px 12px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              {getBadge()}
            </div>
          )}
        </div>

        {auth.currentUser && auth.currentUser.uid !== userId && (
          <div
            style={{
              marginTop: "12px",
              marginBottom: "20px",
            }}
          >
            <FollowButton targetUserId={userId} />
          </div>
        )}

        <p>{user.bio || "No bio provided."}</p>

        <p>Role: {user.role || "User"}</p>

        <p>Category: {user.category || "Not set"}</p>

        <p>
          Followers:{" "}
          {Array.isArray(user.followers) ? user.followers.length : 0}
        </p>

        <p>
          Following:{" "}
          {Array.isArray(user.following) ? user.following.length : 0}
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "24px",
            marginBottom: "24px",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("posts")}
            aria-pressed={activeTab === "posts"}
          >
            Posts
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("about")}
            aria-pressed={activeTab === "about"}
          >
            About
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("accessibility")}
            aria-pressed={activeTab === "accessibility"}
          >
            Accessibility
          </button>
        </div>

        {activeTab === "posts" && (
          <>
            <h2>Posts</h2>

            {postsLoading ? (
              <p role="status">Loading posts...</p>
            ) : postsError ? (
              <>
                <p role="alert">{postsError}</p>

                <button
                  type="button"
                  onClick={() => setReloadKey((key) => key + 1)}
                  style={actionButtonStyle}
                >
                  Retry loading
                </button>
              </>
            ) : posts.length === 0 ? (
              <p>No posts yet.</p>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  name={post.userName || profileName}
                  text={post.text || ""}
                  verified={post.verified === true}
                  badgeType={post.badgeType}
                />
              ))
            )}
          </>
        )}

        {activeTab === "about" && (
          <>
            <h2>About</h2>

            <p>{user.bio || "No bio provided."}</p>

            <p>Category: {user.category || "Not set"}</p>

            <p>Role: {user.role || "User"}</p>
          </>
        )}

        {activeTab === "accessibility" && (
          <>
            <h2>Accessibility</h2>

            {publicAccessibilityNeeds === null ? (
              <p>
                This user has not made their accessibility needs public.
              </p>
            ) : publicAccessibilityNeeds.length > 0 ? (
              <ul>
                {publicAccessibilityNeeds.map((need, index) => (
                  <li key={`${need}-${index}`}>{need}</li>
                ))}
              </ul>
            ) : (
              <p>No accessibility needs have been shared.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
