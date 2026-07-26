import { useRef } from "react";

import {
  getVerificationBadge,
  getPremiumBadge,
  getVerificationMetadata,
} from "../config/verificationTypes";

import {
  migrateVerificationId,
} from "../config/verificationMigration";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  auth,
  db,
  storage,
} from "../firebase";

function ProfileHeader({
  profile,
}) {
  const fileInputRef =
    useRef(null);

  async function uploadPhoto(
    e
  ) {
    try {
      const file =
        e.target.files?.[0];

      if (!file) return;

      const user =
        auth.currentUser;

      if (!user) return;

      const storageRef = ref(
        storage,
        `profiles/${user.uid}`
      );

      await uploadBytes(
        storageRef,
        file
      );

      const url =
        await getDownloadURL(
          storageRef
        );

      await updateDoc(
        doc(
          db,
          "users",
          user.uid
        ),
        {
          profilePhoto: url,
        }
      );

      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  }
  
  const getDaysLeft = () => {
  if (!profile?.premiumExpiryDate) return null;

  const expiry = profile.premiumExpiryDate.toDate();
  const diff = expiry - new Date();

  return Math.max(
    0,
    Math.ceil(diff / (1000 * 60 * 60 * 24))
  );
};

  const getBadge = () => {
  if (!profile?.verified) return null;

  const migratedType = migrateVerificationId(
    profile.badgeType
  );

  return getVerificationBadge(migratedType);
};

  const getPremium = () => {
  if (!profile?.premium) return null;

  return getPremiumBadge(profile.premiumTier);
};

    const verificationMeta =
  profile?.verified
    ? getVerificationMetadata(
        migrateVerificationId(
          profile.badgeType
        )
      )
    : null;
    
  return (
    <div
      style={{
        background:
          "#0f172a",
        borderRadius:
          "24px",
        padding: "24px",
        marginBottom:
          "24px",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems:
            "center",
          flexWrap: "wrap",
        }}
      >
        <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
>
  <img
    src={
      profile?.profilePhoto ||
      "https://via.placeholder.com/120"
    }
    alt="Profile"
    style={{
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "4px solid #38bdf8",
    }}
  />

  <button
    onClick={() =>
      fileInputRef.current?.click()
    }
    style={{
      marginTop: "10px",
      padding: "8px 14px",
      borderRadius: "12px",
      border: "none",
      background: "#38bdf8",
      color: "white",
      cursor: "pointer",
    }}
  >
    📷 Change Photo
  </button>

  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    onChange={uploadPhoto}
    style={{
      display: "none",
    }}
  />
</div>

        <div>
          <h2>
  {profile?.fullName || "Inclura User"}
</h2>

<div
  style={{
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "10px",
  }}
>
  {profile?.verified && (
    <div
      style={{
        background: "#16a34a",
        color: "white",
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: "700",
      }}
    >
      {getBadge()}
    </div>
  )}

  {verificationMeta && (
    <div
      style={{
        background: "#1e293b",
        color: "#38bdf8",
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: "700",
      }}
    >
      🛡️ Trust Level {verificationMeta.trustLevel}
    </div>
  )}

  {profile?.premium && (
  <>
    <div
      style={{
        background: "#f59e0b",
        color: "white",
        padding: "6px 12px",
        borderRadius: "999px",
      }}
    >
      {getPremium()}
    </div>

    {getVerificationMetadata(profile.premiumTier)?.trustLevel && (
      <div
        style={{
          background: "#78350f",
          color: "#facc15",
          padding: "6px 12px",
          borderRadius: "999px",
          fontSize: "13px",
          fontWeight: "700",
        }}
      >
        ⭐ Premium Trust Level{" "}
        {getVerificationMetadata(profile.premiumTier).trustLevel}
      </div>
    )}
  </>
)}

  {profile?.premium && (
    <div
      style={{
        background: "#334155",
        color: "white",
        padding: "6px 12px",
        borderRadius: "999px",
      }}
    >
      ⏳ {getDaysLeft()} days left
    </div>
  )}
</div>

<p
  style={{
    color: "#94a3b8",
  }}
>
  {profile?.bio || "No bio yet"}
</p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap:
                "wrap",
              marginTop:
                "10px",
            }}
          >
            <span
              style={tag}
            >
              🏷️{" "}
              {profile?.category ||
                "Member"}
            </span>

            <span
              style={tag}
            >
              📍{" "}
              {profile?.location ||
                "Unknown"}
            </span>

            <span
              style={tag}
            >
              ⭐ XP:{" "}
              {profile?.xp ||
                0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const tag = {
  background: "#1e293b",
  padding: "8px 12px",
  borderRadius: "999px",
};

export default ProfileHeader;
