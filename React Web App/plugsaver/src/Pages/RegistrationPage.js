import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [twoFACode, setTwoFACode] = useState(""); // State for 2FA code
  const [isCodeValid, setIsCodeValid] = useState(false); // State to track if the code is valid

  const handleRegisterClick = () => {
    navigate("/LoginPage");
  };

  const handleSignInClick = () => {
    if (name && email && password && isAgreed) {
      setShow2FAModal(true);
      startTimer();
    } else {
      alert("Please fill all fields and agree to the terms.");
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleResendCode = () => {
    setTimeLeft(60);
    startTimer();
  };

  const handleCloseModal = () => {
    setShow2FAModal(false);
    setTimeLeft(60); // Reset the timer when the modal is closed
    setTwoFACode(""); // Clear the 2FA code input
    setIsCodeValid(false); // Reset code validation
  };

  const handleVerifyClick = () => {
    // Redirect to /RoleSelection page
    navigate("/RoleSelection");
  };

  // Handle 2FA code input change
  const handleTwoFACodeChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    if (/^\d{0,6}$/.test(value)) {
      setTwoFACode(value);
      setIsCodeValid(value.length === 6); // Enable Verify button only if 6 digits are entered
    }
  };

  const containerStyle = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to top, #4ADE80, #22D3EE, #3B82F6)",
    color: "white",
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    overflow: "hidden",
    boxSizing: "border-box",
    margin: 0,
    position: "fixed",
    top: 0,
    left: 0,
    padding: "16px", // Add padding to ensure the container doesn't touch the edges
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    margin: "0 16px", // Add margin to ensure the card doesn't touch the edges
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  };

  const subtitleStyle = {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  };

  const inputContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
    color: "#333",
    fontSize: "14px",
    outline: "none",
  };

  const inputStyleCode = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
    color: "#333",
    fontSize: "14px",
    outline: "none",
    textAlign: "center", // Center the text inside the input
  };

  const checkboxContainerStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    justifyContent: "center",
  };

  const checkboxStyle = {
    marginRight: "10px",
    cursor: "pointer",
    transform: isAgreed ? "scale(1.1)" : "scale(1)", // Scale effect when checked
    transition: "transform 0.2s ease", // Smooth transition
  };

  const checkboxLabelStyle = {
    color: isAgreed ? "#007bff" : "#666", // Change label color when checked
    transition: "color 0.2s ease", // Smooth transition
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "15px",
    opacity: name && email && password && isAgreed ? 1 : 0.5,
    pointerEvents: name && email && password && isAgreed ? "auto" : "none",
  };

  const linkStyle = {
    color: "#007bff",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const modalContentStyle = {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    width: "90%",
    maxWidth: "400px",
    position: "relative",
  };

  const modalTitleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#007bff", // Matches the Verify button color
  };

  const modalSubtitleStyle = {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#666",
  };

  const timerStyle = {
    fontSize: "14px",
    color: "#666",
    marginTop: "10px",
  };

  const verifyButtonStyle = {
    width: "50%", // Decreased width of the Verify button
    padding: "12px",
    backgroundColor: isCodeValid ? "#007bff" : "#ccc", // Disabled style if code is invalid
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: isCodeValid ? "pointer" : "not-allowed", // Change cursor if disabled
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    margin: "20px auto", // Increased margin to add space between input and button
    pointerEvents: isCodeValid ? "auto" : "none", // Disable button if code is invalid
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={titleStyle}>Registration</div>
        <div style={subtitleStyle}>Enter your name, email, and password to register</div>
        <div style={inputContainerStyle}>
          <input
            type="text"
            placeholder="Name"
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div style={checkboxContainerStyle}>
          <input
            type="checkbox"
            style={checkboxStyle}
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
          />
          <span style={checkboxLabelStyle}>I agree the Terms and Conditions</span>
        </div>
        <button style={buttonStyle} onClick={handleSignInClick}>
          SIGN IN
        </button>
        <div style={{ color: "#666" }}>
          <span>Already have an account? </span>
          <a onClick={handleRegisterClick} style={linkStyle}>
            Login
          </a>
        </div>
      </div>

      {show2FAModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            {/* Exit Button */}
            <button style={closeButtonStyle} onClick={handleCloseModal}>
              ×
            </button>

            {/* Modal Title and Subtitle */}
            <div style={modalTitleStyle}>Two-Factor Authentication</div>
            <div style={modalSubtitleStyle}>
              Enter the 6 Digit Code Sent To Your Email
            </div>

            {/* 2FA Input Field */}
            <input
              type="text"
              placeholder="Enter 6 Digit Code"
              value={twoFACode}
              onChange={handleTwoFACodeChange}
              style={{
                ...inputStyleCode,
                marginBottom: "20px", // Increased space below the input
                width: "80%", // Centered and fixed width for the input
                margin: "0 auto", // Center the input field
                textAlign: "center", // Center the text inside the input
              }}
              maxLength={6} // Restrict input to 6 digits
            />

            {/* Verify Button */}
            <button
              style={verifyButtonStyle}
              onClick={handleVerifyClick} // Redirect to /RoleSelection
              disabled={!isCodeValid} // Disable button if code is invalid
            >
              Verify
            </button>

            {/* Timer and Resend Code */}
            <div style={timerStyle}>
              {timeLeft > 0
                ? `Request new code in ${timeLeft} seconds`
                : "Didn't receive the code?"}
            </div>
            {timeLeft === 0 && (
              <button
                style={{ ...linkStyle, border: "none", background: "none" }}
                onClick={handleResendCode}
              >
                Request New Code
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}