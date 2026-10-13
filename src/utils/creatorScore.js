import { auth } from "../firebase";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const awardCreatorActivity = httpsCallable(
  functions,
  "awardCreatorActivity"
);

async function awardActivity(uid, activityType, activityId) {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be signed in to record creator activity.");
  }

  if (currentUser.uid !== uid) {
    throw new Error("You cannot record activity for another user.");
  }

  if (
    typeof activityId !== "string" ||
    !activityId.trim()
  ) {
    throw new Error(
      "A valid activity ID is required to record creator activity."
    );
  }

  const result = await awardCreatorActivity({
    activityType,
    activityId: activityId.trim(),
  });

  return result.data;
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
