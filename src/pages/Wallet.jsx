import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { WalletCards, ArrowUpCircle, ArrowDownCircle, Send, ReceiptText, Loader2, AlertCircle } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { auth, db } from "../firebase";

function Wallet() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsubscribeWallet = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeWallet) unsubscribeWallet();
      setError("");
      setLoading(true);
      if (!user) {
        setWallet(null);
        setLoading(false);
        setError(t("walletLoadError"));
        return;
      }
      unsubscribeWallet = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        setWallet(snapshot.exists() ? snapshot.data() : {});
        setLoading(false);
      }, (snapshotError) => {
        console.error("Wallet listener error:", snapshotError);
        setError(t("walletLoadError"));
        setLoading(false);
      });
    });
    return () => {
      unsubscribeAuth();
      if (unsubscribeWallet) unsubscribeWallet();
    };
  }, [t]);

  const balances = wallet?.walletBalances || {};
  const ngn = wallet?.walletBalance ?? balances.NGN ?? null;
  const currencies = [
    { code: "USD", symbol: "$", value: balances.USD },
    { code: "EUR", symbol: "€", value: balances.EUR },
    { code: "GBP", symbol: "£", value: balances.GBP },
    { code: "NGN", symbol: "₦", value: ngn },
  ];
  const formatBalance = (value, symbol) => {
    if (value === null || value === undefined || value === "") return t("walletCurrencyUnavailable");
    const numeric = Number(value);
    return Number.isFinite(numeric) ? symbol + numeric.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : t("walletCurrencyUnavailable");
  };
  const actions = [
    { label: t("walletTopUp"), description: t("walletTopUpDescription"), icon: ArrowUpCircle, path: "/pay-topup" },
    { label: t("walletWithdraw"), description: t("walletWithdrawDescription"), icon: ArrowDownCircle, path: "/withdraw" },
    { label: t("walletTransfer"), description: t("walletTransferDescription"), icon: Send, path: "/transfer" },
    { label: t("walletTransactions"), description: t("walletTransactionsDescription"), icon: ReceiptText, path: "/transactions" },
  ];

  return (
    <DashboardLayout>
      <main aria-label={t("walletAccessibilityLabel")} style={{ color: "white", maxWidth: "1100px", margin: "0 auto", paddingBottom: "24px" }}>
        <header style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <WalletCards aria-hidden="true" size={30} />
            <div><h1 style={{ margin: 0 }}>{t("walletTitle")}</h1><p style={{ margin: "6px 0 0", color: "#cbd5e1" }}>{t("walletBalance")}</p></div>
          </div>
        </header>
        {error && <div role="alert" style={alertStyle}><AlertCircle aria-hidden="true" size={20} /><span>{error}</span></div>}
        {loading ? (
          <div role="status" aria-live="polite" style={statusStyle}><Loader2 aria-hidden="true" size={20} /><span>{t("walletLoading")}</span></div>
        ) : (
          <>
            <section aria-label={t("walletBalance")} style={gridStyle}>
              {currencies.map(({ code, symbol, value }) => (
                <article key={code} style={walletCard} aria-label={code + ": " + formatBalance(value, symbol)}>
                  <div style={currencyHeader}><span style={currencyBadge}>{code}</span><span style={{ color: "#94a3b8", fontWeight: 700 }}>{t("walletBalance")}</span></div>
                  <strong style={balanceStyle}>{formatBalance(value, symbol)}</strong>
                </article>
              ))}
            </section>
            <section aria-label={t("walletAccessibilityLabel")} style={actionGrid}>
              {actions.map(({ label, description, icon: Icon, path }) => (
                <button key={path} type="button" onClick={() => navigate(path)} style={actionBtn} aria-label={label}>
                  <Icon aria-hidden="true" size={24} />
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}><strong>{label}</strong><small style={{ color: "#cbd5e1", textAlign: "left" }}>{description}</small></span>
                </button>
              ))}
            </section>
            <section style={historyCard} aria-label={t("walletTransactionHistory")}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><ReceiptText aria-hidden="true" size={22} /><h2 style={{ margin: 0 }}>{t("walletTransactionHistory")}</h2></div>
              <p style={{ color: "#94a3b8", marginBottom: 0 }}>{t("walletNoTransactions")}</p>
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
const alertStyle = { display: "flex", alignItems: "center", gap: "10px", background: "#3f1d1d", border: "1px solid #7f1d1d", padding: "14px 16px", borderRadius: "14px", marginBottom: "16px" };
const statusStyle = { display: "flex", alignItems: "center", gap: "10px", background: "#0f172a", padding: "18px", borderRadius: "16px" };
export default Wallet;