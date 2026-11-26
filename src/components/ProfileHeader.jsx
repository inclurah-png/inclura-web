import { useEffect, useRef, useState } from "react";

import {
  getVerificationBadge,
  getPremiumBadge,
  getVerificationMetadata,
} from "../config/verificationTypes";

import {
  migrateVerificationId,
} from "../config/verificationMigration";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase";
import { uploadProfilePhotoToCloudinary } from "../services/cloudinaryUpload";
import { useTranslation } from "react-i18next";

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

function resolveProfileName(
  profile,
  fallbackName = "Inclura User"
) {
  const currentUser =
    auth.currentUser;

  const firstName =
    typeof profile?.firstName ===
    "string"
      ? profile.firstName.trim()
      : "";

  const lastName =
    typeof profile?.lastName ===
    "string"
      ? profile.lastName.trim()
      : "";

  const nameFromParts =
    `${firstName} ${lastName}`.trim();

  if (
    nameFromParts &&
    !isPlaceholderName(
      nameFromParts
    )
  ) {
    return nameFromParts;
  }

  const fullName =
    typeof profile?.fullName ===
    "string"
      ? profile.fullName.trim()
      : "";

  if (
    fullName &&
    !isPlaceholderName(
      fullName
    )
  ) {
    return fullName;
  }

  const profileName =
    typeof profile?.name ===
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

  const displayName =
    typeof profile?.displayName ===
    "string"
      ? profile.displayName.trim()
      : "";

  if (
    displayName &&
    !isPlaceholderName(
      displayName
    )
  ) {
    return displayName;
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

  const email =
    currentUser?.email ||
    profile?.email ||
    "";

  if (email) {
    return email.split("@")[0];
  }

  return fallbackName;
}

function ProfileHeader({
  profile,
}) {
  const { t } = useTranslation();
  const fileInputRef =
    useRef(null);
  const [uploadedPhotoURL, setUploadedPhotoURL] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);

  useEffect(() => {
    setUploadedPhotoURL(
      profile?.profilePhoto ||
      profile?.photoURL ||
      auth.currentUser?.photoURL ||
      ""
    );
  }, [profile?.profilePhoto, profile?.photoURL]);

  const profileName =
    resolveProfileName(
      profile,
      t("statsUser")
    );

  async function uploadPhoto(e) {
    const input = e.target;
    const file = input.files?.[0];
    input.value = "";

    if (!file) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        alert(t("error"));
        return;
      }

      setPhotoUploading(true);
      const url = await uploadProfilePhotoToCloudinary(file);

      await updateDoc(doc(db, "users", user.uid), {
        profilePhoto: url,
        photoURL: url,
      });

      // Update this profile immediately; a full-page reload is unnecessary.
      setUploadedPhotoURL(url);
    } catch (error) {
      console.error("Profile photo upload failed:", error);
      alert(error.message || t("error"));
    } finally {
      setPhotoUploading(false);
    }
  }

  const getDaysLeft = () => {
    if (
      !profile?.premiumExpiryDate
    ) {
      return null;
    }

    const expiryValue = profile.premiumExpiryDate;
    const expiry =
      expiryValue && typeof expiryValue.toDate === "function"
        ? expiryValue.toDate()
        : new Date(expiryValue);

    if (Number.isNaN(expiry.getTime())) {
      return null;
    }

    const diff =
      expiry - new Date();

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
    if (!profile?.verified) {
      return null;
    }

    const migratedType =
      migrateVerificationId(
        profile.badgeType
      );

    return getVerificationBadge(
      migratedType
    );
  };

  const getPremium = () => {
    if (!profile?.premium) {
      return null;
    }

    return getPremiumBadge(
      profile.premiumTier
    );
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
        background: "#0f172a",
        borderRadius: "24px",
        padding: "24px",
        marginBottom: "24px",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
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
          {uploadedPhotoURL ? (
            <img
              src={uploadedPhotoURL}
              alt={`${profileName} ${t("profile")}`}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #38bdf8",
              }}
            />
          ) : (
            <div
              role="img"
              aria-label={`${profileName} ${t("profile")} initials`}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: "#134e4a",
                color: "#facc15",
                border: "4px solid #38bdf8",
                fontSize: "44px",
                fontWeight: 800,
              }}
            >
              {(profileName || "Inclura").trim().charAt(0).toUpperCase()}
            </div>
          )}

          <button
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={photoUploading}
            style={{
              marginTop: "10px",
              padding: "8px 14px",
              borderRadius: "12px",
              border: "none",
              background: "#38bdf8",
              color: "white",
              cursor: photoUploading ? "wait" : "pointer",
              opacity: photoUploading ? 0.65 : 1,
            }}
          >
            {photoUploading ? t("uploadingPhoto") : `📷 ${t("changePhoto")}`}
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={uploadPhoto}
            disabled={photoUploading}
            style={{
              display: "none",
            }}
          />
        </div>

        <div>
          <h2>
            {profileName}
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
                  background:
                    "#16a34a",
                  color: "white",
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

            {verificationMeta && (
              <div
                style={{
                  background:
                    "#1e293b",
                  color:
                    "#38bdf8",
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
                🛡️ {t("trustLevel")}{" "}
                {
                  verificationMeta.trustLevel
                }
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
                  {getPremium()}
                </div>

                {getVerificationMetadata(
                  profile.premiumTier
                )?.trustLevel && (
                  <div
                    style={{
                      background:
                        "#78350f",
                      color:
                        "#facc15",
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
                    ⭐ {t("premiumTrustLevel")}{" "}
                    {
                      getVerificationMetadata(
                        profile.premiumTier
                      ).trustLevel
                    }
                  </div>
                )}
              </>
            )}

            {profile?.premium && (
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
                ⏳{" "}
                {t("daysLeft", { count: getDaysLeft() })}
              </div>
            )}
          </div>

          <p
            style={{
              color: "#94a3b8",
            }}
          >
            {profile?.bio ||
              t("noBioYet")}
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "10px",
            }}
          >
            <span
              style={tag}
            >
              🏷️{" "}
              {profile?.category ||
                t("statsUser")}
            </span>

            <span
              style={tag}
            >
              📍{" "}
              {profile?.location ||
                t("unknown")}
            </span>

            <span
              style={tag}
            >
              ⭐ {t("statsXP")}:{" "}
              {profile?.xp || 0}
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
