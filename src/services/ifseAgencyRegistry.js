import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

export async function resolveIFSEAgency(agencyName) {
  if (!agencyName) {
    throw new Error(
      "IFSE Agency Registry Error: Agency name is missing."
    );
  }

  const agencyQuery = query(
    collection(db, "ifseAgencyRegistry"),
    where("agencyName", "==", agencyName),
    where("active", "==", true),
    where("governmentAuthorized", "==", true),
    where("ifseVerifiedRequired", "==", true)
  );

  const snapshot = await getDocs(agencyQuery);

  if (snapshot.empty) {
    throw new Error(
      `IFSE Agency Registry Error: No active authorized registry entry exists for "${agencyName}".`
    );
  }

  const agencyDoc = snapshot.docs[0];

  return {
    registryId: agencyDoc.id,
    ...agencyDoc.data(),
  };
}
