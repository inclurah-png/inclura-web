import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  auth,
  db,
  storage,
} from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

import { VERIFICATION_PLANS } from "../config";

function VerificationDocuments() {

const navigate = useNavigate();

const currentUser = auth.currentUser;
  
const IFSE_STAGES = [

"Identity Verification",

"Document Authentication",

"Fraud Detection",

"OCR Extraction",

"AI Analysis",

"Accessibility Validation",

"Risk Assessment",

"Executive Review",

"Final Approval",

];

const VERIFICATION_TYPES = [

"Creator",

"Group",

"Organization",

"NGO",

"Institution",

"Religious",

"Healthcare",

"Museum",

"Tourism",

"Entertainment",

"Media",

"Accessibility",

"Corporate",

"Government",

"Enterprise",

];

const SECURITY_LAYERS = [

"Identity Verification",

"Document Authenticity",

"Duplicate Detection",

"Forgery Detection",

"Metadata Analysis",

"OCR Extraction",

"AI Fraud Detection",

"Malware Scan",

"Accessibility Compliance",

"Executive Approval",

"Continuous Monitoring",

];

const [loading, setLoading] = useState(false);

const [error, setError] = useState("");

const [success, setSuccess] = useState("");

const [verificationType, setVerificationType] =
useState("Creator");

const [organizationName, setOrganizationName] =
useState("");

const [country, setCountry] =
useState("");

const [state, setState] =
useState("");

const [city, setCity] =
useState("");

const [contactName, setContactName] =
useState("");

const [contactEmail, setContactEmail] =
useState("");

const [notes, setNotes] =
useState("");

const ALLOWED_FILE_TYPES = [

  "application/pdf",

  "image/jpeg",

  "image/jpg",

  "image/png",

];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const DOCUMENT_REQUIREMENTS = useMemo(() => ({

  Creator: [
    "Government ID",
    "Recent Selfie",
  ],

  Group: [
    "Group Registration",
    "Administrator ID",
  ],

  Organization: [
    "Organization Registration Certificate",
    "Tax Certificate",
    "Authorized Representative ID",
  ],

  NGO: [
    "NGO Registration Certificate",
    "Tax Exemption Certificate",
    "Director ID",
  ],

  Institution: [
    "Institution Registration",
    "Accreditation Certificate",
    "Principal / Vice Chancellor ID",
  ],

  Religious: [
  "Religious Registration Certificate",
  "Leader Identification",
],
  
  Healthcare: [
    "Medical License",
    "Hospital Registration",
    "Healthcare Accreditation",
    "Medical Director ID",
  ],

  Museum: [
  "Museum Registration",
  "Operating License",
  "Curator Identification",
],

Tourism: [
  "Tourism Registration",
  "Operating License",
  "Business Registration",
],

Entertainment: [
  "Business Registration",
  "Venue Operating License",
  "Management Identification",
],

Accessibility: [
  "Accessibility Audit Request",
  "Organization Registration",
],
  
  Media: [
    "Media License",
    "Broadcast / Publishing Registration",
    "Editor ID",
  ],

  Corporate: [
    "Business Registration",
    "Tax Certificate",
    "Director ID",
    "Proof of Address",
  ],

  Government: [
    "Government Authorization Letter",
    "Agency Registration",
    "Official ID",
  ],

  Enterprise: [
    "Certificate of Incorporation",
    "Corporate Profile",
    "Directors Information",
    "Tax Clearance",
    "Proof of Headquarters",
  ],

}), []);
  
  const [uploadedDocuments, setUploadedDocuments] =
useState({});
  
  const handleDocumentUpload = (documentName, file) => {

  if (!file) return;

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {

    alert(

      "Only PDF, JPG, JPEG and PNG files are allowed."

    );

    return;

  }

  if (file.size > MAX_FILE_SIZE) {

    alert(

      "Document size must not exceed 10 MB."

    );

    return;

  }

  setUploadedDocuments((previous) => ({

    ...previous,

    [documentName]: {

      file,

      uploaded: false,

      uploadProgress: 0,

      fileName: file.name,

      fileType: file.type,

      fileSize: file.size,

      validated: true,

    },

  }));

};
  const calculateRiskScore = () => {

  let score = 0;

  if (!contactName.trim()) score += 10;

  if (!contactEmail.trim()) score += 10;

  if (!country.trim()) score += 5;

  if (!state.trim()) score += 5;

  if (!city.trim()) score += 5;

  if (
    verificationType === "Enterprise" &&
    !organizationName.trim()
  ) {
    score += 20;
  }

  if (
    verificationType === "Corporate" &&
    !organizationName.trim()
  ) {
    score += 15;
  }

  if (
    verificationType === "Government" &&
    !organizationName.trim()
  ) {
    score += 15;
  }
    
if (
  verificationType === "Religious" &&
  !organizationName.trim()
) {
  score += 10;
}

if (
  verificationType === "Museum" &&
  !organizationName.trim()
) {
  score += 10;
}

if (
  verificationType === "Tourism" &&
  !organizationName.trim()
) {
  score += 10;
}

if (
  verificationType === "Entertainment" &&
  !organizationName.trim()
) {
  score += 10;
}

if (
  verificationType === "Accessibility" &&
  !organizationName.trim()
) {
  score += 10;
}
  return Math.min(score, 100);

};
  const riskScore = calculateRiskScore();
  const threatLevel =

  riskScore >= 75
    ? "High"
    : riskScore >= 40
    ? "Medium"
    : "Low";
  const executiveReviewRequired =

  verificationType === "Enterprise" ||

  verificationType === "Corporate" ||

  verificationType === "Government" ||

  riskScore >= 60;
  const handleSubmit = async (e) => {

  e.preventDefault();

  setError("");

  setSuccess("");

  if (!currentUser) {

    setError("Please sign in first.");

    return;

  }

  if (!contactName.trim()) {

    setError("Contact name is required.");

    return;

  }

  if (!contactEmail.trim()) {

    setError("Contact email is required.");

    return;

  }

  setLoading(true);

  try {

    const requestRef = await addDoc(

      collection(db, "verificationRequests"),

      {

        verificationType,

        organizationName,

        contactName,

        contactEmail,

        country,

        state,

        city,

        notes,

        riskScore,

        threatLevel,

        executiveReviewRequired,

        status: "submitted",

        submittedBy: currentUser.uid,

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),

      }

    );

    const verificationId = requestRef.id;
        const uploadedFiles = {};

for (const [documentName, documentInfo] of Object.entries(uploadedDocuments)) {

  if (!documentInfo?.file) continue;

  const storagePath =
    `verificationDocuments/${verificationId}/${Date.now()}_${documentInfo.file.name}`;

  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, documentInfo.file);

  const downloadURL =
    await getDownloadURL(storageRef);

  uploadedFiles[documentName] = {

    fileName: documentInfo.file.name,

    fileSize: documentInfo.file.size,

    fileType: documentInfo.file.type,

    storagePath,

    downloadURL,

    uploadedAt: new Date().toISOString(),

  };

}

await addDoc(

  collection(db, "verificationDocuments"),

  {

    verificationId,

    verificationType,

    uploadedDocuments: uploadedFiles,

    submittedBy: currentUser.uid,

    createdAt: serverTimestamp(),

  }

);
        await addDoc(

      collection(db, "verificationTimeline"),

      {

        verificationId,

        title: "Verification Submitted",

        status: "Completed",

        createdAt: serverTimestamp(),

      }

    );
        await addDoc(

      collection(db, "ifseSecurityEvents"),

      {

        verificationId,

        eventType: "verification_created",

        verificationType,

        riskScore,

        threatLevel,

        executiveReviewRequired,

        reviewed: false,

        createdAt: serverTimestamp(),

      }

    );
        await addDoc(

      collection(db, "verificationAuditLogs"),

      {

        verificationId,

        action: "Verification Submitted",

        actor: currentUser.uid,

        createdAt: serverTimestamp(),

      }

    );

    setSuccess(

      "Verification documents submitted successfully."

    );

    navigate("/verification-status");

  }

  catch (err) {

    console.error(err);

    setError(

      "Unable to submit verification."

    );

  }

  finally {

    setLoading(false);

  }

};
  return (

<DashboardLayout>

<div className="verification-documents-page">

<h1>IFSE Verification Documents</h1>

<p>

Upload your verification documents securely.

Every submission is protected by the

<strong> Inclura Fortress Security Engine (IFSE)</strong>.

</p>

{error && (

<div className="error-message">

{error}

</div>

)}

{success && (

<div className="success-message">

{success}

</div>

)}

<form onSubmit={handleSubmit}>
  <section>

<h2>Verification Type</h2>

<select

value={verificationType}

onChange={(e)=>

setVerificationType(e.target.value)

}

>

{VERIFICATION_TYPES.map(type=>(

<option

key={type}

value={type}

>

{type}

</option>

))}

</select>

</section>
  <section>

<h2>Applicant Information</h2>

<input

type="text"

placeholder="Organization / Company Name"

value={organizationName}

onChange={(e)=>

setOrganizationName(e.target.value)

}

/>

<input

type="text"

placeholder="Contact Name"

value={contactName}

onChange={(e)=>

setContactName(e.target.value)

}

required

/>

<input

type="email"

placeholder="Contact Email"

value={contactEmail}

onChange={(e)=>

setContactEmail(e.target.value)

}

required

/>

<input

type="text"

placeholder="Country"

value={country}

onChange={(e)=>

setCountry(e.target.value)

}

/>

<input

type="text"

placeholder="State"

value={state}

onChange={(e)=>

setState(e.target.value)

}

/>

<input

type="text"

placeholder="City"

value={city}

onChange={(e)=>

setCity(e.target.value)

}

/>

<textarea

rows={4}

placeholder="Additional Notes"

value={notes}

onChange={(e)=>

setNotes(e.target.value)

}

/>

</section>
  <section>

<h2>Required Documents</h2>

{

DOCUMENT_REQUIREMENTS[verificationType]

.map(document=>(

<div

key={document}

className="document-upload"

>

<label>

{document}

</label>

<input

type="file"

accept=".pdf,.jpg,.jpeg,.png"

onChange={(e)=>

handleDocumentUpload(

document,

e.target.files[0]

)

}

/>

</div>

))

}

</section>
  <section className="ifse-security-dashboard">

<h2>IFSE Security Assessment</h2>

<p>

<strong>Risk Score:</strong> {riskScore}%

</p>

<p>

<strong>Threat Level:</strong> {threatLevel}

</p>

<p>

<strong>Executive Review:</strong>

{executiveReviewRequired ? " Required" : " Not Required"}

</p>

</section>
  <section className="ifse-layers">

<h2>IFSE Protection Layers</h2>

<ul>

{SECURITY_LAYERS.map(layer => (

<li key={layer}>

✅ {layer}

</li>

))}

</ul>

</section>
  <section className="verification-workflow">

<h2>Verification Workflow</h2>

<ol>

{IFSE_STAGES.map(stage => (

<li key={stage}>

{stage}

</li>

))}

</ol>

</section>
  <section className="verification-plan">

<h2>Selected Verification</h2>

<p>

<strong>Type:</strong> {verificationType}

</p>

<p>

Pricing and renewal will automatically follow the
selected verification plan in pricing.js.

</p>

</section>
  <section className="ifse-notice">

<h2>IFSE Notice</h2>

<p>

Every submitted document is protected by the
Inclura Fortress Security Engine (IFSE).

Documents are scanned for:

</p>

<ul>

<li>Identity Verification</li>

<li>Forgery Detection</li>

<li>Duplicate Detection</li>

<li>AI Fraud Detection</li>

<li>OCR Analysis</li>

<li>Malware Scanning</li>

<li>Accessibility Compliance</li>

<li>Executive Review</li>

</ul>

</section>
  <div className="verification-actions">

<button

type="submit"

disabled={loading}

>

{loading

? "Submitting..."

: "Submit Verification"}

</button>

<button

type="button"

onClick={() => navigate("/verification-center")}

>

Cancel

</button>

</div>
  </form>

</div>

</DashboardLayout>

);

}

export default VerificationDocuments;
