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
    cursor: "pointer",
  };

  const twofaStyle = {
    width: "115px",
    height: "115px",
    marginBottom: "20px", // Space below the image
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    position: "relative",
  };

  const inputContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
    marginBottom: "20px", // Space below the input
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
  };

  const verifyButtonStyle = {
    width: "114px",
    height: "43px",
    background: "#FF0085",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "25px",
    color: "white",
    fontSize: "20px",
    fontWeight: "400",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "background 0.3s ease",
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center" }}>
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
      <img src={logo} alt="Back" style={arrowStyle} />

      {/* Centered Content */}
      <div style={containerStyle}>
        {/* Two-Factor Authentication Section */}
        <div
          style={{
            color: "#008CFF",
            fontSize: "24px",
            fontWeight: "400",
            marginBottom: "10px",
          }}
        >
          Two-Factor Authentication
        </div>
        <div
          style={{
            color: "black",
            fontSize: "12px",
            fontWeight: "400",
            marginBottom: "20px",
          }}
        >
          Enter the 6 Digit Code Sent To Your Email
        </div>

        {/* 2FA Image */}
        <img src={logo2} alt="2FA" style={twofaStyle} />

        {/* Authentication Code Input */}
        <div style={inputContainerStyle}>
          <div style={labelStyle}>Authentication Code</div>
          <input type="text" style={inputStyle} />
        </div>

        {/* Verify Button */}
        <div
          style={verifyButtonStyle}
          onMouseOver={(e) => (e.target.style.background = "#E00075")}
          onMouseOut={(e) => (e.target.style.background = "#FF0085")}
        >
          Verify
        </div>
      </div>
    </div>
  );
}

export default App;