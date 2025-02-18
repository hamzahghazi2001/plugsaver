import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import houseEmoji from "./Images/house.png"; // Import house emoji/image

export default function HouseholdManagerPage() {
  const navigate = useNavigate();
  const [householdCode, setHouseholdCode] = useState(""); // State for generated code

  // Function to generate a random 7-digit/letter code
  const generateHouseholdCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 7; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setHouseholdCode(code);
  };

  // Function to copy the generated code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(householdCode);
    alert("Code copied to clipboard!");
  };

  // Function to handle continue button click
  const handleContinueClick = () => {
    navigate("/HomePage"); // Navigate to the next page
  };

  // Styles
  const containerStyle = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "linear-gradient(to top, #4ADE80, #22D3EE, #3B82F6)",
    color: "white",
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    overflowX: "hidden",
    overflowY: "auto",
    boxSizing: "border-box",
    margin: 0,
    position: "fixed",
    top: 0,
    left: 0,
    padding: "16px", // Add padding to avoid touching the edges
  };

  const progressBarContainerStyle = {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "800px",
    margin: "20px auto", // Margin to position the progress bar at the top
    boxSizing: "border-box",
  };

  const progressTrackerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    position: "relative",
  };

  const progressStepStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1, // Ensure steps are above the progress line
  };

  const progressCircleStyle = (isCompleted, isCurrent) => ({
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: isCompleted ? "#4ADE80" : isCurrent ? "#007bff" : "#ddd",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  });

  const progressLabelStyle = {
    marginTop: "5px",
    fontSize: "12px",
    color: "#666",
  };

  const cardContainerStyle = {
    flex: 1, // Take up remaining space
    display: "flex",
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
    width: "100%",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    padding: "40px", // Increased padding for better spacing
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "800px", // Reduced maxWidth for better desktop layout
    textAlign: "center",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column", // Ensure vertical stacking
    alignItems: "center", // Center-align all items
    marginTop: -90,
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  };

  const codeContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
    gap: "10px", // Added gap for better spacing
    flexWrap: "wrap", // Allow wrapping on smaller screens
  };

  const codeInputStyle = {
    width: "150px", // Reduced width of the input field
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
    color: "#333",
    fontSize: "16px",
    textAlign: "center",
    flex: "none", // Prevent input from growing
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
    flex: "none", // Prevent button from growing
  };

  const continueButtonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: householdCode ? "#007bff" : "#ccc",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: householdCode ? "pointer" : "not-allowed",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginTop: "20px",
    pointerEvents: householdCode ? "auto" : "none",
    transition: "background-color 0.3s ease",
  };

  const houseEmojiStyle = {
    width: "60px",
    height: "60px",
    margin: "20px auto", // Center the image
  };

  return (
    <div style={containerStyle}>
      {/* Progress Bar Container */}
      <div style={progressBarContainerStyle}>
        <div style={progressTrackerStyle}>
          <div style={progressStepStyle}>
            <div style={progressCircleStyle(true, false)}>✓</div>
            <div style={progressLabelStyle}>Sign Up</div>
          </div>
          <div style={progressStepStyle}>
            <div style={progressCircleStyle(true, false)}>✓</div>
            <div style={progressLabelStyle}>Role</div>
          </div>
          <div style={progressStepStyle}>
            <div style={progressCircleStyle(false, true)}>3</div>
            <div style={progressLabelStyle}>Household</div>
          </div>
        </div>
      </div>

      {/* Card Container (Centered) */}
      <div style={cardContainerStyle}>
        {/* Household Manager Card */}
        <div style={cardStyle}>
          {/* Title */}
          <div style={titleStyle}>Create Household</div>

          {/* House Emoji/Image */}
          <img src={houseEmoji} alt="House" style={houseEmojiStyle} />

          {/* Generate Code Button */}
          <button style={buttonStyle} onClick={generateHouseholdCode}>
            Generate Household Code
          </button>

          {/* Household Code and Copy Button */}
          <div style={codeContainerStyle}>
            <input
              type="text"
              placeholder="Household Code"
              value={householdCode}
              readOnly
              style={codeInputStyle}
            />
            <button style={buttonStyle} onClick={copyToClipboard}>
              Copy
            </button>
          </div>

          {/* Continue Button */}
          <button
            style={continueButtonStyle}
            onClick={handleContinueClick}
            disabled={!householdCode}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}