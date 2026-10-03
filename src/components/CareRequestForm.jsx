import { useState } from "react";
import { useTranslation } from "react-i18next";

function CareRequestForm({
  onSubmit,
  submitting = false,
}) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    serviceType: "",
    description: "",
    location: "",
    preferredDate: "",
  });

  const [statusMessage, setStatusMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setStatusMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.serviceType) {
      setStatusMessage(
        t("careGigs.form.serviceRequired", {
          defaultValue:
            "Please select a care service type.",
        })
      );
      return;
    }

    if (!form.description.trim()) {
      setStatusMessage(
        t("careGigs.form.descriptionRequired", {
          defaultValue:
            "Please describe the care or support you need.",
        })
      );
      return;
    }

    if (!form.location.trim()) {
      setStatusMessage(
        t("careGigs.form.locationRequired", {
          defaultValue:
            "Please provide the service area.",
        })
      );
      return;
    }

    if (!form.preferredDate) {
      setStatusMessage(
        t("careGigs.form.dateRequired", {
          defaultValue:
            "Please select a preferred date.",
        })
      );
      return;
    }

    if (typeof onSubmit !== "function") {
      setStatusMessage(
        t("careGigs.form.notReady", {
          defaultValue:
            "Care request submission is not connected yet.",
        })
      );
      return;
    }

    try {
      setStatusMessage(
        t("careGigs.form.submitting", {
          defaultValue:
            "Submitting your care request...",
        })
      );

      await onSubmit({
        serviceType: form.serviceType,
        description: form.description.trim(),
        location: form.location.trim(),
        preferredDate: form.preferredDate,
        preferredTime: "",
        urgency: "normal",
        communicationPreference: "",
        accessibilityNeeds: "",
      });

      setForm({
        serviceType: "",
        description: "",
        location: "",
        preferredDate: "",
      });

      setStatusMessage(
        t("careGigs.form.success", {
          defaultValue:
            "Your care request was submitted successfully.",
        })
      );
    } catch (error) {
      console.error(
        "Care request submission failed:",
        error
      );

      setStatusMessage(
        t("careGigs.form.submitError", {
          defaultValue:
            "We could not submit your care request. Please try again.",
        })
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="care-request-title"
      style={formContainer}
    >
      <h2 id="care-request-title">
        {t("careGigs.form.title", {
          defaultValue: "Create a Care Request",
        })}
      </h2>

      <p style={helpText}>
        {t("careGigs.form.introduction", {
          defaultValue:
            "Tell us what care or support you need.",
        })}
      </p>

      <div style={fieldGroup}>
        <label
          htmlFor="care-service-type"
          style={label}
        >
          {t("careGigs.form.serviceType", {
            defaultValue: "Care Service Type",
          })}
        </label>

        <select
          id="care-service-type"
          name="serviceType"
          value={form.serviceType}
          onChange={handleChange}
          style={input}
        >
          <option value="">
            {t("careGigs.form.selectService", {
              defaultValue: "Select a service",
            })}
          </option>

          <option value="caregiver">
            {t("careGigs.form.serviceCaregiver", {
              defaultValue: "Caregiver Support",
            })}
          </option>

          <option value="home_assistance">
            {t("careGigs.form.serviceHome", {
              defaultValue: "Home Assistance",
            })}
          </option>

          <option value="transportation">
            {t("careGigs.form.serviceTransportation", {
              defaultValue: "Transportation Support",
            })}
          </option>

          <option value="support">
            {t("careGigs.form.serviceSupport", {
              defaultValue: "Support Services",
            })}
          </option>
        </select>
      </div>

      <div style={fieldGroup}>
        <label
          htmlFor="care-description"
          style={label}
        >
          {t("careGigs.form.description", {
            defaultValue:
              "What care or support do you need?",
          })}
        </label>

        <textarea
          id="care-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          style={input}
        />
      </div>

      <div style={fieldGroup}>
        <label
          htmlFor="care-location"
          style={label}
        >
          {t("careGigs.form.location", {
            defaultValue: "Service Area",
          })}
        </label>

        <input
          id="care-location"
          name="location"
          type="text"
          value={form.location}
          onChange={handleChange}
          style={input}
        />
      </div>

      <div style={fieldGroup}>
        <label
          htmlFor="care-date"
          style={label}
        >
          {t("careGigs.form.preferredDate", {
            defaultValue: "Preferred Date",
          })}
        </label>

        <input
          id="care-date"
          name="preferredDate"
          type="date"
          value={form.preferredDate}
          onChange={handleChange}
          style={input}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        style={submitButton}
      >
        {submitting
          ? t("careGigs.form.submittingButton", {
              defaultValue: "Submitting...",
            })
          : t("careGigs.form.submit", {
              defaultValue: "Submit Care Request",
            })}
      </button>

      {statusMessage && (
        <p
          role="status"
          aria-live="polite"
          style={status}
        >
          {statusMessage}
        </p>
      )}
    </form>
  );
}

const formContainer = {
  background: "#0f172a",
  padding: "24px",
  borderRadius: "20px",
  color: "white",
  maxWidth: "800px",
  margin: "0 auto",
};

const fieldGroup = {
  marginBottom: "22px",
};

const label = {
  display: "block",
  fontWeight: "700",
  marginBottom: "8px",
};

const input = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #475569",
  background: "#1e293b",
  color: "white",
  fontSize: "16px",
};

const helpText = {
  color: "#cbd5e1",
  lineHeight: "1.6",
};

const submitButton = {
  width: "100%",
  padding: "16px",
  border: "none",
  borderRadius: "12px",
  background: "#38bdf8",
  color: "white",
  fontWeight: "700",
  fontSize: "17px",
  cursor: "pointer",
};

const status = {
  color: "#86efac",
  lineHeight: "1.6",
  marginTop: "16px",
};

export default CareRequestForm;
