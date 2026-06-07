import FollowButton from "../components/FollowButton";
import { auth } from "../firebase";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { db } from "../firebase";

import {
  doc,
  getDoc,
} from "firebase/firestore";

function UserProfile() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
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

        <h1>{user.fullName}</h1>

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
          Category:
          {" "}
          {user.category}
        </p>

        <p>
          Accessibility:
          {" "}
          {user.accessibility}
        </p>

        <p>
          Followers:
          {" "}
          {user.followers?.length || 0}
        </p>

        <p>
          Following:
          {" "}
          {user.following?.length || 0}
        </p>
      </div>
    </div>
  );
}

export default UserProfile;

