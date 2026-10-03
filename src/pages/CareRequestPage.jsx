import { useState } from "react";

import DashboardLayout from "../components/DashboardLayout";
import CareRequestForm from "../components/CareRequestForm";
import { useTranslation } from "react-i18next";

function CareRequestPage() {
  const { t } = useTranslation();

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(requestData) {
    setSubmitting(true);

    try {
      const { createCareRequest } = await import(
        "../services/careGigService"
      );

      const result = await createCareRequest(requestData);

      return result;
    } catch (error) {
      console.error(
        "Care request page submission failed:",
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
        aria-labelledby="care-request-page-title"
        style={page}
      >
        <header style={header}>
          <h1 id="care-request-page-title">
            {t("careGigs.requestPage.title", {
              defaultValue: "Create a Care Request",
            })}
          </h1>

          <p style={intro}>
            {t("careGigs.requestPage.introduction", {
              defaultValue:
                "Tell us what care or support you need so suitable providers can respond.",
            })}
          </p>
        </header>

        <CareRequestForm
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </main>
    </DashboardLayout>
  );
}

const page = {
  color: "white",
  maxWidth: "1000px",
  margin: "0 auto",
  paddingBottom: "40px",
};

const header = {
  marginBottom: "28px",
};

const intro = {
  color: "#cbd5e1",
  lineHeight: "1.7",
  maxWidth: "760px",
};

export default CareRequestPage;
