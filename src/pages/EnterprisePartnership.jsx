import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

import {
  ENTERPRISE_PARTNERSHIP,
} from "../config/pricing";

const REQUEST_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  NEGOTIATION: "negotiation",
  APPROVED: "approved",
  REJECTED: "rejected",
  ACTIVE: "active",
  SUSPENDED: "suspended",
};

const CONTRACT_TYPES = [
  "Annual",
  "Two-Year",
  "Three-Year",
  "Five-Year",
  "Custom",
];

const PARTNERSHIP_TYPES = [
  "Enterprise",
  "Corporate",
  "Government",
];

function EnterprisePartnership() {

const navigate = useNavigate();

const currentUser = auth.currentUser;

const [loading, setLoading] =
  useState(false);

const [error, setError] =
  useState("");

const [success, setSuccess] =
  useState("");

const [organizationName, setOrganizationName] =
  useState("");

const [organizationType, setOrganizationType] =
  useState("");

const [registrationNumber, setRegistrationNumber] =
  useState("");

const [taxNumber, setTaxNumber] =
  useState("");

const [website, setWebsite] =
  useState("");

const [industry, setIndustry] =
  useState("");

const [contactName, setContactName] =
  useState("");

const [contactEmail, setContactEmail] =
  useState("");

const [contactPhone, setContactPhone] =
  useState("");

const [position, setPosition] =
  useState("");

const [country, setCountry] =
  useState("");

const [state, setState] =
  useState("");

const [city, setCity] =
  useState("");

const [address, setAddress] =
  useState("");

const [partnershipType, setPartnershipType] =
  useState("Enterprise");

const [contractType, setContractType] =
  useState("Annual");

const [estimatedUsers, setEstimatedUsers] =
  useState("");

const [customRequirements, setCustomRequirements] =
  useState("");

const partnershipFee = useMemo(() => {
  return ENTERPRISE_PARTNERSHIP;
}, []);

const [acceptedTerms, setAcceptedTerms] =
  useState(false);

const [acceptedPrivacy, setAcceptedPrivacy] =
  useState(false);

const [acceptedSecurity, setAcceptedSecurity] =
  useState(false);
const [timeline, setTimeline] = useState([]);

const [reviewProgress, setReviewProgress] = useState({
  application: true,
  security: false,
  accessibility: false,
  compliance: false,
  integration: false,
  approval: false,
});
useEffect(() => {
  if (!currentUser) return;

  setTimeline([
    {
      title: "Application Started",
      description: "Enterprise partnership application initialized.",
      date: new Date().toLocaleDateString(),
      status: "completed",
    },
    {
      title: "Awaiting Submission",
      description: "Complete the application and submit it for review.",
      date: "",
      status: "current",
    },
  ]);
}, [currentUser]);

const updateTimelineAfterSubmission = () => {
  setTimeline([
    {
      title: "Application Submitted",
      description: "Enterprise partnership request submitted.",
      date: new Date().toLocaleString(),
      status: "completed",
    },
    {
      title: "Security Review",
      description: "Pending security verification.",
      date: "",
      status: "pending",
    },
    {
      title: "Accessibility Review",
      description: "Pending accessibility audit.",
      date: "",
      status: "pending",
    },
    {
      title: "Compliance Review",
      description: "Pending legal and compliance verification.",
      date: "",
      status: "pending",
    },
    {
      title: "Deployment",
      description: "Will begin after approval.",
      date: "",
      status: "pending",
    },
  ]);
};

const getReviewPercentage = () => {
  const completed = Object.values(reviewProgress).filter(Boolean).length;
  const total = Object.keys(reviewProgress).length;
  return Math.round((completed / total) * 100);
};

const isApplicationReady = () => {
  return (
    organizationName &&
    organizationType &&
    registrationNumber &&
    contactName &&
    contactEmail &&
    contactPhone &&
    country &&
    acceptedTerms &&
    acceptedPrivacy &&
    acceptedSecurity
  );
};

const enterpriseBenefits = [
  "Dedicated Enterprise Account Manager",
  "Priority Technical Support (24/7)",
  "Verified Enterprise Badge",
  "Enterprise Analytics Dashboard",
  "Custom API Integrations",
  "Advanced Accessibility Suite",
  "Inclura Fortress Security Engine (IFSE)",
  "Dedicated Success Manager",
  "Enterprise Creator Network",
  "Government & Corporate Collaboration Tools",
  "Advanced Moderation Controls",
  "Organization-wide Account Management",
  "Priority AI Processing",
  "Custom Branding Options",
  "Dedicated Compliance Assistance",
];

const enterpriseModules = [
  {
    id: "verification",
    name: "Verification Center",
    enabled: true,
  },
  {
    id: "documents",
    name: "Verification Documents",
    enabled: true,
  },
  {
    id: "status",
    name: "Verification Status",
    enabled: true,
  },
  {
    id: "payments",
    name: "Verification Payment Engine",
    enabled: true,
  },
  {
    id: "ifse",
    name: "Inclura Fortress Security Engine",
    enabled: true,
  },
  {
    id: "analytics",
    name: "Enterprise Analytics",
    enabled: false,
  },
  {
    id: "api",
    name: "Developer API",
    enabled: false,
  },
];

const securityLayers = [
  "Zero Trust Authentication",
  "Device Fingerprinting",
  "Behavior Analysis",
  "Real-time Threat Detection",
  "Enterprise Audit Logs",
  "Immutable Security Events",
  "Administrator Approval",
  "Multi-factor Authentication",
  "Continuous Monitoring",
];

const enterpriseStatistics = {
  reviewCompletion: getReviewPercentage(),
  securityLayers: securityLayers.length,
  availableModules: enterpriseModules.length,
  enterpriseBenefits: enterpriseBenefits.length,
};

const calculateEnterpriseRisk = () => {
  let score = 0;

  if (!website.trim()) score += 15;

  if (!registrationNumber.trim()) score += 20;

  if (!taxNumber.trim()) score += 10;

  if (estimatedUsers) {
    const users = Number(estimatedUsers);

    if (users > 1000000) {
      score += 20;
    } else if (users > 100000) {
      score += 10;
    }
  }

  if (partnershipType === "Government") {
    score += 25;
  }

  return Math.min(score, 100);
};

const determineThreatLevel = (riskScore) => {
  if (riskScore >= 75) return "Critical";

  if (riskScore >= 50) return "High";

  if (riskScore >= 25) return "Medium";

  return "Low";
};

const checkDuplicateOrganization = async () => {
  const organizationQuery = query(
    collection(db, "enterprisePartnerships"),
    where("organizationName", "==", organizationName.trim())
  );

  const snapshot = await getDocs(organizationQuery);

  return !snapshot.empty;
};

const checkDuplicateEmail = async () => {
  const emailQuery = query(
    collection(db, "enterprisePartnerships"),
    where("contactEmail", "==", contactEmail.trim())
  );

  const snapshot = await getDocs(emailQuery);

  return !snapshot.empty;
};
  
<h1>Enterprise Partnership</h1>

<p>
Request an enterprise partnership with Inclura for
large-scale deployments, dedicated support,
advanced integrations, accessibility compliance,
and enterprise-grade security.
</p>

<hr />
  
<h2>Organisation Information</h2>

<input
  type="text"
  placeholder="Organisation Name"
  value={organizationName}
  onChange={(e) =>
    setOrganizationName(e.target.value)
  }
/>

<input
  type="text"
  placeholder="Organisation Type"
  value={organizationType}
  onChange={(e) =>
    setOrganizationType(e.target.value)
  }
/>

<input
  type="text"
  placeholder="Registration Number"
  value={registrationNumber}
  onChange={(e) =>
    setRegistrationNumber(e.target.value)
  }
/>

<input
  type="text"
  placeholder="Tax Registration Number"
  value={taxNumber}
  onChange={(e) =>
    setTaxNumber(e.target.value)
  }
/>

<input
  type="text"
  placeholder="Official Website"
  value={website}
  onChange={(e) =>
    setWebsite(e.target.value)
  }
/>

<input
  type="text"
  placeholder="Industry"
  value={industry}
  onChange={(e) =>
    setIndustry(e.target.value)
  }
/>

<h2>Primary Contact</h2>

<input
  type="text"
  placeholder="Full Name"
  value={contactName}
  onChange={(e) =>
    setContactName(e.target.value)
  }
/>

<input
  type="email"
  placeholder="Official Email"
  value={contactEmail}
  onChange={(e) =>
    setContactEmail(e.target.value)
  }
/>

<input
  type="text"
  placeholder="Phone Number"
  value={contactPhone}
  onChange={(e) =>
    setContactPhone(e.target.value)
  }
/>

<input
  type="text"
  placeholder="Job Position"
  value={position}
  onChange={(e) =>
    setPosition(e.target.value)
  }
/>

<h2>Headquarters</h2>

<input
  type="text"
  placeholder="Country"
  value={country}
  onChange={(e) =>
    setCountry(e.target.value)
  }
/>

<input
  type="text"
  placeholder="State"
  value={state}
  onChange={(e) =>
    setState(e.target.value)
  }
/>

<input
  type="text"
  placeholder="City"
  value={city}
  onChange={(e) =>
    setCity(e.target.value)
  }
/>

<textarea
  placeholder="Head Office Address"
  value={address}
  onChange={(e) =>
    setAddress(e.target.value)
  }
/>

<h2>Partnership</h2>

<select
  value={partnershipType}
  onChange={(e) =>
    setPartnershipType(e.target.value)
  }
>
  {PARTNERSHIP_TYPES.map((type) => (
    <option key={type}>
      {type}
    </option>
  ))}
</select>

<select
  value={contractType}
  onChange={(e) =>
    setContractType(e.target.value)
  }
>
  {CONTRACT_TYPES.map((type) => (
    <option key={type}>
      {type}
    </option>
  ))}
</select>

<input
  type="number"
  placeholder="Estimated Number of Users"
  value={estimatedUsers}
  onChange={(e) =>
    setEstimatedUsers(e.target.value)
  }
/>

<textarea
  rows={6}
  placeholder="Describe your technical, accessibility, compliance, AI, security or integration requirements..."
  value={customRequirements}
  onChange={(e) =>
    setCustomRequirements(e.target.value)
  }
/>

<hr />

<h2>Enterprise Partnership Benefits</h2>

<ul>
  <li>Dedicated Enterprise Account Manager</li>

  <li>Priority Technical Support (24/7)</li>

  <li>Enterprise-grade API Access</li>

  <li>Single Sign-On (SSO) Integration</li>

  <li>Advanced User Management</li>

  <li>Role-Based Administrative Controls</li>

  <li>Accessibility Compliance Assistance</li>

  <li>Enterprise Analytics Dashboard</li>

  <li>Dedicated Security Monitoring</li>

  <li>Priority Feature Requests</li>

  <li>Custom AI Integration Support</li>

  <li>Dedicated Creator & Campaign Support</li>

  <li>Government-ready Compliance Framework</li>

  <li>Enterprise Verification Badge</li>
</ul>

  <hr />

<h2>Pricing Summary</h2>

<p>

<strong>Pricing Model:</strong>

{" "}

{partnershipFee.pricingModel}

</p>

<p>

<strong>Annual Fee:</strong>

{" "}

{partnershipFee.yearlyUSD
  ? `$${partnershipFee.yearlyUSD.toLocaleString()}`
  : "Negotiation"}

</p>

<p>

<strong>Billing:</strong>

Annual Enterprise Contract

</p>

<hr />

<h2>Enterprise Deliverables</h2>

<ul>

<li>Dedicated onboarding</li>

<li>Deployment assistance</li>

<li>Security review</li>

<li>Accessibility audit</li>

<li>Staff training</li>

<li>Migration assistance</li>

<li>Integration consulting</li>

<li>Dedicated enterprise support</li>

<li>Priority infrastructure allocation</li>

<li>Service Level Agreement (SLA)</li>

</ul>

<hr />

<h2>Enterprise Review Progress</h2>

<div className="review-progress">
  {Object.entries(reviewProgress).map(([stage, completed]) => (
    <div
      key={stage}
      className="review-stage"
    >
      <strong>{stage}</strong>

      <p>
        {completed ? "Completed" : "Pending"}
      </p>
    </div>
  ))}
</div>

<hr />

<h2>Application Timeline</h2>

<div className="timeline">
  {timeline.map((item, index) => (
    <div
      key={index}
      className="timeline-item"
    >
      <strong>{item.title}</strong>

      <p>
        {item.completed
          ? "Completed"
          : "Awaiting"}
      </p>
    </div>
  ))}
</div>

<hr />

<h2>Legal Agreements</h2>

<label>

<input

type="checkbox"

checked={acceptedTerms}

onChange={(e)=>

setAcceptedTerms(e.target.checked)

}

/>

I agree to the Enterprise Terms & Conditions.

</label>

<label>

<input

type="checkbox"

checked={acceptedPrivacy}

onChange={(e)=>

setAcceptedPrivacy(e.target.checked)

}

/>

I agree to the Enterprise Privacy Policy.

</label>

<label>

<input

type="checkbox"

checked={acceptedSecurity}

onChange={(e)=>

setAcceptedSecurity(e.target.checked)

}

/>

I agree to Inclura Enterprise Security Policies.

</label>

<button
  type="button"
  onClick={submitEnterpriseRequest}
  disabled={loading}
>
  
Continue Enterprise Request

</button>

const submitEnterpriseRequest = async () => {
  setError("");
  setSuccess("");

  if (!currentUser) {
    setError("Please login first.");
    return;
  }

  if (!organizationName.trim()) {
    setError("Organization name is required.");
    return;
  }

  if (!contactName.trim()) {
    setError("Primary contact is required.");
    return;
  }

  if (!contactEmail.trim()) {
    setError("Official email is required.");
    return;
  }

  if (!country.trim()) {
    setError("Country is required.");
    return;
  }

  if (!acceptedTerms) {
    setError("You must accept the Terms.");
    return;
  }

  if (!acceptedPrivacy) {
    setError("You must accept the Privacy Policy.");
    return;
  }

  if (!acceptedSecurity) {
    setError("You must accept the Security Policy.");
    return;
  }

  if (!isApplicationReady()) {
  setError("Please complete all required fields before submitting.");
  return;
  }

const enterpriseRiskScore =
  calculateEnterpriseRisk();

const organizationExists =
  await checkDuplicateOrganization();

const emailExists =
  await checkDuplicateEmail();

if (organizationExists) {

  await addDoc(
    collection(db, "ifseSecurityEvents"),
    {
      eventType: "duplicate_organization",

      organizationName,

      userId: currentUser.uid,

      severity: "medium",

      createdAt: serverTimestamp(),
    }
  );

  setError(
    "An application already exists for this organization."
  );

  return;
}

if (emailExists) {

  await addDoc(
    collection(db, "ifseSecurityEvents"),
    {
      eventType: "duplicate_contact_email",

      contactEmail,

      userId: currentUser.uid,

      severity: "medium",

      createdAt: serverTimestamp(),
    }
  );

  setError(
    "This contact email already has an enterprise application."
  );

  return;
  }

const threatLevel =
  determineThreatLevel(
    enterpriseRiskScore
  );
  setLoading(true);

  try {
const partnershipId =
  "ENT-" +
  new Date().getFullYear() +
  "-" +
  Math.floor(
    100000 + Math.random() * 900000
  );

const contractReference =
  "CTR-" +
  Date.now() +
  "-" +
  Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase();
  
const docRef = await addDoc(
  collection(db, "enterprisePartnerships"),
  {
    userId: currentUser.uid,

    partnershipId,

    contractReference,

    organizationName,

    organizationType,

    registrationNumber,

    taxNumber,

    website,

    industry,

    contactName,

    contactEmail,

    contactPhone,

    position,

    country,

    state,

    city,

    address,

    partnershipType,

    contractType,

    estimatedUsers,

    customRequirements,

    pricingModel:
      partnershipFee.pricingModel,

    proposedFee:
      partnershipFee.yearlyUSD || null,

    status:
      REQUEST_STATUS.SUBMITTED,

    verificationStatus: "pending",

    approvedBy: "",

    approvedAt: null,

    contractSigned: false,

    contractDocument: "",

    assignedAccountManager: "",

    securityReview: "pending",

    accessibilityReview: "pending",

    integrationReview: "pending",

    deploymentStatus: "pending",

    enterpriseDashboardEnabled: false,

    corporateShieldEnabled: false,

    governmentSuiteEnabled: false,

    createdAt: serverTimestamp(),
  }
);

await addDoc(
  collection(db, "adminNotifications"),
  {

    type:
      "enterprise_partnership",

    partnershipId:
      docRef.id,

    organizationName,

    status:
      "unread",

    createdAt:
      serverTimestamp(),

  }
);

await addDoc(
  collection(db, "auditLogs"),
  {

    actor:
      currentUser.uid,

    action:
      "enterprise_partnership_created",

    resource:
      docRef.id,

    timestamp:
      serverTimestamp(),

  }
);

await addDoc(
  collection(db, "enterpriseReviewQueue"),
  {
    partnershipId: docRef.id,

    enterpriseId: partnershipId,

    organizationName,

    reviewStage: "initial",

    assignedReviewer: "",

    status: "pending",

    createdAt: serverTimestamp(),
  }
);

await addDoc(
  collection(db, "enterpriseRevenuePipeline"),
  {
    partnershipId: docRef.id,

    enterpriseId: partnershipId,

    pricingModel:
      partnershipFee.pricingModel,

    proposedFee:
      partnershipFee.yearlyUSD || null,

    negotiatedFee: null,

    contractSigned: false,

    invoiceIssued: false,

    paymentReceived: false,

    createdAt: serverTimestamp(),
  }
);
  
await addDoc(
  collection(db, "enterpriseTimeline"),
  {
    partnershipId: docRef.id,

    title: "Enterprise partnership submitted",

    description:
      "Awaiting administrator review.",

    createdBy: currentUser.uid,

    createdAt: serverTimestamp(),
  }
);

await addDoc(
  collection(db, "ifseSecurityEvents"),
  {
    eventType:
      "enterprise_partnership_created",

    enterpriseId: partnershipId,

    userId: currentUser.uid,

    severity: "low",

    riskScore: enterpriseRiskScore,

    threatLevel,

    automaticAssessment: true,

    requiresManualReview:
      enterpriseRiskScore >= 50,

    reviewed: false,

    createdAt: serverTimestamp(),
  }
);

  await addDoc(
  collection(db, "enterpriseContracts"),
  {
    partnershipId: docRef.id,

    enterpriseId: partnershipId,

    contractReference,

    organizationName,

    contractType,

    status: "draft",

    signedByEnterprise: false,

    signedByInclura: false,

    signedDate: null,

    expiresAt: null,

    renewalRequired: false,

    createdAt: serverTimestamp(),
  }
);

  await addDoc(
  collection(db, "enterpriseAccessRequests"),
  {
    partnershipId: docRef.id,

    enterpriseId: partnershipId,

    requestedModules: [],

    approvedModules: [],

    deniedModules: [],

    status: "pending",

    reviewedBy: "",

    createdAt: serverTimestamp(),
  }
);

  await addDoc(
  collection(db, "enterpriseDeploymentQueue"),
  {
    partnershipId: docRef.id,

    enterpriseId: partnershipId,

    deploymentStage: "waiting",

    deploymentEngineer: "",

    deploymentNotes: "",

    targetEnvironment: "production",

    createdAt: serverTimestamp(),
  }
);

  await addDoc(
  collection(db, "enterpriseSupport"),
  {
    partnershipId: docRef.id,

    enterpriseId: partnershipId,

    supportTier: "Enterprise",

    accountManager: "",

    sla: "24/7",

    activeTickets: 0,

    createdAt: serverTimestamp(),
  }
);

  await addDoc(
  collection(db, "enterpriseCompliance"),
  {
    partnershipId: docRef.id,

    enterpriseId: partnershipId,

    accessibilityReview: false,

    securityReview: false,

    privacyReview: false,

    legalReview: false,

    complianceScore: 0,

    createdAt: serverTimestamp(),
  }
);
  
setSuccess(
  "Enterprise partnership request submitted successfully."
);
updateTimelineAfterSubmission();

setReviewProgress({
  application: true,
  security: true,
  accessibility: false,
  compliance: false,
  integration: false,
  approval: false,
});
  
navigate("/verification-status");

} catch (err) {

  console.error(err);

  setError(
    "Unable to submit partnership request."
  );

} finally {

  setLoading(false);
}
};

  return (
  <DashboardLayout>
    <div className="enterprise-partnership-page">

      <div className="page-header">
        <h1>Enterprise Partnership</h1>

        <p>
          Partner with Inclura for enterprise accessibility,
          AI integration, secure infrastructure,
          compliance, creator ecosystem support,
          and dedicated enterprise services.
        </p>
      </div>
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

      {success && (
  <div className="enterprise-next-steps">

    <h3>Next Steps</h3>

    <p>
      Your Enterprise Partnership request has entered the
      Inclura verification pipeline.
    </p>

    <ul>
      <li>Identity verification</li>
      <li>Enterprise document review</li>
      <li>Security assessment</li>
      <li>Accessibility assessment</li>
      <li>Compliance review</li>
      <li>Administrator approval</li>
    </ul>

  </div>
)}

            <section className="enterprise-summary-card">

        <h2>Partnership Summary</h2>

        <p>
          <strong>Pricing Model:</strong>{" "}
          {partnershipFee.pricingModel}
        </p>

        <p>
          <strong>Estimated Annual Fee:</strong>{" "}
          {partnershipFee.yearlyUSD
            ? `$${partnershipFee.yearlyUSD.toLocaleString()}`
            : "Negotiation Based"}
        </p>

        <p>
          <strong>Billing:</strong> Annual Enterprise Contract
        </p>

      </section>

            <section className="enterprise-benefits">

        <h2>Enterprise Benefits</h2>

        <ul>

          <li>Dedicated Enterprise Account Manager</li>

          <li>24/7 Priority Support</li>

          <li>Enterprise Verification</li>

          <li>Advanced Accessibility Suite</li>

          <li>Corporate Security Shield</li>

          <li>Enterprise Analytics Dashboard</li>

          <li>Priority Feature Requests</li>

          <li>Dedicated API Access</li>

          <li>Compliance Assistance</li>

          <li>AI Integration Support</li>

        </ul>

      </section>

      <section className="enterprise-application">

  <h2>Enterprise Partnership Application</h2>

  <form
    onSubmit={(e) => {
      e.preventDefault();
      submitRequest();
    }}
  >

    <div className="form-group">
      <label>Organization Name *</label>

      <input
        type="text"
        value={organizationName}
        onChange={(e) =>
          setOrganizationName(e.target.value)
        }
        required
      />
    </div>

    <div className="form-group">
      <label>Organization Type *</label>

      <input
        type="text"
        value={organizationType}
        onChange={(e) =>
          setOrganizationType(e.target.value)
        }
        required
      />
    </div>

    <div className="form-group">
      <label>Registration Number *</label>

      <input
        type="text"
        value={registrationNumber}
        onChange={(e) =>
          setRegistrationNumber(e.target.value)
        }
        required
      />
    </div>

    <div className="form-group">
      <label>Tax Number</label>

      <input
        type="text"
        value={taxNumber}
        onChange={(e) =>
          setTaxNumber(e.target.value)
        }
      />
    </div>

        <hr />

    <h3>Primary Contact Information</h3>

    <div className="form-group">
      <label>Contact Person *</label>

      <input
        type="text"
        value={contactName}
        onChange={(e) =>
          setContactName(e.target.value)
        }
        required
      />
    </div>

    <div className="form-group">
      <label>Position / Job Title *</label>

      <input
        type="text"
        value={position}
        onChange={(e) =>
          setPosition(e.target.value)
        }
        required
      />
    </div>

    <div className="form-group">
      <label>Email Address *</label>

      <input
        type="email"
        value={contactEmail}
        onChange={(e) =>
          setContactEmail(e.target.value)
        }
        required
      />
    </div>

    <div className="form-group">
      <label>Phone Number *</label>

      <input
        type="tel"
        value={contactPhone}
        onChange={(e) =>
          setContactPhone(e.target.value)
        }
        required
      />
    </div>

    <div className="form-group">
      <label>Official Website</label>

      <input
        type="url"
        value={website}
        onChange={(e) =>
          setWebsite(e.target.value)
        }
        placeholder="https://example.com"
      />
    </div>

    <hr />

    <h3>Organization Address</h3>

    <div className="form-group">
      <label>Country *</label>

      <input
        type="text"
        value={country}
        onChange={(e) =>
          setCountry(e.target.value)
        }
        required
      />
    </div>

    <div className="form-group">
      <label>State / Province</label>

      <input
        type="text"
        value={state}
        onChange={(e) =>
          setState(e.target.value)
        }
      />
    </div>

    <div className="form-group">
      <label>City</label>

      <input
        type="text"
        value={city}
        onChange={(e) =>
          setCity(e.target.value)
        }
      />
    </div>

    <div className="form-group">
      <label>Office Address</label>

      <textarea
        rows={4}
        value={address}
        onChange={(e) =>
          setAddress(e.target.value)
        }
      />
    </div>

    
        <hr />

    <h3>Partnership Details</h3>

    <div className="form-group">
      <label>Partnership Type *</label>

      <select
        value={partnershipType}
        onChange={(e) =>
          setPartnershipType(e.target.value)
        }
      >
        {PARTNERSHIP_TYPES.map((type) => (
          <option
            key={type}
            value={type}
          >
            {type}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Contract Duration *</label>

      <select
        value={contractType}
        onChange={(e) =>
          setContractType(e.target.value)
        }
      >
        {CONTRACT_TYPES.map((contract) => (
          <option
            key={contract}
            value={contract}
          >
            {contract}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Estimated Number of Users</label>

      <input
        type="number"
        min="1"
        value={estimatedUsers}
        onChange={(e) =>
          setEstimatedUsers(e.target.value)
        }
      />
    </div>

    <div className="form-group">
      <label>Industry / Sector</label>

      <input
        type="text"
        value={industry}
        onChange={(e) =>
          setIndustry(e.target.value)
        }
      />
    </div>

    <div className="form-group">
      <label>
        Describe Your Partnership Requirements
      </label>

      <textarea
        rows={6}
        value={customRequirements}
        onChange={(e) =>
          setCustomRequirements(e.target.value)
        }
        placeholder="Tell us about your accessibility goals, security requirements, integrations, deployment expectations, compliance needs, AI services, or other enterprise requirements."
      />
    </div>

    <hr />

    <section className="enterprise-pricing-preview">

      <h3>Enterprise Partnership Overview</h3>

      <p>
        <strong>Pricing Model:</strong>{" "}
        {partnershipFee.pricingModel}
      </p>

      <p>
        <strong>Contract:</strong>{" "}
        {contractType}
      </p>

      <p>
        <strong>Estimated Fee:</strong>{" "}
        {partnershipFee.yearlyUSD
          ? `$${partnershipFee.yearlyUSD.toLocaleString()} per year`
          : "Negotiation Required"}
      </p>

      <p>
        Final pricing may change depending on
        deployment size, accessibility requirements,
        security level, cloud infrastructure,
        integrations, compliance obligations and
        support requirements.
      </p>

    </section>

    <section className="ifse-security-notice">

      <h3>Inclura Fortress Security Engine (IFSE)</h3>

      <p>
        Every Enterprise Partnership application
        undergoes automated and administrator security
        review. Risk scoring, duplicate detection,
        compliance verification and accessibility
        assessment are performed before approval.
      </p>

    </section>  

    <hr />

    <h3>Agreements & Declarations</h3>

    <div className="form-group">
      <label>
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) =>
            setAcceptedTerms(e.target.checked)
          }
        />
        {" "}
        I agree to the Inclura Enterprise Partnership
        Terms and Conditions.
      </label>
    </div>

    <div className="form-group">
      <label>
        <input
          type="checkbox"
          checked={acceptedPrivacy}
          onChange={(e) =>
            setAcceptedPrivacy(e.target.checked)
          }
        />
        {" "}
        I agree to the Privacy Policy and data
        processing requirements.
      </label>
    </div>

    <div className="form-group">
      <label>
        <input
          type="checkbox"
          checked={acceptedSecurity}
          onChange={(e) =>
            setAcceptedSecurity(e.target.checked)
          }
        />
        {" "}
        I agree to the Inclura Fortress Security Engine
        (IFSE) verification and security review process.
      </label>
    </div>

    <hr />

    <section className="enterprise-review-progress">

      <h3>Application Progress</h3>

      <p>
        Completion: {getReviewPercentage()}%
      </p>

      <ul>

        <li>
          Application:
          {reviewProgress.application ? " ✔" : " ○"}
        </li>

        <li>
          Security:
          {reviewProgress.security ? " ✔" : " ○"}
        </li>

        <li>
          Accessibility:
          {reviewProgress.accessibility ? " ✔" : " ○"}
        </li>

        <li>
          Compliance:
          {reviewProgress.compliance ? " ✔" : " ○"}
        </li>

        <li>
          Integration:
          {reviewProgress.integration ? " ✔" : " ○"}
        </li>

        <li>
          Approval:
          {reviewProgress.approval ? " ✔" : " ○"}
        </li>

      </ul>

    </section>

    <hr />

    <section className="enterprise-timeline">

      <h3>Application Timeline</h3>

      {timeline.map((item, index) => (

        <div
          key={index}
          className="timeline-item"
        >

          <strong>{item.title}</strong>

          {item.description && (
            <p>{item.description}</p>
          )}

          {item.date && (
            <small>{item.date}</small>
          )}

          <p>Status: {item.status}</p>

        </div>

      ))}

    </section>

        <hr />

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

    <div className="enterprise-actions">

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
          ? "Submitting Application..."
          : "Submit Enterprise Partnership Request"}
      </button>

      <button
        type="button"
        onClick={() =>
          navigate("/verification-center")
        }
      >
        Back to Verification Center
      </button>

    </div>

  </form>

</section>

<section className="enterprise-footer">

  <p>
    Enterprise Partnerships are reviewed by the
    Inclura Enterprise Review Team together with
    the Inclura Fortress Security Engine (IFSE).
    Submission does not guarantee approval.
  </p>

</section>

</div>

</DashboardLayout>

);
}

export default EnterprisePartnership;
    

  



