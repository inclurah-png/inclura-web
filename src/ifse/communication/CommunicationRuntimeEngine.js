// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Communication Runtime Engine
// =======================================================

let runtimeState = {

  initialized: false,

  currentUser: null,

  communicationProfile: null,

  activeModules: {},

  lastUpdated: null,

};

const runtimeListeners = [];

export function initializeCommunicationRuntime(user) {

  runtimeState.initialized = true;

  runtimeState.currentUser = user;

  runtimeState.lastUpdated = new Date().toISOString();

  return runtimeState;

}

export function getCommunicationRuntime() {

  return runtimeState;

}

export function updateCommunicationRuntime(update) {

  runtimeState = {

    ...runtimeState,

    ...update,

    lastUpdated: new Date().toISOString(),

  };

  notifyCommunicationListeners();

  return runtimeState;

}

export function subscribeCommunication(listener) {

  runtimeListeners.push(listener);

  return () => {

    const index = runtimeListeners.indexOf(listener);

    if (index >= 0) {

      runtimeListeners.splice(index, 1);

    }

  };

}

export function notifyCommunicationListeners() {

  runtimeListeners.forEach((listener) => {

    listener(runtimeState);

  });

}

export function shutdownCommunicationRuntime() {

  runtimeState = {

    initialized: false,

    currentUser: null,

    communicationProfile: null,

    activeModules: {},

    lastUpdated: null,

  };

  return runtimeState;

}
