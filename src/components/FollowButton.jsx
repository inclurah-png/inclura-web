
import { useEffect, useState } from "react";

import {
doc,
updateDoc,
arrayUnion,
arrayRemove,
onSnapshot,
} from "firebase/firestore";

import {
db,
auth,
} from "../firebase";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

function FollowButton({
targetUserId,
}) {

const [isFollowing,
setIsFollowing] =
useState(false);

const [loading,
setLoading] =
useState(false);

useEffect(() => {

const user =
auth.currentUser;

if (!user)
return;

const unsubscribe =
onSnapshot(
doc(
db,
"users",
user.uid
),
(snapshot) => {

const data =
snapshot.data();

if (
data?.following?.includes(
targetUserId
)
) {

setIsFollowing(
true
);

} else {

setIsFollowing(
false
);

}

}
);

return () =>
unsubscribe();

}, [targetUserId]);

async function handleFollow() {

const user =
auth.currentUser;

if (!user)
return;

setLoading(true);

try {

const currentUserRef =
doc(
db,
"users",
user.uid
);

const targetUserRef =
doc(
db,
"users",
targetUserId
);

if (isFollowing) {

await updateDoc(
currentUserRef,
{
following:
arrayRemove(
targetUserId
),
}
);

await updateDoc(
targetUserRef,
{
followers:
arrayRemove(
user.uid
),
}
);

} else {

await updateDoc(
currentUserRef,
{
following:
arrayUnion(
targetUserId
),
}
);

await updateDoc(
targetUserRef,
{
followers:
arrayUnion(
user.uid
),
}
);

  const currentUserName =
  auth.currentUser.displayName ||
  "Inclura User";

await addDoc(
  collection(db, "notifications"),
  {
    targetUserId: targetUserId,
    message: `${currentUserName} started following you`,
    createdAt: serverTimestamp(),
  }
);
  
}

} catch (error) {

alert(error.message);

}

setLoading(false);

}

return (

<button
onClick={
handleFollow
}
disabled={loading}
style={{
padding:
"12px 18px",
borderRadius:
"14px",
border: "none",
background:
isFollowing
? "#334155"
: "#38bdf8",
color: "white",
fontWeight:
"700",
cursor:
"pointer",
fontSize:
"14px",
}}
>

{loading
? "Loading..."
: isFollowing
? "Following"
: "Follow"}

</button>

);

}

export default FollowButton;
