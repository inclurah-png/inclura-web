import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase";

const AuthContext =
createContext();

export function AuthProvider({
children,
}) {
const [user, setUser] =
useState(null);

const [userProfile, setUserProfile] =
useState(null);

const [loading, setLoading] =
useState(true);

useEffect(() => {

  const unsubscribe =
    onAuthStateChanged(
      auth,

      async (currentUser) => {

        setUser(currentUser);

        if (currentUser) {

          try {

            const profileRef =
              doc(
                db,
                "users",
                currentUser.uid
              );

            const profileSnap =
              await getDoc(profileRef);

            if (
              profileSnap.exists()
            ) {

              setUserProfile(
                profileSnap.data()
              );

            } else {

              setUserProfile(null);

            }

          } catch (error) {

            console.log(error);

            setUserProfile(null);

          }

        } else {

          setUserProfile(null);

        }

        setLoading(false);

      }

    );

  return () => unsubscribe();

}, []);

return (
<AuthContext.Provider
  value={{
    user,
    userProfile,
    loading,
  }}
>
  {!loading && children}
</AuthContext.Provider>
);
}

export function useAuth() {
return useContext(AuthContext);
}

