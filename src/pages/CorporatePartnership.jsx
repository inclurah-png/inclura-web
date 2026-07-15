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

import { partnerships } from "../config";

const CORPORATE_PARTNERSHIP = partnerships.corporate;

const REQUEST_STATUS = {
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  ACTIVE: "active",
};

const CONTRACT_TYPES = [
  "Annual",
  "Two-Year",
  "Three-Year",
  "Custom",
];
function CorporatePartnership() {

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

  const [companyName,
    setCompanyName] =
    useState("");

  const [registrationNumber,
    setRegistrationNumber] =
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

  const [province, setProvince] = useState("");

  const [city,
    setCity] =
    useState("");

  const [address,
    setAddress] =
    useState("");

  const [contractType,
    setContractType] =
    useState("Annual");

  const [estimatedEmployees,
    setEstimatedEmployees] =
    useState("");

  const [businessNeeds,
    setBusinessNeeds] =
    useState("");

  const partnershipFee =
    useMemo(() => {

      return CORPORATE_PARTNERSHIP;

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
      compliance: false,
      accessibility: false,
      approval: false,
    });
    useEffect(() => {

    setTimeline([

      {
        title:
          "Application Submitted",

        status:
          "Completed",
      },

      {
        title:
          "Corporate Security Review",

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
          "Corporate Approval",

        status:
          "Pending",
      },

    ]);

  }, []);
    const securityLayers = [

    "IFSE Corporate Identity Verification",

    "Corporate Fraud Detection",

    "Accessibility Compliance",

    "Business Compliance Screening",

    "AI Risk Assessment",

    "Administrator Review",

  ];

  const corporateBenefits = [

    "Verified Corporate Profile",

    "Business Analytics",

    "Priority Support",

    "Accessibility Suite",

    "Corporate Security",

    "API Integration",

    "Compliance Assistance",

    "Dedicated Account Manager",

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
    const calculateCorporateRisk =
    () => {

      let score = 0;

      if (!website.trim())
        score += 15;

      if (
        !registrationNumber.trim()
      )
        score += 20;

      if (
        estimatedEmployees
      ) {

        const employees =
          Number(
            estimatedEmployees
          );

        if (
          employees > 50000
        ) {

          score += 20;

        }

        else if (
          employees > 5000
        ) {

          score += 10;

        }

      }

      return Math.min(
        score,
        100
      );

    };
    const corporateRiskScore =
    calculateCorporateRisk();

  const threatLevel =
    corporateRiskScore >= 75
      ? "High"
      : corporateRiskScore >= 40
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
                const companyQuery =
          query(
            collection(
              db,
              "corporatePartnerships"
            ),
            where(
              "companyName",
              "==",
              companyName
            )
          );

        const companySnapshot =
          await getDocs(
            companyQuery
          );

        const companyExists =
          !companySnapshot.empty;
                if (
          companyExists
        ) {

          await addDoc(
            collection(
              db,
              "ifseSecurityEvents"
            ),
            {
              eventType:
                "duplicate_company",

              partnershipType:
                "corporate",

              companyName,

              userId:
                currentUser.uid,

              severity:
                "high",

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
            "A partnership request already exists for this company."
          );

          setLoading(false);

          return;

        }
                const emailQuery =
          query(
            collection(
              db,
              "corporatePartnerships"
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
                "corporate",

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
            "This contact email has already submitted a corporate partnership request."
          );

          setLoading(false);

          return;

        }
                const docRef =
          await addDoc(
            collection(
              db,
              "corporatePartnerships"
            ),
            {
              companyName,

              registrationNumber,

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

              contractType,

              estimatedEmployees,

              businessNeeds,

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

riskScore:
  corporateRiskScore,

threatLevel,
            }
          );

        const partnershipId =
          docRef.id;
                await addDoc(
          collection(
            db,
            "corporateTimeline"
          ),
          {
            partnershipId,

            partnershipType:
              "corporate",

            title:
              "Corporate Partnership Submitted",

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
              "corporate_partnership_created",

            partnershipId,

            partnershipType:
              "corporate",

            corporateId:
              docRef.id,

            userId:
              currentUser.uid,

            companyName,

            severity:
              "low",

            riskScore:
              corporateRiskScore,

            threatLevel,

            automaticAssessment:
              true,

            requiresManualReview:
              corporateRiskScore >= 50,

            reviewed:
              false,

            createdAt:
              serverTimestamp(),
          }
        );
                setSuccess(
          "Corporate partnership request submitted successfully."
        );

        navigate(
          "/verification-center"
        );
              }

      catch (err) {

        console.error(err);

        setError(
          "Unable to submit your corporate partnership request. Please try again."
        );

      }

      finally {

        setLoading(false);

      }

    };

    return (

      <DashboardLayout>

        <div className="corporate-partnership-page">

          <header className="corporate-header">

            <h1>

              Corporate Partnership

            </h1>

            <p>

              Apply for an Inclura Corporate Partnership.
              Every application is protected by the
              Inclura Fortress Security Engine (IFSE)
              before administrator approval.

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
                      <section className="corporate-information">

            <h2>

              Company Information

            </h2>
                                    <div className="form-group">

              <label>

                Company Name *

              </label>

              <input
                type="text"
                value={companyName}
                onChange={(e) =>
                  setCompanyName(
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
            <div className="form-group">

  <label>

    Company Classification *

  </label>

  <select
    value={contractType}
    onChange={(e) =>
      setContractType(
        e.target.value
      )
    }
  >
    <option value="Startup">
      Startup
    </option>

    <option value="Small Business">
      Small Business
    </option>

    <option value="Incorporated Trustee">
      Incorporated Trustee
    </option>

    <option value="Limited Company">
      Limited Company (Contract)
    </option>

    <option value="PLC">
      Public Limited Company (Contract)
    </option>
  </select>

</div>

          <section className="corporate-contact">

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
    value={province}
    onChange={(e) =>
      setProvince(e.target.value)
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
                      <section className="corporate-contract">

            <h2>

              Partnership Details

            </h2>

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

                Estimated Employees

              </label>

              <input
                type="number"
                value={estimatedEmployees}
                onChange={(e) =>
                  setEstimatedEmployees(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="form-group">

              <label>

                Business Needs

              </label>

              <textarea
                rows={5}
                value={businessNeeds}
                onChange={(e) =>
                  setBusinessNeeds(
                    e.target.value
                  )
                }
              />

            </div>

          </section>

            <section className="corporate-documents">

  <h2>

    Required Corporate Documents

  </h2>

  <ul>

    <li>Certificate of Registration</li>

    <li>Memorandum & Articles of Association</li>

    <li>Tax Identification Number (TIN)</li>

    <li>Proof of Business Address</li>

    <li>Director Identification</li>

    <li>Corporate Bank Verification</li>

    <li>Accessibility Compliance Declaration</li>

  </ul>

</section>

          <section className="corporate-summary">

            <h2>

              Partnership Summary

            </h2>

            <p>

              <strong>

                Pricing Model:

              </strong>{" "}

              {partnershipFee.pricingModel}

            </p>

            <p>

              <strong>

                Annual Fee:

              </strong>{" "}

              {partnershipFee.yearlyUSD
                ? `$${partnershipFee.yearlyUSD.toLocaleString()}`
                : "Negotiation Based"}

            </p>

            <p>

              <strong>

                Billing:

              </strong>{" "}

              Annual Corporate Contract

            </p>

          </section>

          <section className="corporate-benefits">

            <h2>

              Corporate Benefits

            </h2>

            <ul>

              {corporateBenefits.map(
                (benefit) => (

                  <li key={benefit}>

                    {benefit}

                  </li>

                )
              )}

            </ul>

          </section>
                      <section className="corporate-security">

            <h2>

              IFSE Corporate Security Assessment

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

          <section className="corporate-review-progress">

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

                Compliance Review:
                {reviewProgress.compliance ? " ✔" : " ○"}

              </li>

              <li>

                Accessibility Review:
                {reviewProgress.accessibility ? " ✔" : " ○"}

              </li>

              <li>

                Final Approval:
                {reviewProgress.approval ? " ✔" : " ○"}

              </li>

            </ul>

          </section>

          <section className="corporate-risk">

            <h2>

              IFSE Risk Assessment

            </h2>

            <p>

              <strong>

                Corporate Risk Score:

              </strong>{" "}

              {corporateRiskScore}%

            </p>

            <p>

              <strong>

                Threat Level:

              </strong>{" "}

              {threatLevel}

            </p>

          </section>

          <section className="corporate-agreements">

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
                I agree to the Corporate Partnership Terms.

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
                I consent to IFSE corporate security
                verification and compliance review.

              </label>

            </div>

          </section>

          <div className="corporate-actions">

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
                : "Submit Corporate Partnership"}

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

        <footer className="corporate-footer">

          <p>

            Corporate partnership requests are protected
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

export default CorporatePartnership;
