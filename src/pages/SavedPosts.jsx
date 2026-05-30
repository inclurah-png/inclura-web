
import { useEffect, useState } from "react";

import {
collection,
query,
where,
onSnapshot,
} from "firebase/firestore";

import { db, auth } from "../firebase";

function SavedPosts() {

const [posts, setPosts] =
useState([]);

useEffect(() => {

const user =
auth.currentUser;

if (!user) return;

const q = query(
collection(db, "savedPosts"),
where(
"userId",
"==",
user.uid
)
);

const unsubscribe =
onSnapshot(q, (snapshot) => {

const data =
snapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));

setPosts(data);

});

return () =>
unsubscribe();

}, []);

return (

<div
style={{
padding: "24px",
color: "white",
}}
>

<h1
style={{
marginBottom: "24px",
}}
>
🔖 Saved Posts
</h1>

{posts.length === 0 ? (

<p>
No saved posts yet.
</p>

) : (

posts.map((post) => (

<div
key={post.id}
style={{
background: "#0f172a",
padding: "20px",
borderRadius: "20px",
marginBottom: "16px",
}}
>

<p>
{post.text}
</p>

{post.imageUrl && (

<img
src={post.imageUrl}
alt=""
style={{
width: "100%",
borderRadius: "16px",
marginTop: "12px",
}}
/>

)}

</div>

))

)}

</div>

);

}

export default SavedPosts;
