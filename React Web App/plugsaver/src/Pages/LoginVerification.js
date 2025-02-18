import React from "react";
import logo from "./Images/arrow-back.png"; 
import logo2 from "./Images/2fa.png";

function App() {
  const arrowStyle = {
    width: "35px",
    height: "30px",
    position: "absolute",
    top: "30px",
    left: "10px",
  };

  const twofaStyle = {
    width: "115px",
    height: "115px",
    marginTop: "30px", // Space from the previous content
    marginLeft: "auto", // Center horizontally
    marginRight: "auto", // Center horizontally
    display: "block", // Ensure it behaves like a block element for centering
  };
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100vh",
    paddingTop: "80px", // Add space from the toppl
  };

  const inputContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  };

  const labelStyle = {
    textAlign: "center",
    marginBottom: "5px",
    fontSize: "17px",
  };

  const inputStyle = {
    border: "1px solid gray",
    padding: "10px",
    borderRadius: "3px",
    width: "300px",
    marginBottom: "20px",
  };

 

  return (
    <div>
      <img src={logo} alt="Logo" style={arrowStyle} />
      {/* Two-Factor Authentication Section at the Top */}
      <div
        data-layer="Component 33"
        className="Component33"
        style={{
          width: "100%",
          textAlign: "center",
          paddingBottom: "20px",
        }}
      >
        <div
          data-layer="Two-Factor Authentication"
          className="TwoFactorAuthentication"
          style={{
            color: "#008CFF",
            fontSize: 24,
            fontFamily: "",
            fontWeight: "400",
            wordWrap: "break-word",
            marginTop: "220px",
          }}
        >
          Two-Factor Authentication
        </div>
        <div
          data-layer="Enter the 6 Digit Code Sent To Your Email"
          className="EnterThe6DigitCodeSentToYourEmail"
          style={{
            color: "black",
            fontSize: 12,
            fontFamily: "",
            fontWeight: "400",
            wordWrap: "break-word",
            marginTop: "5px",
          }}
        >
          Enter the 6 Digit Code Sent To Your Email
        </div>
      </div>

      {/* 2FA Image Section - Centered horizontally */}
      <img src={logo2} alt="Logo2" style={twofaStyle} />
      
      <div style={containerStyle}>
        <div style={inputContainerStyle}>
          <div style={labelStyle}>Authentication Code</div>
          <input type="text" style={inputStyle} />
        </div>

        {/* Verify Button Section */}
        <div
          data-layer="Component 1"
          className="Component1"
          style={{ width: 114, height: 43, position: "relative" }}
        >
          <div
            data-layer="Login Rectangle"
            className="LoginRectangle"
            style={{
              width: 114,
              height: 43,
              left: 0,
              top: 0,
              position: "absolute",
              background: "#FF0085",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              borderRadius: 25,
            }}
          />
          <div
            data-layer="Verify"
            className="Verify"
            style={{
              width: 113,
              height: 43,
              left: 1,
              top: 0,
              position: "absolute",
              textAlign: "center",
              color: "white",
              fontSize: 20,
              fontFamily: "",
              fontWeight: "400",
              wordWrap: "break-word",
              lineHeight: "43px",
            }}
          >
            Verify
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
