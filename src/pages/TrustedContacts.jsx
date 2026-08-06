import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase";

function TrustedContacts() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "trustedContacts"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setContacts(list);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      style={{
        background: "#0f172a",
        padding: "24px",
        borderRadius: "20px",
        marginBottom: "20px",
      }}
    >
      <h3>👨‍👩‍👧 Trusted Contacts</h3>

      <p>Total Contacts: {contacts.length}</p>

      {contacts.length === 0 ? (
        <p>No trusted contacts added.</p>
      ) : (
        contacts.map((contact) => (
          <div
            key={contact.id}
            style={{
              background: "#111827",
              padding: "15px",
              borderRadius: "12px",
              marginTop: "15px",
            }}
          >
            <strong>{contact.fullName}</strong>

            <br />

            Relationship:
            {" "}
            {contact.relationship || "Not specified"}

            <br />

            Phone:
            {" "}
            {contact.phone}

            <br />

            Email:
            {" "}
            {contact.email || "N/A"}

            <br />

            Status:
            {" "}
            {contact.status || "Active"}
          </div>
        ))
      )}
    </div>
  );
}

export default TrustedContacts;
