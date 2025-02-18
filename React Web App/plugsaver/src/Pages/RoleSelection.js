import React, { useState } from "react";
import logo from "./Images/arrow-back.png";
import logoManager from "./Images/manager.png";
import logoMember from "./Images/member.png";

function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);

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
      
        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "45%",
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
            <div
              style={{
                width: "90%",
                height: 3,
                background: "white",
                position: "absolute",
                top: "30%",
                left: 10,
                transform: "translateY(-50%)",
              }}
            ></div>
            {["✓", "✓", "", ""].map((mark, index) => (
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
                    width: 30,
                    height: 30,
                    background: "white",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: index === 2 ? "2px solid #FF0085" : "none",
                    fontWeight: "bold",
                    fontSize: "20px",
                    color: "black",
                  }}
                >
                  {mark}
                </div>
                <div style={{ marginTop: 5, color: "white", fontSize: 14 }}>
                  {["Sign Up", "2FA", "Role", "Household"][index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <img
        src={logo}
        alt="Back"
        style={{ width: "35px", height: "30px", position: "absolute", top: "30px", left: "10px" }}
      />

      {/* Role Selection */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "400px" }}>
        <h2 style={{ color: "#008CFF" }}>Select Your Role</h2>
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          {[{ role: "Manager", img: logoManager }, { role: "Member", img: logoMember }].map(({ role, img }) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              style={{
                padding: "10px 20px",
                borderRadius: "25px",
                border: "2px solid #008CFF",
                background: selectedRole === role ? "#008CFF" : "white",
                color: selectedRole === role ? "white" : "black",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img src={img} alt={role} style={{ width: "24px", height: "24px" }} />
              {role}
            </button>
          ))}
        </div>

        {/* Confirm Button */}
        <button
          style={{
            width: 114,
            height: 43,
            background: "#FF0085",
            color: "white",
            fontSize: "20px",
            borderRadius: "25px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default RoleSelection;
