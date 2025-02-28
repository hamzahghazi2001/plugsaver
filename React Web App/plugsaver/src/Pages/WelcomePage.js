"use client"

import { useState } from "react"

const PlugSaver = () => {
  const [isLoading, setIsLoading] = useState({ login: false, create: false })

  const handleLogin = () => {
    setIsLoading({ ...isLoading, login: true })
    window.location.href = "/LoginPage"
  }

  const handleCreateAccount = () => {
    setIsLoading({ ...isLoading, create: true })
    window.location.href = "/RegistrationPage"
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
        background: "linear-gradient(to top, #4ADE80, #22D3EE, #3B82F6)",
        color: "white",
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        overflow: "hidden",
        boxSizing: "border-box",
        margin: 0,
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "20rem",
          padding: "1rem",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2.5rem, 10vw, 3.5rem)",
            fontWeight: "700",
            marginBottom: "0.5rem",
            letterSpacing: "-0.05em",
            textAlign: "center",
          }}
        >
          Plug Saver
        </h1>
        <div
          style={{
            fontSize: "clamp(1rem, 4vw, 1.25rem)",
            marginBottom: "3rem",
            opacity: 0.9,
            lineHeight: "1.2",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0 }}>Empower Your Home,</p>
          <p style={{ margin: 0 }}>Save More Energy!</p>
        </div>

        {/* Buttons */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button
            onClick={handleLogin}
            disabled={isLoading.login}
            style={{
              width: "100%",
              padding: "0.875rem",
              fontSize: "clamp(0.875rem, 3vw, 1rem)",
              fontWeight: "600",
              borderRadius: "9999px",
              backgroundColor: "#E91E63",
              color: "white",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {isLoading.login ? "Redirecting..." : "Login"}
          </button>
          <button
            onClick={handleCreateAccount}
            disabled={isLoading.create}
            style={{
              width: "100%",
              padding: "0.875rem",
              fontSize: "clamp(0.875rem, 3vw, 1rem)",
              fontWeight: "600",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "none",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {isLoading.create ? "Redirecting..." : "Create Account"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)",
          opacity: 0.8,
          padding: "1rem",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <p style={{ margin: 0 }}>
          By tapping Create Account or Login, I agree to the PlugSaver{" "}
          <a href="/terms" style={{ color: "#E91E63", textDecoration: "underline" }}>
            Terms and Conditions
          </a>{" "}
          &{" "}
          <a href="/privacy" style={{ color: "#E91E63", textDecoration: "underline" }}>
            Privacy Agreements
          </a>
        </p>
      </div>
    </div>
  )
}

export default PlugSaver

