import DashboardLayout from "../components/DashboardLayout";

const opportunities = [
  { title: "Creator profile", description: "Build a clear profile that helps communities discover your work." },
  { title: "Content and community", description: "Publish accessible content, grow connections and participate meaningfully." },
  { title: "Brand and organization connections", description: "Explore collaboration opportunities with brands and organizations." },
  { title: "Creator analytics", description: "Review engagement and audience activity without financial balances." },
];

function CreatorMonetization() {
  return (
    <DashboardLayout>
      <main style={page} aria-labelledby="creator-opportunities-title">
        <h1 id="creator-opportunities-title">Creator Opportunities</h1>
        <section style={notice}>
          <strong>Important financial boundary</strong>
          <p style={{ marginBottom: 0 }}>
            Inclura does not collect, hold, store, transfer or pay out money for
            creators. This area provides non-financial creator tools and
            opportunity information only. Any independent agreement between
            users and third parties is outside Inclura.
          </p>
        </section>
        <section style={grid} aria-label="Creator tools and opportunities">
          {opportunities.map((item) => (
            <article key={item.title} style={card}>
              <h2 style={{ marginTop: 0, fontSize: 19 }}>{item.title}</h2>
              <p style={muted}>{item.description}</p>
            </article>
          ))}
        </section>
      </main>
    </DashboardLayout>
  );
}

const page = { color: "white", maxWidth: "1100px", margin: "0 auto" };
const notice = { background: "#0f172a", border: "1px solid #d4af37", borderRadius: "16px", padding: "18px", margin: "18px 0", lineHeight: 1.7 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", gap: "14px" };
const card = { background: "#0f172a", border: "1px solid #334155", borderRadius: "16px", padding: "20px" };
const muted = { color: "#cbd5e1", lineHeight: 1.65 };

export default CreatorMonetization;
