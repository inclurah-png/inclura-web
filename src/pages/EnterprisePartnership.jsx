import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
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

import {
  PARTNERSHIP_PLANS,
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

  const navigate =
    useNavigate();

  const currentUser =
    auth.currentUser;
    const [loading,
    setLoading] =
    useState(false);

  const [error,
    setError] =
    useState("");

  const [success,
    setSuccess] =
    useState("");

  const [organizationName,
    setOrganizationName] =
    useState("");

  const [organizationType,
    setOrganizationType] =
    useState("");

  const [registrationNumber,
    setRegistrationNumber] =
    useState("");

  const [taxNumber,
    setTaxNumber] =
    useState("");

  const [website,
    setWebsite] =
    useState("");

  const [industry,
    setIndustry] =
    useState("");

  const [contactName,
    setContactName] =
    useState("");

  const [contactEmail,
    setContactEmail] =
    useState("");

  const [contactPhone,
    setContactPhone] =
    useState("");

  const [position,
    setPosition] =
    useState("");

  const [country,
    setCountry] =
    useState("");

  const [state,
    setState] =
    useState("");

  const [city,
    setCity] =
    useState("");

  const [address,
    setAddress] =
    useState("");

  const [partnershipType,
    setPartnershipType] =
    useState("Enterprise");

  const [contractType,
    setContractType] =
    useState("Annual");

  const [estimatedUsers,
    setEstimatedUsers] =
    useState("");

  const [customRequirements,
    setCustomRequirements] =
    useState("");

  const partnershipFee =
  useMemo(() => {

    return PARTNERSHIP_PLANS.enterprise;

  }, []);

  const [acceptedTerms,
    setAcceptedTerms] =
    useState(false);

  const [acceptedPrivacy,
    setAcceptedPrivacy] =
    useState(false);

  const [acceptedSecurity,
    setAcceptedSecurity] =
    useState(false);

  const [timeline,
    setTimeline] =
    useState([]);

  const [reviewProgress,
    setReviewProgress] =
    useState({
      application: true,
      security: false,
      accessibility: false,
      compliance: false,
      integration: false,
      approval: false,
    });
    useEffect(() => {

    setTimeline([

      {
        title:
          "Application Started",

        status:
          "Completed",
      },

      {
        title:
          "Enterprise Security Review",

        status:
          "Pending",
      },

      {
        title:
          "Accessibility Review",

        status:
          "Pending",
      },

      {
        title:
          "Compliance Review",

        status:
          "Pending",
      },

      {
        title:
          "Enterprise Approval",

        status:
          "Pending",
      },

    ]);
      
  }, []);
  const securityLayers = [

    "IFSE Enterprise Identity Verification",

    "Corporate Fraud Detection",

    "Accessibility Compliance Review",

    "Enterprise Compliance Screening",

    "AI Risk Assessment",

    "Manual Enterprise Review",

  ];

  const enterpriseModules = [

    "Enterprise Dashboard",

    "Dedicated Account Manager",

    "Advanced Analytics",

    "Enterprise API",

    "Accessibility Suite",

    "Security Monitoring",

  ];

  const enterpriseBenefits = [

    "24/7 Priority Support",

    "Dedicated Success Manager",

    "Enterprise Verification Badge",

    "Advanced Accessibility",

    "Enterprise Security",

    "Custom Integrations",

    "Priority Feature Access",

    "Compliance Assistance",

  ];
        const getReviewPercentage =
    () => {

      const values =
        Object.values(
          reviewProgress
        );

      const completed =
        values.filter(
          Boolean
        ).length;

      return Math.round(
        (
          completed /
          values.length
        ) * 100
      );

    };
        const calculateEnterpriseRisk =
    () => {

      let score = 0;

      if (!website.trim())
        score += 15;

      if (
        !registrationNumber.trim()
      )
        score += 20;

      if (!taxNumber.trim())
        score += 10;

      if (estimatedUsers) {

        const users =
          Number(
            estimatedUsers
          );

        if (
          users > 1000000
        ) {

          score += 20;

        }

        else if (
          users > 100000
        ) {

          score += 10;

        }

      }

      if (
        partnershipType ===
        "Government"
      ) {

        score += 25;

      }

      return Math.min(
        score,
        100
      );

    };
        const enterpriseRiskScore =
    calculateEnterpriseRisk();

  const threatLevel =
    enterpriseRiskScore >= 75
      ? "High"
      : enterpriseRiskScore >= 40
      ? "Medium"
      : "Low";
    const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");

      setSuccess("");

      if (!currentUser) {

        setError(
          "Please sign in to continue."
        );

        return;

      }

      if (
        !acceptedTerms ||
        !acceptedPrivacy ||
        !acceptedSecurity
      ) {

        setError(
          "Please accept all agreements before continuing."
        );

        return;

      }

      setLoading(true);

      try {
                const organizationQuery =
          query(
            collection(
              db,
              "enterprisePartnerships"
            ),
            where(
              "organizationName",
              "==",
              organizationName
            )
          );

        const organizationSnapshot =
          await getDocs(
            organizationQuery
          );

        const organizationExists =
          !organizationSnapshot.empty;
                if (
          organizationExists
        ) {

          await addDoc(
            collection(
              db,
              "ifseSecurityEvents"
            ),
            {
              eventType:
                "duplicate_organization",

              partnershipType:
                "enterprise",

              organizationName,

              userId:
                currentUser.uid,

              severity:
                "medium",

              automaticAssessment:
                true,

              requiresManualReview:
                true,

              reviewed:
                false,

              createdAt:
                serverTimestamp(),
            }
          );

          setError(
            "An enterprise partnership already exists for this organization."
          );

          setLoading(false);

          return;

        }
                const emailQuery =
          query(
            collection(
              db,
              "enterprisePartnerships"
            ),
            where(
              "contactEmail",
              "==",
              contactEmail
            )
          );

        const emailSnapshot =
          await getDocs(
            emailQuery
          );

        const emailExists =
          !emailSnapshot.empty;
                if (
          emailExists
        ) {

          await addDoc(
            collection(
              db,
              "ifseSecurityEvents"
            ),
            {
              eventType:
                "duplicate_contact_email",

              partnershipType:
                "enterprise",

              contactEmail,

              userId:
                currentUser.uid,

              severity:
                "medium",

              automaticAssessment:
                true,

              requiresManualReview:
                true,

              reviewed:
                false,

              createdAt:
                serverTimestamp(),
            }
          );

          setError(
            "This contact email has already submitted an enterprise partnership request."
          );

          setLoading(false);

          return;

        }
                const docRef =
          await addDoc(
            collection(
              db,
              "enterprisePartnerships"
            ),
            {
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

              requestStatus:
                REQUEST_STATUS.SUBMITTED,

              reviewProgress,

              timeline,

              userId:
                currentUser.uid,

              createdAt:
                serverTimestamp(),

              updatedAt:
                serverTimestamp(),
            }
          );

        const partnershipId =
          docRef.id;
                await addDoc(
          collection(
            db,
            "enterpriseTimeline"
          ),
          {
            partnershipId,

            title:
              "Enterprise Partnership Submitted",

            status:
              "submitted",

            createdAt:
              serverTimestamp(),
          }
        );
                await addDoc(
          collection(
            db,
            "ifseSecurityEvents"
          ),
          {
            eventType:
              "enterprise_partnership_created",

            partnershipId,

            partnershipType:
              "enterprise",

            userId:
              currentUser.uid,

            severity:
              "low",

            riskScore:
              enterpriseRiskScore,

            threatLevel,

            automaticAssessment:
              true,

            requiresManualReview:
              enterpriseRiskScore >= 50,

            reviewed:
              false,

            createdAt:
              serverTimestamp(),
          }
        );
                setSuccess(
          "Enterprise partnership request submitted successfully."
        );

        navigate(
          "/verification-center"
        );
              }

      catch (err) {

        console.error(err);

        setError(
          "Unable to submit your enterprise partnership request. Please try again."
        );

      }

      finally {

        setLoading(false);

      }

    };
    return (

    <DashboardLayout>

      <div className="enterprise-partnership-page">

        <header className="enterprise-header">

          <h1>

            Enterprise Partnership

          </h1>

          <p>

            Apply for an Inclura Enterprise Partnership.
            Applications are reviewed by the Inclura
            Fortress Security Engine (IFSE) before
            enterprise approval.

          </p>

        </header>

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
                    <section className="enterprise-information">

            <h2>

              Organization Information

            </h2>
                                  <div className="form-group">

              <label>

                Organization Name *

              </label>

              <input
                type="text"
                value={organizationName}
                onChange={(e) =>
                  setOrganizationName(
                    e.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-group">

              <label>

                Organization Type *

              </label>

              <input
                type="text"
                value={organizationType}
                onChange={(e) =>
                  setOrganizationType(
                    e.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-group">

              <label>

                Registration Number *

              </label>

              <input
                type="text"
                value={registrationNumber}
                onChange={(e) =>
                  setRegistrationNumber(
                    e.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-group">

              <label>

                Tax Number *

              </label>

              <input
                type="text"
                value={taxNumber}
                onChange={(e) =>
                  setTaxNumber(
                    e.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-group">

              <label>

                Official Website

              </label>

              <input
                type="url"
                value={website}
                onChange={(e) =>
                  setWebsite(
                    e.target.value
                  )
                }
                placeholder="https://example.com"
              />

            </div>

            <div className="form-group">

              <label>

                Industry *

              </label>

              <input
                type="text"
                value={industry}
                onChange={(e) =>
                  setIndustry(
                    e.target.value
                  )
                }
                required
              />

            </div>

          </section>

          <section className="enterprise-contact">

            <h2>

              Contact Information

            </h2>
                        <div className="form-group">

              <label>

                Contact Name *

              </label>

              <input
                type="text"
                value={contactName}
                onChange={(e) =>
                  setContactName(
                    e.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-group">

              <label>

                Contact Email *

              </label>

              <input
                type="email"
                value={contactEmail}
                onChange={(e) =>
                  setContactEmail(
                    e.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-group">

              <label>

                Contact Phone *

              </label>

              <input
                type="tel"
                value={contactPhone}
                onChange={(e) =>
                  setContactPhone(
                    e.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-group">

              <label>

                Position *

              </label>

              <input
                type="text"
                value={position}
                onChange={(e) =>
                  setPosition(
                    e.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-group">

              <label>

                Country *

              </label>

              <input
                type="text"
                value={country}
                onChange={(e) =>
                  setCountry(
                    e.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-group">

              <label>

                State / Province *

              </label>

              <input
                type="text"
                value={state}
                onChange={(e) =>
                  setState(
                    e.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-group">

              <label>

                City *

              </label>

              <input
                type="text"
                value={city}
                onChange={(e) =>
                  setCity(
                    e.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-group">

              <label>

                Business Address *

              </label>

              <textarea
                rows={3}
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                required
              />

            </div>

          </section>

          <section className="enterprise-contract">

            <h2>

              Partnership Details

            </h2>
                        <div className="form-group">

              <label>

                Partnership Type

              </label>

              <select
                value={partnershipType}
                onChange={(e) =>
                  setPartnershipType(
                    e.target.value
                  )
                }
              >

                {PARTNERSHIP_TYPES.map(
                  (type) => (

                    <option
                      key={type}
                      value={type}
                    >

                      {type}

                    </option>

                  )
                )}

              </select>

            </div>

            <div className="form-group">

              <label>

                Contract Type

              </label>

              <select
                value={contractType}
                onChange={(e) =>
                  setContractType(
                    e.target.value
                  )
                }
              >

                {CONTRACT_TYPES.map(
                  (type) => (

                    <option
                      key={type}
                      value={type}
                    >

                      {type}

                    </option>

                  )
                )}

              </select>

            </div>

            <div className="form-group">

              <label>

                Estimated Users

              </label>

              <input
                type="number"
                value={estimatedUsers}
                onChange={(e) =>
                  setEstimatedUsers(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="form-group">

              <label>

                Custom Requirements

              </label>

              <textarea
                rows={5}
                value={customRequirements}
                onChange={(e) =>
                  setCustomRequirements(
                    e.target.value
                  )
                }
              />

            </div>

          </section>

          <section className="enterprise-summary-card">

            <h2>

              Partnership Summary

            </h2>

            <p>

              <strong>

                Pricing Model:

              </strong>{" "}

              {{partnershipFee.pricing}}

            </p>

            <p>

  <strong>

    Enterprise Pricing:

  </strong>{" "}

  {partnershipFee.pricing}

</p>
            <p>

              <strong>

                Billing:

              </strong>

              {" "}Annual Enterprise Contract

            </p>

          </section>

          <section className="enterprise-benefits">

            <h2>

              Enterprise Benefits

            </h2>

            <ul>

              {enterpriseBenefits.map(
                (benefit) => (

                  <li key={benefit}>

                    {benefit}

                  </li>

                )
              )}

            </ul>

          </section>
                    <section className="enterprise-security">

            <h2>

              IFSE Enterprise Security Assessment

            </h2>

            <ul>

              {securityLayers.map(
                (layer) => (

                  <li key={layer}>

                    {layer}

                  </li>

                )
              )}

            </ul>

          </section>

          <section className="enterprise-review-progress">

            <h2>

              Review Progress

            </h2>

            <p>

              Completion: {getReviewPercentage()}%

            </p>

            <ul>

              <li>

                Application:
                {reviewProgress.application ? " ✔" : " ○"}

              </li>

              <li>

                Security Review:
                {reviewProgress.security ? " ✔" : " ○"}

              </li>

              <li>

                Accessibility Review:
                {reviewProgress.accessibility ? " ✔" : " ○"}

              </li>

              <li>

                Compliance Review:
                {reviewProgress.compliance ? " ✔" : " ○"}

              </li>

              <li>

                Integration Review:
                {reviewProgress.integration ? " ✔" : " ○"}

              </li>

              <li>

                Final Approval:
                {reviewProgress.approval ? " ✔" : " ○"}

              </li>

            </ul>

          </section>

          <section className="enterprise-risk">

            <h2>

              IFSE Risk Assessment

            </h2>

            <p>

              <strong>

                Enterprise Risk Score:

              </strong>{" "}

              {enterpriseRiskScore}%

            </p>

            <p>

              <strong>

                Threat Level:

              </strong>{" "}

              {threatLevel}

            </p>

          </section>

          <section className="enterprise-agreements">

            <h2>

              Agreements

            </h2>

            <div className="form-group">

              <label>

                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) =>
                    setAcceptedTerms(
                      e.target.checked
                    )
                  }
                />

                {" "}
                I agree to the Enterprise Partnership Terms.

              </label>

            </div>

            <div className="form-group">

              <label>

                <input
                  type="checkbox"
                  checked={acceptedPrivacy}
                  onChange={(e) =>
                    setAcceptedPrivacy(
                      e.target.checked
                    )
                  }
                />

                {" "}
                I agree to the Privacy Policy.

              </label>

            </div>

            <div className="form-group">

              <label>

                <input
                  type="checkbox"
                  checked={acceptedSecurity}
                  onChange={(e) =>
                    setAcceptedSecurity(
                      e.target.checked
                    )
                  }
                />

                {" "}
                I consent to IFSE enterprise security
                verification and compliance review.

              </label>

            </div>

          </section>

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
                ? "Submitting..."
                : "Submit Enterprise Partnership"}

            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/home")
              }
            >

              Cancel

            </button>

          </div>

        </form>

        <footer className="enterprise-footer">

          <p>

            Enterprise partnership requests are protected
            by the Inclura Fortress Security Engine (IFSE)
            and undergo security, accessibility,
            compliance and administrator review before
            activation.

          </p>

        </footer>

      </div>

    </DashboardLayout>

  );

}

export default EnterprisePartnership;
  
