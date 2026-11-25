import { useEffect, useState } from "react";
import { collection, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { getIdTokenResult } from "firebase/auth";
import DashboardLayout from "../components/DashboardLayout";
import { auth, db } from "../firebase";

function AdApprovalQueue() {
  const [checkingAccess,setCheckingAccess]=useState(true);
  const [isAdmin,setIsAdmin]=useState(false);
  const [error,setError]=useState("");
  const [ads,setAds]=useState([]);
  const [loading,setLoading]=useState(false);

  async function loadAds() {
    setLoading(true);
    try {
      const snapshot=await getDocs(query(collection(db,"advertisements"),orderBy("createdAt","desc")));
      setAds(snapshot.docs.map(d=>({id:d.id,...d.data()})));
      setError("");
    } catch(error) {
      console.error("Advertisement queue load failed:",error);
      setError("Advertisement records could not be loaded.");
    } finally { setLoading(false); }
  }

  useEffect(()=>{
    let active=true;
    (async()=>{
      try {
        const user=auth.currentUser;
        if(!user){if(active)setError("Please sign in with an administrator account.");return;}
        const token=await getIdTokenResult(user,true);
        if(token.claims.admin!==true){if(active)setError("Access denied. Administrator permission is required.");return;}
        if(active){setIsAdmin(true);await loadAds();}
      } catch(error) {
        console.error("Ad approval access failed:",error);
        if(active)setError("Unable to verify administrator access or load advertisements.");
      } finally { if(active)setCheckingAccess(false); }
    })();
    return ()=>{active=false;};
  },[]);

  async function setStatus(id,status) {
    try {
      await updateDoc(doc(db,"advertisements",id),{
        status,
        reviewedBy:auth.currentUser?.uid||"",
        reviewedAt:new Date(),
        updatedAt:new Date(),
      });
      await loadAds();
    } catch(error) {
      console.error("Advertisement moderation update failed:",error);
      setError("The moderation decision could not be saved.");
    }
  }

  return (
    <DashboardLayout>
      <main style={{color:"white",maxWidth:"1100px",margin:"0 auto"}}>
        <h1>📋 Ad Approval Queue</h1>
        <p style={{color:"#cbd5e1",lineHeight:1.6}}>
          Live moderation queue for advertisement submissions. Decisions are stored in Firestore and shown to the submitting advertiser.
        </p>
        {checkingAccess&&<div style={card} role="status">Verifying administrator access...</div>}
        {!checkingAccess&&error&&<div style={{...card,background:"#451a1a",color:"#fecaca"}} role="alert">{error}</div>}
        {!checkingAccess&&isAdmin&&!error&&<>
          <div style={toolbar}>
            <span>Pending: {ads.filter(a=>a.status==="pending").length}</span>
            <span>Approved: {ads.filter(a=>a.status==="approved").length}</span>
            <span>Rejected: {ads.filter(a=>a.status==="rejected").length}</span>
            <button type="button" onClick={loadAds} disabled={loading} style={button}>{loading?"Loading...":"↻ Refresh"}</button>
          </div>
          {ads.length===0&&<div style={card}><p style={{color:"#cbd5e1"}}>No advertisement submissions are currently recorded.</p></div>}
          {ads.map(ad=><article key={ad.id} style={card}>
            <h2 style={{marginTop:0}}>{ad.title||"Untitled advertisement"}</h2>
            <p style={{color:"#cbd5e1"}}>{ad.description||"No description provided."}</p>
            <div style={meta}>
              <span>Status: <strong>{ad.status||"pending"}</strong></span>
              <span>Type: {ad.type||"text"}</span>
              <span>Budget: {Number(ad.budget||0).toLocaleString()}</span>
              <span>Target: {ad.targeting?.country||"—"} {ad.targeting?.state||""} {ad.targeting?.city||""}</span>
            </div>
            <div style={{display:"flex",gap:"10px",flexWrap:"wrap",marginTop:"14px"}}>
              <button type="button" onClick={()=>setStatus(ad.id,"approved")} style={approve}>Approve</button>
              <button type="button" onClick={()=>setStatus(ad.id,"rejected")} style={reject}>Reject</button>
              <button type="button" onClick={()=>setStatus(ad.id,"paused")} style={pause}>Pause</button>
            </div>
          </article>)}
        </>}
      </main>
    </DashboardLayout>
  );
}
const card={background:"#0f172a",padding:"22px",borderRadius:"16px",border:"1px solid #334155",marginBottom:"16px"};
const toolbar={display:"flex",gap:"18px",alignItems:"center",flexWrap:"wrap",margin:"16px 0",color:"#cbd5e1"};
const meta={display:"flex",gap:"16px",flexWrap:"wrap",color:"#cbd5e1",fontSize:"14px"};
const button={background:"#064e3b",color:"white",border:"1px solid #d4af37",borderRadius:"10px",padding:"9px 13px",fontWeight:"700",cursor:"pointer"};
const approve={...button,background:"#065f46"};
const reject={...button,background:"#7f1d1d",borderColor:"#991b1b"};
const pause={...button,background:"#78350f",borderColor:"#92400e"};
export default AdApprovalQueue;
