import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
collection,
query,
orderBy,
onSnapshot,
doc,
updateDoc,
arrayUnion,
arrayRemove,
getDoc,
} from "firebase/firestore";

import { db, auth } from "../firebase";

import FollowButton from "./FollowButton";
import CommentBox from "./CommentBox";
import SearchBar from "./SearchBar";

function Feed() {
const [posts, setPosts] = useState([]);
const [filteredPosts, setFilteredPosts] =
useState([]);
const navigate = useNavigate();
  
useEffect(() => {
const q = query(
collection(db, "posts"),
orderBy("createdAt", "desc")
);

const unsubscribe =
  onSnapshot(q, (snapshot) => {
    const fetchedPosts =
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    setPosts(fetchedPosts);
    setFilteredPosts(fetchedPosts);
  });

return () => unsubscribe();

}, []);

async function savePost(post) {
try {
const user =
auth.currentUser;

  if (!user) return;

  const userRef = doc(
    db,
    "users",
    user.uid
  );

  const userSnap =
    await getDoc(userRef);

  const savedPosts =
    userSnap.data()?.savedPosts || [];
  
  if (
    savedPosts.includes(post.id)
  ) {
    await updateDoc(userRef, {
      savedPosts:
        arrayRemove(post.id),
    });

    alert("Post removed");
  } else {
    await updateDoc(userRef, {
      savedPosts:
        arrayUnion(post.id),
    });

    alert("Post saved");
  }
} catch (error) {
  alert(error.message);
}

}

async function toggleLike(
postId,
likes = []
) {
const user =
auth.currentUser;

if (!user) return;

const postRef = doc(
  db,
  "posts",
  postId
);

const alreadyLiked =
  likes.includes(user.uid);

if (alreadyLiked) {
  await updateDoc(postRef, {
    likes: arrayRemove(
      user.uid
    ),
  });
} else {
  await updateDoc(postRef, {
    likes: arrayUnion(
      user.uid
    ),
  });
}

}

function handleShare(postId) {
const url =
`${window.location.origin}/post/${postId}`;

navigator.clipboard.writeText(
  url
);

alert("Post link copied!");

}

return (
<div
  style={{
    padding: "24px",
    maxWidth: "720px",
    margin: "0 auto",
  }}
>
  <StoriesSection />

  <SearchBar
    posts={posts}
    onResults={setFilteredPosts}
  />

  <div
    style={{
      marginTop: "24px",
    }}
  >
    {filteredPosts.length ===
    0 ? (
      <div
        style={{
          background:
            "#0f172a",
          padding: "24px",
          borderRadius:
            "20px",
          textAlign: "center",
        }}
      >
        No posts yet
      </div>
    ) : (
      filteredPosts.map(
        (post) => (
          <div
            key={post.id}
            style={{
              background:
                "#0f172a",
              padding:
                "24px",
              borderRadius:
                "24px",
              marginBottom:
                "20px",
            }}
          >
            <h3
  onClick={() =>
    navigate(`/user/${post.userId}`)
  }
  style={{
    cursor: "pointer",
  }}
>
  {post.userName}
</h3>

            <FollowButton
              targetUserId={
                post.userId
              }
            />

            <p>
              {post.text}
            </p>

            {post.imageUrl && (
              <img
                src={
                  post.imageUrl
                }
                alt="Post"
                style={{
                  width:
                    "100%",
                  borderRadius:
                    "16px",
                }}
              />
            )}

            <div
              style={{
                display:
                  "flex",
                gap: "12px",
                marginTop:
                  "16px",
              }}
            >
              <button
                onClick={() =>
                  toggleLike(
                    post.id,
                    post.likes ||
                      []
                  )
                }
              >
                ❤️{" "}
                {post.likes
                  ?.length ||
                  0}
              </button>

              <button
                onClick={() =>
                  handleShare(
                    post.id
                  )
                }
              >
                🔁 Share
              </button>

              <button
                onClick={() =>
                  savePost(post)
                }
              >
                🔖 Save
              </button>
            </div>

            <CommentBox
              postId={
                post.id
              }
            />
          </div>
        )
      )
    )}
  </div>
</div>

);
}

export default Feed;        
