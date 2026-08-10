  import {
  addDoc,
  updateDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";


export async function resolveIFSEEmergencyRule(
  emergencyData
) {

  const emergencyType =
    String(
      emergencyData?.emergencyType || ""
    )
      .trim()
      .toLowerCase();


  const description =
    String(
      emergencyData?.description || ""
    )
      .trim()
      .toLowerCase();


  const combinedText =
    `${emergencyType} ${description}`.trim();


  if (!combinedText) {

    throw new Error(
      "IFSE cannot resolve an emergency without a danger description."
    );

  }


  let preferredRuleId = "";


  // ========================================================
  // MEDICAL
  // ========================================================

  if (
    /medical|injury|injured|unconscious|bleeding|heart attack|stroke|ambulance|illness|overdose|pregnan/i
      .test(combinedText)
  ) {

    preferredRuleId =
      "MEDICAL";

  }


  // ========================================================
  // FIRE
  // ========================================================

  else if (
    /fire|smoke|burning|flame|explosion|building fire/i
      .test(combinedText)
  ) {

    preferredRuleId =
      "FIRE";

  }


  // ========================================================
  // FLOOD / DISASTER
  // ========================================================

  else if (
    /flood|flooding|landslide|earthquake|building collapse|collapse|natural disaster|storm|disaster/i
      .test(combinedText)
  ) {

    preferredRuleId =
      "FLOOD";

  }


  // ========================================================
  // POLICE / LAW ENFORCEMENT
  // ========================================================

  else if (
    /police|missing person|theft|robbery|burglary|crime|assault|domestic violence|violent crime/i
      .test(combinedText)
  ) {

    preferredRuleId =
      "POLICE";

  }


  // ========================================================
  // ARMED / SECURITY THREAT
  // ========================================================

  else if (
    /kidnap|kidnapping|hostage|armed|weapon|gun|shooting|terror|terrorist|attack|armed intrusion|security threat|violent attack|invasion/i
      .test(combinedText)
  ) {

    preferredRuleId =
      "ARMED_ATTACK";

  }


  // ========================================================
  // FALLBACK
  // ========================================================

  else {

    preferredRuleId =
      "POLICE";

  }


  const ruleRef =
    doc(
      db,
      "emergencyResponseRules",
      preferredRuleId
    );


  const ruleSnapshot =
    await getDoc(
      ruleRef
    );


  if (
    !ruleSnapshot.exists()
  ) {

    throw new Error(
      `IFSE authoritative rule "${preferredRuleId}" was not found.`
    );

  }


  const rule =
    ruleSnapshot.data();


  if (
    rule.active !== true
  ) {

    throw new Error(
      `IFSE authoritative rule "${preferredRuleId}" is inactive.`
    );

  }


  return {

    ruleId:
      preferredRuleId,

    rule,

  };

}


export async function resolveEmergencyResponseRule(
  emergencyData
) {

  const emergencyType =
    String(
      emergencyData?.emergencyType || ""
    ).trim();


  if (!emergencyType) {

    throw new Error(
      "IFSE Rule Resolver Error: Emergency type is missing."
    );

  }


  const ruleResolution =
    await resolveIFSEEmergencyRule(
      emergencyData
    );


  if (
    !ruleResolution?.ruleId ||
    !ruleResolution?.rule
  ) {

    throw new Error(
      `IFSE Rule Resolver Error: No authoritative rule mapping exists for emergency type "${emergencyType}".`
    );

  }


  return {

    ruleId:
      ruleResolution.ruleId,

    rule:
      ruleResolution.rule,

  };

}


export async function resolveIFSEAgency(
  agencyIdentifier
) {

  const requestedAgency =
    String(
      agencyIdentifier || ""
    ).trim();


  if (!requestedAgency) {

    throw new Error(
      "IFSE Agency Resolver Error: Agency identifier is missing."
    );

  }


  const agencyRegistry =
    collection(
      db,
      "ifseAgencyRegistry"
    );


  const codeQuery =
    query(
      agencyRegistry,
      where(
        "agencyCode",
        "==",
        requestedAgency
      )
    );


  const codeSnapshot =
    await getDocs(
      codeQuery
    );


  let agencySnapshot =
    codeSnapshot;


  if (
    agencySnapshot.empty
  ) {

    const nameQuery =
      query(
        agencyRegistry,
        where(
          "agencyName",
          "==",
          requestedAgency
        )
      );


    agencySnapshot =
      await getDocs(
        nameQuery
      );

  }


  if (
    agencySnapshot.empty
  ) {

    throw new Error(
      `IFSE Agency Resolver Error: Agency "${requestedAgency}" was not found in ifseAgencyRegistry.`
    );

  }


  const agencyDoc =
    agencySnapshot.docs[0];


  const agency =
    agencyDoc.data();


  if (
    agency.active !== true
  ) {

    throw new Error(
      `IFSE Agency Resolver Error: Agency "${requestedAgency}" is inactive.`
    );

  }


  if (
    agency.governmentAuthorized !== true
  ) {

    throw new Error(
      `IFSE Agency Resolver Error: Agency "${requestedAgency}" is not government authorized.`
    );

  }


  if (
    !agency.responderCollection
  ) {

    throw new Error(
      `IFSE Agency Resolver Error: Agency "${requestedAgency}" has no responderCollection configured.`
    );

  }


  return {

    id:
      agencyDoc.id,

    agencyName:
      agency.agencyName ||
      "",

    agencyCode:
      agency.agencyCode ||
      "",

    responderCollection:
      agency.responderCollection ||
      "",

    agencyType:
      agency.agencyType ||
      "",

    active:
      agency.active === true,

    governmentAuthorized:
      agency.governmentAuthorized === true,

    ifseVerifiedRequired:
      agency.ifseVerifiedRequired === true,

    createdAt:
      agency.createdAt ||
      null,

    updatedAt:
      agency.updatedAt ||
      null,

  };

}


export async function createEmergencyEscalation(
  emergencyData
) {

  const emergencyId =
    emergencyData?.id || "";

  const emergencyType =
    emergencyData?.emergencyType || "";


  if (!emergencyId) {

    throw new Error(
      "Emergency ID is missing."
    );

  }


  if (!emergencyType) {

    throw new Error(
      "Emergency type is missing."
    );

  }


  // ============================================================
  // STEP 1 — RESOLVE AUTHORITATIVE IFSE RESPONSE RULE
  // ============================================================

  const ruleResolution =
    await resolveEmergencyResponseRule(
      emergencyData
    );


  const ruleDocumentId =
    ruleResolution.ruleId;


  const rule =
    ruleResolution.rule;


  // ============================================================
  // STEP 2 — CHECK FOR EXISTING ESCALATION QUEUE
  // ============================================================

  const existingEscalationQuery =
    query(
      collection(
        db,
        "emergencyEscalationQueue"
      ),

      where(
        "emergencyId",
        "==",
        emergencyId
      )
    );


  const existingEscalationSnapshot =
    await getDocs(
      existingEscalationQuery
    );


  if (
    !existingEscalationSnapshot.empty
  ) {

    const existingEscalationDoc =
      existingEscalationSnapshot.docs[0];


    const existingEscalation =
      existingEscalationDoc.data();


    return {

      success:
        true,

      alreadyExists:
        true,

      escalationId:
        existingEscalationDoc.id,

      emergencyId,

      emergencyType,

      ruleDocumentId,

      status:
        existingEscalation.status ||
        "Waiting",

    };

  }


  // ============================================================
  // STEP 3 — CREATE ESCALATION QUEUE
  // ============================================================

  const escalationRef =
    await addDoc(
      collection(
        db,
        "emergencyEscalationQueue"
      ),
      {

        emergencyId,

        emergencyType,

        priority:
          emergencyData.priority ||
          rule.priority ||
          "Low",

        ruleDocumentId,

        primaryAgency:
          rule.primaryAgency ||
          "",

        secondaryAgency:
          rule.secondaryAgency ||
          "",

        tertiaryAgency:
          rule.tertiaryAgency ||
          "",

        escalationMinutes:
          Number(
            rule.escalationMinutes
          ) || 0,

        escalationLevel:
          0,

        waitingForAcceptance:
          true,

        accepted:
          false,

        acceptedAt:
          null,

        governmentEscalated:
          false,

        paramilitaryEscalated:
          false,

        militaryEscalated:
          false,

        satelliteActivated:
          false,

        status:
          "Waiting",

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),

      }
    );


  return {

    success:
      true,

    alreadyExists:
      false,

    escalationId:
      escalationRef.id,

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

    const escalationQuery =
      query(
        collection(
          db,
          "emergencyEscalationQueue"
        ),

        where(
          "status",
          "==",
          "Waiting"
        )
      );


    const snapshot =
      await getDocs(
        escalationQuery
      );


    let processed =
      0;


    for (
      const escalationDoc
      of snapshot.docs
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

            status:
              "Escalating",

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

      success:
        true,

      processed,

      scanned:
        snapshot.size,

    };


  } catch (error) {

    console.error(
      "IFSE Escalation Engine Error:",
      error
    );


    return {

      success:
        false,

      processed:
        0,

      error:
        error?.message ||
        "IFSE escalation processing failed.",

    };

  }

}
