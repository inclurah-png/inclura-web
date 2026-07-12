// =======================================================
// Inclura Currency Configuration
// =======================================================

export const DEFAULT_CURRENCY = "USD";

export const SUPPORTED_CURRENCIES = [
  "USD",
  "NGN",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
];

export const money = (amount) => ({
  currency: DEFAULT_CURRENCY,
  usd: amount,
  ngn: null,
  eur: null,
  gbp: null,
  cad: null,
  aud: null,
});

