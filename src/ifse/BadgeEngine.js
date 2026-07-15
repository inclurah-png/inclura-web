// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Badge Engine
// =======================================================

export function generateBadge(request) {

  let badge = null;

  if (request.status === "approved") {

    switch (request.accountType) {

      case "creator":
        badge = "Verified Creator";
        break;

      case "startup":
        badge = "Verified Startup";
        break;

      case "business":
        badge = "Verified Business";
        break;

      case "limited_company":
        badge = "Verified Limited Company";
        break;

      case "plc":
        badge = "Verified PLC";
        break;

      default:
        badge = "Verified";

    }

  }

  return {

    engine: "Badge Engine",

    badge,

    generated: badge !== null,

  };

}
