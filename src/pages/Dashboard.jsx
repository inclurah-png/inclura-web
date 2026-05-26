import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Rightbar from "../components/Rightbar";

function Dashboard() {
  return (
    <div
      style={{
        display: "flex",
        background: "#020617",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Sidebar />
      <Feed />
      <Rightbar />
    </div>
  );
}

export default Dashboard;

