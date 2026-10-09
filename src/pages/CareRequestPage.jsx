import DashboardLayout from "../components/DashboardLayout";
import CareRequestForm from './path/to/CareRequestForm';

const handleFormSubmit = async (event) => {
  event.preventDefault(); // Prevent the default form submission
  const formData = new FormData(event.target); // Collect form data
  // Handle form submission logic here
};

function CareRequestPage() {
  return (
    <DashboardLayout>
      <main
        style={{
          color: "white",
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        <h1>Create a Care Request</h1>

        <p style={{ color: "#cbd5e1" }}>
          Care Request page is loading correctly.
        </p>

        <div
          style={{
            background: "#0f172a",
            padding: "24px",
            borderRadius: "20px",
            marginTop: "24px",
          }}
        >
          <h2>Care Request Form</h2>

          <form onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="requesterName">Name:</label>
              <input type="text" id="requesterName" name="requesterName" required />
            </div>
            <div>
              <label htmlFor="requestDetails">Request Details:</label>
              <textarea id="requestDetails" name="requestDetails" required></textarea>
            </div>
            <button type="submit">Submit Request</button>
          </form>

          <p>
            This is a temporary rendering test for the
            Care-Gigs request route.
          </p>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default CareRequestPage;
