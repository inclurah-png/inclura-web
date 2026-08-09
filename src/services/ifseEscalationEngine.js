import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";


/**
 * Creates the IFSE escalation queue entry for an already
 * validated and dispatched emergency.
 *
 * IMPORTANT:
 * The dispatch engine is responsible for resolving the
 * emergencyResponseRules document.
 *
 * This engine therefore receives the rule directly instead
 * of performing a second emergencyType lookup.
 */
export async function createEmergencyEscalation(
  emergencyData,
  rule,
  ruleDocumentId,
  responderId = ""
) {

  const emergencyId = emergencyData?.id || "";

  if (!emergencyId) {
    throw new Error(
      "IFSE Escalation Error: Emergency ID is missing."
    );
  }

  if (!ruleDocumentId) {
    throw new Error(
      "IFSE Escalation Error: Rule document ID is missing."
    );
  }

  if (!rule) {
    throw new Error(
      "IFSE Escalation Error: Emergency response rule is missing."
    );
  }

  const escalationRef = await addDoc(
    collection(db, "emergencyEscalationQueue"),
    {
      emergencyId,

      emergencyType:
        emergencyData?.emergencyType || "",

      priority:
        emergencyData?.priority ||
        rule?.priority ||
        "Low",

      responderId,

      ruleDocumentId,

      primaryAgency:
        rule?.primaryAgency || "",

      secondaryAgency:
        rule?.secondaryAgency || "",

      tertiaryAgency:
        rule?.tertiaryAgency || "",

      escalationMinutes:
        Number(rule?.escalationMinutes) || 0,

      escalationLevel: 0,

      waitingForAcceptance: true,

      accepted: false,

      acceptedAt: null,

      governmentEscalated: false,

      paramilitaryEscalated: false,

      militaryEscalated: false,

      satelliteActivated: false,

      status: "Waiting",

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp(),
    }
  );

  console.log(
    "IFSE Escalation Queue Created:",
    escalationRef.id
  );

  return {
    success: true,
    escalationId: escalationRef.id,
    emergencyId,
    ruleDocumentId,
  };
}


/**
 * Processes existing Waiting escalation records.
 *
 * NOTE:
 * This function must be invoked by an automation mechanism
 * if you want escalation to happen automatically after the
 * specified number of minutes.
 */
export async function runIFSEEscalationEngine() {

  try {

    const escalationQuery = query(
      collection(db, "emergencyEscalationQueue"),
      where("status", "==", "Waiting")
    );

    const snapshot =
      await getDocs(escalationQuery);

    let processed = 0;

    for (
      const escalationDoc of snapshot.docs
    ) {

      const escalation =
        escalationDoc.data();

      const createdAt =
        escalation.createdAt?.toDate?.();

      if (!createdAt) {
        continue;
      }

      const elapsedMinutes =
        Math.floor(
          (
            Date.now() -
            createdAt.getTime()
          ) / 60000
        );

      const escalationMinutes =
        Number(
          escalation.escalationMinutes
        ) || 0;

      /*
       * Do not escalate immediately when
       * escalationMinutes is zero because
       * zero usually means the rule was not
       * configured correctly.
       */
      if (
        escalationMinutes <= 0
      ) {
        continue;
      }

      if (
        elapsedMinutes >=
        escalationMinutes
      ) {

        const currentLevel =
          Number(
            escalation.escalationLevel
          ) || 0;

        await updateDoc(
          doc(
            db,
            "emergencyEscalationQueue",
            escalationDoc.id
          ),
          {
            status: "Escalating",

            escalationLevel:
              currentLevel + 1,

            updatedAt:
              serverTimestamp(),
          }
        );

        processed++;
      }
    }

    return {
      success: true,
      processed,
      scanned: snapshot.size,
    };

  } catch (error) {

    console.error(
      "IFSE Escalation Engine Error:",
      error
    );

    return {
      success: false,
      processed: 0,
      error:
        error?.message ||
        "IFSE escalation processing failed.",
    };
  }
}
