// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Licensing Engine
// =======================================================

export function evaluateLicense(request) {

  let verified = false;

  const issues = [];

  if (
    request.licenseNumber &&
    request.licenseAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "License information incomplete"
    );

  }

  return {

    engine: "Licensing Engine",

    verified,

    licenseNumber:
      request.licenseNumber || null,

    licenseAuthority:
      request.licenseAuthority || null,

    expiryDate:
      request.licenseExpiry || null,

    issues,

  };

}
