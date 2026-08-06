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
    // Check duplicates
    const timelineSnapshot = await getDocs(
      query(
        collection(db, "emergencyTimeline"),
        where("emergencyId", "==", emergencyId),
        where("eventType", "==", eventType)
      )
    );

    const notificationSnapshot = await getDocs(
      query(
        collection(db, "emergencyNotifications"),
        where("emergencyId", "==", emergencyId),
        where("notificationTitle", "==", eventType)
      )
    );

    const auditSnapshot = await getDocs(
      query(
        collection(db, "ifseAuditLogs"),
        where("emergencyId", "==", emergencyId),
        where("action", "==", eventType)
      )
    );

    // Update Emergency SOS
    await updateDoc(doc(db, "emergencySOS", emergencyId), {
      responseStatus,
      incidentStatus: status,
      assignedResponder: responderName,
      assignedAgency: responderAgency,
      updatedAt: serverTimestamp(),
    });

    // Timeline
    if (timelineSnapshot.empty) {
      await addDoc(collection(db, "emergencyTimeline"), {
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
      });
    }

    // Notification
    if (notificationSnapshot.empty) {
      await addDoc(collection(db, "emergencyNotifications"), {
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
      });
    }

    // IFSE Audit Log
    if (auditSnapshot.empty) {
      await addDoc(collection(db, "ifseAuditLogs"), {
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
      });
    }
  } catch (err) {
    console.error("IFSE Sync Error:", err);
    throw err;
  }
        }
