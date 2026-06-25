import { useState } from "react";

import DashboardLayout from "../components/DashboardLayout";

function VerificationApplication() {
  const [type, setType] =
    useState("creator");

  const fees = {
    creator: 5000,
    ngo: 20000,
    hospital: 25000,
    university: 35000,
    organization: 30000,
    government: 100000,
  };

  return (
    <DashboardLayout>
      <div
        style={{
          background: "#0f172a",
          padding: "24px",
          borderRadius: "20px",
          color: "white",
        }}
      >
        <h1>
          Verification Application
        </h1>

        <p>
          Apply for identity verification.
        </p>

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <label>
            Verification Type
          </label>

          <select
            value={type}
            onChange={(e) =>
              setType(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              borderRadius: "12px",
            }}
          >
            <option value="creator">
              Creator
            </option>

            <option value="ngo">
              NGO
            </option>

            <option value="hospital">
              Hospital
            </option>

            <option value="university">
              University
            </option>

            <option value="organization">
              Organization
            </option>

            <option value="government">
              Government
            </option>
          </select>
        </div>

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <h3>
            Verification Fee
          </h3>

          <p>
            ₦
            {fees[
              type
            ].toLocaleString()}
          </p>
        </div>

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <h3>
            Required Documents
          </h3>

          {type ===
            "creator" && (
            <ul>
              <li>
                National ID
              </li>
              <li>
                Passport
              </li>
              <li>
                Social Profile
              </li>
            </ul>
          )}

          {type ===
            "ngo" && (
            <ul>
              <li>
                Registration
                Certificate
              </li>
              <li>
                Official
                Email
              </li>
            </ul>
          )}

          {type ===
            "hospital" && (
            <ul>
              <li>
                Hospital
                License
              </li>
              <li>
                Registration
                Documents
              </li>
            </ul>
          )}

          {type ===
            "university" && (
            <ul>
              <li>
                Accreditation
              </li>
              <li>
                Official
                Domain
              </li>
            </ul>
          )}

          {type ===
            "organization" && (
            <ul>
              <li>
                CAC
                Certificate
              </li>
              <li>
                Website
              </li>
            </ul>
          )}

          {type ===
            "government" && (
            <ul>
              <li>
                Official
                Government
                Email
              </li>
              <li>
                Appointment
                Letter
              </li>
            </ul>
          )}
        </div>

        <button
          style={{
            marginTop: "24px",
            padding:
              "14px 24px",
            borderRadius:
              "12px",
            border: "none",
            background:
              "#38bdf8",
            color: "white",
            fontWeight:
              "700",
          }}
        >
          Continue To Payment
        </button>
      </div>
    </DashboardLayout>
  );
}

export default VerificationApplication;
