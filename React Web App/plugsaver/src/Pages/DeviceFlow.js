"use client"

import { useState, useEffect } from "react"
import BottomNav from "../Components/BottomNav"

// ========================================================
// CSS styles as a template literal
// ========================================================
const styles = `
.device-flow-container {
  background: #1a1a1a;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.device-flow-card {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.device-step {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 600px;
}

.device-step h1 {
  background: linear-gradient(to right, #4facfe, #00f2fe);
  color: #fff;
  text-align: center;
  margin: -20px -20px 20px -20px;
  padding: 20px;
  font-size: 24px;
}

.header-with-back {
  background: linear-gradient(to right, #4facfe, #00f2fe);
  position: relative;
  color: #fff;
  text-align: center;
  margin: -20px -20px 20px -20px;
  padding: 20px;
}

.back-button {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  font-size: 18px;
}

.scanning-circle {
  width: 200px;
  height: 200px;
  background: #e3f2fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px auto;
  position: relative;
  transition: background-color 0.5s ease;
}

.scanning-circle::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #4facfe;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.timer {
  font-size: 32px;
  color: #4facfe;
  transition: color 0.5s ease;
}

.progress-dots {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: auto;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e0e0e0;
}

.dot.active {
  background: #4facfe;
}

.device-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
}

.device-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 10px;
}

/* Wrap each category + remove button in a small container */
.category-item {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.device-category {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f5f5f5;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  height: 100%;
}

.device-category .category-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.device-category .category-name {
  font-size: 14px;
  color: #333;
  text-align: center;
  word-break: break-word;
}

/* Remove button for custom categories */
.remove-category-btn {
  background: #ff6b6b;
  border: none;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  margin-left: -35px; /* shift it slightly to overlap */
  margin-top: -50px;
}

.schedule-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
}

.time-range {
  display: flex;
  gap: 20px;
  margin: 15px 0;
}

.time-input {
  flex: 1;
}

.time-input label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.time-input input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.days-selector {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  margin-top: 15px;
}

.day-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #4facfe;
  background: white;
  color: #4facfe;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.day-button.active {
  background: #4facfe;
  color: white;
}

.add-device-btn,
.confirm-btn,
.done-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  margin-top: auto;
  transition: opacity 0.3s ease;
}

.add-device-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success {
  text-align: center;
}

.success-icon {
  font-size: 64px;
  margin: 40px 0;
}

.success-message {
  color: #555;
  font-size: 18px;
  margin-bottom: 40px;
}

.room-section {
  margin-top: 20px;
}

.room-label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.room-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
}

.new-room-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.add-category-section {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.new-category-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.add-category-btn {
  padding: 10px;
  background: #4facfe;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.device-found-message {
  text-align: center;
  color: #4facfe;
  font-weight: bold;
  margin-bottom: 15px;
}

.scanning-circle.red {
  background-color: #ffcccb;
}

.scanning-circle.green {
  background-color: #90ee90;
}

.timer.red {
  color: #ff6b6b;
}

.timer.green {
  color: #32cd32;
}

/* Desktop styles */
@media (min-width: 1024px) {
  .device-flow-container {
    padding: 40px;
  }

  .device-flow-card {
    max-width: 960px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 40px;
  }

  .device-step {
    grid-column: 1 / -1;
  }

  .desktop-left {
    grid-column: 1 / 2;
  }

  .desktop-right {
    grid-column: 2 / 3;
  }

  .desktop-nav {
    grid-column: 1 / -1;
    margin-top: auto;
  }
}

/* Mobile styles */
@media (max-width: 1023px) {
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 480px;
    margin: 0 auto;
    padding: 10px;
    border-radius: 15px 15px 0 0;
    background: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  .device-flow-container {
    padding-bottom: 80px;
  }
}

.location-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
}

.location-option {
  background: linear-gradient(to right, #4facfe, #00f2fe);
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.location-option:hover {
  transform: scale(1.03);
}

.location-option.selected {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(79, 172, 254, 0.6);
}
`

// ========================================================
// Helper functions to load & save app data in localStorage
// ========================================================
const loadAppData = () => {
  const data = localStorage.getItem("appData")
  if (data) return JSON.parse(data)
  return { devices: [], rooms: [], customCategories: [] }
}

const saveAppData = (data) => {
  localStorage.setItem("appData", JSON.stringify(data))
}

// ========================================================
// Hook to track window width
// ========================================================
const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handleWindowResize)
    return () => window.removeEventListener("resize", handleWindowResize)
  }, [])
  return { width }
}

// ========================================================
// Mobile Device Flow Component
// ========================================================
const MobileDeviceFlow = () => {
  const [step, setStep] = useState(1)
  const [deviceName, setDeviceName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [schedule, setSchedule] = useState({
    from: "8:00 AM",
    to: "6:00 PM",
    days: ["M", "T", "W", "T", "F"],
  })
  const [timer, setTimer] = useState(10)
  const [isScanning, setIsScanning] = useState(true)
  const [scanColor, setScanColor] = useState("")
  const [deviceFound, setDeviceFound] = useState(false)
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState("")
  const [newRoom, setNewRoom] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryIcon, setNewCategoryIcon] = useState("")
  const [customCategories, setCustomCategories] = useState([])

  const categories = [
    { id: "light", name: "Light", icon: "💡" },
    { id: "pc", name: "PC", icon: "💻" },
    { id: "tv", name: "TV", icon: "📺" },
    { id: "router", name: "Router", icon: "📡" },
    { id: "robot", name: "Robot", icon: "🤖" },
    { id: "door", name: "Door", icon: "🚪" },
  ]

  // Load data on mount
  useEffect(() => {
    const appData = loadAppData()
    setRooms(appData.rooms || [])
    setCustomCategories(appData.customCategories || [])
  }, [])

  useEffect(() => {
    let interval
    if (isScanning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
        setScanColor((prev) => (prev === "red" ? "green" : "red"))
      }, 1000)
    } else if (timer === 0) {
      setIsScanning(false)
      setDeviceFound(true)
      setScanColor("green")
    }
    return () => clearInterval(interval)
  }, [isScanning, timer])

  const handleBack = () => setStep((prev) => prev - 1)
  const handleNext = () => setStep((prev) => prev + 1)

  const toggleDay = (day) => {
    setSchedule((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }))
  }

  // Remove a custom category by ID
  const removeCategory = (id) => {
    const updated = customCategories.filter((cat) => cat.id !== id)
    setCustomCategories(updated)
    // also remove from localStorage
    const appData = loadAppData()
    appData.customCategories = updated
    saveAppData(appData)
  }

  const addNewCategory = () => {
    if (newCategoryName && newCategoryIcon) {
      const newCategory = {
        id: newCategoryName.toLowerCase().replace(/\s+/g, "-"),
        name: newCategoryName,
        icon: newCategoryIcon,
      }
      const updated = [...customCategories, newCategory]
      setCustomCategories(updated)
      setNewCategoryName("")
      setNewCategoryIcon("")
      // update app data
      const appData = loadAppData()
      appData.customCategories = updated
      saveAppData(appData)
    }
  }

  const saveDeviceInfo = () => {
    const deviceInfo = {
      name: deviceName,
      category: selectedCategory,
      schedule,
      room: selectedRoom || newRoom,
    }
    const appData = loadAppData()
    appData.devices = [...(appData.devices || []), deviceInfo]
    if (newRoom && !appData.rooms.includes(newRoom)) {
      appData.rooms.push(newRoom)
    }
    saveAppData(appData)
    console.log("Device information saved successfully")
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
              <div className={`scanning-circle ${scanColor}`}>
                <div className={`timer ${scanColor}`}>{timer}</div>
              </div>
              {deviceFound && (
                <>
                  <p className="device-found-message">
                    Smart plug found! Ready to proceed.
                  </p>
                  <div className="button-container">
                    <button className="add-device-btn" onClick={handleNext}>
                      Continue to Categorization
                    </button>
                  </div>
                </>
              )}
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
                &#8592;
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
                {[...categories, ...customCategories].map((category) => {
                  const isCustom = customCategories.some(
                    (c) => c.id === category.id
                  )
                  return (
                    <div key={category.id} className="category-item">
                      <button
                        className={`device-category ${
                          selectedCategory === category.id ? "selected" : ""
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <span className="category-icon">{category.icon}</span>
                        <span className="category-name">{category.name}</span>
                      </button>
                      {/* Show remove button only if it's a custom category */}
                      {isCustom && (
                        <button
                          onClick={() => removeCategory(category.id)}
                          className="remove-category-btn"
                          title="Remove Category"
                        >
                          X
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="add-category-section">
                <input
                  type="text"
                  placeholder="New Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="new-category-input"
                />
                <input
                  type="text"
                  placeholder="Category Icon (Emoji)"
                  value={newCategoryIcon}
                  onChange={(e) => setNewCategoryIcon(e.target.value)}
                  className="new-category-input"
                />
                <button onClick={addNewCategory} className="add-category-btn">
                  Add Category
                </button>
              </div>
            </div>
            <div className="room-section">
              <label className="room-label">Select Room</label>
              {rooms.length > 0 && (
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="room-select"
                >
                  <option value="">Select a room</option>
                  {rooms.map((room, index) => (
                    <option key={index} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
              )}
              <div className="new-room">
                <input
                  type="text"
                  placeholder="Or create a new room"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  className="new-room-input"
                />
              </div>
            </div>
            <button
              className="add-device-btn"
              onClick={handleNext}
              disabled={
                !deviceName || !selectedCategory || (!selectedRoom && !newRoom)
              }
            >
              Add Device
            </button>
          </div>
        )
      case 3:
        return (
          <div className="device-step">
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
                  {[
                    ...categories,
                    ...customCategories
                  ].find((c) => c.id === selectedCategory)?.icon || ""}
                </div>
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
                {schedule.days.map((dayObj, index) => (
                  <button
                    key={dayObj.label}
                    className={`day-button ${dayObj.active ? "active" : ""}`}
                    onClick={() => toggleDay(index)}
                  >
                    {dayObj.label}
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
            <p className="success-message">
              Device has been added successfully.
            </p>
            <button
              className="done-btn"
              onClick={() => {
                saveDeviceInfo()
                window.location.href = "/devices"
              }}
            >
              Done
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="device-flow-container">
      <div className="device-flow-card">
        {renderStep()}
        <BottomNav isDesktop={false} />
      </div>
    </div>
  )
}

// ========================================================
// Desktop Device Flow Component
// ========================================================
const DesktopDeviceFlow = () => {
  const [step, setStep] = useState(1)
  const [deviceName, setDeviceName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [schedule, setSchedule] = useState({
    from: "08:00",
    to: "18:00",
    days: [
      { label: "M", active: true },
      { label: "T", active: true },
      { label: "W", active: true },
      { label: "T", active: true },
      { label: "F", active: true },
      { label: "S", active: false },
      { label: "S", active: false },
    ],
  })
  const [timer, setTimer] = useState(10)
  const [isScanning, setIsScanning] = useState(true)
  const [scanColor, setScanColor] = useState("")
  const [deviceFound, setDeviceFound] = useState(false)
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState("")
  const [newRoom, setNewRoom] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryIcon, setNewCategoryIcon] = useState("")
  const [customCategories, setCustomCategories] = useState([])

  // Extra device settings
  const [deviceLocation, setDeviceLocation] = useState("")
  const [consumptionLimit, setConsumptionLimit] = useState("")
  const [limitAction, setLimitAction] = useState("turnOff")

  const categories = [
    { id: "light", name: "Light", icon: "💡" },
    { id: "pc", name: "PC", icon: "💻" },
    { id: "tv", name: "TV", icon: "📺" },
    { id: "router", name: "Router", icon: "📡" },
    { id: "robot", name: "Robot", icon: "🤖" },
    { id: "door", name: "Door", icon: "🚪" },
  ]
  const deviceCategories = [...categories, ...customCategories]

  // Load data on mount
  useEffect(() => {
    const appData = loadAppData()
    setRooms(appData.rooms || [])
    setCustomCategories(appData.customCategories || [])
  }, [])

  useEffect(() => {
    let interval
    if (isScanning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
        setScanColor((prev) => (prev === "red" ? "green" : "red"))
      }, 1000)
    } else if (timer === 0) {
      setIsScanning(false)
      setDeviceFound(true)
      setScanColor("green")
    }
    return () => clearInterval(interval)
  }, [isScanning, timer])

  const handleBack = () => setStep((prev) => prev - 1)
  const handleNext = () => setStep((prev) => prev + 1)

  const toggleDay = (index) => {
    setSchedule((prev) => {
      const newDays = prev.days.map((day, i) =>
        i === index ? { ...day, active: !day.active } : day
      )
      return { ...prev, days: newDays }
    })
  }

  // Remove a custom category
  const removeCategory = (id) => {
    const updated = customCategories.filter((cat) => cat.id !== id)
    setCustomCategories(updated)
    const appData = loadAppData()
    appData.customCategories = updated
    saveAppData(appData)
  }

  const addNewCategory = () => {
    if (newCategoryName && newCategoryIcon) {
      const newCategory = {
        id: newCategoryName.toLowerCase().replace(/\s+/g, "-"),
        name: newCategoryName,
        icon: newCategoryIcon,
      }
      const updated = [...customCategories, newCategory]
      setCustomCategories(updated)
      setNewCategoryName("")
      setNewCategoryIcon("")
      // update localStorage
      const appData = loadAppData()
      appData.customCategories = updated
      saveAppData(appData)
    }
  }

  const saveDeviceInfo = () => {
    const deviceInfo = {
      name: deviceName,
      category: selectedCategory,
      schedule,
      room: selectedRoom || newRoom,
      deviceLocation,
      consumptionLimit,
      limitAction,
    }
    const appData = loadAppData()
    appData.devices = [...(appData.devices || []), deviceInfo]
    if (newRoom && !appData.rooms.includes(newRoom)) {
      appData.rooms.push(newRoom)
    }
    saveAppData(appData)
    console.log("Device information saved successfully")
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="device-step">
            <h1>Add Device</h1>
            <div className="desktop-left">
              <div className="pairing-section">
                <h2>Pairing Plug...</h2>
                <p>Ensure that the plug is connected and in pairing mode</p>
                <div className={`scanning-circle ${scanColor}`}>
                  <div className={`timer ${scanColor}`}>{timer}</div>
                </div>
                {deviceFound && (
                  <>
                    <p className="device-found-message">
                      Smart plug found! Ready to proceed.
                    </p>
                    <div className="button-container">
                      <button className="add-device-btn" onClick={handleNext}>
                        Continue to Categorization
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="desktop-right">
              <div className="progress-dots">
                <div className="dot active"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="device-step">
            <div className="header-with-back">
              <button className="back-button" onClick={handleBack}>
                &#8592;
              </button>
              <h1>Configuration</h1>
            </div>
            <div className="desktop-left">
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
                  {deviceCategories.map((category) => {
                    const isCustom = customCategories.some(
                      (c) => c.id === category.id
                    )
                    return (
                      <div key={category.id} className="category-item">
                        <button
                          className={`device-category ${
                            selectedCategory === category.id ? "selected" : ""
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <span className="category-icon">{category.icon}</span>
                          <span className="category-name">{category.name}</span>
                        </button>
                        {isCustom && (
                          <button
                            onClick={() => removeCategory(category.id)}
                            className="remove-category-btn"
                            title="Remove Category"
                          >
                            X
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="desktop-right">
              <div className="add-category-section">
                <input
                  type="text"
                  placeholder="New Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="new-category-input"
                />
                <input
                  type="text"
                  placeholder="Category Icon (Emoji)"
                  value={newCategoryIcon}
                  onChange={(e) => setNewCategoryIcon(e.target.value)}
                  className="new-category-input"
                />
                <button onClick={addNewCategory} className="add-category-btn">
                  Add Category
                </button>
              </div>
              <div className="room-section">
                <label className="room-label">Select Room</label>
                {rooms.length > 0 && (
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="room-select"
                  >
                    <option value="">Select a room</option>
                    {rooms.map((room, index) => (
                      <option key={index} value={room}>
                        {room}
                      </option>
                    ))}
                  </select>
                )}
                <div className="new-room">
                  <input
                    type="text"
                    placeholder="Or create a new room"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="new-room-input"
                  />
                </div>
              </div>
              <button
                className="add-device-btn"
                onClick={handleNext}
                disabled={
                  !deviceName ||
                  !selectedCategory ||
                  (!selectedRoom && !newRoom)
                }
              >
                Add Device
              </button>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="device-step">
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
              <h3>Device Schedule</h3>
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
                {schedule.days.map((dayObj, index) => (
                  <button
                    key={dayObj.label}
                    className={`day-button ${dayObj.active ? "active" : ""}`}
                    onClick={() => toggleDay(index)}
                  >
                    {dayObj.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="device-location">
              <h2>Device Location</h2>
              <div className="location-options">
                {rooms.length > 0 ? (
                  rooms.map((loc) => (
                    <button
                      key={loc}
                      className={`location-option ${
                        deviceLocation === loc ? "selected" : ""
                      }`}
                      onClick={() => setDeviceLocation(loc)}
                    >
                      {loc}
                    </button>
                  ))
                ) : (
                  <p>No rooms found.</p>
                )}
              </div>
            </div>
            <div className="consumption-limit">
              <h2>Consumption Limit</h2>
              <input
                type="number"
                placeholder="Enter limit (kWh)"
                value={consumptionLimit}
                onChange={(e) => setConsumptionLimit(e.target.value)}
              />
              <div className="limit-action">
                <label>
                  <input
                    type="radio"
                    name="limitAction"
                    value="turnOff"
                    checked={limitAction === "turnOff"}
                    onChange={(e) => setLimitAction(e.target.value)}
                  />
                  Turn off device once limit is reached
                </label>
                <label>
                  <input
                    type="radio"
                    name="limitAction"
                    value="notify"
                    checked={limitAction === "notify"}
                    onChange={(e) => setLimitAction(e.target.value)}
                  />
                  Continue monitoring &amp; notify user
                </label>
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
            <p className="success-message">
              Device has been added successfully.
            </p>
            <button
              className="done-btn"
              onClick={() => {
                saveDeviceInfo()
                window.location.href = "/devices"
              }}
            >
              Done
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="device-flow-container">
      <div className="device-flow-card">
        {renderStep()}
        <BottomNav isDesktop={true} />
      </div>
    </div>
  )
}

// ========================================================
// Main DeviceFlow Component
// ========================================================
const DeviceFlow = () => {
  const { width } = useViewport()
  const breakpoint = 1024

  useEffect(() => {
    // Inject CSS into the document head
    const styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [])

  return width >= breakpoint ? <DesktopDeviceFlow /> : <MobileDeviceFlow />
}

export default DeviceFlow
