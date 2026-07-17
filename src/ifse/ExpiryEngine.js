// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Expiry Engine
// =======================================================

export function evaluateExpiry(request) {

  const expired =
    request.expiryDate
      ? new Date(request.expiryDate) < new Date()
      : false;

  return {

    engine: "Expiry Engine",

    expired,

    expiryDate:
      request.expiryDate || null,

    requiresRenewal: expired,

  };

}
