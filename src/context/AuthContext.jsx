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

function isPlaceholderName(
  value
) {
  if (
    typeof value !== "string"
  ) {
    return true;
  }

  const normalized =
    value
      .trim()
      .toLowerCase();

  if (!normalized) {
    return true;
  }

  return [
    "inclura user",
    "inclura member",
    "user",
    "member",
    "friend",
  ].includes(
    normalized
  );
}

function resolveDisplayName(
  currentUser,
  profileData
) {
  const profile =
    profileData &&
    typeof profileData === "object"
      ? profileData
      : {};

  const firstName =
    typeof profile.firstName ===
    "string"
      ? profile.firstName.trim()
      : "";

  const lastName =
    typeof profile.lastName ===
    "string"
      ? profile.lastName.trim()
      : "";

  const fullNameFromParts =
    `${firstName} ${lastName}`.trim();

  /*
   * Prefer an actual first-name/last-name
   * combination when available.
   */
  if (
    fullNameFromParts &&
    !isPlaceholderName(
      fullNameFromParts
    )
  ) {
    return fullNameFromParts;
  }

  const profileFullName =
    typeof profile.fullName ===
    "string"
      ? profile.fullName.trim()
      : "";

  if (
    profileFullName &&
    !isPlaceholderName(
      profileFullName
    )
  ) {
    return profileFullName;
  }

  const profileName =
    typeof profile.name ===
    "string"
      ? profile.name.trim()
      : "";

  if (
    profileName &&
    !isPlaceholderName(
      profileName
    )
  ) {
    return profileName;
  }

  const authDisplayName =
    typeof currentUser?.displayName ===
    "string"
      ? currentUser.displayName.trim()
      : "";

  if (
    authDisplayName &&
    !isPlaceholderName(
      authDisplayName
    )
  ) {
    return authDisplayName;
  }

  const profileDisplayName =
    typeof profile.displayName ===
    "string"
      ? profile.displayName.trim()
      : "";

  if (
    profileDisplayName &&
    !isPlaceholderName(
      profileDisplayName
    )
  ) {
    return profileDisplayName;
  }

  /*
   * Last-resort identity fallback.
   */
  const email =
    currentUser?.email ||
    profile.email ||
    "";

  if (email) {
    return email.split("@")[0];
  }

  return "Inclura User";
}

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

  const resolvedDisplayName =
    resolveDisplayName(
      currentUser,
      firestoreProfile
    );

  return {
    ...firestoreProfile,

    uid:
      firestoreProfile.uid ||
      currentUser.uid,

    displayName:
      resolvedDisplayName,

    fullName:
      firestoreProfile.fullName ||
      resolvedDisplayName,

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
           * Provide authenticated identity
           * immediately while Firestore loads.
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
                 * Preserve authenticated
                 * identity even if Firestore
                 * temporarily fails.
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
