import { dispatchEmergency } from "../services/ifseDispatchEngine";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";

import { db, auth } from "../firebase";
import DashboardLayout from "../components/DashboardLayout";
import SOSHistory from "../pages/SOSHistory";
import TrustedContacts from "./TrustedContacts";
import ShareLiveLocation from "./ShareLiveLocation";
import EmergencyResponders from "./EmergencyResponders";
import CommunityAssistance from "./CommunityAssistance";
import IFSEEmergencyMonitoring from "./IFSEEmergencyMonitoring";
import EmergencyAnalytics from "./EmergencyAnalytics";

function SOS() {
  
const [sosForm, setSosForm] = useState({
  emergencyType: "Medical",
  priority: "Low",
  description: "",
  location: "",
  latitude: "",
  longitude: "",
  accuracy: "",
  trustedContact: "",
  responderNotes: "",
});
  
  const [sosStats, setSosStats] = useState({

  open: 0,
  resolved: 0,
  highPriority: 0,
  medical: 0,
  fire: 0,
  police: 0,
  responders: 0,

});

  useEffect(() => {
  async function loadSOSStats() {
    try {
      const openSnap = await getCountFromServer(
  query(
    collection(db, "emergencySOS"),
    where("status", "==", "open")
  )
);

const resolvedSnap = await getCountFromServer(
  query(
    collection(db, "emergencySOS"),
    where("status", "==", "resolved")
  )
);

const highSnap = await getCountFromServer(
  query(
    collection(db, "emergencySOS"),
    where("priority", "==", "High")
  )
);

const medicalSnap = await getCountFromServer(
  query(
    collection(db, "emergencySOS"),
    where("emergencyType", "==", "Medical")
  )
);

const fireSnap = await getCountFromServer(
  query(
    collection(db, "emergencySOS"),
    where("emergencyType", "==", "Fire")
  )
);

const policeSnap = await getCountFromServer(
  query(
    collection(db, "emergencySOS"),
    where("emergencyType", "==", "Police")
  )
);

const responderSnap = await getCountFromServer(
  query(
    collection(db, "users"),
    where("isResponder", "==", true)
  )
);

setSosStats({
  open: openSnap.data().count,
  resolved: resolvedSnap.data().count,
  highPriority: highSnap.data().count,
  medical: medicalSnap.data().count,
  fire: fireSnap.data().count,
  police: policeSnap.data().count,
  responders: responderSnap.data().count,
});

    } catch (err) {
      console.error(err);
    }
  }

  loadSOSStats();
}, []);

async function submitEmergencySOS() {

  try {

    const emergencyRef = await addDoc(collection(db, "emergencySOS"), {

  systemPlaceholder: false,

  userId: auth.currentUser?.uid || "",

  userName: auth.currentUser?.displayName || "",

  userEmail: auth.currentUser?.email || "",

  userPhoto: auth.currentUser?.photoURL || "",

  emergencyType: sosForm.emergencyType,

  priority: sosForm.priority,

  description: sosForm.description,

  location: sosForm.location,

  latitude: sosForm.latitude || "",

  longitude: sosForm.longitude || "",

  accuracy: sosForm.accuracy || "",

  trustedContact: sosForm.trustedContact,

  responderNotes: sosForm.responderNotes,

  status: "open",

  handledBy: "",

  resolved: false,

  assignedResponder: "",

  assignedResponderId: "",

  incidentStatus: "Active",

  incidentNumber: Date.now().toString(),

  assignedStation: "",

  assignedVehicle: "",

  estimatedArrival: "",

  responseStatus: "Awaiting Response",

  ifseThreatScore: 0,

  ifseClassification: "Pending",

  resolvedBy: "",

  resolutionNotes: "",

  closedAt: null,

  createdAt: serverTimestamp(),

  updatedAt: serverTimestamp(),

  lastUpdated: serverTimestamp(),

});

  const emergencyId = emergencyRef.id;

await dispatchEmergency({
  id: emergencyId,
  userId: auth.currentUser?.uid || "",
  userName: auth.currentUser?.displayName || "",
  userEmail: auth.currentUser?.email || "",
  emergencyType: sosForm.emergencyType,
  priority: sosForm.priority,
  description: sosForm.description,
  location: sosForm.location,
  gpsLatitude: Number(sosForm.latitude) || 0,
  gpsLongitude: Number(sosForm.longitude) || 0,
});
    
    alert("Emergency SOS submitted successfully.");

    setSosForm({

      emergencyType: "Medical",

      priority: "Low",

      description: "",

      location: "",

      trustedContact: "",

      responderNotes: "",

    });

    window.location.reload();

  } catch (err) {

  console.error("SOS Error:", err);

  alert(err.message);

}

}
  
  return (
    <DashboardLayout>
      <div style={page}>
        <h1>🚨 SOS Emergency</h1>

<div style={dashboardGrid}>

  <div style={summaryCard}>
    <h3>🚨 Open SOS Cases</h3>
    <h2>{sosStats.open}</h2>
    <p>Awaiting Response</p>
  </div>

  <div style={summaryCard}>
    <h3>⚠ High Priority</h3>
    <h2>{sosStats.highPriority}</h2>
    <p>Critical Emergencies</p>
  </div>

  <div style={summaryCard}>
    <h3>🚑 Medical Emergencies</h3>
    <h2>{sosStats.medical}</h2>
    <p>Medical Cases</p>
  </div>

  <div style={summaryCard}>
    <h3>🚒 Fire Emergencies</h3>
    <h2>{sosStats.fire}</h2>
    <p>Fire Incidents</p>
  </div>

  <div style={summaryCard}>
    <h3>🚓 Police Emergencies</h3>
    <h2>{sosStats.police}</h2>
    <p>Police Cases</p>
  </div>

  <div style={summaryCard}>
    <h3>👨‍🚒 Active Responders</h3>
    <h2>{sosStats.responders}</h2>
    <p>Available Responders</p>
  </div>

  <div style={summaryCard}>
    <h3>✅ Resolved Cases</h3>
    <h2>{sosStats.resolved}</h2>
    <p>Successfully Closed</p>
  </div>

</div>

<h2 style={sectionTitle}>Emergency Actions</h2>

<div style={card}>

<h3>🚨 Emergency SOS Form</h3>

<label>Emergency Type</label>

<select
value={sosForm.emergencyType}
onChange={(e)=>
setSosForm({
...sosForm,
emergencyType:e.target.value,
})
}
style={input}
>

<option>Medical</option>

<option>Fire</option>

<option>Police</option>

<option>Kidnapping</option>

<option>Accident</option>

<option>Disaster</option>

<option>Security Threat</option>

<option>Missing Person</option>

</select>

<label>Priority</label>

<select
value={sosForm.priority}
onChange={(e)=>
setSosForm({
...sosForm,
priority:e.target.value,
})
}
style={input}
>

<option>Low</option>

<option>Medium</option>

<option>High</option>

<option>Critical</option>

</select>

<label>Description</label>

<textarea
rows={4}
placeholder="Describe the emergency..."
value={sosForm.description}
onChange={(e)=>
setSosForm({
...sosForm,
description:e.target.value,
})
}
style={input}
/>

<label>Location</label>

<input
type="text"
placeholder="Current location"
value={sosForm.location}
onChange={(e)=>
setSosForm({
...sosForm,
location:e.target.value,
})
}
style={input}
/>

<label>Trusted Contact</label>

<input
type="text"
placeholder="Phone or email"
value={sosForm.trustedContact}
onChange={(e)=>
setSosForm({
...sosForm,
trustedContact:e.target.value,
})
}
style={input}
/>

<button
onClick={submitEmergencySOS}
style={dangerButton}
>

🚨 Send SOS Alert

</button>

</div>

<div style={card}>
  📍 <ShareLiveLocation />
</div>

<div style={card}>
  👨‍👩‍👧 <TrustedContacts />
</div>

<div style={card}>
  🤝 <CommunityAssistance />
</div>

<div style={card}>
  🚑 <EmergencyResponders />
</div>

<div style={card}>
  🛡 <IFSEEmergencyMonitoring />
</div>

<div style={card}>
  📊 <EmergencyAnalytics />
</div>

<div style={card}>
  📜 <SOSHistory />
</div>
      </div>
    </DashboardLayout>
  );
}

const dashboardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "18px",
  marginBottom: "30px",
};

const summaryCard = {
  background: "#111827",
  borderRadius: "18px",
  padding: "20px",
  border: "1px solid #1f2937",
};

const sectionTitle = {
  marginTop: "35px",
  marginBottom: "15px",
  color: "#60a5fa",
  fontSize: "22px",
  fontWeight: "700",
};

const page = { color: "white" };

const card = {
  background: "#0f172a",
  padding: "24px",
  borderRadius: "20px",
  marginBottom: "20px",
};

const input = {

  width: "100%",
  marginTop: "8px",
  marginBottom: "15px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #374151",
  background: "#111827",
  color: "#fff",

};

const dangerButton = {

  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "14px",
  borderRadius: "12px",
  cursor: "pointer",
  width: "100%",
  fontWeight: "700",
  fontSize: "16px",

};

export default SOS;
