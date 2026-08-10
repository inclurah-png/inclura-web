import {
  dispatchEmergency,
} from "./ifseDispatchEngine";

import {
  resolveEmergencyResponseRule,
  resolveIFSEAgency,
  createEmergencyEscalation,
} from "./ifseEscalationEngine";

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

import {
  db,
} from "../firebase";


// ============================================================
// IFSE DISPATCH ENGINE
// ============================================================

export async function dispatchEmergency(
  emergencyData
) {

  const emergencyId =
    emergencyData?.id || "";


  try {

    console.log(
      "🛡 IFSE Dispatch Engine Started"
    );


    // ==========================================================
    // STEP 1 — VALIDATE INPUT
    // ==========================================================

    const emergencyType =
      String(
        emergencyData?.emergencyType || ""
      ).trim();


    const priority =
      emergencyData?.priority ||
      "Critical";


    if (!emergencyId) {

      throw new Error(
        "IFSE Dispatch Error: Emergency ID is missing."
      );

    }


    if (!emergencyType) {

      throw new Error(
        "IFSE Dispatch Error: Emergency type is missing."
      );

    }


    if (
      !emergencyData?.userId
    ) {

      throw new Error(
        "IFSE Dispatch Error: Registered Inclura user ID is missing."
      );

    }


    await addDoc(
      collection(
        db,
        "dispatchDebug"
      ),
      {

        step:
          "STEP 1 — DISPATCH INPUT RECEIVED",

        emergencyId,

        emergencyType,

        priority,

        userId:
          emergencyData.userId,

        createdAt:
          serverTimestamp(),

      }
    );


    console.log(
      "========== IFSE DISPATCH =========="
    );

    console.log(
      "Emergency ID:",
      emergencyId
    );

    console.log(
      "Emergency Type:",
      emergencyType
    );

    console.log(
      "Priority:",
      priority
    );

    console.log(
      "=================================="
    );


    // ==========================================================
    // STEP 2 — RESOLVE AUTHORITATIVE IFSE RESPONSE RULE
    // ==========================================================

    const ruleResolution =
      await resolveEmergencyResponseRule(
        emergencyData
      );


    if (
      !ruleResolution ||
      !ruleResolution.ruleId ||
      !ruleResolution.rule
    ) {

      await addDoc(
        collection(
          db,
          "dispatchDebug"
        ),
        {

          step:
            "STEP 2 — RULE RESOLUTION FAILED",

          emergencyId,

          emergencyType,

          priority,

          createdAt:
            serverTimestamp(),

        }
      );


      throw new Error(
        "No active IFSE response rule could be resolved for emergency type: " +
        emergencyType
      );

    }


    const ruleDocumentId =
      ruleResolution.ruleId;


    const rule =
      ruleResolution.rule;


    console.log(
      "IFSE Authoritative Rule:",
      ruleDocumentId
    );

    console.log(
      "IFSE Rule Data:",
      rule
    );


    await addDoc(
      collection(
        db,
        "dispatchDebug"
      ),
      {

        step:
          "STEP 2 — AUTHORITATIVE RULE RESOLVED",

        emergencyId,

        emergencyType,

        priority,

        ruleDocumentId,

        primaryAgency:
          rule.primaryAgency || "",

        secondaryAgency:
          rule.secondaryAgency || "",

        tertiaryAgency:
          rule.tertiaryAgency || "",

        createdAt:
          serverTimestamp(),

      }
    );


    // ==========================================================
    // STEP 3 — RESOLVE PRIMARY AGENCY
    //         THROUGH IFSE AGENCY REGISTRY
    // ==========================================================

    if (
      !rule.primaryAgency
    ) {

      throw new Error(
        "IFSE Dispatch Error: Authoritative rule has no primary agency."
      );

    }


    const primaryAgency =
      await resolveIFSEAgency(
        rule.primaryAgency
      );


    if (
      !primaryAgency ||
      primaryAgency.active !== true
    ) {

      await addDoc(
        collection(
          db,
          "dispatchDebug"
        ),
        {

          step:
            "STEP 3 — PRIMARY AGENCY RESOLUTION FAILED",

          emergencyId,

          emergencyType,

          priority,

          ruleDocumentId,

          requestedAgency:
            rule.primaryAgency || "",

          createdAt:
            serverTimestamp(),

        }
      );


      throw new Error(
        "IFSE agency registry could not resolve an active primary agency: " +
        rule.primaryAgency
      );

    }


    const responderCollection =
      primaryAgency.responderCollection;


    if (
      !responderCollection
    ) {

      throw new Error(
        "IFSE agency registry has no responderCollection for agency: " +
        (
          primaryAgency.agencyName ||
          rule.primaryAgency
        )
      );

    }


    console.log(
      "IFSE Agency Registry Selected:",
      primaryAgency
    );


    await addDoc(
      collection(
        db,
        "dispatchDebug"
      ),
      {

        step:
          "STEP 3 — PRIMARY AGENCY REGISTRY RESOLVED",

        emergencyId,

        emergencyType,

        priority,

        ruleDocumentId,

        agencyName:
          primaryAgency.agencyName || "",

        agencyCode:
          primaryAgency.agencyCode || "",

        agencyType:
          primaryAgency.agencyType || "",

        responderCollection,

        governmentAuthorized:
          primaryAgency.governmentAuthorized ===
          true,

        ifseVerifiedRequired:
          primaryAgency.ifseVerifiedRequired ===
          true,

        createdAt:
          serverTimestamp(),

      }
    );


    // ==========================================================
    // STEP 4 — SEARCH PRIMARY RESPONDERS
    // ==========================================================

    const responderSnapshot =
      await getDocs(
        collection(
          db,
          responderCollection
        )
      );


    const eligibleResponders =
      responderSnapshot.docs.filter(
        (
          responderDoc
        ) => {

          const data =
            responderDoc.data();


          const verificationRequired =
            primaryAgency
              .ifseVerifiedRequired ===
            true;


          const verificationSatisfied =
            verificationRequired
              ? data.ifseVerified === true
              : true;


          return (

            data.available === true &&

            data.onDuty === true &&

            data.verified === true &&

            verificationSatisfied &&

            data.suspended !== true

          );

        }
      );


    await addDoc(
      collection(
        db,
        "dispatchDebug"
      ),
      {

        step:
          "STEP 4 — PRIMARY RESPONDER SEARCH",

        emergencyId,

        ruleDocumentId,

        agencyName:
          primaryAgency.agencyName || "",

        agencyCode:
          primaryAgency.agencyCode || "",

        responderCollection,

        respondersFound:
          responderSnapshot.size,

        eligibleResponders:
          eligibleResponders.length,

        createdAt:
          serverTimestamp(),

      }
    );


    if (
      eligibleResponders.length === 0
    ) {

      console.log(
        "No eligible responder found in:",
        responderCollection
      );


      throw new Error(
        "No eligible responder found in " +
        responderCollection
      );

    }


    // ==========================================================
    // STEP 5 — SELECT PRIMARY RESPONDER
    // ==========================================================

    const responder =
      eligibleResponders[0];


    const responderData =
      responder.data();


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


    await addDoc(
      collection(
        db,
        "dispatchDebug"
      ),
      {

        step:
          "STEP 5 — PRIMARY RESPONDER SELECTED",

        emergencyId,

        ruleDocumentId,

        responderId:
          responder.id,

        responderName:
          selectedResponderName,

        responderAgency:
          primaryAgency.agencyName || "",

        responderAgencyCode:
          primaryAgency.agencyCode || "",

        responderAgencyType:
          primaryAgency.agencyType || "",

        responderCollection,

        createdAt:
          serverTimestamp(),

      }
    );


    // ==========================================================
    // STEP 6 — RESOLVE SECONDARY AGENCY
    // ==========================================================

    const secondaryAgency =
      rule.secondaryAgency
        ? await resolveIFSEAgency(
            rule.secondaryAgency
          )
        : null;


    if (
      rule.secondaryAgency &&
      (
        !secondaryAgency ||
        secondaryAgency.active !== true
      )
    ) {

      throw new Error(
        "IFSE agency registry could not resolve an active secondary agency: " +
        rule.secondaryAgency
      );

    }


    // ==========================================================
    // STEP 7 — RESOLVE TERTIARY AGENCY
    // ==========================================================

    const tertiaryAgency =
      rule.tertiaryAgency
        ? await resolveIFSEAgency(
            rule.tertiaryAgency
          )
        : null;


    if (
      rule.tertiaryAgency &&
      (
        !tertiaryAgency ||
        tertiaryAgency.active !== true
      )
    ) {

      throw new Error(
        "IFSE agency registry could not resolve an active tertiary agency: " +
        rule.tertiaryAgency
      );

    }


    await addDoc(
      collection(
        db,
        "dispatchDebug"
      ),
      {

        step:
          "STEP 6/7 — MULTI AGENCY REGISTRY RESOLUTION",

        emergencyId,

        ruleDocumentId,

        primaryAgency:
          primaryAgency.agencyCode || "",

        primaryAgencyType:
          primaryAgency.agencyType || "",

        secondaryAgency:
          secondaryAgency?.agencyCode || "",

        secondaryAgencyType:
          secondaryAgency?.agencyType || "",

        tertiaryAgency:
          tertiaryAgency?.agencyCode || "",

        tertiaryAgencyType:
          tertiaryAgency?.agencyType || "",

        createdAt:
          serverTimestamp(),

      }
    );


    // ==========================================================
    // STEP 8 — DETERMINE ROUTING FLAGS
    // ==========================================================

    const governmentRouting =
      rule.notifyGovernment === true;


    const paramilitaryRouting =
      Boolean(

        secondaryAgency &&
        (
          secondaryAgency.agencyType ===
            "Law Enforcement / Paramilitary" ||

          secondaryAgency.agencyType ===
            "Police Mobile Force / Law Enforcement" ||

          secondaryAgency.agencyType ===
            "Paramilitary"
        )

      );


    const militaryRouting =
      Boolean(

        primaryAgency.agencyType ===
          "Military" ||

        secondaryAgency?.agencyType ===
          "Military" ||

        tertiaryAgency?.agencyType ===
          "Military"

      );


    // ==========================================================
    // STEP 9 — CREATE PRIMARY RESPONDER ASSIGNMENT
    // ==========================================================

    const assignmentRef =
      await addDoc(
        collection(
          db,
          "emergencyAssignments"
        ),
        {

          assignmentId:
            emergencyId +
            "_" +
            responder.id,

          emergencyId,

          responderId:
            responder.id,

          responderName:
            selectedResponderName,

          responderAgency:
            primaryAgency.agencyName || "",

          responderAgencyCode:
            primaryAgency.agencyCode || "",

          responderAgencyType:
            primaryAgency.agencyType || "",

          responderCollection,

          responderType:
            responderData.responderType ||
            "Government",

          assignedBy:
            "IFSE Auto Dispatch",

          assignmentStatus:
            "Pending",

          accepted:
            false,

          acceptedAt:
            null,

          arrived:
            false,

          arrivedAt:
            null,

          completed:
            false,

          completedAt:
            null,

          cancelled:
            false,

          cancellationReason:
            "",

          escalationLevel:
            0,

          dispatchPriority:
            priority,

          estimatedArrivalMinutes:
            Number(
              rule.estimatedArrivalMinutes
            ) || 0,

          actualArrivalMinutes:
            0,

          satelliteDispatch:
            false,

          automaticAssignment:
            true,

          manualOverride:
            false,

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),

        }
      );


    console.log(
      "Emergency Assignment Created:",
      assignmentRef.id
    );


    // ==========================================================
    // STEP 10 — UPDATE ORIGINAL SOS RECORD
    // ==========================================================

    await updateDoc(
      doc(
        db,
        "emergencySOS",
        emergencyId
      ),
      {

        status:
          "assigned",

        assignedResponder:
          selectedResponderName,

        assignedResponderId:
          responder.id,

        assignedAgency:
          primaryAgency.agencyName || "",

        assignedAgencyCode:
          primaryAgency.agencyCode || "",

        assignedAgencyType:
          primaryAgency.agencyType || "",

        responderCollection,

        responseStatus:
          "Awaiting Responder Acceptance",

        assignmentStatus:
          "Pending",

        incidentStatus:
          "Responder Assigned",

        ifseClassification:
          ruleDocumentId,

        updatedAt:
          serverTimestamp(),

      }
    );


    console.log(
      "SOS document updated successfully."
    );


    // ==========================================================
    // STEP 11 — CREATE EMERGENCY TIMELINE
    // ==========================================================

    const timelineRef =
      await addDoc(
        collection(
          db,
          "emergencyTimeline"
        ),
        {

          timelineId:
            emergencyId +
            "_001",

          emergencyId,

          eventType:
            "Responder Assigned",

          eventDescription:
            (
              primaryAgency.agencyName ||
              "Authorized agency"
            ) +
            " responder assigned automatically by IFSE.",

          performedBy:
            "IFSE Dispatch Engine",

          performerType:
            "System",

          responderId:
            responder.id,

          responderAgency:
            primaryAgency.agencyName || "",

          responderAgencyCode:
            primaryAgency.agencyCode || "",

          responderAgencyType:
            primaryAgency.agencyType || "",

          responderName:
            selectedResponderName,

          responderCollection,

          eventStatus:
            "Completed",

          latitude:
            Number(
              emergencyData?.gpsLatitude
            ) || 0,

          longitude:
            Number(
              emergencyData?.gpsLongitude
            ) || 0,

          satelliteMode:
            false,

          networkAvailable:
            typeof navigator !==
            "undefined"
              ? navigator.onLine
              : true,

          offlineRecorded:
            false,

          severity:
            priority,

          ifseThreatScore:
            0,

          ifseClassification:
            ruleDocumentId,

          eventOrder:
            1,

          visibleToFamily:
            true,

          visibleToGovernment:
            true,

          visibleToResponders:
            true,

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),

        }
      );


    // ==========================================================
    // STEP 12 — TRUSTED CONTACT NOTIFICATIONS
    // ==========================================================

    const trustedContactsQuery =
      query(
        collection(
          db,
          "trustedContacts"
        ),
        where(
          "ownerId",
          "==",
          emergencyData.userId
        )
      );


    const trustedContactsSnapshot =
      await getDocs(
        trustedContactsQuery
      );


    for (
      const contactDoc
      of trustedContactsSnapshot.docs
    ) {

      const contactData =
        contactDoc.data();


      await addDoc(
        collection(
          db,
          "emergencyNotifications"
        ),
        {

          emergencyId,

          recipientType:
            "Trusted Contact",

          recipientId:
            contactDoc.id,

          recipientName:
            contactData.fullName ||
            "",

          recipientPhone:
            contactData.phoneNumber ||
            "",

          recipientEmail:
            contactData.email ||
            "",

          emergencyType,

          priority,

          assignedAgency:
            primaryAgency.agencyName ||
            "",

          assignedAgencyCode:
            primaryAgency.agencyCode ||
            "",

          location:
            emergencyData.location ||
            "",

          notificationStatus:
            "Pending",

          deliveryMethod:
            "System",

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),

        }
      );

    }


    console.log(
      "Trusted Contacts Notification Queue Created"
    );


    // ==========================================================
    // STEP 13 — FAMILY NETWORK NOTIFICATIONS
    // ==========================================================

    const familyQuery =
      query(
        collection(
          db,
          "familyEmergencyNetwork"
        ),
        where(
          "ownerId",
          "==",
          emergencyData.userId
        )
      );


    const familySnapshot =
      await getDocs(
        familyQuery
      );


    for (
      const familyDoc
      of familySnapshot.docs
    ) {

      const familyData =
        familyDoc.data();


      await addDoc(
        collection(
          db,
          "emergencyNotifications"
        ),
        {

          emergencyId,

          recipientType:
            "Family",

          recipientId:
            familyDoc.id,

          recipientName:
            familyData.fullName ||
            "",

          recipientPhone:
            familyData.phoneNumber ||
            "",

          recipientEmail:
            familyData.email ||
            "",

          emergencyType,

          priority,

          assignedAgency:
            primaryAgency.agencyName ||
            "",

          assignedAgencyCode:
            primaryAgency.agencyCode ||
            "",

          location:
            emergencyData.location ||
            "",

          notificationStatus:
            "Pending",

          deliveryMethod:
            "System",

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),

        }
      );

    }


    console.log(
      "Family Notification Queue Created"
    );


    // ==========================================================
    // STEP 14 — GOVERNMENT COMMAND NOTIFICATION
    // ==========================================================

    if (
      governmentRouting
    ) {

      const governmentQuery =
        query(
          collection(
            db,
            "governmentEmergencyCenter"
          ),
          where(
            "active",
            "==",
            true
          )
        );


      const governmentSnapshot =
        await getDocs(
          governmentQuery
        );


      for (
        const governmentDoc
        of governmentSnapshot.docs
      ) {

        const governmentData =
          governmentDoc.data();


        await addDoc(
          collection(
            db,
            "emergencyNotifications"
          ),
          {

            emergencyId,

            recipientType:
              "Government",

            recipientId:
              governmentDoc.id,

            recipientName:
              governmentData.centerName ||
              "",

            recipientPhone:
              governmentData.phoneNumber ||
              "",

            recipientEmail:
              governmentData.email ||
              "",

            emergencyType,

            priority,

            assignedAgency:
              primaryAgency.agencyName ||
              "",

            assignedAgencyCode:
              primaryAgency.agencyCode ||
              "",

            location:
              emergencyData.location ||
              "",

            notificationStatus:
              "Pending",

            deliveryMethod:
              "System",

            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp(),

          }
        );

      }


      console.log(
        "Government Notification Queue Created"
      );

    }


    // ==========================================================
    // STEP 15 — CREATE IFSE ESCALATION QUEUE
    // ==========================================================

    const escalationResult =
      await createEmergencyEscalation(
        emergencyData
      );


    console.log(
      "Escalation Queue Created:",
      escalationResult
    );


    // ==========================================================
    // STEP 16 — CREATE MULTI-AGENCY DISPATCH RECORD
    // ==========================================================

    const multiAgencyRef =
      await addDoc(
        collection(
          db,
          "emergencyMultiAgencyDispatch"
        ),
        {

          emergencyId,

          ruleDocumentId,

          primaryAgency:
            primaryAgency.agencyName || "",

          primaryAgencyCode:
            primaryAgency.agencyCode || "",

          primaryAgencyType:
            primaryAgency.agencyType || "",

          secondaryAgency:
            secondaryAgency?.agencyName || "",

          secondaryAgencyCode:
            secondaryAgency?.agencyCode || "",

          secondaryAgencyType:
            secondaryAgency?.agencyType || "",

          tertiaryAgency:
            tertiaryAgency?.agencyName || "",

          tertiaryAgencyCode:
            tertiaryAgency?.agencyCode || "",

          tertiaryAgencyType:
            tertiaryAgency?.agencyType || "",

          dispatchedPrimary:
            true,

          dispatchedSecondary:
            false,

          dispatchedTertiary:
            false,

          dispatchCompleted:
            false,

          escalationLevel:
            0,

          governmentRouting,

          paramilitaryRouting,

          militaryRouting,

          satelliteBackup:
            false,

          registeredIncluraOnly:
            true,

          automaticAlert:
            true,

          ifseGenerated:
            true,

          paymentRequired:
            false,

          sosService:
            "Social Responsibility",

          gpsLatitude:
            Number(
              emergencyData?.gpsLatitude
            ) || 0,

          gpsLongitude:
            Number(
              emergencyData?.gpsLongitude
            ) || 0,

          gpsAccuracy:
            Number(
              emergencyData?.accuracy
            ) || 0,

          eventStatus:
            "Completed",

          visibleToGovernment:
            true,

          visibleToResponders:
            true,

          visibleToFamily:
            true,

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),

        }
      );


    console.log(
      "Multi-Agency Dispatch Created:",
      multiAgencyRef.id
    );


    // ==========================================================
    // STEP 17 — FINAL IFSE DISPATCH AUDIT
    // ==========================================================

    const finalAuditRef =
      await addDoc(
        collection(
          db,
          "emergencyTimeline"
        ),
        {

          timelineId:
            emergencyId +
            "_FINAL",

          emergencyId,

          eventType:
            "IFSE Dispatch Completed",

          eventDescription:
            "IFSE completed authoritative emergency routing, responder assignment, notification queue creation, and escalation registration.",

          performedBy:
            "IFSE Dispatch Engine",

          performerType:
            "System",

          ruleDocumentId,

          primaryAgency:
            primaryAgency.agencyName || "",

          primaryAgencyCode:
            primaryAgency.agencyCode || "",

          primaryAgencyType:
            primaryAgency.agencyType || "",

          secondaryAgency:
            secondaryAgency?.agencyName || "",

          secondaryAgencyCode:
            secondaryAgency?.agencyCode || "",

          secondaryAgencyType:
            secondaryAgency?.agencyType || "",

          tertiaryAgency:
            tertiaryAgency?.agencyName || "",

          tertiaryAgencyCode:
            tertiaryAgency?.agencyCode || "",

          tertiaryAgencyType:
            tertiaryAgency?.agencyType || "",

          responderId:
            responder.id,

          responderName:
            selectedResponderName,

          responderCollection,

          assignmentId:
            assignmentRef.id,

          timelineReference:
            timelineRef.id,

          escalationId:
            escalationResult?.escalationId ||
            "",

          multiAgencyDispatchId:
            multiAgencyRef.id,

          governmentRouting,

          paramilitaryRouting,

          militaryRouting,

          satelliteBackup:
            false,

          registeredIncluraOnly:
            true,

          automaticAlert:
            true,

          ifseGenerated:
            true,

          paymentRequired:
            false,

          sosService:
            "Social Responsibility",

          gpsLatitude:
            Number(
              emergencyData?.gpsLatitude
            ) || 0,

          gpsLongitude:
            Number(
              emergencyData?.gpsLongitude
            ) || 0,

          gpsAccuracy:
            Number(
              emergencyData?.accuracy
            ) || 0,

          eventStatus:
            "Completed",

          visibleToGovernment:
            true,

          visibleToResponders:
            true,

          visibleToFamily:
            true,

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),

        }
      );


    // ==========================================================
    // STEP 18 — FINAL DEBUG RECORD
    // ==========================================================

    await addDoc(
      collection(
        db,
        "dispatchDebug"
      ),
      {

        step:
          "STEP 18 — DISPATCH COMPLETED",

        emergencyId,

        ruleDocumentId,

        primaryAgency:
          primaryAgency.agencyName || "",

        primaryAgencyCode:
          primaryAgency.agencyCode || "",

        primaryAgencyType:
          primaryAgency.agencyType || "",

        secondaryAgency:
          secondaryAgency?.agencyName || "",

        secondaryAgencyCode:
          secondaryAgency?.agencyCode || "",

        secondaryAgencyType:
          secondaryAgency?.agencyType || "",

        tertiaryAgency:
          tertiaryAgency?.agencyName || "",

        tertiaryAgencyCode:
          tertiaryAgency?.agencyCode || "",

        tertiaryAgencyType:
          tertiaryAgency?.agencyType || "",

        responderCollection,

        responderId:
          responder.id,

        responderName:
          selectedResponderName,

        assignmentCreated:
          true,

        timelineCreated:
          true,

        escalationCreated:
          Boolean(
            escalationResult?.success
          ),

        multiAgencyDispatchCreated:
          true,

        finalAuditCreated:
          true,

        createdAt:
          serverTimestamp(),

      }
    );


    // ==========================================================
    // STEP 19 — SUCCESS
    // ==========================================================

    return {

      success:
        true,

      emergencyId,

      assigned:
        true,

      agency:
        primaryAgency.agencyName ||
        "",

      agencyCode:
        primaryAgency.agencyCode ||
        "",

      agencyType:
        primaryAgency.agencyType ||
        "",

      responderCollection,

      responderId:
        responder.id,

      responderName:
        selectedResponderName,

      emergencyService:
        emergencyData?.emergencyService ||
        "",

      registeredIncluraUser:
        Boolean(
          emergencyData?.userId
        ),

      healthcareRouting:
        emergencyData?.healthcareRouting ||
        "not_applicable",

      paymentRequired:
        false,

      sosService:
        "Social Responsibility",

      governmentAlertInitiated:
        governmentRouting,

      paramilitaryAlertInitiated:
        paramilitaryRouting,

      militaryAlertInitiated:
        militaryRouting,

      ruleDocumentId,

      assignmentId:
        assignmentRef.id,

      timelineId:
        timelineRef.id,

      escalationId:
        escalationResult?.escalationId ||
        "",

      multiAgencyDispatchId:
        multiAgencyRef.id,

      finalAuditId:
        finalAuditRef.id,

    };


  } catch (err) {


    console.error(
      "IFSE Dispatch Engine Error:",
      err
    );


    // ==========================================================
    // ERROR AUDIT
    // ==========================================================

    try {

      await addDoc(
        collection(
          db,
          "dispatchDebug"
        ),
        {

          step:
            "ERROR",

          emergencyId,

          message:
            err?.message ||
            "Unknown dispatch error",

          stack:
            err?.stack ||
            "",

          emergencyType:
            emergencyData?.emergencyType ||
            "",

          priority:
            emergencyData?.priority ||
            "",

          emergencyService:
            emergencyData?.emergencyService ||
            "",

          registeredIncluraUser:
            Boolean(
              emergencyData?.userId
            ),

          healthcareRouting:
            emergencyData?.healthcareRouting ||
            "not_applicable",

          paymentRequired:
            false,

          sosService:
            "Social Responsibility",

          createdAt:
            serverTimestamp(),

        }
      );

    } catch (
      debugError
    ) {

      console.error(
        "Unable to record IFSE dispatch error:",
        debugError
      );

    }


    return {

      success:
        false,

      emergencyId,

      assigned:
        false,

      error:
        err?.message ||
        "Emergency dispatch failed.",

    };

  }

}
