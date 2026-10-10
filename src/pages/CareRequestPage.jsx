import { useState } from "react";
import { useTranslation } from "react-i18next";

import DashboardLayout from "../components/DashboardLayout";
import CareRequestForm from "../components/CareRequestForm";

import { createCareRequest } from "../services/careGigService";

function CareRequestPage() {
  const { t } = useTranslation();

  const [submitting, setSubmitting] = useState(false);

  async function handleFormSubmit(requestData) {
    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const result = await createCareRequest(requestData);

      if (!result || !result.success || !result.requestId) {
        throw new Error("CARE_REQUEST_CREATION_FAILED");
      }

      return result;
    } catch (error) {
      console.error(
        "CareGig request submission failed:",
        error
      );

      throw error;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <main
        style={{
          color: "white",
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "30px",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <h1>
          {t("careGigs.createRequest", {
            defaultValue: "Create a Care Request",
          })}
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: "1.6",
          }}
        >
          {t("careGigs.form.introduction", {
            defaultValue:
              "Tell us what care or support you need.",
          })}
        </p>

        <section
          aria-label={t("careGigs.form.title", {
            defaultValue: "Care Request Form",
          })}
          style={{
            marginTop: "24px",
            width: "100%",
          }}
        >
          <CareRequestForm
            onSubmit={handleFormSubmit}
            submitting={submitting}
          />
        </section>
      </main>
    </DashboardLayout>
  );
}

export default CareRequestPage;
