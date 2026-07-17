// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Education Verification Engine
// =======================================================

export function evaluateEducation(request) {

  let verified = false;

  const issues = [];

  if (
    request.institutionName &&
    request.educationAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Education verification information incomplete"
    );

  }

  return {

    engine: "Education Verification Engine",

    verified,

    institutionName:
      request.institutionName || null,

    educationAuthority:
      request.educationAuthority || null,

    institutionType:
      request.institutionType || null,

    issues,

  };

}
