import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { onAuthStateChanged } from "firebase/auth";
import { WalletCards, ArrowUpCircle, ArrowDownCircle, Send, ReceiptText, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { auth } from "../firebase";

const API_BASE_URL = (
  import.meta.env.VITE_IFSE_IDENTITY_BACKEND_URL ||
  "https://inclura-ifse-backend.onrender.com"
).replace(/\/+$/, "");

function Wallet() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFinancialData(user) {
      try {
        setLoading(true);
        setTransactionsLoading(true);
        setError("");

        const token = await user.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [overviewResponse, transactionsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/wallet/overview`, { headers }),
          fetch(`${API_BASE_URL}/api/wallet/transactions?limit=25`, { headers }),
        ]);

        const overview = await overviewResponse.json();
        const transactionData = await transactionsResponse.json();

        if (!overviewResponse.ok || !overview.success) {
          throw new Error(overview.message || "Wallet overview could not be loaded.");
        }

        if (!cancelled) {
          setWallet(overview.wallet || null);
          setTransactions(
            transactionData.success && Array.isArray(transactionData.transactions)
              ? transactionData.transactions
              : []
          );
          setLoading(false);
          setTransactionsLoading(false);
        }
      } catch (loadError) {
        console.error("Wallet API error:", loadError);
        if (!cancelled) {
          setError(t("walletLoadError"));
          setWallet(null);
          setTransactions([]);
          setLoading(false);
          setTransactionsLoading(false);
        }
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setWallet(null);
        setTransactions([]);
        setLoading(false);
        setTransactionsLoading(false);
        setError(t("walletLoadError"));
        return;
      }
      loadFinancialData(user);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [t]);

  const isInitialized = wallet?.status === "active";
  const currency = wallet?.currency || "NGN";

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") {
      return t("walletCurrencyUnavailable");
    }
    const numeric = Number(value);
    return Number.isFinite(numeric)
      ? `₦${numeric.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : t("walletCurrencyUnavailable");
  };

  const actions = [
    {
      label: t("walletTopUp"),
      description: t("walletTopUpDescription"),
      icon: ArrowUpCircle,
      path: "/pay-topup",
    },
    {
      label: t("walletWithdraw"),
      description: t("walletWithdrawDescription"),
      icon: ArrowDownCircle,
      path: "/withdraw",
    },
    {
      label: t("walletTransfer"),
      description: t("walletTransferDescription"),
      icon: Send,
      path: "/transfer",
    },
    {
      label: t("walletTransactions"),
      description: t("walletTransactionsDescription"),
      icon: ReceiptText,
      path: "/transactions",
    },
  ];

  return (
    <DashboardLayout>
      <main
        aria-label={t("walletAccessibilityLabel")}
        style={{ color: "white", maxWidth: "1100px", margin: "0 auto", paddingBottom: "24px" }}
      >
        <header style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <WalletCards aria-hidden="true" size={30} />
            <div>
              <h1 style={{ margin: 0 }}>{t("walletTitle")}</h1>
              <p style={{ margin: "6px 0 0", color: "#cbd5e1" }}>
                {t("walletBalance")}
              </p>
            </div>
          </div>
        </header>

        {error && (
          <div role="alert" style={alertStyle}>
            <AlertCircle aria-hidden="true" size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div role="status" aria-live="polite" style={statusStyle}>
            <Loader2 aria-hidden="true" size={20} />
            <span>{t("walletLoading")}</span>
          </div>
        ) : (
          <>
            {!isInitialized && (
              <section style={securityCard} aria-label={t("walletAccessibilityLabel")}>
                <ShieldCheck aria-hidden="true" size={24} />
                <div>
                  <strong>Secure financial setup</strong>
                  <p style={{ margin: "6px 0 0", color: "#cbd5e1" }}>
                    Your wallet is not funded or initialized yet. No balance is being invented or changed in the browser.
                    Payment-provider settlement will be connected before real money can enter or leave Inclura.
                  </p>
                </div>
              </section>
            )}

            <section aria-label={t("walletBalance")} style={gridStyle}>
              <article style={walletCard} aria-label={`${currency}: ${formatMoney(wallet?.availableBalance)}`}>
                <div style={currencyHeader}>
                  <span style={currencyBadge}>{currency}</span>
                  <span style={{ color: "#94a3b8", fontWeight: 700 }}>{t("walletBalance")}</span>
                </div>
                <strong style={balanceStyle}>{formatMoney(wallet?.availableBalance)}</strong>
              </article>

              <article style={walletCard}>
                <div style={currencyHeader}>
                  <span style={currencyBadge}>Pending</span>
                  <span style={{ color: "#94a3b8", fontWeight: 700 }}>Settlement</span>
                </div>
                <strong style={balanceStyle}>{formatMoney(wallet?.pendingBalance)}</strong>
              </article>

              <article style={walletCard}>
                <div style={currencyHeader}>
                  <span style={currencyBadge}>Creator</span>
                  <span style={{ color: "#94a3b8", fontWeight: 700 }}>Earnings</span>
                </div>
                <strong style={balanceStyle}>{formatMoney(wallet?.creatorEarnings)}</strong>
              </article>

              <article style={walletCard}>
                <div style={currencyHeader}>
                  <span style={currencyBadge}>Seller</span>
                  <span style={{ color: "#94a3b8", fontWeight: 700 }}>Marketplace</span>
                </div>
                <strong style={balanceStyle}>{formatMoney(wallet?.marketplaceEarnings)}</strong>
              </article>
            </section>

            <section aria-label={t("walletAccessibilityLabel")} style={actionGrid}>
              {actions.map(({ label, description, icon: Icon, path }) => (
                <button
                  key={path}
                  type="button"
                  onClick={() => navigate(path)}
                  style={actionBtn}
                  aria-label={label}
                >
                  <Icon aria-hidden="true" size={24} />
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
                    <strong>{label}</strong>
                    <small style={{ color: "#cbd5e1", textAlign: "left" }}>{description}</small>
                  </span>
                </button>
              ))}
            </section>

            <section style={historyCard} aria-label={t("walletTransactionHistory")}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ReceiptText aria-hidden="true" size={22} />
                <h2 style={{ margin: 0 }}>{t("walletTransactionHistory")}</h2>
              </div>

              {transactionsLoading ? (
                <div role="status" aria-live="polite" style={statusStyle}>
                  <Loader2 aria-hidden="true" size={20} />
                  <span>{t("walletLoading")}</span>
                </div>
              ) : transactions.length === 0 ? (
                <p style={{ color: "#94a3b8", marginBottom: 0 }}>
                  {t("walletNoTransactions")}
                </p>
              ) : (
                <div style={{ display: "grid", gap: "10px", marginTop: "16px" }}>
                  {transactions.map((transaction) => (
                    <div key={transaction.id} style={transactionRow}>
                      <div>
                        <strong>{transaction.description || transaction.type}</strong>
                        <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>
                          {transaction.status} · {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : ""}
                        </div>
                      </div>
                      <strong>{formatMoney(transaction.amount)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </DashboardLayout>
  );
}

const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: "14px", marginBottom: "20px" };
const walletCard = { background: "#0f172a", padding: "20px", borderRadius: "18px", border: "1px solid #334155" };
const currencyHeader = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "14px" };
const currencyBadge = { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "52px", height: "34px", padding: "0 10px", borderRadius: "10px", background: "#1e293b", fontWeight: 800 };
const balanceStyle = { fontSize: "28px", lineHeight: 1.2, overflowWrap: "anywhere" };
const actionGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "12px", marginBottom: "20px" };
const actionBtn = { display: "flex", alignItems: "flex-start", gap: "12px", width: "100%", minHeight: "92px", padding: "16px", borderRadius: "16px", border: "1px solid #334155", background: "#0f172a", color: "white", cursor: "pointer", textAlign: "left" };
const historyCard = { background: "#0f172a", padding: "20px", borderRadius: "18px", border: "1px solid #334155" };
const securityCard = { display: "flex", alignItems: "flex-start", gap: "12px", background: "#0f2f24", border: "1px solid #166534", padding: "16px", borderRadius: "16px", marginBottom: "20px" };
const transactionRow = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "14px 0", borderBottom: "1px solid #1e293b" };
const alertStyle = { display: "flex", alignItems: "center", gap: "10px", background: "#3f1d1d", border: "1px solid #7f1d1d", padding: "14px 16px", borderRadius: "14px", marginBottom: "16px" };
const statusStyle = { display: "flex", alignItems: "center", gap: "10px", background: "#0f172a", padding: "18px", borderRadius: "16px" };

export default Wallet;
