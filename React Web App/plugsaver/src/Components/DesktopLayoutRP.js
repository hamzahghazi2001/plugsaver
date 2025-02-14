import React from "react";
import "../App.css";

const DesktopLayout = ({ headerContent, children }) => {
  return (
    <div className="desktop-container">
      <div className="desktop-card">
        {headerContent && (
          <div className="rewards-header desktop-header">
            {headerContent}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default DesktopLayout;
