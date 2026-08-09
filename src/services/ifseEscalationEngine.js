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

import { db } from "../firebase";

export async function createEmergencyEscalation(emergencyData) {
const emergencyId = emergencyData?.id || "";

if (!emergencyId) {
throw new Error("Emergency ID is missing.");
}

const ruleQuery = query(
collection(db, "emergencyResponseRules"),
where(
"emergencyType",
"==",
emergencyData.emergencyType
),
where("active", "==", true)
);

const ruleSnapshot = await getDocs(ruleQuery);

if (ruleSnapshot.empty) {
  throw new Error(
    `No active emergency response rule found for ${emergencyData.emergencyType}.`
  );
}

const ruleDoc = ruleSnapshot.docs[0];
const rule = ruleDoc.data();

const escalationRef = await addDoc(
collection(db, "emergencyEscalationQueue"),
{
emergencyId,

emergencyType:  
    emergencyData.emergencyType || "",  

  priority:  
    emergencyData.priority ||  
    rule.priority ||  
    "Low",  

  ruleDocumentId: ruleDoc.id,  

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
};
}

export async function runIFSEEscalationEngine() {
try {
const escalationQuery = query(
collection(db, "emergencyEscalationQueue"),
where("status", "==", "Waiting")
);

const snapshot = await getDocs(escalationQuery);  

for (const escalationDoc of snapshot.docs) {  
  const escalation = escalationDoc.data();  

  const createdAt =  
    escalation.createdAt?.toDate();  

  if (!createdAt) continue;  

  const elapsedMinutes = Math.floor(  
    (Date.now() - createdAt.getTime()) /  
      60000  
  );  

  const limit =  
    Number(escalation.escalationMinutes) || 0;  

  if (elapsedMinutes >= limit) {  
    await updateDoc(  
      doc(  
        db,  
        "emergencyEscalationQueue",  
        escalationDoc.id  
      ),  
      {  
        status: "Escalating",  

        escalationLevel:  
          (Number(  
            escalation.escalationLevel  
          ) || 0) + 1,  

        updatedAt: serverTimestamp(),  
      }  
    );  
  }  
}  

return {  
  success: true,  
  processed: snapshot.size,  
};

} catch (error) {
console.error(
"IFSE Escalation Engine Error:",
error
);

return {  
  success: false,  
  error: error.message,  
};

}
  }
