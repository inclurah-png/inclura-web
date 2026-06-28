import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase";

function CrossPost() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [post, setPost] = useState(null);

  const [loading, setLoading] = useState(true);

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

  function share(platform) {
    alert(
      `Cross-post to ${platform} will be connected after API integration.`
    );
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
          {platforms.map(
            (platform) => (
              <button
                key={platform}
                onClick={() =>
                  share(platform)
                }
                style={{
                  padding: "18px",
                  borderRadius:
                    "16px",
                  cursor: "pointer",
                }}
              >
                {platform}
              </button>
            )
          )}
        </div>
      </div>

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

function StatCard({
  title,
  value,
}) {
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
