import React from "react";

const ProgressBar = ({ milestones, currentPoints }) => {
  const progressWidth =
    (Math.min(currentPoints, milestones[milestones.length - 1]) /
      milestones[milestones.length - 1]) *
    100;
  return (
    <div className="progress-bar">
      {milestones.length > 0 && (
        <div className="progress-bar-fill" style={{ width: `${progressWidth}%` }} />
      )}
      {milestones.map((milestone, index) => (
        <div key={index} className="milestone">
          <div
            className={`milestone-point ${currentPoints >= milestone ? "achieved" : ""}`}
          >
            ⚡
          </div>
          <span className="milestone-label">{milestone}</span>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
