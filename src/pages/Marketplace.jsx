import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import DashboardLayout from "../components/DashboardLayout";
import { db } from "../firebase";

const categories = [
  { id: "all", icon: "🛍️", label: "All listings" },
  { id: "products", icon: "📦", label: "Products" },
  { id: "accessibility", icon: "♿", label: "Accessibility equipment" },
  { id: "creators", icon: "🎨", label: "Creator stores" },
  { id: "services", icon: "🤝", label: "Services" },
];

function Marketplace() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  async function loadListings() {
    setLoading(true);
    setError("");
    try {
      const snap = await getDocs(collection(db, "marketplaceListings"));
      setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Marketplace listings load failed:", e);
      setError("Marketplace listings could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadListings(); }, []);

  function categoryFor(item) {
    const category = String(item.category || item.type || "").toLowerCase();
    const searchable = `${category} ${item.title || item.name || ""} ${item.description || ""}`.toLowerCase();
    if (/accessib|wheelchair|assistive|mobility|hearing|braille/.test(searchable)) return "accessibility";
    if (/creator|artwork|digital content|store/.test(searchable)) return "creators";
    if (/service|consult|care|lesson|repair/.test(searchable)) return "services";
    return "products";
  }

  const visibleListings = useMemo(() => {
    const term = search.trim().toLowerCase();
    return listings.filter((item) => {
      const matchesCategory = activeCategory === "all" || categoryFor(item) === activeCategory;
      const haystack = `${item.title || item.name || ""} ${item.description || ""} ${item.category || ""}`.toLowerCase();
      return matchesCategory && (!term || haystack.includes(term));
    });
  }, [listings, search, activeCategory]);

  return (
    <DashboardLayout>
      <main style={page}>
        <h1>🛒 Marketplace</h1>
        <p style={muted}>Browse listings currently published in Inclura's marketplace. Use the category shortcuts or search to narrow the results.</p>
        <div style={toolbar}>
          <label htmlFor="marketplace-search" style={srOnly}>Search marketplace listings</label>
          <input id="marketplace-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products, equipment, stores or services..." style={searchInput} />
          <button type="button" onClick={loadListings} disabled={loading} style={button} aria-label="Refresh marketplace listings">
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>
        <nav style={categoryGrid} aria-label="Marketplace categories">
          {categories.map((category) => (
            <button key={category.id} type="button" onClick={() => setActiveCategory(category.id)} aria-pressed={activeCategory === category.id} style={{ ...categoryCard, ...(activeCategory === category.id ? selectedCategory : {}) }}>
              <span aria-hidden="true" style={{ fontSize: 24 }}>{category.icon}</span>
              <strong>{category.label}</strong>
            </button>
          ))}
        </nav>
        {error && <div role="alert" style={errorStyle}>{error}</div>}
        {loading && <p role="status" style={muted}>Loading marketplace listings...</p>}
        {!loading && !error && visibleListings.length === 0 && (
          <div style={empty}>
            <h2>{listings.length ? "No matching listings" : "No listings yet"}</h2>
            <p style={muted}>{listings.length ? "Try another category or search term." : "Published marketplace items will appear here."}</p>
            {(search || activeCategory !== "all") && <button type="button" style={secondaryButton} onClick={() => { setSearch(""); setActiveCategory("all"); }}>Clear filters</button>}
          </div>
        )}
        <section style={grid} aria-label="Marketplace listings">
          {visibleListings.map((item) => (
            <article key={item.id} style={card}>
              {item.imageUrl && <img src={item.imageUrl} alt={item.title || item.name || "Marketplace item"} style={image}/>}
              <h2 style={{fontSize:18,margin:"8px 0"}}>{item.title || item.name || "Untitled listing"}</h2>
              <p style={muted}>{item.description || "No description provided."}</p>
              <div style={{fontWeight:800}}>
                {item.price != null ? (item.currency || "₦") + Number(item.price).toLocaleString() : "Price not specified"}
              </div>
              <div style={status}>{item.status || "published"}</div>
            </article>
          ))}
        </section>
        <p style={footnote}>Purchases and checkout are not enabled yet. No payment will be requested from these listings.</p>
      </main>
    </DashboardLayout>
  );
}
const page={color:"white",maxWidth:"1100px",margin:"0 auto",paddingBottom:32};
const muted={color:"#cbd5e1",lineHeight:1.6};
const toolbar={display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",margin:"14px 0"};
const searchInput={flex:"1 1 240px",minWidth:0,background:"#0f172a",border:"1px solid #475569",borderRadius:10,padding:"12px",color:"white",fontSize:16};
const button={border:"1px solid #d4af37",background:"#064e3b",color:"white",borderRadius:10,padding:"10px 14px",fontWeight:700,cursor:"pointer"};
const categoryGrid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:10,marginBottom:18};
const categoryCard={display:"flex",alignItems:"center",gap:10,textAlign:"left",background:"#0f172a",border:"1px solid #334155",color:"white",padding:14,borderRadius:14,cursor:"pointer",minHeight:64};
const selectedCategory={border:"2px solid #d4af37",background:"#123b32"};
const grid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:14};
const card={background:"#0f172a",border:"1px solid #334155",padding:18,borderRadius:16,minWidth:0};
const image={width:"100%",height:170,objectFit:"cover",borderRadius:12};
const status={display:"inline-block",marginTop:10,padding:"4px 8px",borderRadius:8,background:"#064e3b",fontSize:12};
const empty={...card,marginTop:10};
const secondaryButton={background:"#1e293b",color:"white",border:"1px solid #475569",borderRadius:10,padding:"10px 14px",cursor:"pointer"};
const errorStyle={background:"#451a1a",border:"1px solid #991b1b",color:"#fecaca",borderRadius:12,padding:14,margin:"10px 0 16px"};
const footnote={color:"#94a3b8",fontSize:13,marginTop:20};
const srOnly={position:"absolute",width:1,height:1,padding:0,margin:-1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap",border:0};
export default Marketplace;
