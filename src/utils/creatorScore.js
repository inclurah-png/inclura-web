async function awardActivity(uid, activityType, activityId) {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be signed in to record creator activity.");
  }

  if (currentUser.uid !== uid) {
    throw new Error("You cannot record activity for another user.");
  }

  if (typeof activityId !== "string" || !activityId.trim()) {
    throw new Error("A valid activity ID is required to record creator activity.");
  }

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

    if (!response.ok) {
      const errorDetail = await response.json();
      throw new Error(
        errorDetail.detail || `Request failed with status ${response.status}.`
      );
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error in awarding activity:", error);
    throw new Error("Unable to connect to Inclura's creator-scoring service.");
  }
}
