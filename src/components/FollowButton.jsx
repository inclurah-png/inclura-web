import { useEffect, useState } from "react";

import {
doc,
updateDoc,
arrayUnion,
arrayRemove,
onSnapshot,
getDoc,
} from "firebase/firestore";

import {
db,
auth,
} from "../firebase";

import { sendNotification } from "../utils/notificationHelper";

function FollowButton({
targetUserId,
}) {
const [isFollowing, setIsFollowing] =
useState(false);

const [loading, setLoading] =
useState(false);

useEffect(() => {
const user = auth.currentUser;

if (!user) return;

const unsubscribe = onSnapshot(
  doc(db, "users", user.uid),
  (snapshot) => {
    const data =
      snapshot.data();

    const following =
      (data?.following || []).filter(
        (id) =>
          id &&
          id !== "0" &&
          id !== "array"
      );

    setIsFollowing(
      following.includes(
        targetUserId
      )
    );
  }
);

return () => unsubscribe();

}, [targetUserId]);

async function handleFollow() {
const user =
auth.currentUser;

if (!user) return;

if (
  user.uid ===
  targetUserId
) {
  alert(
    "You cannot follow yourself"
  );
  return;
}

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

    const currentUserSnap =
      await getDoc(
        currentUserRef
      );

    const currentUser =
      currentUserSnap.data();

    await sendNotification({
      receiverId:
        targetUserId,
      senderId:
        user.uid,
      type: "follow",
      text: `${
        currentUser?.fullName ||
        "Someone"
      } started following you`,
    });
  }
} catch (error) {
  console.error(error);
  alert(error.message);
}

setLoading(false);

}

return (
<button
onClick={handleFollow}
disabled={loading}
style={{
padding: "12px 18px",
borderRadius: "14px",
border: "none",
background:
isFollowing
? "#334155"
: "#38bdf8",
color: "white",
fontWeight: "700",
cursor: "pointer",
fontSize: "14px",
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
