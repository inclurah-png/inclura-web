import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

function UsersManagement() {

const [loading, setLoading] = useState(true);

const [users, setUsers] = useState([]);

const [statistics, setStatistics] = useState({
  totalUsers: 0,
  activeUsers: 0,
  suspendedUsers: 0,
  bannedUsers: 0,
  verifiedUsers: 0,
  pendingVerification: 0,
  enterpriseAccounts: 0,
  governmentAccounts: 0,
  mentorAccounts: 0,
  caregiverAccounts: 0,
  employerAccounts: 0,
  marketplaceSellers: 0,
  advertisers: 0,
  reportedUsers: 0,
});
    useEffect(() => {
  loadUsers();
}, []);

const loadUsers = async () => {

  try {

    setLoading(true);

    const snapshot = await getDocs(
      collection(db, "users")
    );

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setUsers(data);

    setStatistics({
      totalUsers: data.length,

      activeUsers: data.filter(
        (u) => u.status === "active"
      ).length,

      suspendedUsers: data.filter(
        (u) => u.status === "suspended"
      ).length,

      bannedUsers: data.filter(
        (u) => u.status === "banned"
      ).length,

      verifiedUsers: data.filter(
        (u) => u.verified === true
      ).length,

      pendingVerification: data.filter(
        (u) => u.verificationStatus === "pending"
      ).length,

      enterpriseAccounts: data.filter(
        (u) => u.accountType === "Enterprise"
      ).length,

      governmentAccounts: data.filter(
        (u) => u.accountType === "Government"
      ).length,

      mentorAccounts: data.filter(
        (u) => u.accountType === "Mentor"
      ).length,

      caregiverAccounts: data.filter(
        (u) => u.accountType === "Caregiver"
      ).length,

      employerAccounts: data.filter(
        (u) => u.accountType === "Employer"
      ).length,

      marketplaceSellers: data.filter(
        (u) => u.marketplaceSeller === true
      ).length,

      advertisers: data.filter(
        (u) => u.advertiser === true
      ).length,

      reportedUsers: data.filter(
        (u) => u.reportCount > 0
      ).length,
    });

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

};

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
👥 Users Management
</h1>

<div style={card}>

  <h3>👥 All Users</h3>

  <h2>{statistics.totalUsers}</h2>

</div>

<div style={card}>

  <h3>🟢 Active Users</h3>

  <h2>{statistics.activeUsers}</h2>

</div>

    <div style={card}>

  <h3>🔴 Suspended Users</h3>

  <h2>{statistics.suspendedUsers}</h2>

</div>

    <div style={card}>

  <h3>🚫 Banned Users</h3>

  <h2>{statistics.bannedUsers}</h2>

</div>

  <div style={card}>

  <h3>✅ Verified Users</h3>

  <h2>{statistics.verifiedUsers}</h2>

</div>

    <div style={card}>

  <h3>🕒 Pending Verification</h3>

  <h2>{statistics.pendingVerification}</h2>

</div>

    <div style={card}>

  <h3>🏢 Enterprise Accounts</h3>

  <h2>{statistics.enterpriseAccounts}</h2>

</div>

    <div style={card}>

  <h3>🏛 Government Accounts</h3>

  <h2>{statistics.governmentAccounts}</h2>

</div>

<div style={card}>

  <h3>🎓 Mentor Accounts</h3>

  <h2>{statistics.mentorAccounts}</h2>

</div>

    <div style={card}>

  <h3>🤝 Caregiver Accounts</h3>

  <h2>{statistics.caregiverAccounts}</h2>

</div>

    <div style={card}>

  <h3>💼 Employer Accounts</h3>

  <h2>{statistics.employerAccounts}</h2>

</div>

    <div style={card}>
      🛒 Marketplace Sellers
    </div>

    <div style={card}>
      📢 Advertisers
    </div>

    <div style={card}>
      🚨 Reported Users
    </div>

    <div style={card}>
      📊 User Analytics
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

export default UsersManagement;
