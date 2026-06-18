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
const [activeTab, setActiveTab] =
useState("posts");

useEffect(() => {
loadUser();
loadPosts();
}, [userId]);

async function loadUser() {
try {
const docRef = doc(
db,
"users",
userId
);

  const docSnap =
    await getDoc(docRef);

  if (docSnap.exists()) {
    setUser(docSnap.data());
  }
} catch (error) {
  console.error(error);
}

}

async function loadPosts() {
const q = query(
collection(db, "posts"),
where("userId", "==", userId)
);

const snapshot =
  await getDocs(q);

const data =
  snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

setPosts(data);

}

if (!user) {
return (
<div
style={{
background: "#020617",
minHeight: "100vh",
color: "white",
display: "flex",
justifyContent: "center",
alignItems: "center",
}}
>
Loading...
</div>
);
}

const getBadge = () => {
if (!user?.verified) return null;

switch (user?.badgeType) {
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

return (
<div
style={{
background: "#020617",
minHeight: "100vh",
padding: "24px",
color: "white",
}}
>
<div
style={{
maxWidth: "700px",
margin: "0 auto",
background: "#0f172a",
padding: "30px",
borderRadius: "24px",
}}
>
<button
onClick={() =>
window.history.back()
}
style={{
padding: "10px 16px",
borderRadius: "12px",
border: "none",
background: "#38bdf8",
color: "white",
cursor: "pointer",
marginBottom: "20px",
}}
>
← Back
</button>

    {user.photoURL ? (
      <img
        src={user.photoURL}
        alt="profile"
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
        }}
      >
        {user.fullName?.charAt(0)}
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
      <h1>{user.fullName}</h1>

      {user.verified && (
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

    {auth.currentUser &&
      auth.currentUser.uid !== userId && (
        <div
          style={{
            marginTop: "12px",
            marginBottom: "20px",
          }}
        >
          <FollowButton
            targetUserId={userId}
          />
        </div>
      )}

    <p>{user.bio}</p>

    <p>
      Category: {user.category}
    </p>

    <p>
      Accessibility:{" "}
      {user.accessibility}
    </p>

    <p>
      Followers:{" "}
      {user.followers?.length || 0}
    </p>

    <p>
      Following:{" "}
      {user.following?.length || 0}
    </p>

    <div
      style={{
        display: "flex",
        gap: "12px",
        marginTop: "24px",
        marginBottom: "24px",
      }}
    >
      <button
        onClick={() =>
          setActiveTab("posts")
        }
      >
        Posts
      </button>

      <button
        onClick={() =>
          setActiveTab("about")
        }
      >
        About
      </button>

      <button
        onClick={() =>
          setActiveTab(
            "accessibility"
          )
        }
      >
        Accessibility
      </button>
    </div>

    {activeTab === "posts" && (
      <>
        <h2>Posts</h2>

        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              name={post.userName}
              text={post.text}
            />
          ))
        )}
      </>
    )}

    {activeTab === "about" && (
      <>
        <p>{user.bio}</p>

        <p>
          Category:{" "}
          {user.category}
        </p>
      </>
    )}

    {activeTab ===
      "accessibility" && (
      <>
        <p>
          Accessibility:{" "}
          {user.accessibility}
        </p>

        <p>
          {user.accessibilityNeeds?.join(
            ", "
          )}
        </p>
      </>
    )}
  </div>
</div>

);
}

export default UserProfile;
