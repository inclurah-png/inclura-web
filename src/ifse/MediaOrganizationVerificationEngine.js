// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Media Organization Verification Engine
// =======================================================

export function evaluateMediaOrganization(request) {

  let verified = false;

  const issues = [];

  if (
    request.mediaLicense &&
    request.mediaAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Media organization verification information incomplete"
    );

  }

  return {

    engine: "Media Organization Verification Engine",

    verified,

    mediaLicense:
      request.mediaLicense || null,

    mediaAuthority:
      request.mediaAuthority || null,

    mediaType:
      request.mediaType || null,

    issues,

  };

}
