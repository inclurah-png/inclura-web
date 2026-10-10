import { useCallback, useEffect, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { getIdTokenResult } from "firebase/auth";

import { auth, db } from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

function UsersManagement() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [busyUserId, setBusyUserId] = useState("");
  const [pageError, setPageError] = useState("");
  const [pageMessage, setPageMessage] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setAuthorized(false);
        setUsers([]);
        setPageError("Please sign in with an authorized administrator account.");
        return;
      }

      // Refresh the token before checking the server-issued claim.
      // Never set this claim from a client-editable Firestore field.
      const tokenResult = await getIdTokenResult(currentUser, true);

      if (tokenResult.claims.admin !== true) {
        setAuthorized(false);
        setUsers([]);
        setSelectedUser(null);
        setPageError(
          "Access denied. This account does not have the required administrator permission."
        );
        return;
      }

      setAuthorized(true);

      const snapshot = await getDocs(collection(db, "users"));

      const data = snapshot.docs.map((userDoc) => ({
        id: userDoc.id,
        ...userDoc.data(),
      }));

      setUsers(data);

      if (selectedUser) {
        const refreshedSelectedUser = data.find(
          (item) => item.id === selectedUser.id
        );

        setSelectedUser(refreshedSelectedUser || null);
      }
    } catch (error) {
      console.error("Unable to load managed users:", error);
      setUsers([]);
      setPageError(
        "Unable to load users. Check your administrator claim, connection, and Firestore Security Rules."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const statistics = {
    totalUsers: users.length,
    activeUsers: users.filter((user) => user.status === "active").length,
    suspendedUsers: users.filter((user) => user.status === "suspended").length,
    bannedUsers: users.filter((user) => user.status === "banned").length,
    verifiedUsers: users.filter((user) => user.verified === true).length,
    pendingVerification: users.filter(
      (user) => user.verificationStatus === "pending"
    ).length,
    enterpriseAccounts: users.filter(
      (user) => user.accountType === "Enterprise"
    ).length,
    governmentAccounts: users.filter(
      (user) => user.accountType === "Government"
    ).length,
    mentorAccounts: users.filter(
      (user) => user.accountType === "Mentor"
    ).length,
    caregiverAccounts: users.filter(
      (user) => user.accountType === "Caregiver"
    ).length,
    employerAccounts: users.filter(
      (user) => user.accountType === "Employer"
    ).length,
    marketplaceSellers: users.filter(
      (user) => user.marketplaceSeller === true
    ).length,
    advertisers: users.filter(
      (user) => user.advertiser === true
    ).length,
    reportedUsers: users.filter(
      (user) => Number(user.reportCount) > 0
    ).length,
  };

  const keyword = searchTerm.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    const name =
      typeof user.fullName === "string" ? user.fullName.toLowerCase() : "";
    const email =
      typeof user.email === "string" ? user.email.toLowerCase() : "";
    const username =
      typeof user.username === "string" ? user.username.toLowerCase() : "";

    const matchesSearch =
      name.includes(keyword) ||
      email.includes(keyword) ||
      username.includes(keyword);

    const matchesFilter =
      selectedFilter === "all" ||
      user.accountType === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  async function performUserAction(userId, action) {
    if (!authorized || !userId || busyUserId) {
      return;
    }

    const targetUser = users.find((user) => user.id === userId);

    if (!targetUser) {
      setPageError("The selected user could not be found. Refresh the list.");
      return;
    }

    if (userId === auth.currentUser?.uid) {
      setPageError("You cannot use this panel to change your own administrator account.");
      return;
    }

    const actionDetails = {
      suspend: {
        title: "Suspend this user?",
        changes: {
          status: "suspended",
          suspendedAt: serverTimestamp(),
        },
      },
      ban: {
        title: "Ban this user?",
        changes: {
          status: "banned",
          bannedAt: serverTimestamp(),
        },
      },
      restore: {
        title: "Restore this user?",
        changes: {
          status: "active",
          restoredAt: serverTimestamp(),
        },
      },
      verify: {
        title: "Approve verification for this user?",
        changes: {
          verified: true,
          verificationStatus: "approved",
          status: "active",
          verifiedAt: serverTimestamp(),
        },
      },
    };

    const selectedAction = actionDetails[action];

    if (!selectedAction) {
      setPageError("Unknown management action.");
      return;
    }

    if (!window.confirm(selectedAction.title)) {
      return;
    }

    setBusyUserId(userId);
    setPageError("");
    setPageMessage("");

    try {
      // Recheck the current server-issued claim before the privileged write.
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const tokenResult = await getIdTokenResult(currentUser, true);

      if (tokenResult.claims.admin !== true) {
        setAuthorized(false);
        throw new Error("Administrator permission is no longer available.");
      }

      // Firestore Security Rules must independently enforce admin access.
      await updateDoc(doc(db, "users", userId), selectedAction.changes);

      setPageMessage("The user account was updated successfully.");

      await loadUsers();
    } catch (error) {
      console.error(`User action "${action}" failed:`, error);

      setPageError(
        "The account could not be updated. Check administrator permissions and Firestore Security Rules."
      );
    } finally {
      setBusyUserId("");
    }
  }

  const cards = [
    ["👥 All Users", statistics.totalUsers],
    ["🟢 Active Users", statistics.activeUsers],
    ["🔴 Suspended Users", statistics.suspendedUsers],
    ["🚫 Banned Users", statistics.bannedUsers],
    ["✅ Verified Users", statistics.verifiedUsers],
    ["🕒 Pending Verification", statistics.pendingVerification],
    ["🏢 Enterprise Accounts", statistics.enterpriseAccounts],
    ["🏛 Government Accounts", statistics.governmentAccounts],
    ["🎓 Mentor Accounts", statistics.mentorAccounts],
    ["🤝 Caregiver Accounts", statistics.caregiverAccounts],
    ["💼 Employer Accounts", statistics.employerAccounts],
    ["🛒 Marketplace Sellers", statistics.marketplaceSellers],
    ["📢 Advertisers", statistics.advertisers],
    ["🚨 Reported Users", statistics.reportedUsers],
  ];

  return (
    <DashboardLayout>
      <div style={{ color: "white" }}>
        <h1 style={{ marginBottom: "24px" }}>
          👥 Users Management
        </h1>

        {pageError && (
          <div role="alert" style={alertStyle}>
            {pageError}
          </div>
        )}

        {pageMessage && (
          <div role="status" style={messageStyle}>
            {pageMessage}
          </div>
        )}

        {!authorized ? (
          <div style={panelStyle}>
            <h2>Administrator access required</h2>
            <p>
              This page requires a server-issued Firebase Authentication
              custom claim named <code>admin</code>, set to <code>true</code>.
            </p>
            <p>
              The claim must be assigned by a trusted server. Do not add
              an admin field to your own profile from this page.
            </p>
            <button
              type="button"
              onClick={loadUsers}
              disabled={loading}
              style={buttonStyle}
            >
              {loading ? "Checking permissions..." : "Check Access Again"}
            </button>
          </div>
        ) : (
          <>
            {loading ? (
              <p role="status">Loading user management data...</p>
            ) : (
              <>
                <div style={statsGridStyle}>
                  {cards.map(([label, value]) => (
                    <div style={cardStyle} key={label}>
                      <h3>{label}</h3>
                      <h2>{value}</h2>
                    </div>
                  ))}
                </div>

                <section style={panelStyle}>
                  <h2>📊 User Analytics</h2>
                  <p>Total registered users: {statistics.totalUsers}</p>
                  <p style={{ color: "#94a3b8" }}>
                    These statistics reflect the user documents this
                    administrator is permitted to read.
                  </p>

                  <button
                    type="button"
                    onClick={loadUsers}
                    disabled={loading || Boolean(busyUserId)}
                    style={buttonStyle}
                  >
                    Refresh Users
                  </button>
                </section>

                <section style={panelStyle}>
                  <h2>👥 Registered Users</h2>

                  <label htmlFor="user-search">Search users</label>
                  <input
                    id="user-search"
                    type="search"
                    placeholder="Search by name, email, or username..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    style={inputStyle}
                  />

                  <label htmlFor="account-filter">Filter by account type</label>
                  <select
                    id="account-filter"
                    value={selectedFilter}
                    onChange={(event) => setSelectedFilter(event.target.value)}
                    style={inputStyle}
                  >
                    <option value="all">All Accounts</option>
                    {[
                      "Creator",
                      "Employer",
                      "Caregiver",
                      "Mentor",
                      "Enterprise",
                      "Government",
                      "NGO",
                      "Institution",
                      "Healthcare",
                      "Religious",
                      "Museum",
                      "Tourism",
                      "Entertainment",
                      "Media",
                      "Accessibility",
                    ].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  <p>
                    Showing {filteredUsers.length} of {users.length} users.
                  </p>

                  <div style={{ overflowX: "auto" }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr style={{ background: "#1e293b" }}>
                          <th style={cellStyle}>Name</th>
                          <th style={cellStyle}>Email</th>
                          <th style={cellStyle}>Account</th>
                          <th style={cellStyle}>Status</th>
                          <th style={cellStyle}>Verified</th>
                          <th style={cellStyle}>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td style={cellStyle}>
                              {user.fullName || "Unknown User"}
                            </td>
                            <td style={cellStyle}>
                              {user.email || "No Email"}
                            </td>
                            <td style={cellStyle}>
                              {user.accountType || "User"}
                            </td>
                            <td style={cellStyle}>
                              {user.status || "active"}
                            </td>
                            <td style={cellStyle}>
                              {user.verified === true ? "✅" : "❌"}
                            </td>
                            <td style={cellStyle}>
                              <div style={actionsStyle}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedUser(user)}
                                  style={smallButtonStyle}
                                >
                                  View
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    Boolean(busyUserId) ||
                                    user.id === auth.currentUser?.uid
                                  }
                                  onClick={() =>
                                    performUserAction(user.id, "suspend")
                                  }
                                  style={smallButtonStyle}
                                >
                                  Suspend
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    Boolean(busyUserId) ||
                                    user.id === auth.currentUser?.uid
                                  }
                                  onClick={() =>
                                    performUserAction(user.id, "ban")
                                  }
                                  style={smallButtonStyle}
                                >
                                  Ban
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    Boolean(busyUserId) ||
                                    user.id === auth.currentUser?.uid
                                  }
                                  onClick={() =>
                                    performUserAction(user.id, "restore")
                                  }
                                  style={smallButtonStyle}
                                >
                                  Restore
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    Boolean(busyUserId) ||
                                    user.id === auth.currentUser?.uid ||
                                    user.verified === true
                                  }
                                  onClick={() =>
                                    performUserAction(user.id, "verify")
                                  }
                                  style={smallButtonStyle}
                                >
                                  Verify
                                </button>
                              </div>

                              {busyUserId === user.id && (
                                <p role="status">Updating account...</p>
                              )}
                            </td>
                          </tr>
                        ))}

                        {filteredUsers.length === 0 && (
                          <tr>
                            <td style={cellStyle} colSpan={6}>
                              No matching users found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section style={panelStyle}>
                  <h2>👤 User Details Panel</h2>

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
                        {selectedUser.phoneNumber ||
                          selectedUser.phone ||
                          "N/A"}
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
                        {selectedUser.verified === true ? "Yes" : "No"}
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
                        <strong>User ID:</strong> {selectedUser.id}
                      </p>
                      <p>
                        <strong>Joined:</strong>{" "}
                        {selectedUser.createdAt?.toDate?.()
                          ?.toLocaleString?.() || "Unknown"}
                      </p>

                      <button
                        type="button"
                        onClick={() => setSelectedUser(null)}
                        style={buttonStyle}
                      >
                        Close Details
                      </button>
                    </>
                  ) : (
                    <p>
                      Select a user by clicking the <strong>View</strong> button.
                    </p>
                  )}
                </section>
              </>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

const cardStyle = {
  background: "#0f172a",
  padding: "24px",
  borderRadius: "20px",
  fontWeight: "600",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginBottom: "28px",
};

const panelStyle = {
  marginTop: "28px",
  background: "#0f172a",
  borderRadius: "20px",
  padding: "24px",
  overflowWrap: "anywhere",
};

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  borderRadius: "10px",
  marginTop: "8px",
  marginBottom: "20px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#fff",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "12px 16px",
  borderRadius: "10px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const smallButtonStyle = {
  ...buttonStyle,
  padding: "8px 10px",
  whiteSpace: "nowrap",
};

const actionsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "850px",
};

const cellStyle = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "1px solid #334155",
  verticalAlign: "top",
};

const alertStyle = {
  background: "#7f1d1d",
  border: "1px solid #ef4444",
  color: "#fff",
  padding: "14px",
  borderRadius: "12px",
  marginBottom: "16px",
};

const messageStyle = {
  background: "#14532d",
  border: "1px solid #22c55e",
  color: "#fff",
  padding: "14px",
  borderRadius: "12px",
  marginBottom: "16px",
};

export default UsersManagement;
