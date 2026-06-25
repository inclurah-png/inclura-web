import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { auth, db } from "../firebase";

import {
  doc,
  getDoc,
} from "firebase/firestore";

function CreatorRoute({ children }) {
  const [loading, setLoading] =
    useState(true);

  const [isCreator, setIsCreator] =
    useState(false);

  useEffect(() => {
    async function checkRole() {
      try {
        const user =
          auth.currentUser;

        if (!user) {
          setLoading(false);
          return;
        }

        const snap =
          await getDoc(
            doc(
              db,
              "users",
              user.uid
            )
          );

        if (
          snap.exists() &&
          snap.data().role ===
            "creator"
        ) {
          setIsCreator(true);
        }
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }

    checkRole();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          padding: "40px",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!isCreator) {
    return (
      <Navigate
        to="/profile"
        replace
      />
    );
  }

  return children;
}

export default CreatorRoute;
