import Topbar from "../components/Topbar";

import Sidebar from "../components/Sidebar";

import Feed from "../components/Feed";

import Rightbar from "../components/Rightbar"; 

import MobileNav from "../components/MobileNav";

import Notifications from "../components/Notifications";

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
width: "100%",
}}
>

{/* LEFT SIDEBAR */}

<div
style={{
display:
window.innerWidth > 900
? "block"
: "none",
}}
>
<Sidebar />
</div>

{/* MAIN FEED */}

<div
style={{
flex: 1,
}}
>

<Feed />

<div
style={{
marginTop: "24px",
}}
>

<Notifications />

</div>

</div>

{/* RIGHTBAR */}

<div
style={{
display:
window.innerWidth > 1100
? "block"
: "none",
}}
>
<Rightbar />
</div>
  
<MobileNav />
  
</div>

);

}

export default Dashboard;
