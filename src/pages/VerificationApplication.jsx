import { useState, useMemo, useEffect } from "react";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import { VERIFICATION_PLANS } from "../config";

function VerificationApplication() {

  const navigate = useNavigate();

  const categories = useMemo(
    () => Object.keys(VERIFICATION_PLANS),
    []
  );

  const [category, setCategory] =
    useState(categories[0]);

  const [verificationType, setVerificationType] =
    useState("");

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [organizationName, setOrganizationName] =
    useState("");

  const [website, setWebsite] =
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
  }, [category]);

  const selectedVerification =
    verificationTypes.find(
      (item) =>
        item.id === verificationType
    );

  const paymentAmount =
    selectedVerification?.yearlyUSD ??
    selectedVerification?.monthlyUSD ??
    0;

  const isEnterprise =
    selectedVerification?.enterprise === true;
    async function handleContinue() {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (!fullName.trim()) {
      alert("Enter your full name.");
      return;
    }

    if (!email.trim()) {
      alert("Enter your email.");
      return;
    }

    if (!phone.trim()) {
      alert("Enter your phone number.");
      return;
    }

    try {
      await addDoc(
        collection(
          db,
          "verificationRequests"
        ),
        {
          userId: user.uid,

          category,

          verificationType,

          accountType: category,

          fullName,

          email,

          phone,

          organizationName,

          website,

          socialLink1,

          socialLink2,

          officialEmail,

          paymentAmount,

          paymentStatus:
            paymentAmount > 0
              ? "pending"
              : "free",

          status: "pending",

          enterprise:
            isEnterprise,

          documentName:
            documentFile
              ? documentFile.name
              : "",

          documentUrl: "",

          note:
            "Verification request submitted from Inclura Verification Center.",

          createdAt:
            serverTimestamp(),
        }
      );

      if (
        isEnterprise
      ) {
        navigate(
          "/enterprise-partnership"
        );
        return;
      }

      if (
        paymentAmount > 0
      ) {
        navigate(
          "/creator-verification-payment"
        );
        return;
      }

      alert(
        "Verification request submitted successfully."
      );

      navigate(
        "/verification-status"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Unable to submit verification request."
      );
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
        <h1>
          Verification Application
        </h1>

        <p>
          Complete the form below to apply for verification.
        </p>
                <label>
          Verification Category
        </label>

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          style={inputStyle}
        >
          {categories.map((key) => (
            <option
              key={key}
              value={key}
            >
              {
                VERIFICATION_PLANS[key]
                  ?.title
              }
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
          {verificationTypes.map(
            (item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            )
          )}
        </select>

        <label>
          Full Name
        </label>

        <input
          type="text"
          value={fullName}
          onChange={(e) =>
            setFullName(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <label>
          Email Address
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
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
            setPhone(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <label>
          Organization / Brand Name
        </label>

        <input
          type="text"
          value={organizationName}
          onChange={(e) =>
            setOrganizationName(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <label>
          Official Website
        </label>

        <input
          type="text"
          value={website}
          onChange={(e) =>
            setWebsite(
              e.target.value
            )
          }
          style={inputStyle}
        />
                {category === "creator" && (
          <>
            <label>
              Primary Social Link
            </label>

            <input
              type="text"
              value={socialLink1}
              onChange={(e) =>
                setSocialLink1(
                  e.target.value
                )
              }
              style={inputStyle}
              placeholder="https://..."
            />

            <label>
              Secondary Social Link
            </label>

            <input
              type="text"
              value={socialLink2}
              onChange={(e) =>
                setSocialLink2(
                  e.target.value
                )
              }
              style={inputStyle}
              placeholder="https://..."
            />
          </>
        )}

        {category === "government" && (
          <>
            <div
              style={{
                background: "#14532d",
                color: "white",
                padding: "14px",
                borderRadius: "12px",
                marginBottom: "18px",
                fontWeight: "600",
              }}
            >
              🏛 Government verification is reviewed
              manually by Inclura and does not require
              online payment.
            </div>

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
              placeholder="agency@gov.ng"
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
            marginBottom: "24px",
            color: "white",
          }}
        />

        <div
          style={{
            background: "#1e293b",
            padding: "18px",
            borderRadius: "14px",
            marginBottom: "24px",
          }}
        >
          <h3>
            Verification Fee
          </h3>

          {isEnterprise ? (
            <p>
              Enterprise Pricing
              <br />
              Contact Inclura for a customized quotation.
            </p>
          ) : (
            <p
              style={{
                fontSize: "22px",
                fontWeight: "700",
              }}
            >
              ${paymentAmount.toLocaleString()}
            </p>
          )}
        </div>
                <button
          onClick={handleContinue}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            border: "none",
            background: "#38bdf8",
            color: "white",
            fontSize: "18px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          {isEnterprise
            ? "Submit Partnership Request"
            : paymentAmount > 0
            ? "Continue To Payment"
            : "Submit Verification Request"}
        </button>
      </div>
    </DashboardLayout>
  );
}

export default VerificationApplication;
