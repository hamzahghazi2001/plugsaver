"use client"

import { useState, useEffect } from "react"
import BottomNav from "../Components/BottomNav"

// Updated CSS to mimic DeviceEdit's layout
const styles = `
/* ---- Basic full-page layout, like DeviceEdit ---- */
.device-flow-management {
  min-height: 100vh;
  background-color: #f9fafb;
  font-family: Arial, sans-serif; /* optional */
  display: flex;
  flex-direction: column;
}

/* Top gradient header with rounded corners */
.flow-header {
  background: linear-gradient(to right, #4facfe, #00f2fe);
  color: white;
  padding: 24px;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  text-align: center;
}
.flow-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}
.flow-header p {
  font-size: 14px;
  opacity: 0.8;
}

/* White "card" content area, pulled up under the header */
.flow-content {
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 16px;
  margin: -32px 16px 0;
}

/* Keep your existing step styles inside .flow-content */
.device-step {
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* Remove or reduce default padding if desired */
}

/* Override old gradient backgrounds on .device-step h1 */
.device-step h1 {
  background: none;
  color: #111827;
  margin: 0;
  padding: 0;
  text-align: center;
  font-size: 20px;
}

/* "header-with-back" can appear inside the white card now */
.header-with-back {
  position: relative;
  background: none;
  color: #111827;
  text-align: center;
  margin: 0;
  padding: 16px 0;
}
.back-button {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #4facfe;
  font-size: 18px;
  cursor: pointer;
}

/* Scanning circle, timer, etc. remain the same */
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
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}
.timer {
  font-size: 32px;
  color: #4facfe;
  transition: color 0.5s ease;
}
.scanning-circle.red { background-color: #ffcccb; }
.scanning-circle.green { background-color: #90ee90; }
.timer.red { color: #ff6b6b; }
.timer.green { color: #32cd32; }

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

/* Device input, category grid, etc. remain unchanged */
.device-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
}
.device-input:focus {
  border: 2px solid #4facfe;
}
.device-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 10px;
}
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
.remove-category-btn,
.remove-room-btn {
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
}

/* Scheduling section, unchanged */
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
.time-input { flex: 1; }
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

/* Buttons remain the same */
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

/* Room section, unchanged except for layout */
.room-section {
  margin-top: 20px;
}
.room-label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}
.new-room {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.new-room-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
}
.new-room-input:focus {
  border: 2px solid #4facfe;
}

/* Category creation */
.add-category-section {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
.new-category-input {
  flex: 1;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  outline: none;
}
.new-category-input:focus {
  border: 2px solid #4facfe;
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

/* Tile-based room styling remains the same */
.room-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 10px;
}
.room-tile {
  background: linear-gradient(to right, #4facfe, #00f2fe);
  color: #fff;
  border-radius: 12px;
  padding: 20px;
  position: relative;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.room-tile.selected {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(79, 172, 254, 0.6);
}

/* Bottom nav pinned at bottom, similar to DeviceEdit */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-around;
  padding: 12px;
}
  .flow-content {
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 16px;
  margin: -32px 16px 0;
  /* Add this so there's space above the bottom nav */
  padding-bottom: 80px; 
}


/* Modal overlay remains the same */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  width: 80%;
  text-align: center;
}
.modal-content h3 {
  margin-bottom: 10px;
}
.modal-content p {
  margin-bottom: 20px;
}
.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.modal-buttons button {
  background: #4facfe;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}
.modal-buttons button:hover {
  background: #3ba7e0;
}
  .device-location {
  margin-top: 20px; /* optional spacing */
}

.device-location h2 {
  margin-bottom: 10px; /* optional */
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

  // Rooms
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState("")
  const [newRoom, setNewRoom] = useState("")

  // Categories
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryIcon, setNewCategoryIcon] = useState("")
  const [customCategories, setCustomCategories] = useState([])

  // Extra device settings
  const [deviceLocation, setDeviceLocation] = useState("")
  const [consumptionLimit, setConsumptionLimit] = useState("")
  const [limitAction, setLimitAction] = useState("turnOff")

  // For the custom popup
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [pendingRemoveRoom, setPendingRemoveRoom] = useState(null)

  // Default categories
  const defaultCategories = [
    { id: "light", name: "Light", icon: "💡" },
    { id: "pc", name: "PC", icon: "💻" },
    { id: "tv", name: "TV", icon: "📺" },
    { id: "router", name: "Router", icon: "📡" },
    { id: "robot", name: "Robot", icon: "🤖" },
    { id: "door", name: "Door", icon: "🚪" },
  ]
  const categories = [...defaultCategories, ...customCategories]

  // Load data on mount
  useEffect(() => {
    const appData = loadAppData()
    setRooms(appData.rooms || [])
    setCustomCategories(appData.customCategories || [])
  }, [])

  // Pairing scanning logic
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
      const appData = loadAppData()
      appData.customCategories = updated
      saveAppData(appData)
    }
  }

  const handleRemoveRoomClick = (room) => {
    setPendingRemoveRoom(room)
    setShowRemoveModal(true)
  }

  const handleConfirmRemoveRoom = () => {
    if (!pendingRemoveRoom) return
    const updated = rooms.filter((r) => r !== pendingRemoveRoom)
    setRooms(updated)
    const appData = loadAppData()
    appData.rooms = updated
    saveAppData(appData)

    if (selectedRoom === pendingRemoveRoom) {
      setSelectedRoom("")
    }
    if (deviceLocation === pendingRemoveRoom) {
      setDeviceLocation("")
    }

    setPendingRemoveRoom(null)
    setShowRemoveModal(false)
  }

  const handleCancelRemoveRoom = () => {
    setPendingRemoveRoom(null)
    setShowRemoveModal(false)
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
            {/* Device Name */}
            <input
              type="text"
              className="device-input"
              placeholder="Device Name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />

            {/* Categories */}
            <div className="category-section">
              <label className="category-label">Select Device Category</label>
              <div className="device-grid">
                {categories.map((category) => {
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

            {/* Rooms (tile-based) */}
            <div className="room-section">
              <label className="room-label">Select or Remove Rooms</label>
              <div className="room-grid">
                {rooms.map((room) => (
                  <div
                    key={room}
                    className={`room-tile ${
                      selectedRoom === room ? "selected" : ""
                    }`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    {room}
                    <button
                      className="remove-room-btn"
                      title="Remove Room"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveRoomClick(room)
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
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
            {/* Device Summary */}
            <div className="device-info">
              <div className="info-row">
                <label>Device Name</label>
                <div className="info-value">{deviceName}</div>
              </div>
              <div className="info-row">
                <label>Device Category</label>
                <div className="category-icon">
                  {categories.find((c) => c.id === selectedCategory)?.icon}
                </div>
              </div>
            </div>

            {/* Schedule */}
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

            {/* Device Location */}
            <div className="device-location">
              <h2>Device Location</h2>
              <div className="location-options">
                {rooms.map((loc) => (
                  <button
                    key={loc}
                    className={`location-option ${
                      deviceLocation === loc ? "selected" : ""
                    }`}
                    onClick={() => setDeviceLocation(loc)}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Consumption Limit */}
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

  const renderRemoveModal = () => {
    if (!showRemoveModal) return null
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Remove Room?</h3>
          <p>
            Any devices assigned to this room will need to be re-paired from the
            dashboard.
          </p>
          <div className="modal-buttons">
            <button onClick={handleConfirmRemoveRoom}>Yes, remove it</button>
            <button onClick={handleCancelRemoveRoom}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="device-flow-management">
      {/* Gradient header, just like DeviceEdit */}
      <div className="flow-header">
        <h1>Device Flow</h1>
        <p>Follow the steps to add or configure your device</p>
      </div>

      {/* White card content area */}
      <div className="flow-content">
        {renderStep()}
        {renderRemoveModal()}
      </div>

      <BottomNav isDesktop={false} />
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

  // Rooms
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState("")
  const [newRoom, setNewRoom] = useState("")

  // Categories
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryIcon, setNewCategoryIcon] = useState("")
  const [customCategories, setCustomCategories] = useState([])

  // Extra device settings
  const [deviceLocation, setDeviceLocation] = useState("")
  const [consumptionLimit, setConsumptionLimit] = useState("")
  const [limitAction, setLimitAction] = useState("turnOff")

  // For the custom popup
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [pendingRemoveRoom, setPendingRemoveRoom] = useState(null)

  // Default categories
  const defaultCategories = [
    { id: "light", name: "Light", icon: "💡" },
    { id: "pc", name: "PC", icon: "💻" },
    { id: "tv", name: "TV", icon: "📺" },
    { id: "router", name: "Router", icon: "📡" },
    { id: "robot", name: "Robot", icon: "🤖" },
    { id: "door", name: "Door", icon: "🚪" },
  ]
  const deviceCategories = [...defaultCategories, ...customCategories]

  useEffect(() => {
    const appData = loadAppData()
    setRooms(appData.rooms || [])
    setCustomCategories(appData.customCategories || [])
  }, [])

  // Pairing scanning logic
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
      const appData = loadAppData()
      appData.customCategories = updated
      saveAppData(appData)
    }
  }

  const handleRemoveRoomClick = (room) => {
    setPendingRemoveRoom(room)
    setShowRemoveModal(true)
  }

  const handleConfirmRemoveRoom = () => {
    if (!pendingRemoveRoom) return
    const updated = rooms.filter((r) => r !== pendingRemoveRoom)
    setRooms(updated)
    const appData = loadAppData()
    appData.rooms = updated
    saveAppData(appData)

    if (selectedRoom === pendingRemoveRoom) {
      setSelectedRoom("")
    }
    if (deviceLocation === pendingRemoveRoom) {
      setDeviceLocation("")
    }

    setPendingRemoveRoom(null)
    setShowRemoveModal(false)
  }

  const handleCancelRemoveRoom = () => {
    setPendingRemoveRoom(null)
    setShowRemoveModal(false)
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
                        <span className="category-name">
                          {category.name}
                        </span>
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
              <label className="room-label">Select or Remove Rooms</label>
              <div className="room-grid">
                {rooms.map((room) => (
                  <div
                    key={room}
                    className={`room-tile ${
                      selectedRoom === room ? "selected" : ""
                    }`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    {room}
                    <button
                      className="remove-room-btn"
                      title="Remove Room"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveRoomClick(room)
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
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
                  {
                    deviceCategories.find((c) => c.id === selectedCategory)
                      ?.icon
                  }
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
                {rooms.map((loc) => (
                  <button
                    key={loc}
                    className={`location-option ${
                      deviceLocation === loc ? "selected" : ""
                    }`}
                    onClick={() => setDeviceLocation(loc)}
                  >
                    {loc}
                  </button>
                ))}
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
            <p className="success-message">Device has been added successfully.</p>
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

  const renderRemoveModal = () => {
    if (!showRemoveModal) return null
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Remove Room?</h3>
          <p>
            Any devices assigned to this room will need to be re-paired from the
            dashboard.
          </p>
          <div className="modal-buttons">
            <button onClick={handleConfirmRemoveRoom}>Yes, remove it</button>
            <button onClick={handleCancelRemoveRoom}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="device-flow-management">
      <div className="flow-header">
        <h1>Device Flow</h1>
        <p>Follow the steps to add or configure your device</p>
      </div>

      <div className="flow-content">
        {renderStep()}
        {renderRemoveModal()}
      </div>

      <BottomNav isDesktop={true} />
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
