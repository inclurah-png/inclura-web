// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Financial Verification Engine
// =======================================================

export function evaluateFinancial(request) {

  let verified = false;

  const issues = [];

  if (
    request.financialLicense &&
    request.financialAuthority
  ) {

    verified = true;

  } else {

    issues.push(
      "Financial verification information incomplete"
    );

  }

  return {

    engine: "Financial Verification Engine",

    verified,

    financialLicense:
      request.financialLicense || null,

    financialAuthority:
      request.financialAuthority || null,

    institutionType:
      request.financialInstitutionType || null,

    issues,

  };

}
