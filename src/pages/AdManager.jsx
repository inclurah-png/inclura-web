import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

function AdManager() {
  const sections = [
    { title:"Create Advertisement", icon:"➕", description:"Create and submit an advertisement for moderation.", to:"/advertiser-dashboard" },
    { title:"Ad Analytics", icon:"📊", description:"Review recorded impressions and clicks for submitted campaigns.", to:"/advertiser-dashboard" },
    { title:"Audience Targeting", icon:"🎯", description:"Define country, state, city, age and accessibility targeting when creating a campaign.", to:"/advertiser-dashboard" },
    { title:"Active Campaigns", icon:"📈", description:"Review campaigns that have passed moderation.", to:"/advertiser-dashboard" },
    { title:"Ad Spend", icon:"💰", description:"Review the budgets recorded against your campaign submissions.", to:"/advertiser-dashboard" },
    { title:"Ad Approval Queue", icon:"📋", description:"Administrators can review and approve or reject submitted advertisements.", to:"/ad-approval" },
  ];

  return (
    <DashboardLayout>
      <main style={{color:"white",padding:"8px",maxWidth:"1000px"}}>
        <h1>📢 Ad Manager</h1>
        <p style={{color:"#cbd5e1",lineHeight:1.6}}>
          Connected advertising workspace. Campaign submissions and moderation decisions are stored in the Inclura Firestore workflow.
        </p>
        {sections.map(section=>(
          <Link key={section.title} to={section.to} style={{textDecoration:"none",color:"inherit"}}>
            <section style={card}>
              <h2 style={{fontSize:"18px",marginTop:0}}>{section.icon} {section.title}</h2>
              <p style={{color:"#cbd5e1",lineHeight:1.6}}>{section.description}</p>
              <span style={linkStyle}>Open {section.title} →</span>
            </section>
          </Link>
        ))}
      </main>
    </DashboardLayout>
  );
}
const card={background:"#0f172a",padding:"22px",borderRadius:"16px",border:"1px solid #334155",marginBottom:"16px"};
const linkStyle={display:"inline-block",color:"#38bdf8",fontWeight:"800"};
export default AdManager;
