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
  onSnapshot,
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

  const [
    userProfile,
    setUserProfile,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let unsubscribeProfile =
      null;

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(
            currentUser
          );

          if (
            unsubscribeProfile
          ) {
            unsubscribeProfile();
            unsubscribeProfile =
              null;
          }

          if (!currentUser) {
            setUserProfile(null);
            setLoading(false);

            return;
          }

          setLoading(true);

          const profileRef =
            doc(
              db,
              "users",
              currentUser.uid
            );

          unsubscribeProfile =
            onSnapshot(
              profileRef,
              (profileSnap) => {
                if (
                  profileSnap.exists()
                ) {
                  const profileData =
                    profileSnap.data();

                  setUserProfile(
                    profileData
                  );
                } else {
                  setUserProfile(
                    null
                  );
                }

                setLoading(false);
              },
              (error) => {
                console.log(
                  "User profile listener error:",
                  error
                );

                setUserProfile(
                  null
                );

                setLoading(false);
              }
            );
        }
      );

    return () => {
      if (
        unsubscribeProfile
      ) {
        unsubscribeProfile();
      }

      unsubscribeAuth();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
      }}
    >
      {!loading &&
        children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(
    AuthContext
  );
}
