import DashboardLayout from "../components/DashboardLayout";

function VerificationManager() {
return (
<DashboardLayout>
<div
style={{
color: "white",
}}
>
<h1
style={{
marginBottom: "24px",
}}
>
✅ Verification Manager
</h1>

    <div style={card}>
      🕒 Pending Verifications
    </div>

    <div style={card}>
      ✅ Approved Verifications
    </div>

    <div style={card}>
      ❌ Rejected Verifications
    </div>

    <div style={card}>
      👤 Creator Verification
    </div>

    <div style={card}>
      🏢 Organization Verification
    </div>

    <div style={card}>
      💼 Enterprise Verification
    </div>

    <div style={card}>
      🏛 Government Verification
    </div>

    <div style={card}>
      💰 Verification Revenue
    </div>

    <div style={card}>
      📊 Verification Analytics
    </div>

    <div style={card}>
      ⭐ Verified Users Directory
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

export default VerificationManager;
