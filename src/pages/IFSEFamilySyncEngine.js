import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Synchronize IFSE updates to the Family Dashboard.
 */
export async function syncFamilyEmergency({
  emergencyId,
  assignmentId,
  responderId,
  responderName,
  responderAgency,
  emergencyType,
  location,
  status,
  responseStatus,
  priority,
  eventType,
  eventDescription,
}) {
  try {

    // Update emergencySOS
    await updateDoc(
      doc(db, "emergencySOS", emergencyId),
      {
        status,
        responseStatus,
        assignedResponder: responderName,
        assignedAgency: responderAgency,
        updatedAt: serverTimestamp(),
      }
    );

    // Add timeline entry
    await addDoc(
      collection(db, "emergencyTimeline"),
      {
        emergencyId,
        assignmentId,
        responderId,
        responderName,
        responderAgency,

        eventType,
        eventDescription,
        eventStatus: status,

        priority,

        visibleToFamily: true,
        visibleToGovernment: true,
        visibleToResponders: true,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );

    // Create family notification
    await addDoc(
      collection(db, "emergencyNotifications"),
      {
        emergencyId,
        assignmentId,
        responderId,

        recipientType: "Family",

        notificationTitle: eventType,
        notificationMessage: eventDescription,

        assignedAgency: responderAgency,
        emergencyType,
        location,

        priority,

        visibleToFamily: true,

        notificationStatus: "Pending",

        acknowledged: false,
        archived: false,
        read: false,

        ifseGenerated: true,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );

    // IFSE Audit Log
    await addDoc(
      collection(db, "ifseAuditLogs"),
      {
        emergencyId,
        assignmentId,
        responderId,

        module: "EmergencySOS",

        action: eventType,

        description: eventDescription,

        performedBy: "IFSE",

        createdAt: serverTimestamp(),
      }
    );

  } catch (err) {

    console.error("IFSE Family Sync:", err);

    throw err;

  }
        }

