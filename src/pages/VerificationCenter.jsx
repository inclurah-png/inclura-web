import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import { VERIFICATION_PLANS } from "../config";
function VerificationCenter() {

const navigate = useNavigate();

const verificationCategories = useMemo(
  () => [
    {
      key: "creator",
      title: "Creator",
      route: "/creator-verification",
    },
    {
      key: "group",
      title: "Group",
      route: "/group-verification",
    },
    {
      key: "organization",
      title: "Organization",
      route: "/organization-verification",
    },
    {
      key: "ngo",
      title: "NGO",
      route: "/ngo-verification",
    },
    {
      key: "institution",
      title: "Institution",
      route: "/institution-verification",
    },
    {
      key: "religious",
      title: "Religious",
      route: "/religious-verification",
    },
    {
      key: "healthcare",
      title: "Healthcare",
      route: "/healthcare-verification",
    },
    {
      key: "museum",
      title: "Museum",
      route: "/museum-verification",
    },
    {
      key: "tourism",
      title: "Tourism",
      route: "/tourism-verification",
    },
    {
      key: "entertainment",
      title: "Entertainment",
      route: "/entertainment-verification",
    },
    {
      key: "media",
      title: "Media",
      route: "/media-verification",
    },
    {
      key: "accessibility",
      title: "Accessibility",
      route: "/accessibility-verification",
    },
  ],
  []
);
  const partnershipCategories = useMemo(
  () => [
    {
      title: "Corporate Partnership",
      route: "/corporate-partnership",
    },
    {
      title: "Government Partnership",
      route: "/government-partnership",
    },
    {
      title: "Enterprise Partnership",
      route: "/enterprise-partnership",
    },
  ],
  []
);

const ifseLayers = [

"Identity Verification",

"Document Authentication",

"AI Fraud Detection",

"OCR Verification",

"Forgery Detection",

"Duplicate Detection",

"Payment Fraud Protection",

"Accessibility Compliance",

"Executive Review",

"Continuous Monitoring",

];

const verificationBenefits = [

"Official Verification Badge",

"Higher Trust & Credibility",

"Search Priority",

"Protection Against Impersonation",

"Eligibility for Premium Features",

"Priority Support",

"Business & Partnership Opportunities",

"IFSE Continuous Protection",

];

return (

<DashboardLayout>

<div className="verification-center">

<header className="verification-header">

<h1>

Verification Center

</h1>

<p>

Welcome to the Inclura Verification Center.

Every verification is protected by the

<strong> Inclura Fortress Security Engine (IFSE)</strong>.

</p>

</header>

<section className="verification-categories">

<h2>

Choose Verification Type

</h2>

<div className="verification-grid">

{

verificationCategories.map(item => (

<div

key={item.key}

className="verification-card"

>

<h3>{item.title}</h3>

<p>

{

VERIFICATION_PLANS?.[item.key]?.title || item.title

}

</p>

<button

onClick={()=>

navigate(item.route)

}

>

Start Verification

</button>

</div>

))

}

</div>

</section>

<section className="ifse-security">

<h2>

IFSE Security Protection

</h2>

<ul>

{

ifseLayers.map(layer=>(

<li key={layer}>

✅ {layer}

</li>

))

}

</ul>

</section>

<section className="verification-benefits">

<h2>

Benefits of Verification

</h2>

<ul>

{

verificationBenefits.map(benefit=>(

<li key={benefit}>

⭐ {benefit}

</li>

))

}

</ul>

</section>

<section className="verification-workflow">

<h2>

Verification Process

</h2>

<ol>

<li>

Choose Verification Type

</li>

<li>

Upload Documents

</li>

<li>

Complete Secure Payment

</li>

<li>

IFSE Security Review

</li>

<li>

Accessibility Review

</li>

<li>

Executive Approval (if required)

</li>

<li>

Badge & Certificate Issued

</li>

</ol>

</section>

<section className="verification-pricing">

<h2>

Verification Pricing

</h2>

<p>

Every verification category uses the official

pricing configured in
<strong> src/config/pricing/</strong>.
Pricing automatically updates when new verification
plans are added.

</p>

</section>

<section className="partnership-shortcuts">

  <h2>

    Enterprise & Partnership Verification

  </h2>

  <div className="verification-grid">

    {partnershipCategories.map((item) => (

      <div
        key={item.title}
        className="verification-card"
      >

        <h3>{item.title}</h3>

        <p>

          Enterprise-grade verification secured by IFSE.

        </p>

        <button
          onClick={() => navigate(item.route)}
        >

          Open

        </button>

      </div>

    ))}

  </div>

</section>

<section className="accessibility-certification">

<h2>

Accessibility Certification

</h2>

<p>

Organizations can apply for:

</p>

<ul>

<li>Bronze Certified</li>

<li>Silver Certified</li>

<li>Gold Certified</li>

<li>Platinum Certified (Enterprise Negotiation)</li>

</ul>

</section>

<section className="ifse-notice">

<h2>

IFSE Notice

</h2>

<p>

Every verification submitted through Inclura

is protected by the

<strong>

Inclura Fortress Security Engine (IFSE)

</strong>.

</p>

<p>

IFSE performs identity verification,

document authentication,

AI fraud detection,

payment protection,

accessibility compliance,

continuous monitoring,

and enterprise-grade security reviews.

</p>

</section>

<footer className="verification-footer">

<p>

© Inclura Verification Center

Powered by the Inclura Fortress Security Engine (IFSE).

</p>

</footer>

</div>

</DashboardLayout>

);

}

export default VerificationCenter;
