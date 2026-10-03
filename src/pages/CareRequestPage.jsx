import DashboardLayout from "../components/DashboardLayout";

function CareRequestPage() {
  return (
    <DashboardLayout>
      <main
        style={{
          color: "white",
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        <h1>Create a Care Request</h1>

        <p style={{ color: "#cbd5e1" }}>
          Care Request page is loading correctly.
        </p>

        <div
          style={{
            background: "#0f172a",
            padding: "24px",
            borderRadius: "20px",
            marginTop: "24px",
          }}
        >
          <h2>Care Request Test</h2>

          <p>
            This is a temporary rendering test for the
            Care-Gigs request route.
          </p>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default CareRequestPage;
