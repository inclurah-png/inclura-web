import { createHash, randomUUID } from "node:crypto";
import express from "express";
import multer from "multer";
import { auth, firestore } from "../config/firebaseAdmin.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

const MIME_RESOURCE_TYPES = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
  "image/avif": "image",
  "video/mp4": "video",
  "video/webm": "video",
  "video/quicktime": "video",
  "audio/mpeg": "video",
  "audio/mp4": "video",
  "audio/webm": "video",
  "audio/ogg": "video",
  "application/pdf": "raw",
  "application/msword": "raw",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "raw",
  "application/vnd.ms-excel": "raw",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "raw",
  "text/plain": "raw",
};

const CATEGORY_RULES = {
  profilePhoto: { folder: "profilePhotos", private: false, resources: ["image"] },
  post: { folder: "posts", private: false, resources: ["image", "video"] },
  story: { folder: "stories", private: false, resources: ["image"] },
  chat: { folder: "chat", private: false, resources: ["image", "video", "raw"] },
  voiceNote: { folder: "voiceNotes", private: false, resources: ["video"] },
  verificationDocument: { folder: "verificationDocuments", private: true, resources: ["image", "raw"] },
};

function signCloudinaryParams(params, secret) {
  const canonical = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== "")
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1")
    .update(canonical + secret)
    .digest("hex");
}

function getBearerToken(req) {
  const match = (req.headers.authorization || "").match(/^Bearer (.+)$/i);
  return match?.[1] || null;
}

router.get("/status", (req, res) => {
  const configured = Boolean(CLOUD_NAME && API_KEY && API_SECRET);
  return res.status(configured ? 200 : 503).json({
    success: configured,
    service: "Inclura Media Upload",
    configured,
    message: configured
      ? "Cloudinary credentials are available to the backend."
      : "Cloudinary configuration is incomplete.",
  });
});


router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      return res.status(503).json({ success: false, message: "Media uploads are not configured yet." });
    }

    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const decoded = await auth().verifyIdToken(token);
    const category = String(req.body?.category || "");
    const mimeType = String(req.file?.mimetype || "").toLowerCase();
    const rule = CATEGORY_RULES[category];
    const resourceType = MIME_RESOURCE_TYPES[mimeType];

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No media file was received." });
    }

    if (!rule || !resourceType || !rule.resources.includes(resourceType)) {
      return res.status(400).json({
        success: false,
        message: "This media type is not allowed for the selected upload category.",
      });
    }

    const maxSize = resourceType === "image"
      ? 5 * 1024 * 1024
      : resourceType === "video"
        ? 50 * 1024 * 1024
        : 10 * 1024 * 1024;

    if (req.file.size > maxSize) {
      return res.status(413).json({
        success: false,
        message: resourceType === "image"
          ? "Image must be 5 MB or smaller."
          : "Video must be 50 MB or smaller.",
      });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = randomUUID();
    const folder = "inclura/" + rule.folder + "/" + decoded.uid;
    const type = rule.private ? "authenticated" : "upload";
    const params = {
      folder,
      overwrite: "false",
      public_id: publicId,
      timestamp: String(timestamp),
      type,
      unique_filename: "false",
      use_filename: "false",
    };
    const signature = signCloudinaryParams(params, API_SECRET);

    const cloudinaryForm = new FormData();
    cloudinaryForm.append("file", new Blob([req.file.buffer], { type: mimeType }));
    Object.entries(params).forEach(([key, value]) => cloudinaryForm.append(key, String(value)));
    cloudinaryForm.append("api_key", API_KEY);
    cloudinaryForm.append("signature", signature);

    const cloudinaryResponse = await fetch(
      "https://api.cloudinary.com/v1_1/" + CLOUD_NAME + "/" + resourceType + "/upload",
      {
        method: "POST",
        body: cloudinaryForm,
      }
    );

    const cloudinaryResult = await cloudinaryResponse.json().catch(() => ({}));

    if (!cloudinaryResponse.ok || !cloudinaryResult.secure_url || !cloudinaryResult.public_id) {
      console.error("Cloudinary media upload failed:", {
        status: cloudinaryResponse.status,
        message: cloudinaryResult?.error?.message || "Unknown Cloudinary error",
      });
      return res.status(502).json({
        success: false,
        message: "Cloudinary could not complete the media upload.",
      });
    }

    return res.status(200).json({
      success: true,
      secureUrl: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      resourceType: cloudinaryResult.resource_type,
    });
  } catch (error) {
    console.error("Inclura media upload failed:", error?.message || "Unknown error");
    return res.status(500).json({
      success: false,
      message: "Unable to complete the media upload.",
    });
  }
});

router.post("/sign-upload", async (req, res) => {
  try {
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      return res.status(503).json({ success: false, message: "Media uploads are not configured yet." });
    }

    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const decoded = await auth().verifyIdToken(token);
    const category = req.body?.category;
    const mimeType = String(req.body?.mimeType || "").toLowerCase();
    const rule = CATEGORY_RULES[category];
    const resourceType = MIME_RESOURCE_TYPES[mimeType];

    if (!rule || !resourceType || !rule.resources.includes(resourceType)) {
      return res.status(400).json({
        success: false,
        message: "This media type is not allowed for the selected upload category.",
      });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = randomUUID();
    const folder = `inclura/${rule.folder}/${decoded.uid}`;
    const type = rule.private ? "authenticated" : "upload";
    const params = {
      folder,
      overwrite: "false",
      public_id: publicId,
      timestamp: String(timestamp),
      type,
      unique_filename: "false",
      use_filename: "false",
    };
    const signature = signCloudinaryParams(params, API_SECRET);

    return res.status(200).json({
      success: true,
      cloudName: CLOUD_NAME,
      apiKey: API_KEY,
      resourceType,
      uploadType: type,
      uploadUrl: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      publicId: `${folder}/${publicId}`,
      params,
      signature,
    });
  } catch (error) {
    console.error("Cloudinary upload signing failed:", error);
    return res.status(401).json({ success: false, message: "Upload authorization failed." });
  }
});

// Prepare a separate, permanently watermarked copy for an owner's external-sharing request.
// The source Firebase Storage asset is never modified.
router.post("/prepare-crosspost", async (req, res) => {
  let requestRef = null;
  let requestData = null;
  let processingStage = "authentication";

  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const decoded = await auth().verifyIdToken(token);
    processingStage = "request_validation";
    const requestId = String(req.body?.requestId || "");
    if (!requestId || requestId.length > 150) {
      return res.status(400).json({ success: false, message: "A valid cross-post request ID is required." });
    }

    requestRef = firestore().collection("crossPostRequests").doc(requestId);
    processingStage = "load_crosspost_request";
    const requestSnapshot = await requestRef.get();
    if (!requestSnapshot.exists) {
      return res.status(404).json({ success: false, message: "Cross-post request not found." });
    }

    requestData = requestSnapshot.data() || {};
    if (
      requestData.creatorId !== decoded.uid ||
      requestData.sourcePostOwnerId !== decoded.uid
    ) {
      return res.status(403).json({ success: false, message: "You are not authorized to prepare this post." });
    }

    if (requestData.watermark?.status === "completed" && requestData.watermark?.secureUrl) {
      return res.status(200).json({
        success: true,
        watermark: {
          status: "completed",
          secureUrl: requestData.watermark.secureUrl,
          resourceType: requestData.watermark.resourceType,
        },
      });
    }

    if (requestData.status !== "pending" || requestData.publishing?.completed === true) {
      return res.status(409).json({ success: false, message: "This request is not available for watermark preparation." });
    }

    processingStage = "load_original_post";
    const sourceSnapshot = await firestore()
      .collection("posts")
      .doc(String(requestData.sourcePostId || ""))
      .get();

    if (!sourceSnapshot.exists) {
      return res.status(404).json({ success: false, message: "The original post could not be found." });
    }

    const sourcePost = sourceSnapshot.data() || {};
    if (sourcePost.userId !== decoded.uid) {
      return res.status(403).json({ success: false, message: "The original post does not belong to this account." });
    }

    const imageUrl = typeof sourcePost.imageUrl === "string" ? sourcePost.imageUrl.trim() : "";
    const videoUrl = typeof sourcePost.videoUrl === "string" ? sourcePost.videoUrl.trim() : "";

    if (!imageUrl && !videoUrl) {
      await requestRef.update({
        watermark: {
          ...(requestData.watermark || {}),
          required: false,
          status: "not_required",
          processedBy: "authorized_backend",
          processedAt: new Date(),
        },
      });
      return res.status(200).json({
        success: true,
        watermark: { status: "not_required" },
        message: "Text-only cross-post request needs no media watermark.",
      });
    }

    if (imageUrl && videoUrl) {
      return res.status(400).json({
        success: false,
        message: "Permanent media watermarking currently supports one image or one video per post.",
      });
    }

    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      return res.status(503).json({ success: false, message: "Media processing is not configured." });
    }

    const sourceUrl = imageUrl || videoUrl;
    processingStage = "validate_source_media";
    const source = new URL(sourceUrl);
    const sourcePublicId = imageUrl
      ? String(sourcePost.imagePublicId || "")
      : String(sourcePost.videoPublicId || "");
    const expectedPrefix = `inclura/posts/${decoded.uid}/`;

    // Only accept the authenticated owner's Cloudinary post asset.
    // The original Cloudinary upload remains unchanged; the watermarked copy is new.
    if (
      source.protocol !== "https:" ||
      source.hostname !== "res.cloudinary.com" ||
      sourcePost.mediaProvider !== "cloudinary" ||
      !sourcePublicId.startsWith(expectedPrefix)
    ) {
      return res.status(403).json({ success: false, message: "The source file is not an approved media asset for this account." });
    }

    const resourceType = imageUrl ? "image" : "video";
    const timestamp = String(Math.floor(Date.now() / 1000));
    const publicId = randomUUID();
    const folder = `inclura/crosspost-watermarked/${decoded.uid}`;
    const transformation =
      "l_text:Arial_24:INCLURA%20-%20INCLUSION%20COMES%20FIRST,co_white,b_rgb:064E3B/fl_layer_apply,g_south_east,x_18,y_18";

    // Incoming transformation stores the branded rendition as a separate asset.
    // The original Cloudinary post asset remains unchanged.
    const params = {
      folder,
      overwrite: "false",
      public_id: publicId,
      timestamp,
      transformation,
      unique_filename: "false",
      use_filename: "false",
    };
    const signature = signCloudinaryParams(params, API_SECRET);
    const form = new URLSearchParams({
      ...params,
      file: sourceUrl,
      api_key: API_KEY,
      signature,
    });

    processingStage = "cloudinary_upload_request";
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form,
      }
    );

    processingStage = "read_cloudinary_response";
    const cloudinaryResult = await cloudinaryResponse.json().catch(() => ({}));
    if (!cloudinaryResponse.ok || !cloudinaryResult.secure_url || !cloudinaryResult.public_id) {
      console.error("Cross-post watermark processing failed at Cloudinary.", {
        status: cloudinaryResponse.status,
        providerCode: cloudinaryResult?.error?.http_code || null,
        providerMessage: String(cloudinaryResult?.error?.message || "No provider message").slice(0, 240),
      });
      await requestRef.update({
        watermark: {
          ...(requestData.watermark || {}),
          required: true,
          status: "failed",
          failureReason: "media_processing_failed",
          processedBy: "authorized_backend",
          processedAt: new Date(),
        },
      });
      return res.status(502).json({ success: false, message: "Inclura could not create the watermarked media copy. The original post is unchanged." });
    }

    processingStage = "save_completed_watermark";
    await requestRef.update({
      watermark: {
        ...(requestData.watermark || {}),
        required: true,
        status: "completed",
        secureUrl: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        resourceType,
        processedBy: "authorized_backend",
        processedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      watermark: {
        status: "completed",
        secureUrl: cloudinaryResult.secure_url,
        resourceType,
      },
    });
  } catch (error) {
    console.error("Cross-post watermark preparation failed:", {
      stage: processingStage,
      name: error?.name || "Error",
      message: String(error?.message || "Unknown error").slice(0, 300),
      code: error?.code || null,
    });
    if (requestRef && requestData?.creatorId) {
      try {
        await requestRef.update({
          watermark: {
            ...(requestData.watermark || {}),
            required: true,
            status: "failed",
            failureReason: `processing_failed_${processingStage}`,
            processedBy: "authorized_backend",
            processedAt: new Date(),
          },
        });
      } catch {
        // Preserve the generic API error; do not expose source URLs or credentials.
      }
    }
    const firestoreErrorCode = String(error?.code || "");
    const safeFailureReason =
      firestoreErrorCode === "7" || firestoreErrorCode === "permission-denied"
        ? "firestore_permission_denied"
        : firestoreErrorCode === "5" || firestoreErrorCode === "not-found"
          ? "firestore_not_found"
          : firestoreErrorCode === "14" || firestoreErrorCode === "unavailable"
            ? "firestore_unavailable"
            : firestoreErrorCode === "4" || firestoreErrorCode === "deadline-exceeded"
              ? "firestore_timeout"
              : "firestore_read_error";

    return res.status(500).json({
      success: false,
      message: `Unable to prepare the watermarked media copy (stage: ${processingStage}; reason: ${safeFailureReason}). The original post is unchanged.`,
    });
  }
});

// Issue a short-lived Cloudinary download URL only after checking the
// authenticated user against the Firestore verification application.
router.post("/verification-document-access", async (req, res) => {
  try {
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      return res.status(503).json({ success: false, message: "Private document access is not configured." });
    }

    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const decoded = await auth().verifyIdToken(token, true);
    if (decoded.admin === true) {
      const adminRecord = await auth().getUser(decoded.uid);
      if (adminRecord.disabled || decoded.email_verified !== true) {
        return res.status(403).json({ success: false, message: "An active, verified administrator session is required." });
      }
    }
    const verificationId = String(req.body?.verificationId || "");
    const requestedPublicId = String(req.body?.publicId || "");

    if (!verificationId || !requestedPublicId || verificationId.length > 150 || requestedPublicId.length > 500) {
      return res.status(400).json({ success: false, message: "A valid verification and document reference are required." });
    }

    const requestSnapshot = await firestore()
      .collection("verificationRequests")
      .doc(verificationId)
      .get();

    if (!requestSnapshot.exists) {
      return res.status(404).json({ success: false, message: "Verification application not found." });
    }

    const verification = requestSnapshot.data() || {};
    const requestOwnerId = String(verification.userId || verification.submittedBy || "");
    const isOwner = requestOwnerId === decoded.uid;
    const isAdmin = decoded.admin === true;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "You are not authorized to access this verification document." });
    }
    if (!requestOwnerId || !requestedPublicId.startsWith(`inclura/verificationDocuments/${requestOwnerId}/`)) {
      return res.status(403).json({ success: false, message: "Document does not belong to this verification applicant." });
    }

    const uploadedDocuments = verification.uploadedDocuments || {};
    const documentRecord = Object.values(uploadedDocuments).find(
      (item) => item?.cloudinaryPublicId === requestedPublicId
    );

    if (!documentRecord) {
      return res.status(404).json({ success: false, message: "The document is not attached to this verification application." });
    }

    const resourceType = MIME_RESOURCE_TYPES[String(documentRecord.fileType || "").toLowerCase()];
    const formatByMime = {
      "application/pdf": "pdf",
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
    };
    const format = formatByMime[String(documentRecord.fileType || "").toLowerCase()];

    if (!resourceType || !["image", "raw"].includes(resourceType) || !format || !String(requestedPublicId).startsWith("inclura/verificationDocuments/")) {
      return res.status(400).json({ success: false, message: "The stored document metadata is invalid." });
    }

    const expiresAt = Math.floor(Date.now() / 1000) + 90;
    const downloadParams = {
      expires_at: String(expiresAt),
      format,
      public_id: requestedPublicId,
      timestamp: String(Math.floor(Date.now() / 1000)),
      type: "authenticated",
    };
    const signature = signCloudinaryParams(downloadParams, API_SECRET);
    const query = new URLSearchParams({
      ...downloadParams,
      api_key: API_KEY,
      signature,
    });
    const downloadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/download?${query.toString()}`;

    return res.status(200).json({
      success: true,
      downloadUrl,
      expiresAt,
      fileName: documentRecord.fileName || "verification-document",
    });
  } catch (error) {
    console.error("Verification document access failed:", error);
    return res.status(500).json({ success: false, message: "Unable to authorize document access." });
  }
});

export default router;
