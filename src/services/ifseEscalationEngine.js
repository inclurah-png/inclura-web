import {
  addDoc,
  updateDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

const emergencyRuleMap = {
  Medical: "MEDICAL",

  Fire: "FIRE",

  Police: "POLICE",

  Kidnapping: "ARMED_ATTACK",

  "Security Threat": "ARMED_ATTACK",

  "Armed Attack": "ARMED_ATTACK",

  Accident: "MEDICAL",

  "Missing Person": "POLICE",

  Flood: "FLOOD",

  Disaster: "FLOOD",
};

export async function createEmergencyEscalation(emergencyData) {
  const emergencyId = emergencyData?.id || "";
  const emergencyType = emergencyData?.emergencyType || "";

  if (!emergencyId) {
    throw new Error("Emergency ID is missing.");
  }

  if (!emergencyType) {
    throw new Error("Emergency type is missing.");
  }

  const ruleDocumentId = emergencyRuleMap[emergencyType];

  if (!ruleDocumentId) {
    throw new Error(
      `IFSE Escalation Error: No authoritative rule mapping exists for emergency type "${emergencyType}".`
    );
  }

  const ruleRef = doc(
    db,
    "emergencyResponseRules",
    ruleDocumentId
  );

  const ruleSnapshot = await getDocs(
    query(
      collection(db, "emergencyResponseRules"),
      where("__name__", "==", ruleDocumentId)
    )
  );

  if (ruleSnapshot.empty) {
    throw new Error(
      `IFSE Escalation Error: Authoritative rule document "${ruleDocumentId}" was not found.`
    );
  }

  const ruleDoc = ruleSnapshot.docs[0];
  const rule = ruleDoc.data();

  if (rule.active !== true) {
    throw new Error(
      `IFSE Escalation Error: Authoritative rule "${ruleDocumentId}" is inactive.`
    );
  }

  const escalationRef = await addDoc(
    collection(db, "emergencyEscalationQueue"),
    {
      emergencyId,

      emergencyType,

      priority:
        emergencyData.priority ||
        rule.priority ||
        "Low",

      ruleDocumentId,

      primaryAgency:
        rule.primaryAgency || "",

      secondaryAgency:
        rule.secondaryAgency || "",

      tertiaryAgency:
        rule.tertiaryAgency || "",

      escalationMinutes:
        Number(rule.escalationMinutes) || 0,

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

  return {
    success: true,
    escalationId: escalationRef.id,
    emergencyId,
    emergencyType,
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
