import { useState } from "react";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  db,
  auth,
} from "../firebase";

import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

function VerificationApplication() {
const [type, setType] =
useState("creator");

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
const navigate = useNavigate();

const fees = {
  creator: 3000,
  ngo: 5000,
  hospital: 10000,
  university: 15000,
  organization: 20000,
  government: 0,
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

        accountType: type,

        fullName,

        email,

        phone,

        socialLink1,

        socialLink2,

        officialEmail,

        paymentAmount:
          fees[type],

        paymentStatus:
          type === "government"
            ? "free"
            : "pending",

        status: "pending",

        documentName:
          documentFile
            ? documentFile.name
            : "",

        documentUrl: "",

        note:
          "Identity verification request",

        createdAt:
          serverTimestamp(),
      }
    );

    if (type === "government") {
      alert(
        "Government verification request submitted successfully."
      );

      navigate("/profile");

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
maxWidth: "800px",
}}
>
<h1>
Verification Application
</h1>

<p>
  Identity Verification Review Fee
</p>

    {/* Verification Type */}  
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
      style={inputStyle}  
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

    {/* Full Name */}  
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

    {/* Email */}  
    <label>Email</label>  

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

    {/* Phone */}  
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

    {/* Creator Fields */}  
    {type ===  
      "creator" && (  
      <>  
        <label>  
          Social Link 1  
        </label>  

        <input  
          type="text"  
          value={  
            socialLink1  
          }  
          onChange={(e) =>  
            setSocialLink1(  
              e.target.value  
            )  
          }  
          style={  
            inputStyle  
          }  
        />  

        <label>  
          Social Link 2  
        </label>  

        <input  
          type="text"  
          value={  
            socialLink2  
          }  
          onChange={(e) =>  
            setSocialLink2(  
              e.target.value  
            )  
          }  
          style={  
            inputStyle  
          }  
        />  
      </>  
    )}  

    {/* Government */}  
{type === "government" && (
  <>
    <div
      style={{
        background: "#16a34a",
        color: "white",
        padding: "14px",
        borderRadius: "12px",
        marginBottom: "16px",
        fontWeight: "600",
      }}
    >
      🏛 Government verification is FREE.
      <br />
      Applications are manually reviewed before approval.
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
      placeholder="example@agency.gov.ng"
    />
  </>
)}

    {/* Document Upload */}  
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
        marginBottom:  
          "20px",  
      }}  
    />  

    {/* Fee */}  
    <div  
      style={{  
        background:  
          "#1e293b",  
        padding: "16px",  
        borderRadius:  
          "12px",  
        marginBottom:  
          "20px",  
      }}  
    >  
      <h3>  
        Apply for identity verification.
      </h3>  

      <p>  
        ₦  
        {fees[  
          type  
        ].toLocaleString()}  
      </p>  
    </div>  

    {/* Submit */}  
    <button  
      onClick={  
        handleContinue  
      }  
      style={{  
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
        cursor:  
          "pointer",  
      }}  
    >  {type === "government"
    ? "Submit Verification Request"
    : "Continue To Payment"}
    </button>  
  </div>  
</DashboardLayout>

);
}

export default VerificationApplication;
