import React, { useState, useEffect } from "react";
import BottomNav from "../Components/BottomNav";
import DesktopLayout from "../Components/DesktopLayout";
import "../App.css";

// Hook for responsive design
const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);
  return { width };
};

// Example device categories
const deviceCategories = [
  { id: "light", name: "Light", icon: "💡" },
  { id: "pc", name: "PC", icon: "💻" },
  { id: "tv", name: "TV", icon: "📺" },
  { id: "router", name: "Router", icon: "📡" },
  { id: "camera", name: "Camera", icon: "📸" },
  { id: "phone", name: "Phone", icon: "📱" },
];

// MOBILE LAYOUT
const DeviceFlowMobile = ({ renderStep }) => (
  <div className="device-flow-container">
    <div className="device-flow-card">{renderStep()}</div>
    <BottomNav isDesktop={false} />
  </div>
);

// DESKTOP LAYOUT
const DeviceFlowDesktop = ({ renderStep }) => {
  return (
    <DesktopLayout headerContent={<h1>Device Flow</h1>}>
      {/* 
        Similar two-column approach as RewardsPage: 
        left column for main content, right column is optional. 
        If you don't need two columns, you can remove .desktop-left/.desktop-right 
        and just do {renderStep()} 
      */}
      <div className="desktop-left">{renderStep()}</div>
      <div className="desktop-right">
        {/* You can put additional info or an illustration here if desired */}
      </div>

      {/* Desktop bottom nav (optional). If you prefer no nav on desktop, remove. */}
      <BottomNav isDesktop={true} />
    </DesktopLayout>
  );
};

const DeviceFlow = () => {
  const { width } = useViewport();
  const breakpoint = 1024;

  const [step, setStep] = useState(1);
  const [deviceName, setDeviceName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // State for schedule
  const [schedule, setSchedule] = useState({
    from: "08:00", // 24-hour time format
    to: "18:00",
    days: ["M", "T", "W", "T", "F", "S", "S"],
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  // Renders the appropriate step based on `step` value
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="device-step">
            <h1>Configuration</h1>
            <input
              type="text"
              placeholder="Device Name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="device-input"
            />

            <div className="category-label">Select Device Category</div>
            <div className="device-grid">
              {deviceCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={`device-category ${
                    selectedCategory === cat.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                </button>
              ))}
            </div>

            <button className="add-device-btn" onClick={handleNext}>
              Add Device
            </button>
          </div>
        );

      case 2:
        return (
          <div className="device-step">
            <h1>Configuration</h1>
            <input
              type="text"
              value={deviceName}
              className="device-input"
              disabled
            />
            <div className="selected-category">
              <span className="category-icon">
                {deviceCategories.find((c) => c.id === selectedCategory)?.icon}
              </span>
            </div>
            <button className="add-device-btn" onClick={handleNext}>
              Add Device
            </button>
          </div>
        );

      case 3:
        return (
          <div className="device-step">
            {/* A custom header with a back button */}
            <div className="header-with-back">
              <button className="back-button" onClick={handleBack}>
                ←
              </button>
              <h1>Configuration</h1>
            </div>

            <div className="device-info">
              <div className="info-row">
                <label>Device Name</label>
                <div className="info-value">{deviceName}</div>
              </div>
              <div className="info-row">
                <label>Device Category</label>
                <div className="category-icon">
                  {deviceCategories.find((c) => c.id === selectedCategory)?.icon}
                </div>
              </div>
            </div>

            <div className="schedule-section">
              <h2>Device Schedule</h2>
              <div className="time-range">
                <div className="time-input">
                  <label>From</label>
                  <input
                    type="time"
                    value={schedule.from}
                    onChange={(e) =>
                      setSchedule((prev) => ({ ...prev, from: e.target.value }))
                    }
                  />
                </div>
                <div className="time-input">
                  <label>To</label>
                  <input
                    type="time"
                    value={schedule.to}
                    onChange={(e) =>
                      setSchedule((prev) => ({ ...prev, to: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="days-selector">
                {schedule.days.map((day, index) => (
                  <div key={index} className="day-button active">
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <button className="confirm-btn" onClick={handleNext}>
              Confirm
            </button>
          </div>
        );

      case 4:
        return (
          <div className="device-step success">
            <h1>Device Added</h1>
            <div className="success-message">
              Device has been added successfully.
            </div>
            <button className="done-btn">Done</button>
          </div>
        );

      default:
        return null;
    }
  };

  // Decide which layout to show based on screen width
  return width >= breakpoint ? (
    <DeviceFlowDesktop renderStep={renderStep} />
  ) : (
    <DeviceFlowMobile renderStep={renderStep} />
  );
};

export default DeviceFlow;
