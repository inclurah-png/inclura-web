import DashboardLayout from "../components/DashboardLayout";

function CreatorEarnings() {
  return (
    <DashboardLayout>
      <main style={page} aria-labelledby="creator-activity-title">
        <h1 id="creator-activity-title">Creator Activity</h1>
        <section style={card}>
          <h2 style={{ marginTop: 0 }}>Inclura financial boundary</h2>
          <p style={muted}>
            Inclura does not hold, receive, store, transfer or pay out user funds.
            Creator balances, earnings records, withdrawals and payout services are
            not provided by Inclura.
          </p>
          <p style={muted}>
            You can continue building your presence through content, community
            participation, creator analytics and non-financial opportunities.
          </p>
        </section>
      </main>
    </DashboardLayout>
  );
}

const page = { color: "white", maxWidth: "1000px", margin: "0 auto" };
const card = {
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "18px",
  padding: "22px",
  lineHeight: 1.7,
};
const muted = { color: "#cbd5e1", lineHeight: 1.7 };

export default CreatorEarnings;
