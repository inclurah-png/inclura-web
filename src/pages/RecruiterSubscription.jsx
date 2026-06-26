import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

import {
  auth,
  db,
} from "../firebase";

import {
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import {
  useFlutterwave,
  closePaymentModal,
} from "flutterwave-react-v3";

function RecruiterSubscription() {
  const [loading, setLoading] =
    useState(false);

  const [selectedPlan, setSelectedPlan] =
    useState("starter");

  const user = auth.currentUser;

  const plans = {
    starter: {
      title: "Starter Recruiter",
      amount: 20000,
      jobs: 5,
      applications: 30,
      color: "#38bdf8",
    },

    business: {
      title: "Business Recruiter",
      amount: 40000,
      jobs: 15,
      applications: "Unlimited",
      color: "#10b981",
    },

    enterprise: {
      title: "Enterprise Recruiter",
      amount: 100000,
      jobs: "Unlimited",
      applications: "Unlimited",
      color: "#f59e0b",
    },
  };

  const plan =
    plans[selectedPlan];

  const config = {
    public_key:
      "FLWPUBK_TEST-1ee584892828ffa6942ef2e45a970768-X",

    tx_ref:
      Date.now().toString(),

    amount:
      plan.amount,

    currency: "NGN",

    payment_options:
      "card,banktransfer,ussd",

    customer: {
      email:
        user?.email ||
        "user@inclura.com",

      phone_number:
        "08000000000",

      name:
        user?.displayName ||
        "Inclura User",
    },

    customizations: {
      title:
        "Inclura Recruiter Subscription",

      description:
        `${plan.title} Subscription`,

      logo: "",
    },
  };

  const handleFlutterPayment =
    useFlutterwave(config);

  async function activateSubscription(
    response
  ) {
    const expiry =
      new Date();

    expiry.setDate(
      expiry.getDate() + 30
    );

    await updateDoc(
      doc(
        db,
        "users",
        user.uid
      ),
      {
        recruiter: {
          plan:
            selectedPlan,

          status:
            "active",

          activatedAt:
            serverTimestamp(),

          expiresAt:
            Timestamp.fromDate(
              expiry
            ),

          paymentReference:
            response.tx_ref,

          transactionId:
            response.transaction_id,

          activeJobs: 0,
        },
      }
    );
  }

  function subscribe() {
    setLoading(true);

    handleFlutterPayment({
      callback: async (
        response
      ) => {
        try {
          if (
            response.status ===
            "successful"
          ) {
            await activateSubscription(
              response
            );

            alert(
              "Recruiter Subscription Activated Successfully."
            );
          } else {
            alert(
              "Payment Failed."
            );
          }
        } catch (err) {
          console.error(err);

          alert(
            "Unable to activate subscription."
          );
        }

        setLoading(false);

        closePaymentModal();
      },

      onClose: () => {
        setLoading(false);
      },
    });
  }

  return (
    <DashboardLayout>
      <div
        style={{
          color: "white",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h1>
          Recruiter Subscription
        </h1>

        <p
          style={{
            color: "#94a3b8",
          }}
        >
          Subscribe before posting opportunities on Inclura.
        </p>

        <div
          style={{
            display: "grid",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {/* STARTER */}
          <div
            onClick={() =>
              setSelectedPlan(
                "starter"
              )
            }
            style={{
              background:
                selectedPlan ===
                "starter"
                  ? "#082f49"
                  : "#0f172a",
              border:
                selectedPlan ===
                "starter"
                  ? "2px solid #38bdf8"
                  : "1px solid #334155",
              borderRadius:
                "18px",
              padding: "24px",
              cursor: "pointer",
            }}
          >
            <h2
              style={{
                color:
                  "#38bdf8",
              }}
            >
              Starter Recruiter
            </h2>

            <h1>
              ₦20,000
              <span
                style={{
                  fontSize:
                    "16px",
                }}
              >
                /month
              </span>
            </h1>

            <ul>
              <li>
                5 Active Jobs
              </li>
              <li>
                30 Applications
                Per Job
              </li>
              <li>
                No Featured Jobs
              </li>
              <li>
                No Company
                Branding
              </li>
            </ul>
          </div>

          {/* BUSINESS */}

          <div
            onClick={() =>
              setSelectedPlan(
                "business"
              )
            }
            style={{
              background:
                selectedPlan ===
                "business"
                  ? "#052e16"
                  : "#0f172a",
              border:
                selectedPlan ===
                "business"
                  ? "2px solid #10b981"
                  : "1px solid #334155",
              borderRadius:
                "18px",
              padding: "24px",
              cursor: "pointer",
            }}
          >
            <h2
              style={{
                color:
                  "#10b981",
              }}
            >
              Business Recruiter
            </h2>

            <h1>
              ₦40,000
              <span
                style={{
                  fontSize:
                    "16px",
                }}
              >
                /month
              </span>
            </h1>

            <ul>
              <li>
                15 Active Jobs
              </li>
              <li>
                Unlimited
                Applications
              </li>
              <li>
                Featured Jobs
              </li>
              <li>
                Company Profile
              </li>
              <li>
                Recruiter
                Analytics
              </li>
            </ul>
          </div>

          {/* ENTERPRISE */}

          <div
            onClick={() =>
              setSelectedPlan(
                "enterprise"
              )
            }
            style={{
              background:
                selectedPlan ===
                "enterprise"
                  ? "#451a03"
                  : "#0f172a",
              border:
                selectedPlan ===
                "enterprise"
                  ? "2px solid #f59e0b"
                  : "1px solid #334155",
              borderRadius:
                "18px",
              padding: "24px",
              cursor: "pointer",
            }}
          >
            <h2
              style={{
                color:
                  "#f59e0b",
              }}
            >
              Enterprise
              Recruiter
            </h2>

            <h1>
              ₦100,000
              <span
                style={{
                  fontSize:
                    "16px",
                }}
              >
                /month
              </span>
            </h1>

            <ul>
              <li>
                Unlimited Jobs
              </li>
              <li>
                Recruiter Team
              </li>
              <li>
                API Integration
              </li>
              <li>
                Priority Support
              </li>
              <li>
                Enterprise Hiring
                Badge
              </li>
              <li>
                Advanced
                Analytics
              </li>
            </ul>
          </div>
          </div>

        {/* SELECTED PLAN SUMMARY */}

        <div
          style={{
            marginTop: "30px",
            background: "#111827",
            padding: "24px",
            borderRadius: "20px",
          }}
        >
          <h2>
            Selected Plan
          </h2>

          <h3
            style={{
              color: plan.color,
            }}
          >
            {plan.title}
          </h3>

          <h1>
            ₦{plan.amount.toLocaleString()}
            <span
              style={{
                fontSize: "18px",
              }}
            >
              /month
            </span>
          </h1>

          <p
            style={{
              color: "#94a3b8",
            }}
          >
            Recruiter subscriptions renew every
            30 days.

            <br />

            If payment expires,
            opportunity posting will be disabled
            automatically until renewed.
          </p>

          <button
            onClick={subscribe}
            disabled={loading}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "none",
              background: plan.color,
              color: "white",
              fontWeight: "700",
              fontSize: "17px",
              cursor: "pointer",
            }}
          >
            {loading
              ? "Processing Payment..."
              : `Subscribe To ${plan.title}`}
          </button>
        </div>

        {/* NOTICE */}

        <div
          style={{
            marginTop: "25px",
            background: "#1e293b",
            padding: "18px",
            borderRadius: "14px",
            color: "#cbd5e1",
          }}
        >
          <strong>
            Important:
          </strong>

          <ul
            style={{
              marginTop: "10px",
            }}
          >
            <li>
              Verification Badge and Recruiter
              Subscription are different
              services.
            </li>

            <li>
              Recruiter Subscription is required
              before posting opportunities.
            </li>

            <li>
              Subscription expires every 30
              days.
            </li>

            <li>
              After expiry, posting new jobs is
              disabled until renewal.
            </li>

            <li>
              Existing opportunities remain
              visible but become locked for
              editing until renewal.
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default RecruiterSubscription;
