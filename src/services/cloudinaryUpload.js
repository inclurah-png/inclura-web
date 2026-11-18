import { auth } from "../firebase";

const IFSE_API_BASE =
  import.meta.env.VITE_IFSE_API_BASE ||
  "https://inclura-ifse-backend.onrender.com";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const ALLOWED_VERIFICATION_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

async function uploadImageToCloudinary(file, category, maxSize, sizeMessage) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please log in again before uploading media.");
  }

  if (!ALLOWED_IMAGE_TYPES.has(file?.type)) {
    throw new Error("Choose a JPEG, PNG, WebP, GIF, or AVIF image.");
  }

  if (!file.size || file.size > maxSize) {
    throw new Error(sizeMessage);
  }

  const token = await user.getIdToken();
  const signingResponse = await fetch(
    `${IFSE_API_BASE}/api/media/sign-upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category,
        mimeType: file.type,
      }),
    }
  );

  const signingData = await signingResponse.json().catch(() => ({}));
  if (!signingResponse.ok || !signingData.success) {
    throw new Error(
      signingData.message || "The server could not authorize this media upload."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signingData.apiKey);
  formData.append("timestamp", signingData.params.timestamp);
  formData.append("folder", signingData.params.folder);
  formData.append("public_id", signingData.params.public_id);
  formData.append("overwrite", signingData.params.overwrite);
  formData.append("type", signingData.params.type);
  formData.append("unique_filename", signingData.params.unique_filename);
  formData.append("use_filename", signingData.params.use_filename);
  formData.append("signature", signingData.signature);

  const uploadResponse = await fetch(signingData.uploadUrl, {
    method: "POST",
    body: formData,
  });

  const uploadData = await uploadResponse.json().catch(() => ({}));
  if (!uploadResponse.ok || !uploadData.secure_url) {
    console.error("Cloudinary media upload response:", uploadData);
    throw new Error(
      uploadData.error?.message || "Cloudinary could not complete the media upload."
    );
  }

  return uploadData.secure_url;
}

export function uploadProfilePhotoToCloudinary(file) {
  return uploadImageToCloudinary(
    file,
    "profilePhoto",
    5 * 1024 * 1024,
    "Please choose an image smaller than 5 MB."
  );
}

export function uploadStoryImageToCloudinary(file) {
  return uploadImageToCloudinary(
    file,
    "story",
    10 * 1024 * 1024,
    "Please choose an image smaller than 10 MB."
  );
}

export async function uploadVerificationDocumentToCloudinary(file) {
  if (!ALLOWED_VERIFICATION_TYPES.has(file?.type)) {
    throw new Error("Only PDF, JPG, JPEG and PNG files are allowed.");
  }

  if (!file?.size || file.size > 10 * 1024 * 1024) {
    throw new Error("Document size must not exceed 10 MB.");
  }

  const user = auth.currentUser;
  if (!user) {
    throw new Error("Please log in again before uploading verification documents.");
  }

  const token = await user.getIdToken();
  const signingResponse = await fetch(
    `${IFSE_API_BASE}/api/media/sign-upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: "verificationDocument",
        mimeType: file.type,
      }),
    }
  );

  const signingData = await signingResponse.json().catch(() => ({}));
  if (!signingResponse.ok || !signingData.success) {
    throw new Error(
      signingData.message ||
        "The server could not authorize this verification document upload."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signingData.apiKey);
  formData.append("timestamp", signingData.params.timestamp);
  formData.append("folder", signingData.params.folder);
  formData.append("public_id", signingData.params.public_id);
  formData.append("overwrite", signingData.params.overwrite);
  formData.append("type", signingData.params.type);
  formData.append("unique_filename", signingData.params.unique_filename);
  formData.append("use_filename", signingData.params.use_filename);
  formData.append("signature", signingData.signature);

  const uploadResponse = await fetch(signingData.uploadUrl, {
    method: "POST",
    body: formData,
  });

  const uploadData = await uploadResponse.json().catch(() => ({}));
  if (!uploadResponse.ok || !uploadData.public_id) {
    console.error("Cloudinary verification document upload response:", uploadData);
    throw new Error(
      uploadData.error?.message ||
        "Cloudinary could not complete the verification document upload."
    );
  }

  return {
    publicId: uploadData.public_id,
    resourceType: uploadData.resource_type || signingData.resourceType,
    assetId: uploadData.asset_id || "",
    originalFilename: uploadData.original_filename || file.name,
  };
}

export async function getVerificationDocumentAccess(verificationId, publicId) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Please log in again to access verification documents.");
  }

  const token = await user.getIdToken();
  const response = await fetch(
    `${IFSE_API_BASE}/api/media/verification-document-access`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ verificationId, publicId }),
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success || !data.downloadUrl) {
    throw new Error(data.message || "Unable to authorize this document.");
  }

  return data;
}
