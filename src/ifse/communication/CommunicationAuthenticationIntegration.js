// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Communication Authentication Integration
// =======================================================

import {

  initializeCommunicationRuntime,

} from "./CommunicationRuntimeEngine";

export async function initializeUserCommunication(user) {

  if (!user) {

    return null;

  }

  initializeCommunicationRuntime(user);

  return true;

}
