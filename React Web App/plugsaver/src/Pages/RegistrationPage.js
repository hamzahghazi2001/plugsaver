import React from "react";

export default function RegistrationPage() {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    margin: 0,
    flexDirection: "column", // Stack children vertically (form and button)
  };

  const inputContainerStyle = {
    display: "flex",
    flexDirection: "column", // Arrange label and input vertically
    alignItems: "flex-start", // Align items to the left
    padding: "20px",
    borderRadius: "5px", // Keep the border radius (optional)
    backgroundColor: "white", // Add a background color to the form
  };

  const labelStyle = {
    alignSelf: "flex-start", // Align the label to the left
    marginBottom: "5px", // Space between label and input
  };

  const inputStyle = {
    border: "1px solid gray",
    padding: "10px",
    borderRadius: "3px",
    width: "300px", // Increase the width of the input fields
    marginBottom: "20px", // Add margin-bottom to increase the space between fields
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center", // Center the button horizontally
    alignItems: "center",
    marginTop: "10px", // Space between the inputs and the button
  };

  const buttonStyle = {
    width: "247px",
    height: "43px",
    position: "relative",
    background: "#FF0085",
    borderRadius: "25px",
    cursor: "pointer", // Changes the cursor to a pointer to indicate it's clickable
  };

  const buttonTextStyle = {
    width: "245px",
    height: "43px",
    position: "absolute",
    textAlign: "center",
    color: "white",
    fontSize: "20px",
    fontFamily: "",
    fontWeight: "400",
    wordWrap: "break-word",
    lineHeight: "43px", // Vertically center the text inside the button
  };

  const forgotPasswordStyle = {
    marginTop: "15px", // Space between the button and "Forgot Password?"
    textAlign: "center",
    color: "black", // Change color to black
    fontSize: "14px",
    cursor: "pointer", // Change cursor to pointer to indicate it's clickable
  };

  const createAccountContainerStyle = {
    position: "absolute", // Position it at the bottom
    bottom: "30px", // Distance from the bottom of the page
    display: "inline-flex", // To align the "Don’t have an account?" and "Create Account" texts
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "7px", // Space between the texts
    width: "100%", // Ensure it stretches across the page width
    textAlign: "center", // Center-align the text
  };

  const createAccountTextStyle = {
    width: "123px",
    height: "18px",
    color: "#FF0085", // Color for "Create Account"
    fontSize: "15px",
    fontFamily: "",
    fontWeight: "700",
    wordWrap: "break-word",
    cursor: "pointer", // Add cursor pointer to indicate it's clickable
  };

  const handleCreateAccountClick = () => {
    alert("Create Account button clicked!");
  };

  const handleLoginClick = () => {
    alert("Login clicked!");
  };

  return (
    <div>
      {/* Title Banner */}
      <div
        data-layer="TitleBanner"
        className="Titlebanner"
        style={{
          width: "100vw",
          height: 190,
          position: "absolute",
          top: 0,
          left: 0,
          background:
            "linear-gradient(90deg, #236AF2, #34ECE1, #54DEE7, #B6FF7C)",
          overflow: "hidden",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        {/* Blurred background shapes */}
        <div
          style={{
            width: 500,
            height: 400,
            background: "#34ECE1",
            position: "absolute",
            top: -100,
            left: -50,
            filter: "blur(100px)",
          }}
        ></div>
        <div
          style={{
            width: 600,
            height: 500,
            background: "#236AF2",
            position: "absolute",
            top: -150,
            left: "30%",
            filter: "blur(120px)",
          }}
        ></div>
        <div
          style={{
            width: 450,
            height: 350,
            background: "#54DEE7",
            position: "absolute",
            top: -50,
            left: "70%",
            filter: "blur(100px)",
          }}
        ></div>
        <div
          style={{
            width: 550,
            height: 400,
            background: "#B6FF7C",
            position: "absolute",
            top: 50,
            left: "40%",
            filter: "blur(110px)",
          }}
        ></div>

        {/* Registration text */}
        <div
          data-layer="Registration"
          className="Registration"
          style={{
            position: "absolute",
            left: 30,
            top: "25%", // Vertically centered
            transform: "translateY(-70%)", // Adjust for exact centering
            color: "white",
            fontSize: 40,
            fontFamily: "",
            fontWeight: "500",
            wordWrap: "break-word",
          }}
        >
          Registration
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "45%", // Positioned below the "Registration" text
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div
            style={{
              width: "80%",
              maxWidth: 400,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Line connecting the circles */}
            <div
              style={{
                width: "90%",
                height: 3,
                background: "white",
                position: "absolute",
                top: "30%",
                left: 10,
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
            ></div>

            {/* Step 1: Sign Up */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  background: "white",
                  borderRadius: "50%",
                  border: "2px solid #FF0085", // Pink border for the first step
                }}
              ></div>
              <div
                style={{
                  marginTop: 5,
                  color: "white",
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                Sign Up
              </div>
            </div>

            {/* Step 2: 2FA */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  background: "white",
                  borderRadius: "50%",
                }}
              ></div>
              <div
                style={{
                  marginTop: 5,
                  color: "white",
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                2FA
              </div>
            </div>

            {/* Step 3: Role */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  background: "white",
                  borderRadius: "50%",
                }}
              ></div>
              <div
                style={{
                  marginTop: 5,
                  color: "white",
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                Role
              </div>
            </div>

            {/* Step 4: Household */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  background: "white",
                  borderRadius: "50%",
                }}
              ></div>
              <div
                style={{
                  marginTop: 5,
                  color: "white",
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                Household
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div style={containerStyle}>
        <div style={inputContainerStyle}>
          <div style={labelStyle}>Name</div>
          <input type="text" style={inputStyle} />
          <div style={labelStyle}>Email</div>
          <input type="text" style={inputStyle} />
          <div style={labelStyle}>Password</div>
          <input type="password" style={inputStyle} />
        </div>

        {/* Create Account Button */}
        <div style={buttonContainerStyle}>
          <div
            style={buttonStyle}
            onClick={handleCreateAccountClick}
          >
            <div style={buttonTextStyle}>Create Account</div>
          </div>
        </div>
      </div>

      {/* Already have an account? Login section at the bottom */}
      <div style={createAccountContainerStyle}>
        <div
          style={{
            width: "178px",
            height: "18px",
            color: "black",
            fontSize: "15px",
            fontFamily: "",
            fontWeight: "400",
            wordWrap: "break-word",
          }}
        >
          Already have an account?
        </div>
        <div
          style={createAccountTextStyle}
          onClick={handleLoginClick} // Add onClick handler for "Login"
        >
          Login
        </div>
      </div>
    </div>
  );
}