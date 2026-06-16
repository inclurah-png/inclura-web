import DashboardLayout from "../components/DashboardLayout";

function MentorHub() {
  return (
    <DashboardLayout>
      <div style={page}>
        <h1>🎓 Mentor Hub</h1>

        <div style={card}>🔍 Find Mentors</div>
        <div style={card}>🙋 Become a Mentor</div>
        <div style={card}>📅 Sessions</div>
        <div style={card}>⭐ Top Mentors</div>
      </div>
    </DashboardLayout>
  );
}

const page = { color: "white" };

const card = {
  background: "#0f172a",
  padding: "24px",
  borderRadius: "20px",
  marginBottom: "20px",
};

export default MentorHub;
