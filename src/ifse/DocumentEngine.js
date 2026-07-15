// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Document Verification Engine
// =======================================================

export function evaluateDocuments(request) {

  let score = 0;

  const issues = [];

  // Uploaded document
  if (request.documentName) {
    score += 40;
  } else {
    issues.push("Verification document missing");
  }

  // Document URL
  if (request.documentUrl) {
    score += 30;
  } else {
    issues.push("Document file not uploaded");
  }

  // Verification category
  if (request.accountType) {
    score += 15;
  }

  // Organization
  if (request.organizationName) {
    score += 15;
  }

  return {

    engine: "Document Engine",

    score,

    passed: score >= 60,

    issues,

  };

}
