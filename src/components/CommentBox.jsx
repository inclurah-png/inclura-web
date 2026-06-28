import { useState, useEffect } from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { db, auth } from "../firebase";

function CommentBox({ postId }) {

const [comment, setComment] =
useState("");

const [comments, setComments] =
useState([]);

async function handleComment() {

if (!comment.trim()) return;

try {
const user =
auth.currentUser;

await addDoc(
collection(
db,
"posts",
postId,
"comments"
),
{
{
 
  text: comment,

  language: "auto",

  translatedText: {},
userId: user.uid,
userName:
user.displayName ||
"Inclura User",
createdAt:
serverTimestamp(),
}
);
  
  const postRef = doc(
  db,
  "posts",
  postId
);

await updateDoc(postRef, {
  commentCount: increment(1),
  creatorScore: increment(3),
});

setComment("");

} catch (error) {

alert(error.message);

}

}

useEffect(() => {

const q = query(
collection(
db,
"posts",
postId,
"comments"
),
orderBy(
"createdAt",
"asc"
)
);

const unsubscribe =
onSnapshot(q, (snapshot) => {

const fetched =
snapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));

setComments(fetched);

});

return () =>
unsubscribe();

}, [postId]);

return (

<div
style={{
marginTop: "18px",
}}
>

<div
style={{
display: "flex",
gap: "10px",
marginBottom: "16px",
}}
>

<input
type="text"
placeholder="Write a comment..."
value={comment}
onChange={(e) =>
setComment(e.target.value)
}
style={{
flex: 1,
padding: "12px",
borderRadius: "12px",
border: "1px solid #334155",
background: "#1e293b",
color: "white",
outline: "none",
}}
/>

<button
onClick={handleComment}
style={{
padding: "12px 18px",
borderRadius: "12px",
border: "none",
background: "#38bdf8",
color: "white",
fontWeight: "700",
cursor: "pointer",
}}
>
Post
</button>

</div>

<div
style={{
display: "flex",
flexDirection: "column",
gap: "12px",
}}
>

{comments.map((item) => (

<div
key={item.id}
style={{
background: "#1e293b",
padding: "12px",
borderRadius: "14px",
}}
>

<h4
style={{
marginBottom: "6px",
fontSize: "14px",
}}
>
{item.userName}
</h4>

<p
style={{
fontSize: "14px",
lineHeight: "1.6",
}}
>
{item.text}
</p>

</div>

))}

</div>

</div>

);

}

export default CommentBox;
