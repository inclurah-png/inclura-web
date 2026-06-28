import { useRef } from "react";

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
  if (
    !profile?.premiumExpiryDate
  )
    return null;

  const expiry =
    profile.premiumExpiryDate.toDate();

  const diff =
    expiry -
    new Date();

  return Math.max(
    0,
    Math.ceil(
      diff /
        (1000 *
          60 *
          60 *
          24)
    )
  );
};
  const getBadge = () => {
    if (!profile?.verified)
      return null;

    switch (
      profile?.badgeType
    ) {
      case "creator":
        return "🎥 Verified Creator";

      case "organization":
        return "🏢 Verified Organization";

      case "ngo":
        return "🤝 Verified NGO";

      case "hospital":
        return "🏥 Verified Hospital";

      case "university":
        return "🎓 Verified University";

      case "government":
        return "🏛 Verified Government";

      default:
        return "✅ Verified User";
    }
  };

  const getPremiumBadge =
    () => {
      if (
        !profile?.premium
      )
        return null;

      switch (
        profile?.premiumTier
      ) {
        case "silver":
          return "🥈 Silver";

        case "gold":
          return "🥇 Gold";

        case "platinum":
          return "💎 Platinum";

        case "enterprise":
          return "🏆 Enterprise";

        default:
          return "⭐ Premium";
      }
    };

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
        <img
          src={
            profile?.profilePhoto ||
            "https://via.placeholder.com/120"
          }
          
          <div
  style={{
    marginTop: "10px",
  }}
>
  <button
    onClick={() =>
      fileInputRef.current?.click()
    }
    style={{
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
    onChange={
      uploadPhoto
    }
    style={{
      display: "none",
    }}
  />
</div>
        
          alt="Profile"
          style={{
            width: "120px",
            height: "120px",
            borderRadius:
              "50%",
            objectFit:
              "cover",
            border:
              "4px solid #38bdf8",
          }}
        />

        <div>
          <h2>
            {profile?.fullName ||
              "Inclura User"}
          </h2>

          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap:
                "wrap",
              marginBottom:
                "10px",
            }}
          >
            {profile?.verified && (
              <div
                style={{
                  background:
                    "#16a34a",
                  color:
                    "white",
                  padding:
                    "6px 12px",
                  borderRadius:
                    "999px",
                  fontSize:
                    "13px",
                  fontWeight:
                    "700",
                }}
              >
                {getBadge()}
              </div>
            )}

            {profile?.premium && (
  <>
    <div
      style={{
        background:
          "#f59e0b",
        color: "white",
        padding:
          "6px 12px",
        borderRadius:
          "999px",
      }}
    >
      {getPremiumBadge()}
    </div>

    <div
      style={{
        background:
          "#334155",
        color: "white",
        padding:
          "6px 12px",
        borderRadius:
          "999px",
      }}
    >
      ⏳ {getDaysLeft()} days left
    </div>
  </>
)}
   
</div>
          
          <p
            style={{
              color:
                "#94a3b8",
            }}
          >
            {profile?.bio ||
              "No bio yet"}
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
