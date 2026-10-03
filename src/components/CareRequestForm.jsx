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
    preferredTime: "",
    urgency: "normal",
    communicationPreference: "",
    accessibilityNeeds: "",
  });

  const [errors, setErrors] =
    useState({});

  const [statusMessage, setStatusMessage] =
    useState("");

  const serviceTypes = [
    {
      value: "caregiver",
      label: t(
        "careGigs.form.serviceCaregiver",
        {
          defaultValue:
            "Caregiver Support",
        }
      ),
    },
    {
      value: "home_assistance",
      label: t(
        "careGigs.form.serviceHome",
        {
          defaultValue:
            "Home Assistance",
        }
      ),
    },
    {
      value: "transportation",
      label: t(
        "careGigs.form.serviceTransportation",
        {
          defaultValue:
            "Transportation Support",
        }
      ),
    },
    {
      value: "support",
      label: t(
        "careGigs.form.serviceSupport",
        {
          defaultValue:
            "Support Services",
        }
      ),
    },
  ];

  const urgencyOptions = [
    {
      value: "low",
      label: t(
        "careGigs.form.urgencyLow",
        {
          defaultValue:
            "Low",
        }
      ),
    },
    {
      value: "normal",
      label: t(
        "careGigs.form.urgencyNormal",
        {
          defaultValue:
            "Normal",
        }
      ),
    },
    {
      value: "high",
      label: t(
        "careGigs.form.urgencyHigh",
        {
          defaultValue:
            "High",
        }
      ),
    },
  ];

  const communicationOptions = [
    {
      value: "text",
      label: t(
        "careGigs.form.communicationText",
        {
          defaultValue:
            "Text / Written Communication",
        }
      ),
    },
    {
      value: "voice",
      label: t(
        "careGigs.form.communicationVoice",
        {
          defaultValue:
            "Voice Communication",
        }
      ),
    },
    {
      value: "video",
      label: t(
        "careGigs.form.communicationVideo",
        {
          defaultValue:
            "Video Communication",
        }
      ),
    },
    {
      value: "any",
      label: t(
        "careGigs.form.communicationAny",
        {
          defaultValue:
            "Any Accessible Communication Method",
        }
      ),
    },
  ];

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }

    setStatusMessage("");
  }

  function validateForm() {
    const nextErrors = {};

    if (!form.serviceType) {
      nextErrors.serviceType =
        t(
          "careGigs.form.serviceRequired",
          {
            defaultValue:
              "Please select a care service type.",
          }
        );
    }

    if (
      !form.description.trim()
    ) {
      nextErrors.description =
        t(
          "careGigs.form.descriptionRequired",
          {
            defaultValue:
              "Please describe the care or support you need.",
          }
        );
    }

    if (
      !form.location.trim()
    ) {
      nextErrors.location =
        t(
          "careGigs.form.locationRequired",
          {
            defaultValue:
              "Please provide the service area.",
          }
        );
    }

    if (!form.preferredDate) {
      nextErrors.preferredDate =
        t(
          "careGigs.form.dateRequired",
          {
            defaultValue:
              "Please select a preferred date.",
          }
        );
    }

    setErrors(nextErrors);

    return (
      Object.keys(
        nextErrors
      ).length === 0
    );
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setStatusMessage("");

    if (!validateForm()) {
      setStatusMessage(
        t(
          "careGigs.form.validationError",
          {
            defaultValue:
              "Please correct the highlighted fields before submitting.",
          }
        )
      );

      return;
    }

    if (
      typeof onSubmit !==
      "function"
    ) {
      setStatusMessage(
        t(
          "careGigs.form.notReady",
          {
            defaultValue:
              "Care request submission is not connected yet.",
          }
        )
      );

      return;
    }

    try {
      setStatusMessage(
        t(
          "careGigs.form.submitting",
          {
            defaultValue:
              "Submitting your care request...",
          }
        )
      );

      await onSubmit({
        serviceType:
          form.serviceType,

        description:
          form.description.trim(),

        location:
          form.location.trim(),

        preferredDate:
          form.preferredDate,

        preferredTime:
          form.preferredTime,

        urgency:
          form.urgency,

        communicationPreference:
          form.communicationPreference,

        accessibilityNeeds:
          form.accessibilityNeeds.trim(),
      });

      setForm({
        serviceType: "",
        description: "",
        location: "",
        preferredDate: "",
        preferredTime: "",
        urgency: "normal",
        communicationPreference: "",
        accessibilityNeeds: "",
      });

      setErrors({});

      setStatusMessage(
        t(
          "careGigs.form.success",
          {
            defaultValue:
              "Your care request was submitted successfully.",
          }
        )
      );
    } catch (error) {
      console.error(
        "Care request submission failed:",
        error
      );

      setStatusMessage(
        t(
          "careGigs.form.submitError",
          {
            defaultValue:
              "We could not submit your care request. Please try again.",
          }
        )
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
      <header>
        <h2 id="care-request-title">
          {t(
            "careGigs.form.title",
            {
              defaultValue:
                "Create a Care Request",
            }
          )}
        </h2>

        <p style={helpText}>
          {t(
            "careGigs.form.introduction",
            {
              defaultValue:
                "Tell us what care or support you need. You can include accessibility and communication preferences so suitable providers can better understand your needs.",
            }
          )}
        </p>
      </header>

      <div
        aria-live="polite"
        aria-atomic="true"
        style={visuallyHidden}
      >
        {statusMessage}
      </div>

      <div
        role="alert"
        aria-live="assertive"
        style={
          Object.keys(errors)
            .length > 0
            ? errorSummary
            : visuallyHidden
        }
      >
        {Object.keys(errors).length >
          0 &&
          t(
            "careGigs.form.validationSummary",
            {
              defaultValue:
                "Some fields need your attention.",
            }
          )}
      </div>

      <div style={fieldGroup}>
        <label
          htmlFor="care-service-type"
          style={label}
        >
          {t(
            "careGigs.form.serviceType",
            {
              defaultValue:
                "Care Service Type",
            }
          )}
        </label>

        <select
          id="care-service-type"
          name="serviceType"
          value={form.serviceType}
          onChange={handleChange}
          aria-invalid={
            Boolean(
              errors.serviceType
            )
          }
          aria-describedby={
            errors.serviceType
              ? "care-service-type-error"
              : undefined
          }
          style={input}
        >
          <option value="">
            {t(
              "careGigs.form.selectService",
              {
                defaultValue:
                  "Select a service",
              }
            )}
          </option>

          {serviceTypes.map(
            (service) => (
              <option
                key={
                  service.value
                }
                value={
                  service.value
                }
              >
                {service.label}
              </option>
            )
          )}
        </select>

        {errors.serviceType && (
          <p
            id="care-service-type-error"
            style={fieldError}
          >
            {errors.serviceType}
          </p>
        )}
      </div>

      <div style={fieldGroup}>
        <label
          htmlFor="care-description"
          style={label}
        >
          {t(
            "careGigs.form.description",
            {
              defaultValue:
                "What care or support do you need?",
            }
          )}
        </label>

        <textarea
          id="care-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={6}
          aria-invalid={
            Boolean(
              errors.description
            )
          }
          aria-describedby={
            errors.description
              ? "care-description-error"
              : "care-description-help"
          }
          style={{
            ...input,
            resize: "vertical",
          }}
        />

        <p
          id="care-description-help"
          style={helpText}
        >
          {t(
            "careGigs.form.descriptionHelp",
            {
              defaultValue:
                "Avoid sharing passwords, financial information, or other unnecessary sensitive information.",
            }
          )}
        </p>

        {errors.description && (
          <p
            id="care-description-error"
            style={fieldError}
          >
            {errors.description}
          </p>
        )}
      </div>

      <div style={fieldGroup}>
        <label
          htmlFor="care-location"
          style={label}
        >
          {t(
            "careGigs.form.location",
            {
              defaultValue:
                "Service Area",
            }
          )}
        </label>

        <input
          id="care-location"
          name="location"
          type="text"
          value={form.location}
          onChange={handleChange}
          autoComplete="street-address"
          aria-invalid={
            Boolean(
              errors.location
            )
          }
          aria-describedby={
            errors.location
              ? "care-location-error"
              : undefined
          }
          style={input}
        />

        {errors.location && (
          <p
            id="care-location-error"
            style={fieldError}
          >
            {errors.location}
          </p>
        )}
      </div>

      <div style={twoColumn}>
        <div style={fieldGroup}>
          <label
            htmlFor="care-date"
            style={label}
          >
            {t(
              "careGigs.form.preferredDate",
              {
                defaultValue:
                  "Preferred Date",
              }
            )}
          </label>

          <input
            id="care-date"
            name="preferredDate"
            type="date"
            value={
              form.preferredDate
            }
            onChange={handleChange}
            aria-invalid={
              Boolean(
                errors.preferredDate
              )
            }
            aria-describedby={
              errors.preferredDate
                ? "care-date-error"
                : undefined
            }
            style={input}
          />

          {errors.preferredDate && (
            <p
              id="care-date-error"
              style={fieldError}
            >
              {
                errors.preferredDate
              }
            </p>
          )}
        </div>

        <div style={fieldGroup}>
          <label
            htmlFor="care-time"
            style={label}
          >
            {t(
              "careGigs.form.preferredTime",
              {
                defaultValue:
                  "Preferred Time",
              }
            )}
          </label>

          <input
            id="care-time"
            name="preferredTime"
            type="time"
            value={
              form.preferredTime
            }
            onChange={handleChange}
            style={input}
          />
        </div>
      </div>

      <div style={fieldGroup}>
        <label
          htmlFor="care-urgency"
          style={label}
        >
          {t(
            "careGigs.form.urgency",
            {
              defaultValue:
                "Urgency",
            }
          )}
        </label>

        <select
          id="care-urgency"
          name="urgency"
          value={form.urgency}
          onChange={handleChange}
          style={input}
        >
          {urgencyOptions.map(
            (option) => (
              <option
                key={
                  option.value
                }
                value={
                  option.value
                }
              >
                {option.label}
              </option>
            )
          )}
        </select>
      </div>

      <fieldset
        style={fieldset}
      >
        <legend style={legend}>
          {t(
            "careGigs.form.communicationPreference",
            {
              defaultValue:
                "Preferred Communication Method",
            }
          )}
        </legend>

        <div style={radioGroup}>
          {communicationOptions.map(
            (option) => (
              <label
                key={
                  option.value
                }
                style={radioLabel}
              >
                <input
                  type="radio"
                  name="communicationPreference"
                  value={
                    option.value
                  }
                  checked={
                    form.communicationPreference ===
                    option.value
                  }
                  onChange={
                    handleChange
                  }
                />

                <span>
                  {
                    option.label
                  }
                </span>
              </label>
            )
          )}
        </div>
      </fieldset>

      <div style={fieldGroup}>
        <label
          htmlFor="care-accessibility-needs"
          style={label}
        >
          {t(
            "careGigs.form.accessibilityNeeds",
            {
              defaultValue:
                "Accessibility or Accommodation Needs",
            }
          )}
        </label>

        <textarea
          id="care-accessibility-needs"
          name="accessibilityNeeds"
          value={
            form.accessibilityNeeds
          }
          onChange={handleChange}
          rows={5}
          aria-describedby="care-accessibility-help"
          style={{
            ...input,
            resize: "vertical",
          }}
        />

        <p
          id="care-accessibility-help"
          style={helpText}
        >
          {t(
            "careGigs.form.accessibilityHelp",
            {
              defaultValue:
                "You may describe communication, mobility, visual, hearing, cognitive, or other accessibility requirements.",
            }
          )}
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        style={{
          ...submitButton,
          opacity: submitting
            ? 0.6
            : 1,
          cursor: submitting
            ? "not-allowed"
            : "pointer",
        }}
      >
        {submitting
          ? t(
              "careGigs.form.submittingButton",
              {
                defaultValue:
                  "Submitting...",
              }
            )
          : t(
              "careGigs.form.submit",
              {
                defaultValue:
                  "Submit Care Request",
              }
            )}
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

const twoColumn = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
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

const fieldset = {
  border: "1px solid #475569",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "22px",
};

const legend = {
  fontWeight: "700",
  padding: "0 6px",
};

const radioGroup = {
  display: "grid",
  gap: "12px",
};

const radioLabel = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
};

const helpText = {
  color: "#cbd5e1",
  lineHeight: "1.6",
};

const fieldError = {
  color: "#fca5a5",
  lineHeight: "1.5",
};

const errorSummary = {
  background: "#450a0a",
  color: "#fecaca",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "20px",
};

const status = {
  color: "#86efac",
  lineHeight: "1.6",
  marginTop: "16px",
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
};

const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export default CareRequestForm;
