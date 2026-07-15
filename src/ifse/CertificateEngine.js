// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Certificate Engine
// =======================================================

export function generateCertificate(request) {

  const generated =
    request.status === "approved";

  return {

    engine: "Certificate Engine",

    generated,

    certificateId: generated
      ? `IFSE-${Date.now()}`
      : null,

    issuedAt: generated
      ? new Date().toISOString()
      : null,

  };

}
