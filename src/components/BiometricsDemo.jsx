import React, { useEffect, useRef, useState } from "react";
import { DrawingUtils, FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";

const MODEL_ASSET_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm";

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(normalized + padding);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return bytes;
}

export default function BiometricsDemo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("Loading MediaPipe face landmarking...");
  const [passkeyStatus, setPasskeyStatus] = useState(
    "Passkeys are ready to be tested from this browser."
  );
  const [cameraReady, setCameraReady] = useState(false);
  const [passkeySupported, setPasskeySupported] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function detectPasskeySupport() {
      if (typeof window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable !== "function") {
        if (!cancelled) {
          setPasskeySupported(false);
          setPasskeyStatus("This browser does not expose WebAuthn platform authenticator support.");
        }
        return;
      }

      try {
        const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (!cancelled) {
          setPasskeySupported(Boolean(available));
          if (!available) {
            setPasskeyStatus("This device does not currently expose a platform authenticator for passkeys.");
          }
        }
      } catch (error) {
        if (!cancelled) {
          setPasskeySupported(false);
          setPasskeyStatus(`Passkey support check failed: ${error.message}`);
        }
      }
    }

    detectPasskeySupport();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let animationFrameId = null;
    let cancelled = false;

    async function initialize() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("Camera access is not supported by this browser.");
        return;
      }

      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_ASSET_URL,
            delegate: "CPU",
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        });

        if (cancelled) {
          return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const drawingUtils = new DrawingUtils(ctx);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        video.srcObject = stream;
        await video.play();
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        const render = () => {
          if (video.readyState >= 2) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const result = faceLandmarker.detectForVideo(video, performance.now());
            if (result.faceLandmarks?.length) {
              drawingUtils.drawLandmarks(result.faceLandmarks[0], {
                color: "#f59e0b",
                radius: 2,
              });
            }
          }

          animationFrameId = window.requestAnimationFrame(render);
        };

        render();
        setStatus("Face landmarking is active. Move your face into view.");
        setCameraReady(true);
      } catch (error) {
  console.error("Biometrics initialization error:", error);

  if (error.name === "NotAllowedError") {
    setStatus(
      "Camera permission was denied. Please allow camera access in your browser settings."
    );
  } else if (error.name === "NotFoundError") {
    setStatus(
      "No camera was found on this device."
    );
  } else if (error.name === "NotReadableError") {
    setStatus(
      "The camera is already being used by another application."
    );
  } else {
    setStatus(
      `MediaPipe/camera initialization failed: ${error.message}`
    );
  }

  setCameraReady(false);
}
    }

    initialize();

    return () => {
      cancelled = true;
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleAuthenticatePasskey = async () => {
  try {
    setPasskeyStatus(
      "IFSE authentication challenge is not connected yet."
    );
  } catch (error) {
    console.error(error);

    setPasskeyStatus(
      `Authentication failed: ${error.message}`
    );
  }
};
  const handleAuthenticatePasskey = async () => {
    try {
      const stored = localStorage.getItem("inclura-passkey-demo");
      if (!stored) {
        setPasskeyStatus("Register a passkey first so it can be used here.");
        return;
      }

      const parsed = JSON.parse(stored);
      const handleAuthenticatePasskey = async () => {
  setPasskeyStatus(
    "Passkey authentication will be enabled after the IFSE authentication challenge and verification routes are connected."
  );
};

      const assertion = await startAuthentication({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: "required",
          allowCredentials: [
            {
              id: base64UrlDecode(parsed.credentialId),
              type: "public-key",
            },
          ],
        },
      });

      setPasskeyStatus(
        `Authentication succeeded. Signature length: ${assertion.response.authenticatorData.byteLength}`
      );
    } catch (error) {
      console.error(error);
      setPasskeyStatus(`Authentication failed: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "8px" }}>MediaPipe + Passkey Demo</h1>
      <p style={{ color: "#64748b", marginBottom: "24px" }}>
        This route demonstrates browser-based face landmarking and WebAuthn passkey creation.
        For production deployments, verify the WebAuthn responses on your backend and store the registration data securely.
      </p>

      <div
        style={{
          display: "grid",
          gap: "24px",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          alignItems: "start",
        }}
      >
        <section
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px",
            background: "#fff",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Face Landmarker</h2>
          <p style={{ color: "#475569" }}>{status}</p>
          <div
            style={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              background: "#0f172a",
              minHeight: "320px",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          <p style={{ color: cameraReady ? "#15803d" : "#64748b", marginTop: "12px" }}>
            {cameraReady ? "Camera streaming and landmark detection are running." : "Waiting for camera access..."}
          </p>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "8px" }}>
            The face model runs with the CPU delegate for wider browser compatibility.
          </p>
        </section>

        <section
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px",
            background: "#fff",
          }}
        >
          <h2 style={{ marginTop: 0 }}>WebAuthn / Passkeys</h2>
          <p style={{ color: "#475569" }}>{passkeyStatus}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={handleRegisterPasskey}
              disabled={!passkeySupported}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                border: "none",
                background: passkeySupported ? "#2563eb" : "#94a3b8",
                color: "white",
                cursor: passkeySupported ? "pointer" : "not-allowed",
                opacity: passkeySupported ? 1 : 0.8,
              }}
            >
              Register a passkey
            </button>
            <button
              onClick={handleAuthenticatePasskey}
              disabled={!passkeySupported}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                cursor: passkeySupported ? "pointer" : "not-allowed",
                opacity: passkeySupported ? 1 : 0.8,
              }}
            >
              Sign in with Passkey
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
