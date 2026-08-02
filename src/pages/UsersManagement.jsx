import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

function UsersManagement() {

const [loading, setLoading] = useState(true);

const [users, setUsers] = useState([]);

const [filteredUsers, setFilteredUsers] = useState([]);

const [searchTerm, setSearchTerm] = useState("");

const [selectedFilter, setSelectedFilter] =
  useState("all");
const [selectedUser, setSelectedUser] =
  useState(null);

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

const suspendUser = async (userId) => {

  try {

    await updateDoc(
      doc(db, "users", userId),
      {
        status: "suspended",
        suspendedAt: serverTimestamp(),
      }
    );

    loadUsers();

  } catch (error) {

    console.error(error);

    alert("Unable to suspend user.");

  }

};

const banUser = async (userId) => {

  try {

    await updateDoc(
      doc(db, "users", userId),
      {
        status: "banned",
        bannedAt: serverTimestamp(),
      }
    );

    loadUsers();

  } catch (error) {

    console.error(error);

    alert("Unable to ban user.");

  }

};

const restoreUser = async (userId) => {

  try {

    await updateDoc(
      doc(db, "users", userId),
      {
        status: "active",
        restoredAt: serverTimestamp(),
      }
    );

    loadUsers();

  } catch (error) {

    console.error(error);

    alert("Unable to restore user.");

  }

};

const verifyUser = async (userId) => {

  try {

    await updateDoc(

      doc(db, "users", userId),

      {

        verified: true,

        verificationStatus: "approved",

        status: "active",

        verifiedAt: serverTimestamp(),

      }

    );

    loadUsers();

    alert("User verified successfully.");

  } catch (error) {

    console.error(error);

    alert("Unable to verify user.");

  }

};
  
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

const filtered =
  selectedFilter === "all"
    ? data
    : data.filter(
        (user) =>
          user.accountType === selectedFilter
      );

setFilteredUsers(filtered);

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

  <h3>🛒 Marketplace Sellers</h3>

  <h2>{statistics.marketplaceSellers}</h2>

</div>

<div style={card}>

  <h3>📢 Advertisers</h3>

  <h2>{statistics.advertisers}</h2>

</div>

<div style={card}>

  <h3>🚨 Reported Users</h3>

  <h2>{statistics.reportedUsers}</h2>

</div>

<div style={card}>

  <h3>📊 User Analytics</h3>

  <p>Total Users</p>

  <h2>{statistics.totalUsers}</h2>

  <p
    style={{
      color: "#94a3b8",
      marginTop: "12px",
    }}
  >
    Analytics dashboard will be added in the next phase.
  </p>

</div>
<div
  style={{
    marginTop: "40px",
    background: "#0f172a",
    borderRadius: "20px",
    padding: "20px",
  }}
>

  <h2
    style={{
      marginBottom: "20px",
    }}
  >
    👥 Registered Users
  </h2>

  <input
  type="text"
  placeholder="Search users..."
  value={searchTerm}
  onChange={(e) => {

    const value = e.target.value;

    setSearchTerm(value);

    const keyword = value.toLowerCase();

    const filtered = users.filter((user) => {

      const matchesSearch =

        (user.fullName || "")
          .toLowerCase()
          .includes(keyword) ||

        (user.email || "")
          .toLowerCase()
          .includes(keyword) ||

        (user.username || "")
          .toLowerCase()
          .includes(keyword);

      const matchesFilter =

        selectedFilter === "all" ||

        user.accountType === selectedFilter;

      return matchesSearch && matchesFilter;

    });

    setFilteredUsers(filtered);

  }}
  style={{
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "20px",
    border: "none",
    background: "#1e293b",
    color: "#fff",
  }}
/>

  <select
  value={selectedFilter}
  onChange={(e) => {

    const filter = e.target.value;

    setSelectedFilter(filter);

    const keyword =
      searchTerm.toLowerCase();

    const filtered = users.filter((user) => {

      const matchesSearch =

        (user.fullName || "")
          .toLowerCase()
          .includes(keyword) ||

        (user.email || "")
          .toLowerCase()
          .includes(keyword) ||

        (user.username || "")
          .toLowerCase()
          .includes(keyword);

      const matchesFilter =

        filter === "all" ||

        user.accountType === filter;

      return matchesSearch && matchesFilter;

    });

    setFilteredUsers(filtered);

  }}
  style={{
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "20px",
    border: "none",
    background: "#1e293b",
    color: "#fff",
    fontSize: "16px",
  }}
>

  <option value="all">
    All Accounts
  </option>

  <option value="Creator">
    Creator
  </option>

  <option value="Employer">
    Employer
  </option>

  <option value="Caregiver">
    Caregiver
  </option>

  <option value="Mentor">
    Mentor
  </option>

  <option value="Enterprise">
    Enterprise
  </option>

  <option value="Government">
    Government
  </option>

  <option value="NGO">
    NGO
  </option>

  <option value="Institution">
    Institution
  </option>

  <option value="Healthcare">
    Healthcare
  </option>

  <option value="Religious">
    Religious
  </option>

  <option value="Museum">
    Museum
  </option>

  <option value="Tourism">
    Tourism
  </option>

  <option value="Entertainment">
    Entertainment
  </option>

  <option value="Media">
    Media
  </option>

  <option value="Accessibility">
    Accessibility
  </option>

</select>
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
    }}
  >

    <thead>

<tr
  style={{
    background: "#1e293b",
  }}
>

  <th>Name</th>

  <th>Email</th>

  <th>Account</th>

  <th>Status</th>

  <th>Verified</th>

  <th>Actions</th>

</tr>
    </thead>

<tbody>

  {filteredUsers.map((user) => (

    <tr key={user.id}>

  <td>{user.fullName || "Unknown User"}</td>

  <td>{user.email || "No Email"}</td>

  <td>{user.accountType || "User"}</td>

  <td>{user.status || "active"}</td>

  <td>

    {user.verified ? "✅" : "❌"}

  </td>

  <td>

    <button
      onClick={() => {

  setSelectedUser(user);
        
      }}
      style={{
        padding: "8px 14px",
        borderRadius: "8px",
        border: "none",
        background: "#2563eb",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      View
    </button>

    <button
      onClick={() => suspendUser(user.id)}
      style={{
        marginLeft: "6px",
        padding: "8px 14px",
        border: "none",
        borderRadius: "8px",
        background: "#f59e0b",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Suspend
    </button>

    <button
      onClick={() => banUser(user.id)}
      style={{
        marginLeft: "6px",
        padding: "8px 14px",
        border: "none",
        borderRadius: "8px",
        background: "#dc2626",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Ban
    </button>

    <button
      onClick={() => restoreUser(user.id)}
      style={{
        marginLeft: "6px",
        padding: "8px 14px",
        border: "none",
        borderRadius: "8px",
        background: "#16a34a",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Restore
    </button>

    <button
      onClick={() => verifyUser(user.id)}
      style={{
        marginLeft: "6px",
        padding: "8px 14px",
        border: "none",
        borderRadius: "8px",
        background: "#2563eb",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Verify
    </button>

  </td>

</tr>
  ))}

</tbody>
    
  </table>

</div>

  <div
  style={{
    marginTop: "35px",
    background: "#0f172a",
    borderRadius: "20px",
    padding: "24px",
  }}
>

  <h2
    style={{
      marginBottom: "20px",
    }}
  >
    👤 User Details Panel
  </h2>

  {selectedUser ? (

    <>

      <p>
        <strong>Full Name:</strong>{" "}
        {selectedUser.fullName || "N/A"}
      </p>

      <p>
        <strong>Username:</strong>{" "}
        {selectedUser.username || "N/A"}
      </p>

      <p>
        <strong>Email:</strong>{" "}
        {selectedUser.email || "N/A"}
      </p>

      <p>
        <strong>Phone:</strong>{" "}
        {selectedUser.phone || "N/A"}
      </p>

      <p>
        <strong>Account Type:</strong>{" "}
        {selectedUser.accountType || "User"}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {selectedUser.status || "Active"}
      </p>

      <p>
        <strong>Verified:</strong>{" "}
        {selectedUser.verified ? "✅ Yes" : "❌ No"}
      </p>

      <p>
        <strong>Verification Status:</strong>{" "}
        {selectedUser.verificationStatus || "Pending"}
      </p>

      <p>
        <strong>Country:</strong>{" "}
        {selectedUser.country || "N/A"}
      </p>

      <p>
        <strong>State:</strong>{" "}
        {selectedUser.state || "N/A"}
      </p>

      <p>
        <strong>City:</strong>{" "}
        {selectedUser.city || "N/A"}
      </p>

      <p>
        <strong>User ID:</strong>{" "}
        {selectedUser.id}
      </p>

      <p>
        <strong>Joined:</strong>{" "}
        {selectedUser.createdAt?.toDate?.().toLocaleString?.() || "Unknown"}
      </p>

    </>

  ) : (

    <p>
      Select a user by clicking the
      <strong> View </strong>
      button.
    </p>

  )}

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
