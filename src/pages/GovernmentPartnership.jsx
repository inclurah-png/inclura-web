import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

import { partnerships as PARTNERSHIP_PLANS } from "../config";

const REQUEST_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  SECURITY_REVIEW: "security_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  ACTIVE: "active",
};

const CONTRACT_TYPES = [
  "Annual",
  "Two-Year",
  "Three-Year",
  "Five-Year",
  "Custom",
];

const GOVERNMENT_LEVELS = [
  "Federal",
  "State",
  "Local Government",
  "Agency",
  "Ministry",
  "Department",
  "Commission",
  "Parastatal",
];
function GovernmentPartnership() {

  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    setCurrentUser(user);
  });

  return unsubscribe;
}, []);

  const partnership =
    useMemo(() => {
      return PARTNERSHIP_PLANS.government;
    }, []);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");
  const [agencyName, setAgencyName] = useState("");
const [governmentLevel, setGovernmentLevel] = useState("Federal");
const [ministry, setMinistry] = useState("");
const [department, setDepartment] = useState("");

const [contactName, setContactName] = useState("");
const [position, setPosition] = useState("");
const [officialEmail, setOfficialEmail] = useState("");
const [officialPhone, setOfficialPhone] = useState("");

const [country, setCountry] = useState("");
const [state, setState] = useState("");
const [city, setCity] = useState("");
const [address, setAddress] = useState("");

const [contractType, setContractType] =
  useState("Annual");

const [estimatedCitizens, setEstimatedCitizens] =
  useState("");

const [projectDescription, setProjectDescription] =
  useState("");

const [accessibilityGoals, setAccessibilityGoals] =
  useState("");

const [acceptedTerms, setAcceptedTerms] =
  useState(false);

const [acceptedPrivacy, setAcceptedPrivacy] =
  useState(false);

const [acceptedSecurity, setAcceptedSecurity] =
  useState(false);

const [timeline, setTimeline] =
  useState([]);

const [reviewProgress, setReviewProgress] = useState({
  application: true,
  identityReview: false,
  securityReview: false,
  accessibilityReview: false,
  complianceReview: false,
  executiveApproval: false,
});

  useEffect(() => {

  setTimeline([
    {
      title: "Application Started",
      status: "Completed",
    },
    {
      title: "Government Identity Review",
      status: "Waiting",
    },
    {
      title: "IFSE Security Review",
      status: "Waiting",
    },
    {
      title: "Accessibility Compliance",
      status: "Waiting",
    },
    {
      title: "Compliance Review",
      status: "Waiting",
    },
    {
      title: "Executive Approval",
      status: "Waiting",
    },
  ]);

}, []);

  const governmentBenefits = [

  "Government Partnership Badge",

  "Dedicated Government Success Manager",

  "Accessibility Compliance Assistance",

  "Government Analytics Dashboard",

  "Priority Security Monitoring",

  "Enterprise API Access",

  "Dedicated Technical Support",

  "Policy & Compliance Assistance",

  "Early Platform Features",

];
  const securityLayers = [

  "Government Identity Verification",

  "IFSE Threat Intelligence Scan",

  "Accessibility Compliance Review",

  "Government Compliance Assessment",

  "AI Risk Assessment",

  "Manual Executive Review",

];
  const getReviewPercentage = () => {

  const values = Object.values(reviewProgress);

  const completed = values.filter(Boolean).length;

  return Math.round(
    (completed / values.length) * 100
  );

};
  const calculateRiskScore = () => {

  let score = 0;

  const approvedGovernmentDomains = [
  ".gov",
  ".gov.ng",
  ".gov.uk",
  ".gov.za",
  ".gov.au",
  ".gov.in",
];

const validGovernmentEmail =
  approvedGovernmentDomains.some(domain =>
    officialEmail.toLowerCase().endsWith(domain)
  );

if (!validGovernmentEmail) {
  score += 25;
}
  {
    score += 25;
  }

  if (!ministry.trim()) {
    score += 10;
  }

  if (!department.trim()) {
    score += 10;
  }

  if (!address.trim()) {
    score += 10;
  }

  if (estimatedCitizens) {

    const total = Number(estimatedCitizens);

    if (total > 10000000) {

      score += 25;

    } else if (total > 1000000) {

      score += 15;

    }

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
  const handleSubmit = async (e) => {

  e.preventDefault();

  setError("");
  setSuccess("");

  if (!currentUser) {

    setError("Please sign in.");

    return;

  }

if (
  !acceptedTerms ||
  !acceptedPrivacy ||
  !acceptedSecurity
) {

  setError(
    "Accept all agreements before continuing."
  );

  return;

}

const approvedGovernmentDomains = [
  ".gov",
  ".gov.ng",
  ".gov.uk",
  ".gov.za",
  ".gov.au",
  ".gov.in",
];

const validGovernmentEmail =
  approvedGovernmentDomains.some(domain =>
    officialEmail
      .toLowerCase()
      .endsWith(domain)
  );

if (!validGovernmentEmail) {

  setError(
    "Please use an official government email address."
  );

  return;

}

setLoading(true);

    return;

  }

  setLoading(true);

  try {

    const existing = query(

      collection(db, "governmentPartnerships"),

      const existing = query(
  collection(db, "governmentPartnerships"),
  where("agencyName", "==", agencyName),
  where("country", "==", country)
);

    );

    const snapshot =
      await getDocs(existing);

    if (!snapshot.empty) {

      setError(
        "A partnership request already exists."
      );

      setLoading(false);

      return;

    }

    const docRef = await addDoc(

      collection(
        db,
        "governmentPartnerships"
      ),

      {

        agencyName,

        governmentLevel,

        ministry,

        department,

        contactName,

        position,

        officialEmail,

        officialPhone,

        country,

        state,

        city,

        address,

        contractType,

        estimatedCitizens,

        projectDescription,

        accessibilityGoals,

        status:
          REQUEST_STATUS.SUBMITTED,

        reviewProgress,

        timeline,

        userId:
          currentUser.uid,

        riskScore,

        threatLevel,

        executiveReviewRequired:
  riskScore >= 70,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),

      }

    );

    await addDoc(

      collection(
        db,
        "ifseSecurityEvents"
      ),

      {

    await addDoc(
  collection(db, "verificationAuditLogs"),
  {
    action:
      "Government Partnership Submitted",
    performedBy:
      currentUser.uid,
    verificationId:
      docRef.id,
    createdAt:
      serverTimestamp(),
  }
);
        eventType:
          "government_partnership_created",

        partnershipId:
          docRef.id,

        userId:
          currentUser.uid,

        riskScore,

        threatLevel,

        reviewed: false,
        
resolved: false,
        
executiveReview:
    riskScore >= 70,

        createdAt:
          serverTimestamp(),

      }

    );

    setSuccess(
      "Government partnership request submitted successfully."
    );

    navigate("/verification-center");

  } catch (err) {

    console.error(err);

    setError(
      "Unable to submit request."
    );

  } finally {

    setLoading(false);

  }

};
  return (

  <DashboardLayout>

    <div className="government-partnership-page">

      <h1>Government Partnership</h1>

      <p>
        Apply for an official government partnership with
        Inclura.
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

        <section className="government-information">

  <h2>Government Information</h2>

  <div className="form-group">

    <label>Agency / Ministry Name *</label>

    <input
      type="text"
      value={agencyName}
      onChange={(e) => setAgencyName(e.target.value)}
      required
    />

  </div>

  <div className="form-group">

    <label>Government Level *</label>

    <select
      value={governmentLevel}
      onChange={(e) => setGovernmentLevel(e.target.value)}
    >

      {GOVERNMENT_LEVELS.map((level) => (

        <option
          key={level}
          value={level}
        >
          {level}
        </option>

      ))}

    </select>

  </div>

  <div className="form-group">

    <label>Ministry *</label>

    <input
      type="text"
      value={ministry}
      onChange={(e) => setMinistry(e.target.value)}
      required
    />

  </div>

  <div className="form-group">

    <label>Department / Agency *</label>

    <input
      type="text"
      value={department}
      onChange={(e) => setDepartment(e.target.value)}
      required
    />

  </div>

</section>
        <section className="government-contact">

  <h2>Government Contact</h2>

  <div className="form-group">

    <label>Contact Officer *</label>

    <input
      type="text"
      value={contactName}
      onChange={(e) => setContactName(e.target.value)}
      required
    />

  </div>

  <div className="form-group">

    <label>Position *</label>

    <input
      type="text"
      value={position}
      onChange={(e) => setPosition(e.target.value)}
      required
    />

  </div>

  <div className="form-group">

    <label>Official Government Email *</label>

    <input
      type="email"
      value={officialEmail}
      onChange={(e) => setOfficialEmail(e.target.value)}
      placeholder="name@agency.gov"
      required
    />

  </div>

  <div className="form-group">

    <label>Official Phone *</label>

    <input
      type="tel"
      value={officialPhone}
      onChange={(e) => setOfficialPhone(e.target.value)}
      required
    />

  </div>

</section>
        <section className="government-project">

  <h2>Partnership Details</h2>

  <div className="form-group">

    <label>Country *</label>

    <input
      type="text"
      value={country}
      onChange={(e) => setCountry(e.target.value)}
      required
    />

  </div>

  <div className="form-group">

    <label>State / Province *</label>

    <input
      type="text"
      value={state}
      onChange={(e) => setState(e.target.value)}
      required
    />

  </div>

  <div className="form-group">

    <label>City *</label>

    <input
      type="text"
      value={city}
      onChange={(e) => setCity(e.target.value)}
      required
    />

  </div>

  <div className="form-group">

    <label>Office Address *</label>

    <textarea
      rows={3}
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      required
    />

  </div>

  <div className="form-group">

    <label>Contract Type</label>

    <select
      value={contractType}
      onChange={(e) => setContractType(e.target.value)}
    >

      {CONTRACT_TYPES.map((type) => (

        <option key={type} value={type}>
          {type}
        </option>

      ))}

    </select>

  </div>

  <div className="form-group">

    <label>Estimated Citizens Impacted</label>

    <input
      type="number"
      value={estimatedCitizens}
      onChange={(e) => setEstimatedCitizens(e.target.value)}
    />

  </div>

  <div className="form-group">

    <label>Project Description</label>

    <textarea
      rows={5}
      value={projectDescription}
      onChange={(e) =>
        setProjectDescription(e.target.value)
      }
    />

  </div>

  <div className="form-group">

    <label>Accessibility Goals</label>

    <textarea
      rows={4}
      value={accessibilityGoals}
      onChange={(e) =>
        setAccessibilityGoals(e.target.value)
      }
    />

  </div>

</section>
        <section className="government-summary">

  <h2>Government Partnership Summary</h2>

  <p>
    <strong>Pricing:</strong> {partnership.pricing}
  </p>

  <p>
    <strong>Contract:</strong> {partnership.renewal}
  </p>

  <p>
    <strong>Badge:</strong> {partnership.badge}
  </p>

</section>

<section className="government-benefits">

  <h2>Government Partnership Benefits</h2>

  <ul>

    {governmentBenefits.map((item) => (

      <li key={item}>{item}</li>

    ))}

  </ul>

</section>

<section className="government-security">

  <h2>IFSE Security Assessment</h2>

  <ul>

    {securityLayers.map((item) => (

      <li key={item}>{item}</li>

    ))}

  </ul>

</section>

<section className="government-review">

  <h2>Review Progress</h2>

  <p>

    Completion: {getReviewPercentage()}%

  </p>

</section>

<section className="government-risk">

  <h2>Government Risk Assessment</h2>

  <p>

    Risk Score: {riskScore}%

  </p>

  <p>

    Threat Level: {threatLevel}

  </p>

</section>

<section className="government-agreements">

  <h2>Agreements</h2>

  <label>

    <input
      type="checkbox"
      checked={acceptedTerms}
      onChange={(e) =>
        setAcceptedTerms(e.target.checked)
      }
    />

    I accept the Government Partnership Agreement.

  </label>

  <br />

  <label>

    <input
      type="checkbox"
      checked={acceptedPrivacy}
      onChange={(e) =>
        setAcceptedPrivacy(e.target.checked)
      }
    />

    I accept the Privacy Policy.

  </label>

  <br />

  <label>

    <input
      type="checkbox"
      checked={acceptedSecurity}
      onChange={(e) =>
        setAcceptedSecurity(e.target.checked)
      }
    />

    I consent to IFSE Government verification.

  </label>

</section>

<div className="government-actions">

  <button
    type="submit"
    disabled={
      loading ||
      !acceptedTerms ||
      !acceptedPrivacy ||
      !acceptedSecurity
    }
  >

    {loading
      ? "Submitting..."
      : "Submit Government Partnership"}

  </button>

  <button
    type="button"
    onClick={() =>
      navigate("/verification-center")
    }
  >

    Cancel

  </button>

</div>

      </form>

    </div>

  </DashboardLayout>

  );
}

export default GovernmentPartnership;
