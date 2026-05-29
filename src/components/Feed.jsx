
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
} from "firebase/firestore";

import { db, auth } from "../firebase";

import CreatePost from "./CreatePost";

import FollowButton from "./FollowButton";

import CommentBox from "./CommentBox";

function Feed() {

const [posts, setPosts] =
useState([]);

async function toggleLike(
postId,
likes = []
) {

const user =
auth.currentUser;

if (!user) return;

const postRef =
doc(db, "posts", postId);

const alreadyLiked =
likes.includes(user.uid);

if (alreadyLiked) {

await updateDoc(postRef, {
likes: arrayRemove(user.uid),
});

} else {

await updateDoc(postRef, {
likes: arrayUnion(user.uid),
});

}

}

useEffect(() => {

const q = query(
collection(db, "posts"),
orderBy(
"createdAt",
"desc"
)
);

const unsubscribe =
onSnapshot(q, (snapshot) => {

const fetchedPosts =
snapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));

setPosts(fetchedPosts);

});

return () =>
unsubscribe();

}, []);

return (

<div
style={{
padding: "24px",
maxWidth: "720px",
margin: "0 auto",
}}
>

<CreatePost />

<div
style={{
display: "flex",
flexDirection: "column",
gap: "20px",
marginTop: "24px",
}}
>

{posts.length === 0 ? (

<div
style={{
background: "#0f172a",
padding: "24px",
borderRadius: "24px",
textAlign: "center",
color: "#94a3b8",
}}
>
No posts yet.
</div>

) : (

posts.map((post) => (

<div
key={post.id}
style={{
background: "#0f172a",
padding: "24px",
borderRadius: "24px",
border: "1px solid #1e293b",
}}
>

<div
style={{
display: "flex",
alignItems: "center",
gap: "14px",
marginBottom: "18px",
}}
>

<div
style={{
width: "48px",
height: "48px",
borderRadius: "50%",
background: "#38bdf8",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: "700",
fontSize: "18px",
}}
>

{post.userName
? post.userName[0]
: "I"}

</div>

<div>

<h3
style={{
margin: 0,
}}
>
{post.userName ||
"Inclura User"}
</h3>

<FollowButton
targetUserId={post.userId}
/>

<p
style={{
fontSize: "13px",
color: "#94a3b8",
marginTop: "4px",
}}
>
Inclura Member
</p>

</div>

</div>

{post.text && (

<p
style={{
lineHeight: "1.8",
marginBottom: "18px",
fontSize: "16px",
}}
>
{post.text}
</p>

)}

{post.imageUrl && (

<img
src={post.imageUrl}
alt="Post"
style={{
width: "100%",
borderRadius: "20px",
marginBottom: "18px",
border:
"1px solid #1e293b",
}}
/>

)}

{post.accessibilityTags &&
post.accessibilityTags.length > 0 && (

<div
style={{
display: "flex",
flexWrap: "wrap",
gap: "10px",
marginBottom: "18px",
}}
>

{post.accessibilityTags.map(
(tag, index) => (

<div
key={index}
style={{
background: "#1e3a8a",
padding: "10px 14px",
borderRadius: "14px",
fontSize: "13px",
}}
>

{tag}

</div>

)
)}

</div>

)}

<div
style={{
display: "flex",
gap: "18px",
marginBottom: "18px",
}}
>

<button
onClick={() =>
toggleLike(
post.id,
post.likes || []
)
}
style={actionBtn}
>
❤️ {post.likes?.length || 0}
</button>

<button style={actionBtn}>
🔁 Share
</button>

<button style={actionBtn}>
♿ Support
</button>

</div>

<CommentBox
postId={post.id}
/>

</div>

))

)}

</div>

</div>

);

}

const actionBtn = {
background: "transparent",
border: "none",
color: "#94a3b8",
cursor: "pointer",
fontSize: "15px",
};

export default Feed;
