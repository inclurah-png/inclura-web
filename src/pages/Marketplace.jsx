import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import DashboardLayout from "../components/DashboardLayout";
import { db } from "../firebase";

function Marketplace() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadListings() {
    setLoading(true); setError("");
    try {
      const snap = await getDocs(collection(db, "marketplaceListings"));
      setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Marketplace listings load failed:", e);
      setError("Marketplace listings could not be loaded. Please try again.");
    } finally { setLoading(false); }
  }

  useEffect(() => { loadListings(); }, []);

  const categories = ["Products", "Accessibility Equipment", "Creator Stores", "Services"];
  return (
    <DashboardLayout>
      <main style={page}>
        <h1>🛒 Marketplace</h1>
        <p style={muted}>Browse the listings currently published in Inclura's marketplace.</p>
        <button type="button" onClick={loadListings} disabled={loading} style={button}>
          {loading ? "Loading..." : "↻ Refresh marketplace"}
        </button>
        {error && <div style={errorStyle}>{error}</div>}
        <section style={categoryGrid}>
          {categories.map((c) => <div key={c} style={categoryCard}><strong>{c}</strong></div>)}
        </section>
        {!loading && !error && listings.length === 0 && (
          <div style={empty}><h2>No listings yet</h2><p style={muted}>Published marketplace items will appear here.</p></div>
        )}
        <section style={grid}>
          {listings.map((item) => (
            <article key={item.id} style={card}>
              {item.imageUrl && <img src={item.imageUrl} alt={item.title || "Marketplace item"} style={image}/>}
              <h2 style={{fontSize:18,margin:"8px 0"}}>{item.title || item.name || "Untitled listing"}</h2>
              <p style={muted}>{item.description || "No description provided."}</p>
              <div style={{fontWeight:800}}>
                {item.price != null ? (item.currency || "₦") + Number(item.price).toLocaleString() : "Price not specified"}
              </div>
              <div style={status}>{item.status || "published"}</div>
            </article>
          ))}
        </section>
      </main>
    </DashboardLayout>
  );
}
const page={color:"white",maxWidth:"1100px",margin:"0 auto"};
const muted={color:"#cbd5e1",lineHeight:1.6};
const button={border:"1px solid #d4af37",background:"#064e3b",color:"white",borderRadius:10,padding:"10px 14px",fontWeight:700,cursor:"pointer",margin:"10px 0 18px"};
const categoryGrid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginBottom:18};
const categoryCard={background:"#0f172a",border:"1px solid #334155",padding:18,borderRadius:14};
const grid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:14};
const card={background:"#0f172a",border:"1px solid #334155",padding:18,borderRadius:16};
const image={width:"100%",height:170,objectFit:"cover",borderRadius:12};
const status={display:"inline-block",marginTop:10,padding:"4px 8px",borderRadius:8,background:"#064e3b",fontSize:12};
const empty={...card,marginTop:10};
const errorStyle={background:"#451a1a",border:"1px solid #991b1b",color:"#fecaca",borderRadius:12,padding:14,margin:"10px 0 16px"};
export default Marketplace;