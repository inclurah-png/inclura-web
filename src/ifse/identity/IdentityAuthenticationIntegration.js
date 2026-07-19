// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Identity Authentication Integration
// =======================================================

import {

  initializeIdentityRuntime,

} from "./IdentityRuntimeEngine";

export async function initializeUserIdentity(user) {

  if (!user) {

    return null;

  }

  initializeIdentityRuntime(user);

  return true;

}
