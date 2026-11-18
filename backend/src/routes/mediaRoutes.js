import { createHash, randomUUID } from "node:crypto";
import express from "express";
import { auth } from "../config/firebaseAdmin.js";

const router = express.Router();

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

router.post("/sign-upload", async (req, res) => {
  try {
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      return res.status(503).json({
        success: false,
        message: "Media uploads are not configured yet.",
      });
    }

    const authorization = req.headers.authorization || "";
    const match = authorization.match(/^Bearer (.+)$/i);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const decoded = await auth().verifyIdToken(match[1]);
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
    return res.status(401).json({
      success: false,
      message: "Upload authorization failed.",
    });
  }
});

export default router;
