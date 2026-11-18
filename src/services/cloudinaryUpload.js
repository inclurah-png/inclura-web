import { auth } from "../firebase";

const IFSE_API_BASE =
  import.meta.env.VITE_IFSE_API_BASE ||
  "https://inclura-ifse-backend.onrender.com";

const ALLOWED_PROFILE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export async function uploadProfilePhotoToCloudinary(file) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please log in again before uploading a photo.");
  }

  if (!ALLOWED_PROFILE_IMAGE_TYPES.has(file?.type)) {
    throw new Error("Choose a JPEG, PNG, WebP, GIF, or AVIF image.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Please choose an image smaller than 5 MB.");
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
        category: "profilePhoto",
        mimeType: file.type,
      }),
    }
  );

  const signingData = await signingResponse.json().catch(() => ({}));
  if (!signingResponse.ok || !signingData.success) {
    throw new Error(
      signingData.message || "The server could not authorize this photo upload."
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
    console.error("Cloudinary profile photo upload response:", uploadData);
    throw new Error(
      uploadData.error?.message || "Cloudinary could not complete the photo upload."
    );
  }

  return uploadData.secure_url;
}
