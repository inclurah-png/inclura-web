import MobileNav from "../components/MobileNav";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Rightbar from "../components/Rightbar";

function Dashboard() {
  return (
    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        color: "white",
        paddingBottom: "90px",
      }}
    >
      <Topbar />

      {/* Main Layout */}
      <div
        style={{
          display: "flex",
          width: "100%",
        }}
      >
        {/* Desktop Sidebar */}
        <div
          className="desktop-sidebar"
          style={{
            display: window.innerWidth > 900 ? "block" : "none",
          }}
        >
          <Sidebar />
        </div>

        {/* Feed */}
        <div
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          <Feed />
        </div>

        {/* Desktop Rightbar */}
        <div
          className="desktop-rightbar"
          style={{
            display: window.innerWidth > 1100 ? "block" : "none",
          }}
        >
          <Rightbar />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}

export default Dashboard;
