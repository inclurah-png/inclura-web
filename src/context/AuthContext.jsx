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

function buildUserProfile(
  currentUser,
  profileData = {}
) {
  if (!currentUser) {
    return null;
  }

  const firestoreProfile =
    profileData &&
    typeof profileData === "object"
      ? profileData
      : {};

  return {
    ...firestoreProfile,

    /*
     * Firebase Authentication remains
     * the fallback identity source when
     * the Firestore profile is incomplete.
     */
    uid:
      firestoreProfile.uid ||
      currentUser.uid,

    displayName:
      firestoreProfile.displayName ||
      firestoreProfile.fullName ||
      firestoreProfile.name ||
      currentUser.displayName ||
      "",

    email:
      firestoreProfile.email ||
      currentUser.email ||
      "",

    photoURL:
      firestoreProfile.photoURL ||
      firestoreProfile.profilePhoto ||
      currentUser.photoURL ||
      "",

    phoneNumber:
      firestoreProfile.phoneNumber ||
      currentUser.phoneNumber ||
      "",
  };
}

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

          /*
           * Firebase Auth already gives us
           * the authenticated identity.
           *
           * Make that available immediately
           * while the Firestore application
           * profile is being loaded.
           */
          setUserProfile(
            buildUserProfile(
              currentUser
            )
          );

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
                const profileData =
                  profileSnap.exists()
                    ? profileSnap.data()
                    : {};

                setUserProfile(
                  buildUserProfile(
                    currentUser,
                    profileData
                  )
                );

                setLoading(false);
              },
              (error) => {
                console.log(
                  "User profile listener error:",
                  error
                );

                /*
                 * Do not throw away the
                 * authenticated user's identity
                 * simply because the Firestore
                 * profile listener failed.
                 */
                setUserProfile(
                  buildUserProfile(
                    currentUser
                  )
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
