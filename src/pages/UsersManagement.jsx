import DashboardLayout from "../components/DashboardLayout";

function UsersManagement() {
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
👥 Users Management
</h1>

    <div style={card}>
      👥 All Users
    </div>

    <div style={card}>
      🟢 Active Users
    </div>

    <div style={card}>
      🔴 Suspended Users
    </div>

    <div style={card}>
      🚫 Banned Users
    </div>

    <div style={card}>
      ✅ Verified Users
    </div>

    <div style={card}>
      🕒 Pending Verification
    </div>

    <div style={card}>
      🏢 Enterprise Accounts
    </div>

    <div style={card}>
      🏛 Government Accounts
    </div>

    <div style={card}>
      🎓 Mentor Accounts
    </div>

    <div style={card}>
      🤝 Caregiver Accounts
    </div>

    <div style={card}>
      💼 Employer Accounts
    </div>

    <div style={card}>
      🛒 Marketplace Sellers
    </div>

    <div style={card}>
      📢 Advertisers
    </div>

    <div style={card}>
      🚨 Reported Users
    </div>

    <div style={card}>
      📊 User Analytics
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

export default UsersManagement;
