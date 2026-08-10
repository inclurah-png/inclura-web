import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export async function dispatchEmergency(emergencyData) {

  const emergencyId = emergencyData?.id || "";

  try {

    console.log("🛡 IFSE Dispatch Engine Started");

    const emergencyType = emergencyData.emergencyType;

    const priority = emergencyData.priority;

    await addDoc(collection(db, "dispatchDebug"), {
      step: "STEP 1",
      emergencyData,
      emergencyId,
      createdAt: serverTimestamp(),
    });
    
    console.log("========== IFSE DISPATCH ==========");
console.log("Emergency Data Received:", emergencyData);
console.log("Emergency ID:", emergencyId);
console.log("==================================");

// Read IFSE response rule using the existing Firestore document IDs

const emergencyRuleMap = {
  "Security Threat": "ARMED_ATTACK",
  
  "Kidnapping": "ARMED_ATTACK",
  
  "Armed Attack": "ARMED_ATTACK",

  "Police": "POLICE",

  "Fire": "FIRE",

  "Flood": "FLOOD",
  
  "Disaster": "FLOOD",
  
  "Medical": "MEDICAL",
};
const ruleDocumentId =
  emergencyRuleMap[emergencyType];

if (!ruleDocumentId) {

  console.log(
    "No IFSE rule mapping found for emergency type:",
    emergencyType
  );

  return {
    success: false,
    emergencyId,
    assigned: false,
    error:
      "No IFSE response rule mapping found for " +
      emergencyType,
  };

}

console.log(
  "IFSE Rule Document Selected:",
  ruleDocumentId
);

const ruleRef = doc(
  db,
  "emergencyResponseRules",
  ruleDocumentId
);

const ruleSnapshot = await getDoc(ruleRef);

if (!ruleSnapshot.exists()) {

  console.log(
    "IFSE response rule document does not exist:",
    ruleDocumentId
  );

  return {
    success: false,
    emergencyId,
    assigned: false,
    error:
      "IFSE response rule document not found: " +
      ruleDocumentId,
  };

}

const rule = ruleSnapshot.data();

if (rule.active !== true) {

  console.log(
    "IFSE response rule is inactive:",
    ruleDocumentId
  );

  return {
    success: false,
    emergencyId,
    assigned: false,
    error:
      "IFSE response rule is inactive: " +
      ruleDocumentId,
  };

}

console.log(
  "Loaded IFSE Rule:",
  rule
);

    // Determine responder collection

let responderCollection = "";

switch (rule.primaryAgency) {

  case "Police":
    responderCollection = "policeResponders";
    break;

  case "Ambulance":
    responderCollection = "ambulanceResponders";
    break;

  case "Fire Service":
    responderCollection = "fireResponders";
    break;

  case "Army":
    responderCollection = "armyResponders";
    break;

  case "Navy":
    responderCollection = "navyResponders";
    break;

  case "Disaster Agency":
    responderCollection = "disasterResponders";
    break;

case "Community":
  responderCollection = "communityResponders";
  break;

case "Paramilitary":
  responderCollection = "paramilitaryResponders";
  break;

default:
  console.log("Unknown responder agency.");
  return;

}

// Search available responders

const responderSnapshot = await getDocs(
  collection(db, responderCollection)
);

const eligibleResponders = responderSnapshot.docs.filter(
  (responderDoc) => {

    const data = responderDoc.data();

    return (
      data.available === true &&
      data.onDuty === true &&
      data.verified === true &&
      data.ifseVerified === true &&
      data.suspended === false
    );

  }
);

await addDoc(collection(db, "dispatchDebug"), {
  step: "STEP 2",
  responderCollection,
  respondersFound: responderSnapshot.size,
  eligibleResponders: eligibleResponders.length,
  createdAt: serverTimestamp(),
});

if (eligibleResponders.length === 0) {

  console.log(
    "No eligible responder found in:",
    responderCollection
  );

  return {
    success: false,
    emergencyId,
    assigned: false,
    error:
      "No eligible responder found in " +
      responderCollection,
  };

}

const responder = eligibleResponders[0];

const responderData = responder.data();

const selectedResponderName =
  responderData.fullName ||
  responderData.displayName ||
  responderData.name ||
  responderData.username ||
  "Emergency Response Team";

console.log(
  "Eligible responder selected:",
  responderData
);

await addDoc(collection(db, "dispatchDebug"), {
  step: "STEP 2",
  responderCollection,
  respondersFound: responderSnapshot.size,
  createdAt: serverTimestamp(),
});

// =========================
// IFSE Paramilitary Routing
// =========================

const paramilitaryRequired =
  rule.paramilitaryRequired === true;

const paramilitaryAgency =
  rule.paramilitaryAgency || "";

let paramilitaryResponderCollection = "";

if (paramilitaryRequired && paramilitaryAgency) {

  switch (paramilitaryAgency) {

    case "NSCDC":
      paramilitaryResponderCollection = "nscdcResponders";
      break;

    case "FRSC":
      paramilitaryResponderCollection = "frscResponders";
      break;

    case "NDLEA":
      paramilitaryResponderCollection = "ndleaResponders";
      break;

    default:
      console.log(
        "Unknown paramilitary agency:",
        paramilitaryAgency
      );
  }

}

console.log(
  "Paramilitary Required:",
  paramilitaryRequired
);

console.log(
  "Paramilitary Agency:",
  paramilitaryAgency
);

console.log(
  "Paramilitary Responder Collection:",
  paramilitaryResponderCollection
);

console.log("Responder Selected:", responderData);

// Create assignment

    console.log("Writing Assignment...");
console.log("Emergency ID being written:", emergencyId);
    
await addDoc(collection(db, "emergencyAssignments"), {

  assignmentId: emergencyId + "_" + responder.id,

  emergencyId: emergencyId,

  responderId: responder.id,

  responderName: selectedResponderName,

  responderAgency: rule.primaryAgency,

  responderType: responderData.responderType || "Government",

  assignedBy: "IFSE Auto Dispatch",

  assignmentStatus: "Pending",

  accepted: false,

  acceptedAt: null,

  arrived: false,

  arrivedAt: null,

  completed: false,

  completedAt: null,

  cancelled: false,

  cancellationReason: "",

  escalationLevel: 0,

  dispatchPriority: priority,

  estimatedArrivalMinutes: 0,

  actualArrivalMinutes: 0,

  satelliteDispatch: false,

  automaticAssignment: true,

  manualOverride: false,

  createdAt: serverTimestamp(),

  updatedAt: serverTimestamp(),

});

console.log("Emergency Assignment Created");

// Update original SOS record

await updateDoc(
  doc(db, "emergencySOS", emergencyId),
  {
    status: "assigned",

    assignedResponder: selectedResponderName,

    assignedResponderId: responder.id,

    assignedAgency: rule.primaryAgency,

    responseStatus: "Awaiting Responder Acceptance",

    assignmentStatus: "Pending",

    incidentStatus: "Responder Assigned",

    updatedAt: serverTimestamp(),
  }
);
console.log("SOS document updated successfully.");

console.log("Emergency SOS Updated");

// Create Emergency Timeline Record

await addDoc(collection(db, "emergencyTimeline"), {

  timelineId: emergencyId + "_001",

  emergencyId: emergencyId,

  eventType: "Responder Assigned",

  eventDescription:
    rule.primaryAgency +
    " responder assigned automatically by IFSE.",

  performedBy: "IFSE Dispatch Engine",

  performerType: "System",

  responderId: responder.id,

  responderAgency: rule.primaryAgency,
  
  responderName: selectedResponderName,

  eventStatus: "Completed",

  latitude: 0,

  longitude: 0,

  satelliteMode: false,

  networkAvailable: true,

  offlineRecorded: false,

  severity: priority,

  ifseThreatScore: 0,

  ifseClassification: "Automatic Dispatch",

  eventOrder: 1,

  visibleToFamily: true,

  visibleToGovernment: true,

  visibleToResponders: true,

  createdAt: serverTimestamp(),

  updatedAt: serverTimestamp(),

});

console.log("Emergency Timeline Created");

// =========================
// Notify Trusted Contacts
// =========================

const trustedContactsQuery = query(

  collection(db, "trustedContacts"),

  where("ownerId", "==", emergencyData.userId)

);

const trustedContactsSnapshot = await getDocs(trustedContactsQuery);

for (const contact of trustedContactsSnapshot.docs) {

  const contactData = contact.data();

  await addDoc(collection(db, "emergencyNotifications"), {

    emergencyId: emergencyId,

    recipientType: "Trusted Contact",

    recipientId: contact.id,

    recipientName: contactData.fullName || "",

    recipientPhone: contactData.phoneNumber || "",

    recipientEmail: contactData.email || "",

    emergencyType: emergencyType,

    priority: priority,

    assignedAgency: rule.primaryAgency,

    location: emergencyData.location || "",

    notificationStatus: "Pending",

    deliveryMethod: "System",

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),

  });

}

console.log("Trusted Contacts Notification Queue Created");

// =========================
// Notify Family Network
// =========================

const familyQuery = query(

  collection(db, "familyEmergencyNetwork"),

  where("ownerId", "==", emergencyData.userId)

);

const familySnapshot = await getDocs(familyQuery);

for (const family of familySnapshot.docs) {

  const familyData = family.data();

  await addDoc(collection(db, "emergencyNotifications"), {

    emergencyId: emergencyId,

    recipientType: "Family",

    recipientId: family.id,

    recipientName: familyData.fullName || "",

    recipientPhone: familyData.phoneNumber || "",

    recipientEmail: familyData.email || "",

    emergencyType: emergencyType,

    priority: priority,

    assignedAgency: rule.primaryAgency,

    location: emergencyData.location || "",

    notificationStatus: "Pending",

    deliveryMethod: "System",

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),

  });

}

console.log("Family Notification Queue Created");

// =========================
// Notify Government Command
// =========================

if (rule.notifyGovernment) {

  const governmentQuery = query(

    collection(db, "governmentEmergencyCenter"),

    where("active", "==", true)

  );

  const governmentSnapshot = await getDocs(governmentQuery);

  for (const government of governmentSnapshot.docs) {

    const governmentData = government.data();

    await addDoc(collection(db, "emergencyNotifications"), {

      emergencyId: emergencyId,

      recipientType: "Government",

      recipientId: government.id,

      recipientName: governmentData.centerName || "",

      recipientPhone: governmentData.phoneNumber || "",

      recipientEmail: governmentData.email || "",

      emergencyType: emergencyType,

      priority: priority,

      assignedAgency: rule.primaryAgency,

      location: emergencyData.location || "",

      notificationStatus: "Pending",

      deliveryMethod: "System",

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp(),

    });

  }

  console.log("Government Notification Queue Created");

}

// =========================
// IFSE Automatic Escalation
// =========================

const escalationResult =
  await createEmergencyEscalation(
    emergencyData,
    rule,
    ruleDocumentId,
    responder.id
  );

console.log(
  "Escalation Queue Created:",
  escalationResult
);

// =========================
// Multi-Agency Dispatch
// =========================

await addDoc(collection(db, "emergencyMultiAgencyDispatch"), {

  emergencyId: emergencyId,

  primaryAgency: rule.primaryAgency,

  secondaryAgency: rule.secondaryAgency || "",

  tertiaryAgency: rule.tertiaryAgency || "",

  dispatchedPrimary: true,

  dispatchedSecondary: rule.secondaryAgency ? true : false,

  dispatchedTertiary: rule.tertiaryAgency ? true : false,

  dispatchCompleted: false,

  escalationLevel: 0,

  satelliteBackup: false,

  createdAt: serverTimestamp(),

  updatedAt: serverTimestamp(),

});

console.log("Multi-Agency Dispatch Created");

// =========================
// Satellite Emergency Queue
// =========================

const networkOnline = navigator.onLine;

await addDoc(collection(db, "satelliteEmergencyQueue"), {

  emergencyId: emergencyId,

  emergencyType: emergencyType,

  priority: priority,

  satelliteRequired: !networkOnline,

  satelliteActivated: false,

  offlineStored: !networkOnline,

  syncPending: !networkOnline,

  gpsLatitude: emergencyData.gpsLatitude || 0,

  gpsLongitude: emergencyData.gpsLongitude || 0,

  networkStatus: networkOnline ? "Online" : "Offline",

  transmissionStatus: networkOnline ? "Sent" : "Waiting",

  emergencyBeacon: false,

  expansionReady: true,

  createdAt: serverTimestamp(),

  updatedAt: serverTimestamp(),

});

console.log(
  "Satellite Emergency Queue Created"
);

// ============================================================
// IFSE FINAL DISPATCH AUDIT
// ============================================================
//
// Records the final automatic-routing state of the SOS.
// This is an audit record only.
// SOS remains a free social-responsibility service.
//

await addDoc(
  collection(db, "emergencyTimeline"),
  {
    timelineId:
      emergencyId +
      "_FINAL_DISPATCH_AUDIT_" +
      Date.now(),

    emergencyId,

    eventType:
      "IFSE Automatic Dispatch Completed",

    eventDescription:
      "IFSE completed the automatic emergency dispatch workflow and maintained routing to authorized emergency authorities.",

    performedBy:
      "IFSE Dispatch Engine",

    performerType:
      "System",

    emergencyType,

    emergencyService:
      emergencyData?.emergencyService || "Emergency SOS",

    priority,

    governmentRouting: true,

    paramilitaryRouting: true,

    militaryRouting: true,

    registeredIncluraOnly: true,

    automaticAlert: true,

    ifseGenerated: true,

    paymentRequired: false,

    sosService:
      "Social Responsibility",

    gpsLatitude:
      emergencyData?.gpsLatitude || 0,

    gpsLongitude:
      emergencyData?.gpsLongitude || 0,

    gpsAccuracy:
      emergencyData?.accuracy || 0,

    eventStatus:
      "Completed",

    visibleToGovernment: true,

    visibleToResponders: true,

    visibleToFamily: true,

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),
  }
);

console.log(
  "IFSE Final Dispatch Audit Created"
);

// ============================================================
// SUCCESS RESPONSE
// ============================================================

return {
  success: true,

  emergencyId,

  assigned: true,

  agency: rule.primaryAgency,

  responderId: responder.id,

  responderName: selectedResponderName,

  emergencyService:
    emergencyData?.emergencyService || "",

  registeredIncluraUser:
    Boolean(emergencyData?.userId),

  healthcareRouting:
    emergencyData?.healthcareRouting || "not_applicable",

  paymentRequired: false,

  sosService: "Social Responsibility",

  governmentAlertInitiated: true,

  paramilitaryAlertInitiated: true,

  militaryAlertInitiated: true,
};
    
} catch (err) {

  console.error(
    "IFSE Dispatch Engine Error:",
    err
  );

  try {

    await addDoc(
      collection(db, "dispatchDebug"),
      {
        step: "ERROR",

        emergencyId,

        message:
          err?.message ||
          "Unknown dispatch error",

        stack:
          err?.stack ||
          "",

        emergencyType:
          emergencyData?.emergencyType || "",

        priority:
          emergencyData?.priority || "",

        emergencyService:
          emergencyData?.emergencyService || "",

        registeredIncluraUser:
          Boolean(emergencyData?.userId),

        healthcareRouting:
          emergencyData?.healthcareRouting ||
          "not_applicable",

        paymentRequired: false,

        sosService: "Social Responsibility",

        createdAt: serverTimestamp(),
      }
    );

  } catch (debugError) {

    console.error(
      "Unable to record IFSE dispatch error:",
      debugError
    );

  }

    return {
    success: false,

    emergencyId,

    error:
      err?.message ||
      "Emergency dispatch failed.",
  };
}
}
