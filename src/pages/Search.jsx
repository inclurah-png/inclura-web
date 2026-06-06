import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

function Search() {
  const navigate = useNavigate();
  const [query, setQuery] =
    useState("");

  const [users, setUsers] =
    useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const snapshot =
      await getDocs(
        collection(db, "users")
      );

    const data =
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    setUsers(data);
  }

  const filteredUsers =
    users.filter((user) =>
      user.fullName
        ?.toLowerCase()
        .includes(
          query.toLowerCase()
        )
    );

  return (
    <div
      style={{
        background:"#020617",
        minHeight:"100vh",
        padding:"24px",
        color:"white",
      }}
    >
      <h1>Search Users</h1>

      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e)=>
          setQuery(e.target.value)
        }
        style={{
          width:"100%",
          padding:"16px",
          borderRadius:"14px",
          border:"none",
          marginBottom:"20px",
        }}
      />

      {filteredUsers.map((user) => (
  <div
    key={user.id}
    onClick={() =>
      navigate(`/user/${user.id}`)
    }
    style={{
      background:"#1e293b",
      padding:"16px",
      borderRadius:"14px",
      marginBottom:"12px",
      cursor:"pointer",
    }}
  >
    
          <h3>
            {user.fullName}
          </h3>

          <p>
            {user.category}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Search;
