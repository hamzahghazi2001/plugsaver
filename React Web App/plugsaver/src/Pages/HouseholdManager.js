import React, { useState } from "react";
import logo from "./Images/arrow-back.png";
import logo2 from "./Images/house.png"; // Assuming this is the house.png image

function HouseholdManager() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [generatedCode, setGeneratedCode] = useState(""); // State for the generated code

  // Function to handle the Generate Household button click
  const handleGenerateHousehold = () => {
    setGeneratedCode("2F75JH9"); // Set the generated code
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        height: "100vh", // Full viewport height
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Center vertically
        alignItems: "center", // Center horizontally
        position: "relative", // For absolute positioning of the "Share Code" text
      }}
    >
      {/* Title Banner */}
      <div
        style={{
          width: "100%",
          height: "200px",
          background: "linear-gradient(90deg, #236AF2, #34ECE1, #54DEE7, #B6FF7C)",
          borderBottomLeftRadius: "24px",
          borderBottomRightRadius: "24px",
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "hidden",
        }}
      >
        {/* Blurred background shapes */}
        <div
          style={{
            width: "500px",
            height: "400px",
            background: "#34ECE1",
            position: "absolute",
            top: "-100px",
            left: "-50px",
            filter: "blur(100px)",
          }}
        ></div>
        <div
          style={{
            width: "600px",
            height: "500px",
            background: "#236AF2",
            position: "absolute",
            top: "-150px",
            left: "30%",
            filter: "blur(120px)",
          }}
        ></div>
        <div
          style={{
            width: "450px",
            height: "350px",
            background: "#54DEE7",
            position: "absolute",
            top: "-50px",
            left: "70%",
            filter: "blur(100px)",
          }}
        ></div>
        <div
          style={{
            width: "550px",
            height: "400px",
            background: "#B6FF7C",
            position: "absolute",
            top: "50px",
            left: "40%",
            filter: "blur(110px)",
          }}
        ></div>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div
            style={{
              width: "80%",
              maxWidth: "400px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "90%",
                height: "3px",
                background: "white",
                position: "absolute",
                top: "30%",
                left: "10px",
                transform: "translateY(-50%)",
              }}
            ></div>
            {["✓", "✓", "✓", ""].map((mark, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    background: "white",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: index === 3 ? "2px solid #FF0085" : "none",
                    fontWeight: "bold",
                    fontSize: "20px",
                    color: "black",
                  }}
                >
                  {mark}
                </div>
                <div style={{ marginTop: "5px", color: "white", fontSize: "14px" }}>
                  {["Sign Up", "2FA", "Role", "Household"][index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <img
        src={logo}
        alt="Back"
        style={{
          width: "35px",
          height: "30px",
          position: "absolute",
          top: "30px",
          left: "20px",
          cursor: "pointer",
        }}
      />

      {/* Household Creation Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "30px", // Increased gap for more spacing
          zIndex: 2, // Ensure it's above the banner
        }}
      >
        {/* Create Household Text */}
        <h2 style={{ color: "black", fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
          Create Household
        </h2>

        {/* House Image */}
        <img
          src={logo2}
          alt="House"
          style={{ width: "80px", height: "auto", marginBottom: "20px" }}
        />

        {/* Generate Household Button */}
        <button
          onClick={handleGenerateHousehold}
          style={{
            width: "220px",
            height: "50px",
            background: "#FF0085",
            color: "white",
            fontSize: "18px",
            borderRadius: "25px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            transition: "background 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.background = "#E00075")}
          onMouseOut={(e) => (e.target.style.background = "#FF0085")}
        >
          Generate Household
        </button>

        {/* Generated Code Text Field */}
        <input
          type="text"
          value={generatedCode}
          readOnly
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "2px solid #ccc",
            width: "160px",
            textAlign: "center",
            marginTop: "20px", // Increased margin for more spacing
          }}
        />

        {/* Continue Button */}
        <button
          style={{
            width: "138px",
            height: "50px",
            background: "#FF0085",
            color: "white",
            fontSize: "18px",
            borderRadius: "25px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            transition: "background 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.background = "#E00075")}
          onMouseOut={(e) => (e.target.style.background = "#FF0085")}
        >
          Continue
        </button>
      </div>

      {/* Share Code Text at the Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          color: "#008CFF",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Copy Household Code
      </div>
    </div>
  );
}

export default HouseholdManager;