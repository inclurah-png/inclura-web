import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import {
  getAuth,
} from "firebase/auth";

import { db } from "../firebase";

/**
 * CareGig Service
 *
 * Handles CareGig request persistence.
 *
 * Current scope:
 * - Create care requests
 * - Attach authenticated user ownership
 * - Preserve accessibility and communication requirements
 * - Establish request status
 * - Record creation timestamps
 *
 * Future scope:
 * - IFSE verification
 * - Fraud and duplicate detection
 * - Provider matching
 * - Applications and acceptance
 * - Scheduling
 * - Safety/reporting workflows
 * - Audit events
 *
 * IMPORTANT:
 * Client-side validation is not a security boundary.
 * Firestore Security Rules and trusted backend/IFSE services
 * must enforce ownership, permissions, and protected fields.
 */

const CARE_REQUESTS_COLLECTION =
  "careRequests";

const INITIAL_REQUEST_STATUS =
  "open";

const ALLOWED_URGENCY_VALUES = [
  "low",
  "normal",
  "high",
];

const ALLOWED_COMMUNICATION_VALUES = [
  "text",
  "voice",
  "video",
  "any",
];

/**
 * Create a new CareGig request.
 *
 * @param {Object} requestData
 * @returns {Promise<Object>}
 */
export async function createCareRequest(
  requestData
) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "AUTHENTICATION_REQUIRED"
    );
  }

  if (
    !requestData ||
    typeof requestData !== "object"
  ) {
    throw new Error(
      "INVALID_REQUEST_DATA"
    );
  }

  const serviceType =
    typeof requestData.serviceType ===
    "string"
      ? requestData.serviceType.trim()
      : "";

  const description =
    typeof requestData.description ===
    "string"
      ? requestData.description.trim()
      : "";

  const location =
    typeof requestData.location ===
    "string"
      ? requestData.location.trim()
      : "";

  const preferredDate =
    typeof requestData.preferredDate ===
    "string"
      ? requestData.preferredDate.trim()
      : "";

  const preferredTime =
    typeof requestData.preferredTime ===
    "string"
      ? requestData.preferredTime.trim()
      : "";

  const urgency =
    typeof requestData.urgency ===
    "string"
      ? requestData.urgency.trim()
      : "normal";

  const communicationPreference =
    typeof requestData.communicationPreference ===
    "string"
      ? requestData.communicationPreference.trim()
      : "";

  const accessibilityNeeds =
    typeof requestData.accessibilityNeeds ===
    "string"
      ? requestData.accessibilityNeeds.trim()
      : "";

  if (!serviceType) {
    throw new Error(
      "SERVICE_TYPE_REQUIRED"
    );
  }

  if (!description) {
    throw new Error(
      "DESCRIPTION_REQUIRED"
    );
  }

  if (!location) {
    throw new Error(
      "LOCATION_REQUIRED"
    );
  }

  if (!preferredDate) {
    throw new Error(
      "PREFERRED_DATE_REQUIRED"
    );
  }

  if (
    !ALLOWED_URGENCY_VALUES.includes(
      urgency
    )
  ) {
    throw new Error(
      "INVALID_URGENCY"
    );
  }

  if (
    communicationPreference &&
    !ALLOWED_COMMUNICATION_VALUES.includes(
      communicationPreference
    )
  ) {
    throw new Error(
      "INVALID_COMMUNICATION_PREFERENCE"
    );
  }

  const careRequest = {
    requesterId: user.uid,

    serviceType,

    description,

    location,

    preferredDate,

    preferredTime,

    urgency,

    communicationPreference,

    accessibilityNeeds,

    status: INITIAL_REQUEST_STATUS,

    providerId: null,

    applicationCount: 0,

    selectedProviderId: null,

    ifseVerified: false,

    ifseReviewRequired: true,

    safetyReviewStatus: "pending",

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),
  };

  try {
    const requestReference =
      await addDoc(
        collection(
          db,
          CARE_REQUESTS_COLLECTION
        ),
        careRequest
      );

    return {
      success: true,

      requestId:
        requestReference.id,

      collection:
        CARE_REQUESTS_COLLECTION,
    };
  } catch (error) {
    console.error(
      "CareGig request creation failed:",
      error
    );

    throw new Error(
      "CARE_REQUEST_CREATION_FAILED"
    );
  }
}

export default {
  createCareRequest,
};
