import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import DashboardLayout from "../components/DashboardLayout";
import { auth, db } from "../firebase";

function CreatorEarnings() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEarnings() {
    const uid = auth.currentUser?.uid;
    if (!uid) { setError("Please sign in to view creator earnings."); setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const [walletSnap, txSnap] = await Promise.all([
        getDoc(doc(db, "creatorWallets", uid)),
        getDocs(query(collection(db, "creatorTransactions"), where("uid", "==", uid))),
      ]);
      setWallet(walletSnap.exists() ? walletSnap.data() : {});
      setTransactions(txSnap.docs.map((d) => ({ id:d.id, ...d.data() })));
    } catch (e) {
      console.error("Creator earnings load failed:", e);
      setError("Creator earnings could not be loaded.");
    } finally { setLoading(false); }
  }

  useEffect(() => { loadEarnings(); }, []);
  const completed=transactions.filter(t=>t.status==="completed");
  const totalRecorded=completed.reduce((n,t)=>n+Number(t.amount||0),0);
  const currency=wallet?.currency || "₦";
  return (
    <DashboardLayout>
      <main style={page}>
        <h1>💵 Creator Earnings</h1>
        <p style={muted}>Verified creator-wallet and transaction records already stored by Inclura.</p>
        <button type="button" onClick={loadEarnings} disabled={loading} style={button}>{loading ? "Refreshing..." : "↻ Refresh earnings"}</button>
        {error && <div style={errorStyle}>{error}</div>}
        {!loading && (
          <>
            <section style={grid}>
              <Card title="Available Balance" value={currency + Number(wallet?.availableBalance||0).toLocaleString()}/>
              <Card title="Pending Earnings" value={currency + Number(wallet?.pendingBalance||0).toLocaleString()}/>
              <Card title="Lifetime Earnings" value={currency + Number(wallet?.lifetimeEarnings||totalRecorded).toLocaleString()}/>
              <Card title="Recorded Transactions" value={completed.length.toLocaleString()}/>
            </section>
            <section style={{...card,marginTop:16}}>
              <h2 style={{marginTop:0}}>Revenue Sources</h2>
              {completed.length===0 ? <p style={muted}>No completed creator transactions have been recorded yet.</p> :
                <div>{completed.slice(0,10).map(t=><div key={t.id} style={row}><span>{t.source || "Creator revenue"} — {t.description || "Transaction"}</span><strong>{currency}{Number(t.amount||0).toLocaleString()}</strong></div>)}</div>}
            </section>
          </>
        )}
      </main>
    </DashboardLayout>
  );
}
function Card({title,value}){return <article style={card}><div style={muted}>{title}</div><strong style={{fontSize:25,display:"block",marginTop:8}}>{value}</strong></article>}
const page={color:"white",maxWidth:"1100px",margin:"0 auto"};
const muted={color:"#cbd5e1",lineHeight:1.6};
const grid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14};
const card={background:"#0f172a",border:"1px solid #334155",padding:20,borderRadius:16};
const row={display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap",padding:"12px 0",borderBottom:"1px solid #334155"};
const button={border:"1px solid #d4af37",background:"#064e3b",color:"white",borderRadius:10,padding:"10px 14px",fontWeight:700,cursor:"pointer",margin:"10px 0 18px"};
const errorStyle={background:"#451a1a",border:"1px solid #991b1b",color:"#fecaca",borderRadius:12,padding:14,margin:"10px 0 16px"};
export default CreatorEarnings;