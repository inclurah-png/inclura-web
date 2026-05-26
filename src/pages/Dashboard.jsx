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
    }}
  >
    <Topbar />

    <div
      style={{
        display: "flex",
      }}
    >
      <Sidebar />
      <Feed />
      <Rightbar />
    </div>
  </div>
);

}

export default Dashboard;

