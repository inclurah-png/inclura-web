// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Notification Engine
// =======================================================

export function generateNotification(request) {

  let title = "";
  let message = "";
  let type = "info";

  switch (request.status) {

    case "approved":
      title = "Verification Approved";
      message =
        "Your verification has been approved.";
      type = "success";
      break;

    case "manual_review":
      title = "Manual Review Required";
      message =
        "Your verification is awaiting manual review.";
      type = "warning";
      break;

    case "executive_review":
      title = "Executive Review Required";
      message =
        "Your verification has been escalated for executive review.";
      type = "warning";
      break;

    default:
      title = "Verification Submitted";
      message =
        "Your verification request has been received.";
      type = "info";

  }

  return {

    engine: "Notification Engine",

    title,

    message,

    type,

    recipient:
      request.userId || null,

    createdAt:
      new Date().toISOString(),

    delivered: false,

  };

}
