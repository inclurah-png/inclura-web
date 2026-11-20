// Inclura does not distribute, credit or pay out creator funds.
// This legacy export remains inert for compatibility with older imports.
export async function distributeCreatorRevenue() {
  return {
    disabled: true,
    reason: "Inclura does not hold, transfer or pay out user funds.",
  };
}
