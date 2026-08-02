import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  serverTimestamp,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";
import DashboardLayout from "../components/DashboardLayout";

function ReportsAndViolations() {
const [reportStats, setReportStats] = useState({
  reportedUsers: 0,
  reportedPosts: 0,
  advertisements: 0,
  marketplace: 0,
  caregigs: 0,
  mentors: 0,
  harassment: 0,
  scam: 0,
  fakeAccounts: 0,
  contentViolations: 0,
  suspensions: 0,
  banned: 0,
  appeals: 0,
});

  useEffect(() => {

  async function loadReportStats() {

    try {

      const usersSnap = await getCountFromServer(
        query(collection(db, "reports"), where("targetType", "==", "user"))
      );

      const postsSnap = await getCountFromServer(
        query(collection(db, "reports"), where("targetType", "==", "post"))
      );

      const adsSnap = await getCountFromServer(
        query(collection(db, "reports"), where("targetType", "==", "advertisement"))
      );

      const marketSnap = await getCountFromServer(
        query(collection(db, "reports"), where("targetType", "==", "marketplace"))
      );

      const gigsSnap = await getCountFromServer(
        query(collection(db, "reports"), where("targetType", "==", "caregig"))
      );

      const mentorSnap = await getCountFromServer(
        query(collection(db, "reports"), where("targetType", "==", "mentor"))
      );

      const harassmentSnap = await getCountFromServer(
        query(collection(db, "reports"), where("category", "==", "harassment"))
      );

      const scamSnap = await getCountFromServer(
        query(collection(db, "reports"), where("category", "==", "scam"))
      );

      const fakeSnap = await getCountFromServer(
        query(collection(db, "reports"), where("category", "==", "fake_account"))
      );

      const contentSnap = await getCountFromServer(
        query(collection(db, "reports"), where("category", "==", "content"))
      );

      const suspendedSnap = await getCountFromServer(
        query(collection(db, "users"), where("status", "==", "suspended"))
      );

      const bannedSnap = await getCountFromServer(
        query(collection(db, "users"), where("status", "==", "banned"))
      );

      const appealSnap = await getCountFromServer(
        query(collection(db, "appeals"), where("status", "==", "pending"))
      );

      setReportStats({
        reportedUsers: usersSnap.data().count,
        reportedPosts: postsSnap.data().count,
        advertisements: adsSnap.data().count,
        marketplace: marketSnap.data().count,
        caregigs: gigsSnap.data().count,
        mentors: mentorSnap.data().count,
        harassment: harassmentSnap.data().count,
        scam: scamSnap.data().count,
        fakeAccounts: fakeSnap.data().count,
        contentViolations: contentSnap.data().count,
        suspensions: suspendedSnap.data().count,
        banned: bannedSnap.data().count,
        appeals: appealSnap.data().count,
      });

    } catch (err) {
      console.error("Reports Dashboard:", err);
    }

  }

  loadReportStats();

}, []);
  
async function createTestReport() {
  try {
    await addDoc(collection(db, "reports"), {
      type: "SYSTEM_PLACEHOLDER",
status: "placeholder",
createdAt: serverTimestamp(),
message: "Initial Reports collection",
systemPlaceholder: true,
    });

    alert("Reports collection initialized successfully.");

  } catch (error) {
    console.error(error);
    alert("Error creating reports collection.");
  }
}
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
🚨 Reports & Violations
</h1>

<button
  onClick={createTestReport}
  style={{
    padding: "12px 20px",
    borderRadius: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginBottom: "20px",
  }}
>
  Initialize Reports Collection
</button>

<div style={card}>
  <h3>🚨 Reported Users</h3>
  <h2>{reportStats.reportedUsers}</h2>
  <p>Reported User Accounts</p>
</div>

  <div style={card}>
  <h3>📝 Reported Posts</h3>
  <h2>{reportStats.reportedPosts}</h2>
  <p>Reported Posts</p>
</div>

    <div style={card}>
  <h3>📢 Reported Advertisements</h3>
  <h2>{reportStats.advertisements}</h2>
  <p>Advertisement Reports</p>
</div>

    <div style={card}>
  <h3>🛒 Reported Marketplace Listings</h3>
  <h2>{reportStats.marketplace}</h2>
  <p>Marketplace Reports</p>
</div>

<div style={card}>
  <h3>🤝 Reported Care-Gigs</h3>
  <h2>{reportStats.caregigs}</h2>
  <p>Care-Gig Reports</p>
</div>

    <div style={card}>
  <h3>🎓 Reported Mentors</h3>
  <h2>{reportStats.mentors}</h2>
  <p>Mentor Reports</p>
</div>

 <div style={card}>
  <h3>🚫 Harassment Reports</h3>
  <h2>{reportStats.harassment}</h2>
  <p>Harassment Cases</p>
</div>

    <div style={card}>
  <h3>⚠ Scam Reports</h3>
  <h2>{reportStats.scam}</h2>
  <p>Scam Cases</p>
</div>

<div style={card}>
  <h3>🤖 Fake Account Reports</h3>
  <h2>{reportStats.fakeAccounts}</h2>
  <p>Fake Accounts</p>
</div>

    <div style={card}>
  <h3>📵 Content Violations</h3>
  <h2>{reportStats.contentViolations}</h2>
  <p>Content Violations</p>
</div>

<div style={card}>
  <h3>⛔ Suspensions</h3>
  <h2>{reportStats.suspensions}</h2>
  <p>Suspended Accounts</p>
</div>

    <div style={card}>
  <h3>🔨 Banned Accounts</h3>
  <h2>{reportStats.banned}</h2>
  <p>Banned Accounts</p>
</div>

    <div style={card}>
  <h3>📨 Appeals & Reviews</h3>
  <h2>{reportStats.appeals}</h2>
  <p>Pending Appeals</p>
</div>

    <div style={card}>
      📊 Moderation Analytics
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
fontWeight: "600",
};

export default ReportsAndViolations;
