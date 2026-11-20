// Wallet balance analytics are disabled because Inclura does not operate
// stored-value accounts, creator balances or payout services.
export async function updateWalletInsights() {
  return {
    disabled: true,
    reason: "Inclura does not maintain user wallet balances.",
  };
}
