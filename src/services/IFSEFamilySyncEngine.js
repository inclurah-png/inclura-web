import {
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

/**
 * IFSE Family Synchronization Engine
 * Centralized synchronization for Emergency SOS.
 */

export async function syncFamilyEmergency({

  emergencyId,
  assignmentId,

  responderId,
  responderName,
  responderAgency,

  emergencyType,
  location,

  priority,

  status,

  responseStatus,

  eventType,

  eventDescription,

}) {

  try {
    const timelineCheck = query(
  collection(db, "emergencyTimeline"),
  where("emergencyId", "==", emergencyId),
  where("eventType", "==", eventType)
);

const timelineSnapshot = await getDocs(timelineCheck);

const notificationCheck = query(
  collection(db, "emergencyNotifications"),
  where("emergencyId", "==", emergencyId),
  where("notificationTitle", "==", eventType)
);

const notificationSnapshot = await getDocs(notificationCheck);

const auditCheck = query(
  collection(db, "ifseAuditLogs"),
  where("emergencyId", "==", emergencyId),
  where("action", "==", eventType)
);

const auditSnapshot = await getDocs(auditCheck);

    // ===========================
    // UPDATE EMERGENCY SOS
    // ===========================

    await updateDoc(

      doc(db, "emergencySOS", emergencyId),

      {

        responseStatus,

        incidentStatus: status,

        assignedResponder: responderName,

        assignedAgency: responderAgency,

        updatedAt: serverTimestamp(),

      }

    );

    // ===========================
    // EMERGENCY TIMELINE
    // ===========================

    await addDoc(
  collection(db, "emergencyTimeline"),
      {

        emergencyId,

        assignmentId,

        responderId,

        responderName,

        responderAgency,

        performerType: "Responder",

        eventType,

        eventDescription,

        eventStatus: "Completed",

        severity: priority,

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),

      }
      if (timelineSnapshot.empty) {

  await addDoc(
    collection(db, "emergencyTimeline"),

    );

    // ===========================
    // FAMILY NOTIFICATION
    // ===========================

    await addDoc(

      collection(db, "emergencyNotifications"),

      {

        assignmentId,

        emergencyId,

        responderId,

        assignedAgency: responderAgency,

        emergencyType,

        location,

        priority,

        recipientType: "Family",

        recipientName: "",

        recipientEmail: "",

        recipientPhone: "",

        notificationTitle: eventType,

        notificationMessage: eventDescription,

        notificationStatus: "Pending",

        deliveryMethod: "System",

        acknowledged: false,

        archived: false,

        read: false,

        ifseGenerated: true,

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),

        visibleToFamily: true,

      }
if (notificationSnapshot.empty) {

  await addDoc(
    collection(db, "emergencyNotifications"),
    );

    // ===========================
    // IFSE AUDIT LOG
    // ===========================

    await addDoc(

      collection(db, "ifseAuditLogs"),

      {

        emergencyId,

        assignmentId,

        responderId,

        responderName,

        responderAgency,

        action: eventType,

        description: eventDescription,

        module: "EmergencySOS",

        actor: "IFSE",

        createdAt: serverTimestamp(),

      }
    if (auditSnapshot.empty) {

  await addDoc(
    collection(db, "ifseAuditLogs"),

    );

  } catch (err) {

    console.error("IFSE Sync Error:", err);

    throw err;

  }

}
