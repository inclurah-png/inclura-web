import { useEffect, useState } from "react";
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, query,
  serverTimestamp, updateDoc, where,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const emptyForm = { fullName: "", relationship: "", phoneNumber: "", email: "" };

function TrustedContacts() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return undefined;
    return onSnapshot(
      query(collection(db, "trustedContacts"), where("userId", "==", user.uid)),
      (snapshot) => {
        setContacts(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        setError("");
      },
      (err) => {
        console.error("Trusted contacts listener failed:", err);
        setError("Unable to load trusted contacts. Please refresh and try again.");
      }
    );
  }, []);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function beginEdit(contact) {
    setEditingId(contact.id);
    setForm({
      fullName: contact.fullName || "",
      relationship: contact.relationship || "",
      phoneNumber: contact.phoneNumber || "",
      email: contact.email || "",
    });
    setError("");
  }

  function resetForm() {
    setEditingId("");
    setForm(emptyForm);
    setError("");
  }

  async function saveContact(event) {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user) return setError("Please sign in before managing trusted contacts.");

    const fullName = form.fullName.trim();
    const phoneNumber = form.phoneNumber.trim();
    const email = form.email.trim();
    if (!fullName || (!phoneNumber && !email)) {
      return setError("Enter the contact's name and at least a phone number or email address.");
    }
    if (fullName.length > 100 || phoneNumber.length > 40 || email.length > 160) {
      return setError("One or more fields are too long. Please shorten them.");
    }

    setSaving(true);
    setError("");
    const safeData = {
      fullName,
      relationship: form.relationship.trim().slice(0, 60),
      phoneNumber,
      email,
      status: "Active",
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "trustedContacts", editingId), safeData);
      } else {
        if (contacts.length >= 5) throw new Error("You can add up to five trusted contacts.");
        await addDoc(collection(db, "trustedContacts"), {
          ...safeData, userId: user.uid, ownerId: user.uid, createdAt: serverTimestamp(),
        });
      }
      resetForm();
    } catch (err) {
      console.error("Trusted contact save failed:", err);
      setError(err.code === "permission-denied"
        ? "Access was denied while saving this contact. Please refresh and try again."
        : err.message || "The contact could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function removeContact(contactId) {
    if (!window.confirm("Remove this trusted contact from your SOS list?")) return;
    try {
      await deleteDoc(doc(db, "trustedContacts", contactId));
      if (editingId === contactId) resetForm();
    } catch (err) {
      console.error("Trusted contact removal failed:", err);
      setError("The contact could not be removed. Please try again.");
    }
  }

  const panel = { background: "#0f172a", color: "#f8fafc", padding: "20px", borderRadius: "16px", marginBottom: "16px", border: "1px solid #334155" };
  const field = { width: "100%", boxSizing: "border-box", padding: "11px", margin: "5px 0 12px", borderRadius: "9px", border: "1px solid #475569", background: "#111827", color: "#fff" };
  const action = { padding: "9px 13px", margin: "5px 8px 5px 0", border: 0, borderRadius: "8px", cursor: "pointer", fontWeight: 700 };

  return (
    <section style={panel}>
      <h3>👨‍👩‍👧 Trusted Contacts</h3>
      <p>Contacts you choose may be included in an SOS notification workflow. Adding a contact does not itself send a notification or confirm delivery.</p>
      <p>Total contacts: {contacts.length} / 5</p>
      <form onSubmit={saveContact}>
        <label htmlFor="trusted-full-name">Full name</label>
        <input id="trusted-full-name" name="fullName" value={form.fullName} onChange={updateField} maxLength={100} required style={field} placeholder="Contact's full name" />
        <label htmlFor="trusted-relationship">Relationship</label>
        <input id="trusted-relationship" name="relationship" value={form.relationship} onChange={updateField} maxLength={60} style={field} placeholder="e.g. Spouse, sibling, friend" />
        <label htmlFor="trusted-phone">Phone number</label>
        <input id="trusted-phone" name="phoneNumber" type="tel" value={form.phoneNumber} onChange={updateField} maxLength={40} style={field} placeholder="Include country code where possible" />
        <label htmlFor="trusted-email">Email address</label>
        <input id="trusted-email" name="email" type="email" value={form.email} onChange={updateField} maxLength={160} style={field} placeholder="name@example.com" />
        <button type="submit" disabled={saving || (!editingId && contacts.length >= 5)} style={{ ...action, background: "#15803d", color: "#fff" }}>{saving ? "Saving..." : editingId ? "Save changes" : "Add trusted contact"}</button>
        {editingId && <button type="button" onClick={resetForm} style={{ ...action, background: "#475569", color: "#fff" }}>Cancel</button>}
        {!editingId && contacts.length >= 5 && <p>You can add up to five trusted contacts.</p>}
      </form>
      {error && <p role="alert" style={{ color: "#fecaca" }}>{error}</p>}
      {contacts.length === 0 ? <p>No trusted contacts added yet.</p> : contacts.map((contact) => (
        <article key={contact.id} style={{ background: "#111827", padding: "14px", borderRadius: "12px", marginTop: "12px", border: "1px solid #334155" }}>
          <strong>{contact.fullName}</strong>
          <p>Relationship: {contact.relationship || "Not specified"}</p>
          <p>Phone: {contact.phoneNumber || "Not provided"}</p>
          <p>Email: {contact.email || "Not provided"}</p>
          <button type="button" onClick={() => beginEdit(contact)} style={{ ...action, background: "#1d4ed8", color: "#fff" }}>Edit</button>
          <button type="button" onClick={() => removeContact(contact.id)} style={{ ...action, background: "#991b1b", color: "#fff" }}>Remove</button>
        </article>
      ))}
    </section>
  );
}

export default TrustedContacts;
