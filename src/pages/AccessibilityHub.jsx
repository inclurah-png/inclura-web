import DashboardLayout from "../components/DashboardLayout";

function AccessibilityHub() {
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
          ♿ Accessibility Hub
        </h1>

        {/* Accessibility Requests */}
        <div style={card}>
          <h2>
            🆘 Accessibility Requests
          </h2>

          <p>
            Request mobility,
            hearing, speech, visual,
            caregiver, interpreter,
            transport or other support.
          </p>
        </div>

        {/* Resources */}
        <div style={card}>
          <h2>
            📚 Accessibility Resources
          </h2>

          <p>
            Discover guides,
            tools, accessibility
            services and support
            materials.
          </p>
        </div>

        {/* Directory */}
        <div style={card}>
          <h2>
            🏢 Accessibility Directory
          </h2>

          <p>
            Browse organizations,
            NGOs, hospitals,
            accessibility centers
            and support providers.
          </p>
        </div>

        {/* Community Support */}
        <div style={card}>
          <h2>
            🤝 Community Support
          </h2>

          <p>
            Connect with volunteers,
            advocates, caregivers
            and accessibility
            communities.
          </p>
        </div>

        {/* Emergency */}
        <div style={card}>
          <h2>
            🚨 Emergency Accessibility Help
          </h2>

          <p>
            Rapid accessibility
            assistance and urgent
            community support.
          </p>
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
};

export default AccessibilityHub;
