import { useEffect, useState } from "react";
import {
  addDoc, collection, getDocs, query, serverTimestamp, where
} from "firebase/firestore";
import DashboardLayout from "../components/DashboardLayout";
import { auth, db } from "../firebase";

function AdvertiserDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", type: "image", budget: "",
    country: "Nigeria", state: "", city: "", minAge: "18", maxAge: "65",
    accessibilityAudience: "",
  });

  async function loadCampaigns() {
    const user = auth.currentUser;
    if (!user) return;
    setLoading(true);
    try {
      const snapshot = await getDocs(query(
        collection(db, "advertisements"),
        where("advertiserId", "==", user.uid)
      ));
      setCampaigns(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Advertiser campaigns load failed:", error);
      setMessage("Campaign records could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCampaigns(); }, []);

  async function createCampaign(event) {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      setMessage("Please sign in again.");
      return;
    }
    if (!form.title.trim() || !form.description.trim() || Number(form.budget) <= 0) {
      setMessage("Enter a campaign title, description and a budget greater than zero.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await addDoc(collection(db, "advertisements"), {
        advertiserId: user.uid,
        advertiserEmail: user.email || "",
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        budget: Number(form.budget),
        targeting: {
          country: form.country.trim(),
          state: form.state.trim(),
          city: form.city.trim(),
          minAge: Number(form.minAge) || 18,
          maxAge: Number(form.maxAge) || 65,
          accessibilityAudience: form.accessibilityAudience.trim(),
        },
        status: "pending",
        impressions: 0,
        clicks: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setForm({
        title: "", description: "", type: "image", budget: "",
        country: "Nigeria", state: "", city: "", minAge: "18", maxAge: "65",
        accessibilityAudience: "",
      });
      setMessage("Campaign submitted for administrator approval.");
      await loadCampaigns();
    } catch (error) {
      console.error("Campaign creation failed:", error);
      setMessage("Campaign could not be submitted. Check your account permissions.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout>
      <main style={{ color: "white", maxWidth: "1100px", margin: "0 auto" }}>
        <h1>📢 Advertiser Dashboard</h1>
        <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
          Create campaigns, define privacy-aware targeting, and track submission status.
        </p>

        <form onSubmit={createCampaign} style={card}>
          <h2 style={{ marginTop: 0 }}>➕ Create Campaign</h2>
          <div style={grid}>
            <input required placeholder="Campaign title" value={form.title} onChange={e => setForm({...form, title:e.target.value})} style={input} />
            <select value={form.type} onChange={e => setForm({...form, type:e.target.value})} style={input}>
              <option value="image">Image advertisement</option>
              <option value="video">Video advertisement</option>
              <option value="text">Text advertisement</option>
            </select>
            <input required type="number" min="1" placeholder="Campaign budget" value={form.budget} onChange={e => setForm({...form, budget:e.target.value})} style={input} />
            <input placeholder="Country" value={form.country} onChange={e => setForm({...form, country:e.target.value})} style={input} />
            <input placeholder="State" value={form.state} onChange={e => setForm({...form, state:e.target.value})} style={input} />
            <input placeholder="City" value={form.city} onChange={e => setForm({...form, city:e.target.value})} style={input} />
            <input type="number" min="13" max="100" placeholder="Minimum age" value={form.minAge} onChange={e => setForm({...form, minAge:e.target.value})} style={input} />
            <input type="number" min="13" max="100" placeholder="Maximum age" value={form.maxAge} onChange={e => setForm({...form, maxAge:e.target.value})} style={input} />
          </div>
          <input placeholder="Accessibility audience (optional)" value={form.accessibilityAudience} onChange={e => setForm({...form, accessibilityAudience:e.target.value})} style={{...input, marginTop:"12px"}} />
          <textarea required placeholder="Campaign description" value={form.description} onChange={e => setForm({...form, description:e.target.value})} style={{...input, marginTop:"12px", minHeight:"100px"}} />
          <button type="submit" disabled={saving} style={buttonStyle}>{saving ? "Submitting..." : "Submit for approval"}</button>
          {message && <p role="status" style={{ color:"#cbd5e1" }}>{message}</p>}
        </form>

        <section style={{ marginTop:"24px" }}>
          <h2>📈 My Campaigns</h2>
          {loading && <p>Loading campaign records...</p>}
          {!loading && campaigns.length === 0 && <div style={card}><p style={{color:"#cbd5e1"}}>No campaign submissions yet.</p></div>}
          {!loading && campaigns.map(c => (
            <article key={c.id} style={card}>
              <h3 style={{marginTop:0}}>{c.title}</h3>
              <p style={{color:"#cbd5e1"}}>{c.description}</p>
              <div style={stats}>
                <span>Status: <strong>{c.status || "pending"}</strong></span>
                <span>Budget: {Number(c.budget || 0).toLocaleString()}</span>
                <span>Impressions: {Number(c.impressions || 0).toLocaleString()}</span>
                <span>Clicks: {Number(c.clicks || 0).toLocaleString()}</span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </DashboardLayout>
  );
}
const card={background:"#0f172a",padding:"24px",borderRadius:"20px",marginBottom:"20px",border:"1px solid #334155"};
const grid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"12px"};
const input={width:"100%",boxSizing:"border-box",background:"#111827",color:"white",border:"1px solid #334155",borderRadius:"10px",padding:"11px"};
const buttonStyle={background:"#38bdf8",color:"#020617",border:"none",borderRadius:"10px",padding:"12px 18px",fontWeight:"800",cursor:"pointer",marginTop:"14px"};
const stats={display:"flex",flexWrap:"wrap",gap:"16px",color:"#cbd5e1",fontSize:"14px"};
export default AdvertiserDashboard;
