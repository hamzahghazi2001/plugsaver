import React, { useState, useEffect } from "react";
import DesktopLayout from "../Components/DesktopLayout";

export default function WelcomePage() {
  // Track window width to decide desktop vs. mobile layout
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const isDesktop = width >= 1024;

  // Inline container style (original gradient background, etc.)
  const containerStyle = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", // Center title vertically
    alignItems: "center",     // Center title horizontally
    background: "linear-gradient(135deg, #00C9FF, #92FE9D)",
    padding: "20px",
    boxSizing: "border-box",
  };

  // Your existing content (title, buttons, T&C text, etc.)
  const content = (
    <>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          data-layer="Plug Saver"
          className="PlugSaver"
          style={{
            color: "white",
            fontSize: 45,
            fontWeight: 500,
            marginBottom: "5px",
          }}
        >
          Plug Saver
        </div>
        <div
          data-layer="Empower Your Home, Save More Energy!"
          className="EmpowerYourHomeSaveMoreEnergy"
          style={{
            color: "white",
            fontSize: 17,
            fontWeight: 400,
          }}
        >
          Empower Your Home, <br /> Save More Energy!
        </div>
      </div>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          padding: "70px",
        }}
      >
        {/* Login Button */}
        <div
          data-layer="Login Button"
          className="LoginButton"
          style={{
            width: 259,
            height: 49,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FF0085",
            borderRadius: "25px",
            color: "white",
            fontSize: 20,
            fontWeight: 400,
            cursor: "pointer",
          }}
        >
          Login
        </div>

        {/* Create Account Button */}
        <div
          data-layer="Create Account Button"
          className="CreateAccountButton"
          style={{
            width: 259,
            height: 49,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.22)",
            borderRadius: "25px",
            color: "white",
            fontSize: 20,
            fontWeight: 400,
            cursor: "pointer",
          }}
        >
          Create Account
        </div>
      </div>

      {/* Terms and Conditions */}
      <div
        data-layer="By tapping Create Account or Login, I agree to the PlugSaver Terms and Conditions & Privacy Agreements."
        className="ByTappingCreateAccountOrLoginIAgreeToThePlugsaverTermsAndConditionsPrivacyAgreements"
        style={{
          width: "305px",
          textAlign: "center",
          fontSize: "11px",
          fontWeight: 400,
          lineHeight: "20px",
          color: "black",
          marginBottom: "20px",
        }}
      >
        <span>By tapping Create Account or Login, I agree to the PlugSaver </span>
        <span style={{ color: "#FF0085" }}>Terms and Conditions</span>
        <span> & </span>
        <span style={{ color: "#FF0085" }}>Privacy Agreements.</span>
      </div>
    </>
  );

  // If desktop, wrap content in DesktopLayout. Otherwise, render normally.
  return isDesktop ? (
    <DesktopLayout containerStyle={containerStyle}>
      {content}
    </DesktopLayout>
  ) : (
    <div style={containerStyle}>{content}</div>
  );
}
