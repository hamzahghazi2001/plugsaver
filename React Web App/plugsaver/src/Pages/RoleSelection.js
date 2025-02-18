import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import managerImage from "./Images/manager.png"; // Import manager image
import memberImage from "./Images/member.png"; // Import member image

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null); // Track selected role

  const handleManagerClick = () => {
    setSelectedRole("manager"); // Set selected role to manager
  };

  const handleMemberClick = () => {
    setSelectedRole("member"); // Set selected role to member
  };

  const handleConfirmClick = () => {
    if (selectedRole === "manager") {
      navigate("/HouseholdManager"); // Navigate to HouseholdManager page
    } else if (selectedRole === "member") {
      navigate("/HouseholdMember"); // Navigate to HouseholdMember page
    }
  };

  // Styles
  const containerStyle = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Center content horizontally
    background: "linear-gradient(to top, #4ADE80, #22D3EE, #3B82F6)",
    color: "white",
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    overflowX: "hidden", // Prevent horizontal overflow
    overflowY: "auto", // Allow vertical scrolling
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
    width: "90%", // Responsive width
    maxWidth: "800px", // Max width for larger screens
    margin: "20px auto", // Center and add margin
    boxSizing: "border-box", // Include padding in width calculation
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
    padding: "20px", // Reduced padding for better spacing on mobile
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "90%", // Responsive width
    maxWidth: "900px", // Reduced maxWidth for better desktop layout
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

  const roleContainerStyle = {
    display: "flex",
    justifyContent: "space-between", // Space out the role cards
    alignItems: "center", // Center items vertically
    width: "100%", // Full width of the container
    flexDirection: "row", // Default to row layout
    gap: "10px", // Add gap between cards
    "@media (max-width: 600px)": {
      flexDirection: "column", // Stack vertically on mobile
      gap: "10px", // Add gap between stacked cards
    },
  };

  const roleCardStyle = (isSelected) => ({
    width: "48%", // Slightly less than 50% to account for gap
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: isSelected ? "#007bff" : "#f9f9f9",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
    "@media (max-width: 600px)": {
      width: "100%", // Full width on mobile
      padding: "15px", // Reduce padding for mobile
    },
    boxSizing: "border-box", // Include padding in width calculation
  });

  const roleImageStyle = {
    width: "80px", // Smaller image size for mobile
    height: "80px",
    borderRadius: "10px",
    marginBottom: "10px",
    objectFit: "cover", // Ensure the image fits well
    "@media (max-width: 600px)": {
      width: "60px", // Even smaller image size for mobile
      height: "60px",
    },
  };

  const roleTitleStyle = (isSelected) => ({
    fontSize: "18px",
    fontWeight: "bold",
    color: isSelected ? "white" : "#333",
    "@media (max-width: 600px)": {
      fontSize: "16px", // Smaller font size for mobile
    },
  });

  const confirmButtonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: selectedRole ? "#007bff" : "#ccc",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: selectedRole ? "pointer" : "not-allowed",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginTop: "20px",
    pointerEvents: selectedRole ? "auto" : "none",
    transition: "background-color 0.3s ease",
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
            <div style={progressCircleStyle(false, true)}>2</div>
            <div style={progressLabelStyle}>Role</div>
          </div>
          <div style={progressStepStyle}>
            <div style={progressCircleStyle(false, false)}>3</div>
            <div style={progressLabelStyle}>Household</div>
          </div>
        </div>
      </div>

      {/* Card Container (Centered) */}
      <div style={cardContainerStyle}>
        {/* Role Selection Card */}
        <div style={cardStyle}>
          <div style={titleStyle}>Select Your Role</div>

          {/* Role Selection Cards */}
          <div style={roleContainerStyle}>
            <div
              style={roleCardStyle(selectedRole === "manager")}
              onClick={handleManagerClick}
            >
              <img
                src={managerImage} // Use imported manager image
                alt="Manager Role"
                style={roleImageStyle}
              />
              <div style={roleTitleStyle(selectedRole === "manager")}>Manager</div>
            </div>
            <div
              style={roleCardStyle(selectedRole === "member")}
              onClick={handleMemberClick}
            >
              <img
                src={memberImage} // Use imported member image
                alt="Member Role"
                style={roleImageStyle}
              />
              <div style={roleTitleStyle(selectedRole === "member")}>Member</div>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            style={confirmButtonStyle}
            onClick={handleConfirmClick}
            disabled={!selectedRole} // Disable button if no role is selected
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}