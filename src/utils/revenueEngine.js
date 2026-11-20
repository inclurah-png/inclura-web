// Legacy financial engine disabled.
// Inclura does not collect, hold, record, distribute or pay out user funds.
// Exports remain available only to prevent stale imports from breaking the app.
const disabledResult = () => ({
  disabled: true,
  reason: "Inclura does not provide money-handling or payout services.",
});

export async function addCreatorRevenue() {
  return disabledResult();
}

export async function addMarketplaceRevenue() {
  return disabledResult();
}

export async function addPlatformServiceRevenue() {
  return disabledResult();
}

export async function creditCreatorWallet() {
  return disabledResult();
}

export async function recordTransaction() {
  return disabledResult();
}

export async function distributeRevenue() {
  return disabledResult();
}
