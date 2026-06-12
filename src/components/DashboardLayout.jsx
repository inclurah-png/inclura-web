import DashboardSidebar from "./DashboardSidebar";

function DashboardLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        padding: "24px",
        background: "#020617",
        minHeight: "100vh",
      }}
    >
      <DashboardSidebar />

      <div
        style={{
          flex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
