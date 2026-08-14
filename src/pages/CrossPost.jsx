import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

function CrossPost() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [post, setPost] = useState(null);

  const [loading, setLoading] = useState(true);

  const [crossPostStatus, setCrossPostStatus] =
  useState("not_started");

  const [creatingRequest, setCreatingRequest] =
  useState(false);

const [selectedPlatforms, setSelectedPlatforms] =
  useState([]);

  useEffect(() => {
    async function loadPost() {
      const ref = doc(db, "posts", id);

      const snap = await getDoc(ref);

      if (snap.exists()) {
        setPost({
          id: snap.id,
          ...snap.data(),
        });
      }

      setLoading(false);
    }

    loadPost();
  }, [id]);

  if (loading)
    return <p>Loading...</p>;

  if (!post)
    return <p>Post not found.</p>;

  const platforms = [
    "Facebook",
    "Instagram",
    "X / Twitter",
    "LinkedIn",
    "Reddit",
    "Threads",
    "WhatsApp",
    "Telegram",
  ];

function togglePlatform(platform) {
  setSelectedPlatforms((current) => {
    if (current.includes(platform)) {
      return current.filter(
        (item) => item !== platform
      );
    }

    return [...current, platform];
  });
}

async function createCrossPostRequest() {
  if (creatingRequest) return;

  if (!post?.id) {
    alert("Post information is unavailable.");
    return;
  }

  if (selectedPlatforms.length === 0) {
    alert("Please select at least one platform.");
    return;
  }

  setCreatingRequest(true);

  try {
    const requestRef = await addDoc(
      collection(db, "crossPostRequests"),
    {
  sourcePostId: post.id,

  platforms: selectedPlatforms,

  status: "pending",

  requestVersion: 1,

  security: {
    frontendCreated: true,
    backendRequired: true,
    clientPublishingAllowed: false,
    watermarkClientProcessingAllowed: false,
  },

  watermark: {
    required: true,
    status: "pending",
    text:
      "Created on Inclura — The most accessible network.",
    processedBy: "authorized_backend",
  },

  publishing: {
    status: "pending",
    completed: false,
    processedBy: "authorized_backend",
  },

  creatorGrowth: {
    eligible: false,
    points: 0,
    awardedBy: "authorized_backend",
  },

  createdAt: serverTimestamp(),
}
    );

    console.log(
      "CrossPost request created:",
      requestRef.id
    );

    setCrossPostStatus("pending");
    
    alert(
      "Cross-post request created successfully."
    );
  } catch (error) {
    console.error(
      "CrossPost request failed:",
      error
    );

    setCrossPostStatus("failed");
    
    alert(
      "Unable to create CrossPost request."
    );
  } finally {
    setCreatingRequest(false);
  }
}

  return (
    <div
      style={{
        maxWidth: "850px",
        margin: "0 auto",
        padding: "28px",
        color: "white",
      }}
    >
      <button
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1>
        📤 Cross-Post Strategy
      </h1>

      <p>
        Share your content from
        Inclura to Facebook,
        Instagram and others with
        an automatic watermark
        that grows the platform.
      </p>

      <div
        style={{
          background: "#0f172a",
          borderRadius: "22px",
          padding: "22px",
          marginTop: "24px",
        }}
      >
        <h2>How it works</h2>

        <p>
          <strong>1.</strong> Choose a
          post from your Inclura
          feed to share externally.
        </p>

        <p>
          <strong>2.</strong> Select
          your target platforms.
        </p>

        <p>
          <strong>3.</strong> Inclura
          automatically adds the
          watermark:
        </p>

        <div
          style={{
            background: "#1e293b",
            padding: "18px",
            borderRadius: "14px",
            marginBottom: "18px",
          }}
        >
          Created on Inclura —
          The most accessible
          network.
        </div>

        <p>
          + Every successful
          cross-post earns creator
          growth points.
        </p>
      </div>

            <div
        style={{
          background: "#0f172a",
          borderRadius: "22px",
          padding: "22px",
          marginTop: "24px",
        }}
      >
        <h2>Select platform</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: "14px",
          }}
        >
          {platforms.map((platform) => {
            const selected =
              selectedPlatforms.includes(platform);

            return (
              <button
                key={platform}
                type="button"
                onClick={() =>
                  togglePlatform(platform)
                }
                aria-pressed={selected}
                style={{
                  padding: "18px",
                  borderRadius: "16px",
                  cursor: "pointer",
                  border: selected
                    ? "3px solid #22c55e"
                    : "1px solid #475569",
                  background: selected
                    ? "#14532d"
                    : "#1e293b",
                  color: "white",
                  fontWeight: selected
                    ? "700"
                    : "500",
                }}
              >
                {selected ? "✓ " : ""}
                {platform}
              </button>
            );
          })}
        </div>

        {selectedPlatforms.length > 0 && (
          <div
            style={{
              marginTop: "22px",
              padding: "18px",
              borderRadius: "16px",
              background: "#1e293b",
            }}
          >
            <h3>Selected Platforms</h3>

            <p>
              {selectedPlatforms.join(", ")}
            </p>

            <p
              style={{
                fontSize: "14px",
                opacity: 0.8,
              }}
            >
              Your selections will be prepared
              for the secure CrossPost workflow.
              Publishing and watermark processing
              will occur only after backend
              services are connected.
            </p>
          </div>
        )}

        {selectedPlatforms.length > 0 && (
          <button
            type="button"
            onClick={createCrossPostRequest}
            disabled={creatingRequest}
            aria-busy={creatingRequest}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "none",
              cursor: creatingRequest
                ? "not-allowed"
                : "pointer",
              background: "#22c55e",
              color: "white",
              fontWeight: "700",
              fontSize: "16px",
              opacity: creatingRequest ? 0.7 : 1,
            }}
          >
            {creatingRequest
              ? "Preparing Secure Cross-Post..."
              : "Prepare Secure Cross-Post"}
          </button>
        )}
      </div>

      {/* CROSS-POST PREVIEW */}
      {selectedPlatforms.length > 0 && (
        <div
          style={{
            background: "#0f172a",
            borderRadius: "22px",
            padding: "22px",
            marginTop: "24px",
          }}
        >
          <h2>👁️ Cross-Post Preview</h2>

          <p
            style={{
              opacity: 0.8,
              marginBottom: "20px",
            }}
          >
            Review your content before creating
            the secure cross-post request.
          </p>

          {/* Original content */}

          <div
            style={{
              background: "#1e293b",
              borderRadius: "16px",
              padding: "18px",
            }}
          >
            <h3>Original Inclura Post</h3>

            <p
              style={{
                fontWeight: "700",
              }}
            >
              {post.userName || "Inclura Creator"}
            </p>

            {post.text && (
              <p
                style={{
                  whiteSpace: "pre-wrap",
                }}
              >
                {post.text}
              </p>
            )}

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={
                  post.imageAlt ||
                  "Inclura post image"
                }
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  objectFit: "contain",
                  borderRadius: "14px",
                  marginTop: "12px",
                }}
              />
            )}

            {post.videoUrl && (
              <video
                controls
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  borderRadius: "14px",
                  marginTop: "12px",
                }}
              >
                <source
                  src={post.videoUrl}
                  type="video/mp4"
                />
              </video>
            )}
          </div>

          {/* Target platforms */}

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <h3>Target Platforms</h3>

            <p>
              {selectedPlatforms.join(", ")}
            </p>
          </div>

          {/* Planned watermark */}

          <div
            style={{
              marginTop: "20px",
              background: "#1e293b",
              borderRadius: "16px",
              padding: "18px",
            }}
          >
            <h3>🔐 Planned Inclura Watermark</h3>

            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "#334155",
                fontWeight: "600",
              }}
            >
              Created on Inclura —
              The most accessible network.
            </div>

            <p
              style={{
                marginTop: "12px",
                fontSize: "14px",
                opacity: 0.8,
              }}
            >
              This is a preview only. The actual
              watermark will be generated and
              applied by Inclura's secure backend
              before external publishing.
            </p>
          </div>

          {/* Processing status */}

<div
  style={{
    marginTop: "20px",
    padding: "16px",
    borderRadius: "14px",
    background: "#422006",
  }}
>
  <strong>
    🔒 Cross-Post Processing Status
  </strong>

  <p
    style={{
      marginTop: "10px",
      marginBottom: "8px",
      fontWeight: "700",
    }}
  >
    {crossPostStatus === "not_started" &&
      "Not started"}
    
    {crossPostStatus === "pending" &&
  "Request pending"}

    {crossPostStatus === "request_created" &&
      "Request created"}

    {crossPostStatus === "processing" &&
      "Processing"}

    {crossPostStatus === "watermark_ready" &&
      "Watermark ready"}

    {crossPostStatus === "published" &&
      "Published"}

    {crossPostStatus === "failed" &&
      "Failed"}
  </p>

  <p
    style={{
      marginBottom: 0,
      fontSize: "14px",
      opacity: 0.85,
    }}
  >
    {crossPostStatus === "not_started" &&
      "No cross-post request has been submitted yet. The secure backend will control watermark generation and external publishing."}

    {crossPostStatus === "pending" &&
  "Your CrossPost request has been securely recorded and is waiting for authorized backend processing. Watermark generation and external publishing have not occurred yet."}
    
    {crossPostStatus === "request_created" &&
      "Your cross-post request has been created and is waiting for secure backend processing."}

    {crossPostStatus === "processing" &&
      "The secure backend is processing the media and applying the Inclura watermark."}

    {crossPostStatus === "watermark_ready" &&
      "The secure backend has completed watermark processing and the content is ready for the publishing stage."}

    {crossPostStatus === "published" &&
      "The external publication has been confirmed by the publishing service."}

    {crossPostStatus === "failed" &&
      "The cross-post process could not be completed. No successful publication should be recorded."}
  </p>
</div>
        </div>
      )}

    {crossPostStatus !== "not_started" && (
  <div
    style={{
      background: "#0f172a",
      borderRadius: "22px",
      padding: "22px",
      marginTop: "24px",
    }}
  >
    <h2>
      🔄 Cross-Post Status
    </h2>

    <p
      style={{
        fontSize: "18px",
        fontWeight: "700",
      }}
    >
      {crossPostStatus === "pending" &&
        "⏳ Cross-post request is pending."}

      {crossPostStatus === "failed" &&
        "❌ Cross-post request failed."}
    </p>

    {crossPostStatus === "pending" && (
      <p
        style={{
          fontSize: "14px",
          opacity: 0.8,
        }}
      >
        Your request has been securely
        recorded. Watermark processing and
        external publishing will begin only
        when the authorized backend services
        are connected.
      </p>
    )}

    {crossPostStatus === "failed" && (
      <p
        style={{
          fontSize: "14px",
          opacity: 0.8,
        }}
      >
        The request could not be created.
        Please try again.
      </p>
    )}
  </div>
)}
              <div
        style={{
          background: "#0f172a",
          borderRadius: "22px",
          padding: "22px",
          marginTop: "24px",
        }}
      >
        <h2>
          📊 Your Cross-Post
          Statistics
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: "18px",
            marginTop: "18px",
          }}
        >
          <StatCard
            title="Total Cross-Posts"
            value="0"
          />
          
          <StatCard
            title="XP From Sharing"
            value="0"
          />

          <StatCard
            title="Active Referral Signups"
            value="0"
          />

          <StatCard
            title="Impressions Generated"
            value="0"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "18px",
        borderRadius: "16px",
      }}
    >
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  );
}

export default CrossPost;
