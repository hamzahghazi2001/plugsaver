import React, { useState, useEffect } from "react";
import "../device-config.css";


const DeviceConfig = () => {
  const [step, setStep] = useState(1);
  const [deviceName, setDeviceName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [schedule, setSchedule] = useState({ from: '8:00 AM', to: '6:00 PM' });
  
  const deviceCategories = [
    { id: 'light', name: 'Light', icon: '💡' },
    { id: 'pc', name: 'PC', icon: '💻' },
    { id: 'tv', name: 'TV', icon: '📺' },
    { id: 'router', name: 'Router', icon: '📡' },
    { id: 'camera', name: 'Camera', icon: '📸' },
    { id: 'other', name: 'Other', icon: '📱' }
  ];

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="config-step">
            <input
              type="text"
              placeholder="Device Name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="device-input"
            />
            <div className="category-grid">
              {deviceCategories.map(category => (
                <button
                  key={category.id}
                  className={`category-item ${selectedCategory === category.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
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
          <div className="config-step">
            <div className="device-summary">
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="device-input"
              />
              <div className="selected-category">
                {deviceCategories.find(c => c.id === selectedCategory)?.icon}
              </div>
            </div>
            <div className="schedule-section">
              <h3>Device Schedule</h3>
              <div className="time-picker">
                <div className="time-input">
                  <label>From</label>
                  <input
                    type="time"
                    value={schedule.from}
                    onChange={(e) => setSchedule({...schedule, from: e.target.value})}
                  />
                </div>
                <div className="time-input">
                  <label>To</label>
                  <input
                    type="time"
                    value={schedule.to}
                    onChange={(e) => setSchedule({...schedule, to: e.target.value})}
                  />
                </div>
              </div>
              <div className="weekdays">
                {weekDays.map((day, index) => (
                  <button key={index} className="day-btn">
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <button className="confirm-btn" onClick={handleNext}>
              Confirm
            </button>
          </div>
        );
      
      case 3:
        return (
          <div className="config-step success">
            <h2>Device Added</h2>
            <p>Device has been added successfully.</p>
            <button className="done-btn" onClick={() => setStep(1)}>
              Done
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="device-config">
      <header className="config-header">
        {step > 1 && step < 3 && (
          <button className="back-btn" onClick={handleBack}>
            ←
          </button>
        )}
        <h1>Configuration</h1>
      </header>
      {renderStep()}
    </div>
  );
};

export default DeviceConfig;