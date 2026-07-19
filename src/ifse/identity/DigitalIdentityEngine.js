// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Digital Identity Engine
// =======================================================

import { evaluateIdentity } from "../identity";

import { evaluateDeviceTrust }
  from "./DeviceTrustEngine";

import { evaluateSessionTrust }
  from "./SessionTrustEngine";

export function evaluateDigitalIdentity(request) {

  const identity =
    evaluateIdentity(request);

  const device =
    evaluateDeviceTrust(request);

  const session =
    evaluateSessionTrust(request);

  const score = Math.round(

    (
      identity.score +
      device.trustScore +
      session.trustScore

    ) / 3

  );

  const issues = [

    ...identity.issues,

    ...device.issues,

    ...session.issues,

  ];

  return {

    engine: "Digital Identity Engine",

    identity,

    device,

    session,

    digitalIdentityTrusted:

      score >= 70,

    score,

    passed:

      score >= 70,

    issues,

  };

}
