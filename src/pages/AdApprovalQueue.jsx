import DashboardLayout from "../components/DashboardLayout";

function AdApprovalQueue() {
return (
<DashboardLayout>
<div style={{ color: "white" }}>
<h1>📋 Ad Approval Queue</h1>

    <div style={card}>
      🕒 Pending Advertisements
    </div>

    <div style={card}>
      ✅ Approved Advertisements
    </div>

    <div style={card}>
      ❌ Rejected Advertisements
    </div>

    <div style={card}>
      ⏸ Paused Campaigns
    </div>

    <div style={card}>
      🚫 Reported Advertisements
    </div>

    <div style={card}>
      🏢 Enterprise Campaign Reviews
    </div>

    <div style={card}>
      🏛 Government Campaign Reviews
    </div>

    <div style={card}>
      📊 Ad Approval Analytics
    </div>
  </div>
</DashboardLayout>

);
}

const card = {
background: "#0f172a",
padding: "24px",
borderRadius: "20px",
marginBottom: "20px",
fontWeight: "600",
};

export default AdApprovalQueue;
