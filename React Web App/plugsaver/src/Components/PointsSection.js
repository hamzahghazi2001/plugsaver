import React from "react";

const PointsSection = ({ currentPoints }) => (
  <div className="points-section">
    <div className="points-display">
      <span className="points-number">{currentPoints}</span>
      <span className="lightning-icon">⚡</span>
    </div>
    <p>Energy Points</p>
  </div>
);

export default PointsSection;
