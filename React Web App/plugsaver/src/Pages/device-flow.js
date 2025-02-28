"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"

const DeviceFlow = () => {
  const [step, setStep] = useState(1)
  const [deviceName, setDeviceName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [schedule, setSchedule] = useState({
    from: "8:00 AM",
    to: "6:00 PM",
    days: ["M", "T", "W", "T", "F"],
  })
  const [timer, setTimer] = useState(23)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const categories = [
    { id: "light", name: "Light", icon: "💡" },
    { id: "pc", name: "PC", icon: "💻" },
    { id: "tv", name: "TV", icon: "📺" },
    { id: "router", name: "Router", icon: "📡" },
    { id: "robot", name: "Robot", icon: "🤖" },
    { id: "door", name: "Door", icon: "🚪" },
  ]

  const days = ["M", "T", "W", "T", "F", "S", "S"]

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleNext = () => {
    setStep((prev) => prev + 1)
  }

  const toggleDay = (day) => {
    setSchedule((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }))
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="device-step">
            <h1>Add Device</h1>
            <div className="pairing-section">
              <h2>Pairing Plug...</h2>
              <p>Ensure that the plug is connected and in pairing mode</p>
              <div className="scanning-circle">
                <div className="timer">{timer}</div>
              </div>
              <button className="add-device-btn" onClick={handleNext}>
                Pair
              </button>
            </div>
            <div className="progress-dots">
              <div className="dot active"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="device-step">
            <div className="header-with-back">
              <button className="back-button" onClick={handleBack}>
                <ArrowLeft />
              </button>
              <h1>Configuration</h1>
            </div>
            <input
              type="text"
              className="device-input"
              placeholder="Device Name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />
            <div className="category-section">
              <label className="category-label">Select Device Category</label>
              <div className="device-grid">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`device-category ${selectedCategory === category.id ? "selected" : ""}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <button className="add-device-btn" onClick={handleNext} disabled={!deviceName || !selectedCategory}>
              Add Device
            </button>
          </div>
        )

      case 3:
        return (
          <div className="device-step">
            <div className="header-with-back">
              <button className="back-button" onClick={handleBack}>
                <ArrowLeft />
              </button>
              <h1>Configuration</h1>
            </div>
            <div className="device-info">
              <div className="info-row">
                <label>Device Name</label>
                <span className="info-value">{deviceName}</span>
              </div>
              <div className="info-row">
                <label>Device Category</label>
                <span className="info-value">{categories.find((c) => c.id === selectedCategory)?.icon}</span>
              </div>
            </div>
            <div className="schedule-section">
              <h3>Device Schedule</h3>
              <div className="time-range">
                <div className="time-input">
                  <label>From</label>
                  <input
                    type="time"
                    value={schedule.from}
                    onChange={(e) => setSchedule((prev) => ({ ...prev, from: e.target.value }))}
                  />
                </div>
                <div className="time-input">
                  <label>To</label>
                  <input
                    type="time"
                    value={schedule.to}
                    onChange={(e) => setSchedule((prev) => ({ ...prev, to: e.target.value }))}
                  />
                </div>
              </div>
              <div className="days-selector">
                {days.map((day) => (
                  <button
                    key={day}
                    className={`day-button ${schedule.days.includes(day) ? "active" : ""}`}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <button className="confirm-btn" onClick={handleNext}>
              Confirm
            </button>
          </div>
        )

      case 4:
        return (
          <div className="device-step success">
            <h1>Device Added</h1>
            <div className="success-icon">✅</div>
            <p className="success-message">Device has been added successfully.</p>
            <button className="done-btn" onClick={() => (window.location.href = "/devices")}>
              Done
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`device-flow-container ${!isMobile ? "desktop-view" : ""}`}>
      <div className="device-flow-card">{renderStep()}</div>
    </div>
  )
}

export default DeviceFlow

