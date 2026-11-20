// Inclura does not operate creator balances or payout services.
// Keep this legacy export inert so any old caller cannot create a payout.
export async function runMonthlyPayout() {
  return {
    disabled: true,
    reason: "Inclura does not hold, transfer or pay out user funds.",
  };
}
