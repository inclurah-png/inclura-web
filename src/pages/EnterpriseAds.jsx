import { useEffect, useState } from "react";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import DashboardLayout from "../components/DashboardLayout";
import { auth, db } from "../firebase";

function EnterpriseAds() {
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({ title:"", description:"", budget:"" });
  const [message, setMessage] = useState("");

  async function loadCampaigns() {
    const user=auth.currentUser;
    if (!user) return;
    try {
      const snapshot=await getDocs(query(
        collection(db,"enterpriseCampaigns"),
        where("ownerId","==",user.uid)
      ));
      setCampaigns(snapshot.docs.map(d=>({id:d.id,...d.data()})));
    } catch(error) {
      console.error("Enterprise campaigns load failed:",error);
      setMessage("Enterprise campaign records could not be loaded.");
    }
  }

  useEffect(()=>{loadCampaigns();},[]);

  async function createCampaign(event) {
    event.preventDefault();
    const user=auth.currentUser;
    if (!user) return;
    if (!form.title.trim() || Number(form.budget)<=0) {
      setMessage("Enter a campaign title and a budget greater than zero.");
      return;
    }
    try {
      await addDoc(collection(db,"enterpriseCampaigns"),{
        ownerId:user.uid,
        ownerEmail:user.email||"",
        title:form.title.trim(),
        description:form.description.trim(),
        budget:Number(form.budget),
        status:"pending",
        createdAt:serverTimestamp(),
        updatedAt:serverTimestamp(),
      });
      setForm({title:"",description:"",budget:""});
      setMessage("Enterprise campaign submitted.");
      await loadCampaigns();
    } catch(error) {
      console.error("Enterprise campaign creation failed:",error);
      setMessage("Campaign creation is not permitted for this account yet.");
    }
  }

  return (
    <DashboardLayout>
      <main style={{color:"white",maxWidth:"1000px",margin:"0 auto"}}>
        <h1>🏢 Enterprise Ads</h1>
        <p style={{color:"#cbd5e1",lineHeight:1.6}}>
          Create and review enterprise advertising campaigns from the connected Inclura workspace.
        </p>
        <form onSubmit={createCampaign} style={card}>
          <h2 style={{marginTop:0}}>➕ Create Enterprise Campaign</h2>
          <input required placeholder="Campaign title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={input}/>
          <textarea placeholder="Campaign description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{...input,minHeight:"90px",marginTop:"10px"}}/>
          <input required type="number" min="1" placeholder="Campaign budget" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} style={{...input,marginTop:"10px"}}/>
          <button type="submit" style={button}>Submit campaign</button>
          {message&&<p role="status" style={{color:"#cbd5e1"}}>{message}</p>}
        </form>
        <section style={{marginTop:"24px"}}>
          <h2>📢 Submitted campaigns</h2>
          {campaigns.length===0?<div style={card}><p style={{color:"#cbd5e1"}}>No enterprise campaigns have been submitted yet.</p></div>:
            campaigns.map(c=><article key={c.id} style={card}><h3 style={{marginTop:0}}>{c.title}</h3><p style={{color:"#cbd5e1"}}>{c.description}</p><div>Status: <strong>{c.status||"pending"}</strong> · Budget: {Number(c.budget||0).toLocaleString()}</div></article>)}
        </section>
      </main>
    </DashboardLayout>
  );
}
const card={background:"#0f172a",padding:"24px",borderRadius:"20px",marginBottom:"20px",border:"1px solid #334155"};
const input={width:"100%",boxSizing:"border-box",background:"#111827",color:"white",border:"1px solid #334155",borderRadius:"10px",padding:"11px"};
const button={background:"#38bdf8",color:"#020617",border:"none",borderRadius:"10px",padding:"12px 18px",fontWeight:"800",cursor:"pointer",marginTop:"12px"};
export default EnterpriseAds;
