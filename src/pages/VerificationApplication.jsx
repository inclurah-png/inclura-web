import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

import { VERIFICATION_PLANS } from "../config";

function VerificationApplication() {
  const navigate = useNavigate();

  const categories = useMemo(
    () => Object.keys(VERIFICATION_PLANS),
    []
  );

  const [category, setCategory] = useState(
    categories[0] || ""
  );

  const [verificationType, setVerificationType] =
    useState("");

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [officialEmail, setOfficialEmail] =
    useState("");

  const [socialLink1, setSocialLink1] =
    useState("");

  const [socialLink2, setSocialLink2] =
    useState("");

  const [documentFile, setDocumentFile] =
    useState(null);

  const selectedCategory =
    VERIFICATION_PLANS[category] || {};

  const verificationTypes =
    selectedCategory.verificationTypes || [];

  useEffect(() => {
  if (verificationTypes.length > 0) {
    setVerificationType(verificationTypes[0].id);
  } else {
    setVerificationType("");
  }
}, [verificationTypes]);

  const selectedVerification =
    verificationTypes.find(
      (item) =>
        item.id === verificationType
    ) || {};

  const paymentAmount =
    selectedVerification.monthlyUSD ??
    selectedVerification.yearlyUSD ??
    0;

  const enterprise =
    selectedVerification.enterprise ||
    false;

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

          verificationName:
            selectedVerification.name,

          badge:
            selectedVerification.badge || "",

          enterprise,

          paymentAmount,

          paymentFrequency:
            selectedVerification.monthlyUSD
              ? "monthly"
              : selectedVerification.yearlyUSD
              ? "yearly"
              : "enterprise",

          paymentStatus:
            enterprise
              ? "enterprise-negotiation"
              : paymentAmount === 0
              ? "free"
              : "pending",

          status: "pending",

          fullName,

          email,

          phone,

          officialEmail,

          socialLink1,

          socialLink2,

          documentName:
            documentFile?.name || "",

          documentUrl: "",

          createdAt:
            serverTimestamp(),
        }
      );

      if (enterprise) {
        navigate(
          "/enterprise-partnership"
        );
        return;
      }

      if (paymentAmount === 0) {
        navigate(
          "/verification-status"
        );
        return;
      }

      navigate(
        "/creator-verification-payment"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Unable to submit verification request."
      );
    }
  }
    return (
    <DashboardLayout>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#0f172a",
          padding: "30px",
          borderRadius: "20px",
          color: "white",
        }}
      >
        <h1>Verification Application</h1>

        <p>
          Apply for official verification protected by the
          <strong> Inclura Fortress Security Engine (IFSE)</strong>.
        </p>

        <label>
          Verification Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
            setVerificationType(e.target.value)
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

        <label>Email</label>

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

        {category === "creator" && (
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
            />
          </>
        )}

        {category === "government" && (
          <>
            <div
              style={{
                background: "#15803d",
                color: "white",
                padding: "14px",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              Government verification applications are reviewed manually.
            </div>

            <label>
              Official Government Email
            </label>

            <input
              type="email"
              value={officialEmail}
              onChange={(e) =>
                setOfficialEmail(e.target.value)
              }
              style={inputStyle}
              placeholder="agency@gov.xx"
            />
          </>
        )}

        <label>
          Upload Supporting Document
        </label>

        <input
          type="file"
          onChange={(e) =>
            setDocumentFile(e.target.files?.[0] || null)
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
          <h3>Verification Summary</h3>

          <p>
            <strong>Category:</strong>{" "}
            {selectedCategory.title}
          </p>

          <p>
            <strong>Verification:</strong>{" "}
            {selectedVerification.name}
          </p>

          {selectedVerification.badge && (
            <p>
              <strong>Badge:</strong>{" "}
              {selectedVerification.badge}
            </p>
          )}

          {enterprise ? (
            <div
              style={{
                color: "#facc15",
                fontWeight: "700",
              }}
            >
              Enterprise Negotiation Required
            </div>
          ) : (
            <div
              style={{
                color: "#4ade80",
                fontWeight: "700",
              }}
            >
              {selectedVerification.monthlyUSD
                ? `Monthly Fee: $${paymentAmount.toLocaleString()}`
                : selectedVerification.yearlyUSD
                ? `Yearly Fee: $${paymentAmount.toLocaleString()}`
                : "Free Verification"}
            </div>
          )}
        </div>

        <button
          onClick={handleContinue}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "12px",
            background: "#0ea5e9",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          {enterprise
            ? "Continue to Enterprise Partnership"
            : paymentAmount === 0
            ? "Submit Verification"
            : "Continue to Payment"}
        </button>
      </div>
    </DashboardLayout>
  );
}

export default VerificationApplication;
