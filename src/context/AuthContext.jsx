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

            /*
             * Temporary Android diagnostic.
             */
            window.__incluraAuthDiagnostic =
              {
                signedIn: false,
                accessibilityNeeds: [],
                userProfile: null,
              };

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

                  /*
                   * Temporary Android diagnostic.
                   *
                   * This records exactly what
                   * AuthContext receives from
                   * Firestore.
                   */
                  window.__incluraAuthDiagnostic =
                    {
                      signedIn: true,
                      profileExists: true,
                      accessibilityNeeds:
                        Array.isArray(
                          profileData.accessibilityNeeds
                        )
                          ? profileData.accessibilityNeeds
                          : [],
                      userProfile:
                        profileData,
                    };
                } else {
                  setUserProfile(
                    null
                  );

                  /*
                   * Temporary Android diagnostic.
                   */
                  window.__incluraAuthDiagnostic =
                    {
                      signedIn: true,
                      profileExists: false,
                      accessibilityNeeds: [],
                      userProfile: null,
                    };
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

                /*
                 * Temporary Android diagnostic.
                 */
                window.__incluraAuthDiagnostic =
                  {
                    signedIn: true,
                    profileExists: false,
                    accessibilityNeeds: [],
                    userProfile: null,
                    error:
                      error?.message ||
                      "Profile listener error",
                  };

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
