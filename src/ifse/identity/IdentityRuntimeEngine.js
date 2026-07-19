// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Identity Runtime Engine
// =======================================================

let runtimeState = {

  initialized: false,

  currentUser: null,

  identityProfile: null,

  activeModules: {},

  lastUpdated: null,

};

const runtimeListeners = [];

export function initializeIdentityRuntime(user) {

  runtimeState.initialized = true;

  runtimeState.currentUser = user;

  runtimeState.lastUpdated = new Date().toISOString();

  return runtimeState;

}

export function getIdentityRuntime() {

  return runtimeState;

}

export function updateIdentityRuntime(update) {

  runtimeState = {

    ...runtimeState,

    ...update,

    lastUpdated: new Date().toISOString(),

  };

  notifyIdentityListeners();

  return runtimeState;

}

export function subscribeIdentity(listener) {

  runtimeListeners.push(listener);

  return () => {

    const index = runtimeListeners.indexOf(listener);

    if (index >= 0) {

      runtimeListeners.splice(index, 1);

    }

  };

}

export function notifyIdentityListeners() {

  runtimeListeners.forEach((listener) => {

    listener(runtimeState);

  });

}

export function shutdownIdentityRuntime() {

  runtimeState = {

    initialized: false,

    currentUser: null,

    identityProfile: null,

    activeModules: {},

    lastUpdated: null,

  };

  return runtimeState;

}
