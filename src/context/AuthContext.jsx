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

  // This state covers Firebase session restoration only.
  const [loading, setLoading] =
    useState(true);

  // Firestore profile loading must not hide public pages.
  const [
    profileLoading,
    setProfileLoading,
  ] = useState(false);

  useEffect(() => {
    let unsubscribeProfile =
      null;

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);

          if (unsubscribeProfile) {
            unsubscribeProfile();
            unsubscribeProfile = null;
          }

          // Firebase has resolved the user's sign-in state.
          setLoading(false);

          if (!currentUser) {
            setUserProfile(null);
            setProfileLoading(false);
            return;
          }

          // Make the Firebase identity available immediately.
          setUserProfile(
            buildUserProfile(currentUser)
          );

          setProfileLoading(true);

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

                setProfileLoading(false);
              },
              (error) => {
                console.log(
                  "User profile listener error:",
                  error
                );

                // Keep the authenticated identity if Firestore fails.
                setUserProfile(
                  buildUserProfile(currentUser)
                );

                setProfileLoading(false);
              }
            );
        },
        (error) => {
          console.log(
            "Firebase authentication state error:",
            error
          );

          setUser(null);
          setUserProfile(null);
          setProfileLoading(false);
          setLoading(false);
        }
      );

    return () => {
      if (unsubscribeProfile) {
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
        profileLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
