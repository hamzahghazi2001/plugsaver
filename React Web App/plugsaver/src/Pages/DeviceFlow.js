"use client"

import { useState, useEffect } from "react"
import BottomNav from "../Components/BottomNav"

// ========================================================
// CSS styles as a template literal
// ========================================================
const styles = `
.device-flow-container {
  /* Mobile defaults */
  background: #1a1a1a;
  min-height: 100vh;
  padding: 20px;
  overflow-y: auto; /* allow scrolling if content is tall */
}

/* 
  Remove or comment these if you don't want everything centered on mobile:
  display: flex;
  justify-content: center;
  align-items: center;
*/

.device-flow-card {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 480px; /* Applies to mobile by default */
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.device-step {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto; /* allow scrolling in mobile if needed */
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

/* Updated device-input styles */
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

/* A container for category items */
.category-item {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

/* Category pills */
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

/* Remove button for categories or rooms */
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
  margin-left: -35px;
  margin-top: -50px;
}

/* For the "pills" representing rooms */
.room-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.room-item {
  position: relative;
}

.room-pill {
  display: inline-block;
  padding: 12px 20px;
  background: #f5f5f5;
  color: #333;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
  border: 2px solid transparent;
}

.room-pill.selected {
  border: 2px solid #4facfe;
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

/* For the "new-room" text box and spacing */
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
    /* Light background for desktop */
    background: #f8f9fa;
    /* Reduce or remove large padding */
    padding: 20px;
    /* No more flex centering, so content can expand */
    display: block;
    min-height: 100vh;
  }

  .device-flow-card {
    /* Let the card stretch out more on desktop */
    max-width: 1200px;
    margin: 0 auto; /* center horizontally if desired */
    border-radius: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 40px;
  }

  .device-step {
    grid-column: 1 / -1;
    overflow-y: auto;
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

/* Modal overlay for custom popup */
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
  z-index: 999; /* above everything */
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
  .room-grid {
  display: grid;
  /* Adjust columns as you wish; here we do 2 columns on larger screens */
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 10px;
}

/* Each room as a tile/card */
.room-tile {
  background: linear-gradient(to right, #4facfe, #00f2fe);
  color: #fff;
  border-radius: 12px;
  padding: 20px;
  position: relative; /* for the remove button */
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Highlight when selected */
.room-tile.selected {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(79, 172, 254, 0.6);
}

/* Keep or update the remove-room-btn style as you prefer */
.remove-room-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ff6b6b;
  border: none;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  width: 24px;
  height: 24px;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
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

  // Updated toggleDay function for mobile view:
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

  // Add a new custom category
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

  // Show custom popup for removing a room
  const handleRemoveRoomClick = (room) => {
    setPendingRemoveRoom(room)
    setShowRemoveModal(true)
  }

  // Confirm removing the room
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

  // Cancel removing the room
  const handleCancelRemoveRoom = () => {
    setPendingRemoveRoom(null)
    setShowRemoveModal(false)
  }

  // Save device info
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

    // Add new room if needed
    if (newRoom && !appData.rooms.includes(newRoom)) {
      appData.rooms.push(newRoom)
    }
    saveAppData(appData)
    console.log("Device information saved successfully")
  }

  // Renders the main steps
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
        // Configuration step: device name, category, rooms
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

            {/* Rooms */}
            <div className="room-section">
  <label className="room-label">Select or Remove Rooms</label>

  {/* New .room-grid layout */}
  <div className="room-grid">
    {rooms.map((room) => (
      <div
        key={room}
        className={`room-tile ${selectedRoom === room ? "selected" : ""}`}
        onClick={() => setSelectedRoom(room)}
      >
        {room}
        <button
          className="remove-room-btn"
          title="Remove Room"
          onClick={(e) => {
            e.stopPropagation(); // prevent clicking X from also selecting the room
            handleRemoveRoomClick(room);
          }}
        >
          X
        </button>
      </div>
    ))}
  </div>

  {/* Input for creating a new room */}
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
        // Step 3: schedule, device location, consumption limit
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
                  {categories.find((c) => c.id === selectedCategory)?.icon || ""}
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
        // Final success
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

  // Renders the custom modal if showRemoveModal is true
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
    <div className="device-flow-container">
      <div className="device-flow-card">
        {renderStep()}
        {renderRemoveModal()}
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

  // Remove a custom category
  const removeCategory = (id) => {
    const updated = customCategories.filter((cat) => cat.id !== id)
    setCustomCategories(updated)
    const appData = loadAppData()
    appData.customCategories = updated
    saveAppData(appData)
  }

  // Add a new custom category
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

  // Show custom popup for removing a room
  const handleRemoveRoomClick = (room) => {
    setPendingRemoveRoom(room)
    setShowRemoveModal(true)
  }

  // Confirm removing the room
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

  // Cancel removing the room
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

  // Renders the main steps
  const renderStep = () => {
    switch (step) {
      case 1:
        // Pairing step
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
        // Configuration step
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
                <label className="room-label">Select or Remove Rooms</label>
                <div className="room-list">
                  {rooms.map((room) => (
                    <div key={room} className="room-item">
                      <button
                        className={`room-pill ${
                          selectedRoom === room ? "selected" : ""
                        }`}
                        onClick={() => setSelectedRoom(room)}
                        style={{ color: "#333" }}
                      >
                        {room}
                      </button>
                      <button
                        className="remove-room-btn"
                        onClick={() => handleRemoveRoomClick(room)}
                        title="Remove Room"
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
          </div>
        )

      case 3:
        // Step 3: schedule, device location, consumption limit
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

            {/* Device Location */}
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
        // Final success
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

  // Renders the custom modal if showRemoveModal is true
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
    <div className="device-flow-container">
      <div className="device-flow-card">
        {renderStep()}
        {renderRemoveModal()}
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
