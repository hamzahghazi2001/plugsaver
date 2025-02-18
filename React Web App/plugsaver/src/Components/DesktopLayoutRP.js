import React, { useEffect } from "react"
import "../App.css"

/**
 * Inline desktop styles:
 * - Light background for .desktop-container
 * - Remove flex centering
 * - .desktop-card expanded up to 1200px
 */
const desktopStyles = `
@media (min-width: 1024px) {
  .desktop-container {
    background: #f8f9fa;
    min-height: 100vh;
    padding: 20px;
    display: block; /* remove any "flex" centering here */
  }
  .desktop-card {
    max-width: 1200px;
    margin: 0 auto; /* center horizontally if you like */
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    padding: 20px;
  }
 /* DesktopLayoutRP overrides (if needed) */
.rewards-header.desktop-header {
  background: linear-gradient(to right, #f99ac7, #fec9a3);
  color: white;
  padding: 24px;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  text-align: center;
  /* or adjust to match your design */
}
.rewards-header.desktop-header h1 {
    font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

}
`

const DesktopLayout = ({ headerContent, children }) => {
  // Inject the desktopStyles into the document head
  useEffect(() => {
    const styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = desktopStyles
    document.head.appendChild(styleSheet)
    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [])

  return (
    <div className="desktop-container">
      <div className="desktop-card">
        {headerContent && (
          <div className="rewards-header desktop-header">{headerContent}</div>
        )}
        {children}
      </div>
    </div>
  )
}

export default DesktopLayout
