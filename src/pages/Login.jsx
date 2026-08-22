import { useState } from "react";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../firebase";

import {
  useNavigate,
  Link,
} from "react-router-dom";

// =======================================================
// IFSE Identity Backend
// =======================================================

const IFSE_IDENTITY_URL =
  "https://inclura-ifse-backend.onrender.com/api/identity";

// =======================================================
// Base64URL → ArrayBuffer
// =======================================================

function base64UrlToArrayBuffer(
  value
) {
  const padding =
    "=".repeat(
      (4 - (value.length % 4)) % 4
    );

  const base64 =
    (
      value
        .replace(/-/g, "+")
        .replace(/_/g, "/") +
      padding
    );

  const binary =
    window.atob(base64);

  const bytes =
    new Uint8Array(
      binary.length
    );

  for (
    let index = 0;
    index < binary.length;
    index++
  ) {
    bytes[index] =
      binary.charCodeAt(index);
  }

  return bytes.buffer;
}

// =======================================================
// ArrayBuffer → Base64URL
// =======================================================

function arrayBufferToBase64Url(
  buffer
) {
  const bytes =
    new Uint8Array(buffer);

  let binary = "";

  for (
    let index = 0;
    index < bytes.length;
    index++
  ) {
    binary += String.fromCharCode(
      bytes[index]
    );
  }

  return window
    .btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

// =======================================================
// WebAuthn Credential → JSON
// =======================================================

function serializeAssertion(
  credential
) {
  const response =
    credential.response;

  return {
    id: credential.id,

    rawId:
      arrayBufferToBase64Url(
        credential.rawId
      ),

    type: credential.type,

    response: {
      authenticatorData:
        arrayBufferToBase64Url(
          response.authenticatorData
        ),

      clientDataJSON:
        arrayBufferToBase64Url(
          response.clientDataJSON
        ),

      signature:
        arrayBufferToBase64Url(
          response.signature
        ),

      userHandle:
        response.userHandle
          ? arrayBufferToBase64Url(
              response.userHandle
            )
          : null,
    },

    clientExtensionResults:
      credential.getClientExtensionResults
        ? credential.getClientExtensionResults()
        : {},

  };
}

// =======================================================
// Login Component
// =======================================================

function Login() {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    passkeyLoading,
    setPasskeyLoading,
  ] = useState(false);

  // =====================================================
  // Email / Password Login
  // =====================================================

  async function handleLogin() {

    if (!email || !password) {

      alert(
        "Please enter your email and password."
      );

      return;
    }

    try {

      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/profile");

    } catch (error) {

      console.error(
        "Email Login Error:",
        error
      );

      alert(
        error.message
      );

    } finally {

      setLoading(false);

    }
  }

  // =====================================================
  // Google Login
  // =====================================================

  async function handleGoogleLogin() {

    try {

      setLoading(true);

      await signInWithPopup(
        auth,
        googleProvider
      );

      navigate("/profile");

    } catch (error) {

      console.error(
        "Google Login Error:",
        error
      );

      console.error(
        "Code:",
        error.code
      );

      console.error(
        "Message:",
        error.message
      );

      alert(
        `${error.code}\n${error.message}`
      );

    } finally {

      setLoading(false);

    }
  }

  // =====================================================
  // IFSE Passkey Authentication
  // =====================================================

  async function handlePasskeyLogin() {

    try {

      setPasskeyLoading(true);

      // -------------------------------------------------
      // WebAuthn availability
      // -------------------------------------------------

      if (
        !window.PublicKeyCredential ||
        !navigator.credentials
      ) {

        throw new Error(
          "This browser does not support passkeys."
        );

      }

      // -------------------------------------------------
      // We need the user's Firebase identity.
      //
      // The current IFSE authentication service expects
      // a userId, so email alone is not enough.
      //
      // Therefore this flow currently requires the user
      // to enter the email associated with the account.
      // -------------------------------------------------

      if (!email) {

        throw new Error(
          "Enter your account email before using your passkey."
        );

      }

      // -------------------------------------------------
      // Ask IFSE for authentication options
      // -------------------------------------------------

      const optionsResponse =
        await fetch(
          `${IFSE_IDENTITY_URL}/authentication/options`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
            }),
          }
        );

      const optionsResult =
        await optionsResponse.json();

      if (
        !optionsResponse.ok ||
        optionsResult.success === false
      ) {

        throw new Error(
          optionsResult.message ||
          "IFSE could not create authentication options."
        );

      }

      // -------------------------------------------------
      // Convert WebAuthn options into browser format
      // -------------------------------------------------

      const options =
        optionsResult.optionsJSON;

      if (!options) {

        throw new Error(
          "IFSE did not return WebAuthn authentication options."
        );

      }

      const publicKey = {
        ...options,

        challenge:
          base64UrlToArrayBuffer(
            options.challenge
          ),

        allowCredentials:
          Array.isArray(
            options.allowCredentials
          )
            ? options.allowCredentials.map(
                (credential) => ({
                  ...credential,

                  id:
                    base64UrlToArrayBuffer(
                      credential.id
                    ),
                })
              )
            : undefined,
      };

      // -------------------------------------------------
      // Browser performs passkey authentication
      // -------------------------------------------------

      const credential =
        await navigator.credentials.get({
          publicKey,
        });

      if (!credential) {

        throw new Error(
          "No passkey credential was returned."
        );

      }

      // -------------------------------------------------
      // Serialize WebAuthn response
      // -------------------------------------------------

      const authenticationResponse =
        serializeAssertion(
          credential
        );

      // -------------------------------------------------
      // Verify through IFSE
      // -------------------------------------------------

      const verifyResponse =
        await fetch(
          `${IFSE_IDENTITY_URL}/authentication/verify`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              email,

              challengeId:
                optionsResult.challengeId,

              credentialId:
                credential.id,

              authenticationResponse,

            }),
          }
        );

      const verifyResult =
        await verifyResponse.json();

      if (
        !verifyResponse.ok ||
        verifyResult.success === false
      ) {

        throw new Error(
          verifyResult.message ||
          "IFSE passkey verification failed."
        );

      }

      if (
        verifyResult.authenticated !== true
      ) {

        throw new Error(
          "Passkey authentication was not confirmed."
        );

      }

      // -------------------------------------------------
      // Success
      // -------------------------------------------------

      alert(
        "Passkey authentication successful."
      );

      navigate("/profile");

    } catch (error) {

      console.error(
        "IFSE Passkey Login Error:",
        error
      );

      alert(
        `Passkey sign-in failed.\n\n${error.message}`
      );

    } finally {

      setPasskeyLoading(false);

    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <div
      style={{
        minHeight: "100vh",

        background:
          "#020617",

        color:
          "white",

        display:
          "flex",

        justifyContent:
          "center",

        alignItems:
          "center",

        padding:
          "24px",
      }}
    >

      <div
        style={{
          width:
            "100%",

          maxWidth:
            "420px",

          background:
            "#0f172a",

          padding:
            "32px",

          borderRadius:
            "24px",

          boxSizing:
            "border-box",
        }}
      >

        <h1
          style={{
            marginBottom:
              "10px",
          }}
        >
          Welcome Back 👋
        </h1>

        <p
          style={{
            color:
              "#94a3b8",

            marginBottom:
              "24px",
          }}
        >
          Sign in to continue to
          Inclura
        </p>

        {/* =============================================
            Google
        ============================================== */}

        <button
          onClick={
            handleGoogleLogin
          }

          disabled={
            loading ||
            passkeyLoading
          }

          style={{
            width:
              "100%",

            padding:
              "14px",

            borderRadius:
              "12px",

            border:
              "none",

            background:
              "white",

            color:
              "#111827",

            fontWeight:
              "700",

            marginBottom:
              "12px",

            cursor:
              "pointer",
          }}
        >
          Continue with Google
        </button>

        {/* =============================================
            Passkey
        ============================================== */}

        <button
          onClick={
            handlePasskeyLogin
          }

          disabled={
            loading ||
            passkeyLoading
          }

          style={{
            width:
              "100%",

            padding:
              "14px",

            borderRadius:
              "12px",

            border:
              "1px solid #38bdf8",

            background:
              "#0c4a6e",

            color:
              "white",

            fontWeight:
              "700",

            marginBottom:
              "20px",

            cursor:
              "pointer",
          }}
        >
          {passkeyLoading
            ? "Checking Passkey..."
            : "Sign in with Passkey 🔐"}
        </button>

        {/* =============================================
            Divider
        ============================================== */}

        <div
          style={{
            textAlign:
              "center",

            marginBottom:
              "20px",

            color:
              "#64748b",
          }}
        >
          OR
        </div>

        {/* =============================================
            Email
        ============================================== */}

        <input
          type="email"

          placeholder="Email"

          value={
            email
          }

          onChange={
            (e) =>
              setEmail(
                e.target.value
              )
          }

          style={
            inputStyle
          }
        />

        {/* =============================================
            Password
        ============================================== */}

        <input
          type="password"

          placeholder="Password"

          value={
            password
          }

          onChange={
            (e) =>
              setPassword(
                e.target.value
              )
          }

          style={
            inputStyle
          }

          onKeyDown={
            (e) => {

              if (
                e.key === "Enter"
              ) {

                handleLogin();

              }

            }
          }
        />

        {/* =============================================
            Email Login
        ============================================== */}

        <button
          onClick={
            handleLogin
          }

          disabled={
            loading ||
            passkeyLoading
          }

          style={{
            width:
              "100%",

            padding:
              "14px",

            borderRadius:
              "12px",

            border:
              "none",

            background:
              "#38bdf8",

            color:
              "white",

            fontWeight:
              "700",

            cursor:
              "pointer",

            marginTop:
              "10px",
          }}
        >
          {loading
            ? "Signing In..."
            : "Sign In"}
        </button>

        {/* =============================================
            Forgot Password
        ============================================== */}

        <p
          style={{
            textAlign:
              "center",

            marginTop:
              "20px",
          }}
        >

          <Link
            to="/forgot-password"

            style={{
              color:
                "#38bdf8",
            }}
          >
            Forgot Password?
          </Link>

        </p>

        {/* =============================================
            Sign Up
        ============================================== */}

        <p
          style={{
            textAlign:
              "center",

            marginTop:
              "16px",

            color:
              "#94a3b8",
          }}
        >
          Don't have an account?{" "}

          <Link
            to="/signup"

            style={{
              color:
                "#38bdf8",
            }}
          >
            Sign Up
          </Link>

        </p>

      </div>

    </div>

  );
}

// =======================================================
// Input Style
// =======================================================

const inputStyle = {

  width:
    "100%",

  padding:
    "14px",

  borderRadius:
    "12px",

  border:
    "1px solid #334155",

  background:
    "#1e293b",

  color:
    "white",

  marginBottom:
    "14px",

  boxSizing:
    "border-box",

};

// =======================================================
// Export
// =======================================================

export default Login;                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                              

                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            

                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
