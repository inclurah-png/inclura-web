import { useState, useEffect, useMemo } from "react";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db, auth } from "../firebase";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import { VERIFICATION_PLANS } from "../config";

function VerificationApplication() {
  const navigate = useNavigate();

  const categories = useMemo(
    () => Object.keys(VERIFICATION_PLANS),
    []
  );

  const [category, setCategory] = useState(
    categories[0]
  );

  const [verificationType, setVerificationType] =
    useState("");

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [socialLink1, setSocialLink1] =
    useState("");

  const [socialLink2, setSocialLink2] =
    useState("");

  const [officialEmail, setOfficialEmail] =
    useState("");

  const [documentFile, setDocumentFile] =
    useState(null);
  const selectedCategory =
  VERIFICATION_PLANS[category];

const verificationTypes =
  selectedCategory?.verificationTypes || [];

useEffect(() => {
  if (verificationTypes.length > 0) {
    setVerificationType(
      verificationTypes[0].id
    );
  }
}, [category, verificationTypes]);

const selectedVerification =
  verificationTypes.find(
    (item) =>
      item.id === verificationType
  );

const paymentAmount =
  selectedVerification?.yearlyUSD ??
  selectedVerification?.monthlyUSD ??
  0;

const showSocialLinks =
  category === "creator";

const showOfficialEmail =
  category === "government";

const isEnterprise =
  selectedVerification?.enterprise === true;

const submitButtonText =
  isEnterprise
    ? "Submit Partnership Request"
    : paymentAmount > 0
    ? "Continue To Payment"
    : "Submit Verification Request";
  async function handleContinue() {
  const user = auth.currentUser;

  if (!user) {
    alert("Please login first.");
    return;
  }

  if (!fullName.trim()) {
    alert("Please enter your full name.");
    return;
  }

  if (!email.trim()) {
    alert("Please enter your email.");
    return;
  }

  if (!phone.trim()) {
    alert("Please enter your phone number.");
    return;
  }

  try {
    await addDoc(
      collection(db, "verificationRequests"),
      {
        userId: user.uid,

        category,

        verificationType,

        verificationTitle:
          selectedVerification?.name || "",

        badge:
          selectedVerification?.badge || "",

        fullName,

        email,

        phone,

        socialLink1,

        socialLink2,

        officialEmail,

        paymentAmount,

        enterprise: isEnterprise,

        paymentStatus:
          paymentAmount > 0
            ? "pending"
            : "free",

        status: "pending",

        documentName:
          documentFile
            ? documentFile.name
            : "",

        documentUrl: "",

        createdAt: serverTimestamp(),
      }
    );

    if (isEnterprise) {
      navigate("/enterprise-partnership");
      return;
    }

    if (paymentAmount > 0) {
      navigate("/verification-payment");
      return;
    }

    alert("Verification request submitted successfully.");

    navigate("/verification-status");
  } catch (error) {
    console.error(error);
    alert("Unable to submit verification request.");
  }
  }
  const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "16px",
  borderRadius: "12px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
};

return (
  <DashboardLayout>
    <div
      style={{
        background: "#0f172a",
        padding: "24px",
        borderRadius: "20px",
        color: "white",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>Verification Application</h1>

      <p>
        Complete the form below to apply for
        verification.
      </p>

      <label>
        Verification Category
      </label>

      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
        style={inputStyle}
      >
        {categories.map((key) => (
          <option
            key={key}
            value={key}
          >
            {VERIFICATION_PLANS[key].title}
          </option>
        ))}
      </select>

      <label>
        Verification Type
      </label>

      <select
        value={verificationType}
        onChange={(e) =>
          setVerificationType(
            e.target.value
          )
        }
        style={inputStyle}
      >
        {verificationTypes.map((item) => (
          <option
            key={item.id}
            value={item.id}
          >
            {item.name}
          </option>
        ))}
      </select>

      <label>
        Full Name
      </label>

      <input
        type="text"
        value={fullName}
        onChange={(e) =>
          setFullName(e.target.value)
        }
        style={inputStyle}
      />

      <label>
        Email
      </label>

      <input
        type="email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        style={inputStyle}
      />

      <label>
        Phone Number
      </label>

      <input
        type="text"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
        }
        style={inputStyle}
      />
      {showSocialLinks && (
  <>
    <label>
      Social Link 1
    </label>

    <input
      type="text"
      value={socialLink1}
      onChange={(e) =>
        setSocialLink1(e.target.value)
      }
      style={inputStyle}
      placeholder="https://..."
    />

    <label>
      Social Link 2
    </label>

    <input
      type="text"
      value={socialLink2}
      onChange={(e) =>
        setSocialLink2(e.target.value)
      }
      style={inputStyle}
      placeholder="https://..."
    />
  </>
)}

{showOfficialEmail && (
  <>
    <label>
      Official Government Email
    </label>

    <input
      type="email"
      value={officialEmail}
      onChange={(e) =>
        setOfficialEmail(
          e.target.value
        )
      }
      style={inputStyle}
      placeholder="example@gov.ng"
    />
  </>
)}

<label>
  Upload Supporting Document
</label>

<input
  type="file"
  onChange={(e) =>
    setDocumentFile(
      e.target.files[0]
    )
  }
  style={{
    marginTop: "10px",
    marginBottom: "20px",
  }}
/>

<div
  style={{
    background: "#1e293b",
    padding: "18px",
    borderRadius: "12px",
    marginBottom: "20px",
  }}
>
  <h3>
    Selected Verification
  </h3>

  <p>
    <strong>
      {selectedVerification?.name}
    </strong>
  </p>

  <p>
    Badge:
    {" "}
    {selectedVerification?.badge}
  </p>

  <p>
    Price:
    {" "}
    {isEnterprise
      ? "Enterprise Negotiation"
      : `$${paymentAmount.toLocaleString()}`}
  </p>
</div>

<button
  onClick={handleContinue}
  style={{
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    background: "#38bdf8",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  }}
>
  {submitButtonText}
</button>

</div>

</DashboardLayout>
);

}

export default VerificationApplication;
