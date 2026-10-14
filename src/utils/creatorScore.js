import { auth } from "../firebase";

const API_BASE_URL = (
  import.meta.env.VITE_AI_BACKEND_URL || ""
).replace(/\/+$/, "");

const CREATOR_SCORE_ENDPOINT =
  `${API_BASE_URL}/api/creator-score/award`;

async function awardActivity(uid, activityType, activityId) {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be signed in to record creator activity.");
  }

  if (currentUser.uid !== uid) {
    throw new Error(
      "You cannot record activity for another user."
    );
  }

  if (
    typeof activityId !== "string" ||
    !activityId.trim()
  ) {
    throw new Error(
      "A valid activity ID is required to record creator activity."
    );
  }

  if (!API_BASE_URL) {
    throw new Error(
      "The Inclura backend URL is not configured."
    );
  }

  // Obtain a Firebase ID token for backend verification.
  const idToken = await currentUser.getIdToken();

  let response;

  try {
    response = await fetch(CREATOR_SCORE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        activityType,
        activityId: activityId.trim(),
      }),
    });
  } catch {
    throw new Error(
      "Unable to connect to Inclura. Please check your connection and try again."
    );
  }

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "The Inclura backend returned an invalid response."
    );
  }

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message ||
        `Creator-score request failed (${response.status}).`
    );
  }

  return result;
}

export function addVideoPost(uid, postId) {
  return awardActivity(uid, "video_post", postId);
}

export function addTextPost(uid, postId) {
  return awardActivity(uid, "text_post", postId);
}

export function addCrossPost(uid, crossPostId) {
  return awardActivity(uid, "cross_post", crossPostId);
}

export function addComment(uid, commentId) {
  return awardActivity(uid, "comment", commentId);
}
