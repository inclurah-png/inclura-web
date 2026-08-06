import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import DashboardLayout from "../components/DashboardLayout";

function ResponderIncidentReport() {
const [searchParams] = useSearchParams();

const emergencyId =
  searchParams.get("emergencyId") || "";

const assignmentId =
  searchParams.get("assignmentId") || "";

const responderId =
  searchParams.get("responderId") || "";
  
  const [form, setForm] = useState({

    emergencyId,

assignmentId,

responderId,

    responderAgency: "",

    responderName: "",

    incidentSummary: "",

    incidentDetails: "",

    injuriesReported: false,

    fatalitiesReported: false,

    propertyDamage: false,

    suspectArrested: false,

    medicalTransport: false,

    backupRequired: false,

    photosAttached: false,

    videosAttached: false,

    evidenceCollected: false,

  });
useEffect(() => {

  setForm((prev) => ({

    ...prev,

    emergencyId,

    assignmentId,

    responderId,

  }));

}, [
  emergencyId,
  assignmentId,
  responderId,
]);
  
  function updateField(e) {

    const { name, value, type, checked } = e.target;

    setForm((prev) => ({

      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,

    }));

  }

  async function submitIncidentReport() {

    try {

      await addDoc(

        collection(db, "incidentReports"),

        {

          ...form,

          reportStatus: "Submitted",

          ifseReviewed: false,

          governmentReviewed: false,

          reportVersion: 1,

          createdAt: serverTimestamp(),

          updatedAt: serverTimestamp(),

        }

      );

      alert("Incident Report Submitted Successfully.");

      setForm({

        emergencyId: "",

        assignmentId: "",

        responderId: "",

        responderAgency: "",

        responderName: "",

        incidentSummary: "",

        incidentDetails: "",

        injuriesReported: false,

        fatalitiesReported: false,

        propertyDamage: false,

        suspectArrested: false,

        medicalTransport: false,

        backupRequired: false,

        photosAttached: false,

        videosAttached: false,

        evidenceCollected: false,

      });

    } catch (err) {

      console.error(err);

      alert(err.message);

    }

  }

  return (

    <DashboardLayout>

      <div style={container}>

        <h1>🚑 Responder Incident Report</h1>

        <input
          name="emergencyId"
          placeholder="Emergency ID"
          value={form.emergencyId}
          readOnly
          onChange={updateField}
          style={input}
        />

        <input
          name="assignmentId"
          placeholder="Assignment ID"
          value={form.assignmentId}
          readOnly
          onChange={updateField}
          style={input}
        />

        <input
          name="responderId"
          placeholder="Responder ID"
          value={form.responderId}
          readOnly
          onChange={updateField}
          style={input}
        />

        <input
          name="responderAgency"
          placeholder="Responder Agency"
          value={form.responderAgency}
          onChange={updateField}
          style={input}
        />

        <input
          name="responderName"
          placeholder="Responder Name"
          value={form.responderName}
          onChange={updateField}
          style={input}
        />

        <textarea
          name="incidentSummary"
          placeholder="Incident Summary"
          value={form.incidentSummary}
          onChange={updateField}
          style={textarea}
        />

        <textarea
          name="incidentDetails"
          placeholder="Detailed Report"
          value={form.incidentDetails}
          onChange={updateField}
          style={textarea}
        />

        <label>
          <input
            type="checkbox"
            name="injuriesReported"
            checked={form.injuriesReported}
            onChange={updateField}
          />

          Injuries Reported

        </label>

        <label>
          <input
            type="checkbox"
            name="fatalitiesReported"
            checked={form.fatalitiesReported}
            onChange={updateField}
          />

          Fatalities Reported

        </label>

        <label>
          <input
            type="checkbox"
            name="propertyDamage"
            checked={form.propertyDamage}
            onChange={updateField}
          />

          Property Damage

        </label>

        <label>
          <input
            type="checkbox"
            name="suspectArrested"
            checked={form.suspectArrested}
            onChange={updateField}
          />

          Suspect Arrested

        </label>

        <label>
          <input
            type="checkbox"
            name="medicalTransport"
            checked={form.medicalTransport}
            onChange={updateField}
          />

          Medical Transport

        </label>

        <label>
          <input
            type="checkbox"
            name="backupRequired"
            checked={form.backupRequired}
            onChange={updateField}
          />

          Backup Required

        </label>

        <button
          onClick={submitIncidentReport}
          style={button}
        >
          Submit Incident Report
        </button>

      </div>

    </DashboardLayout>

  );

}

const container = {

  color: "#fff",

  display: "flex",

  flexDirection: "column",

  gap: "15px",

};

const input = {

  padding: "12px",

  borderRadius: "10px",

};

const textarea = {

  padding: "12px",

  minHeight: "120px",

  borderRadius: "10px",

};

const button = {

  padding: "14px",

  background: "#2563eb",

  color: "#fff",

  border: "none",

  borderRadius: "10px",

  cursor: "pointer",

};

export default ResponderIncidentReport;
