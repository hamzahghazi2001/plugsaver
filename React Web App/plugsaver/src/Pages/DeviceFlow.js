"use client"

import { useState, useEffect } from "react"
import BottomNav from "../Components/BottomNav"

// CSS styles as a template literal
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
`

// Hook to track window width
const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handleWindowResize)
    return () => window.removeEventListener("resize", handleWindowResize)
  }, [])
  return { width }
}

const DeviceFlow = () => {
  const { width } = useViewport()
  const breakpoint = 1024

  useEffect(() => {
    // Inject CSS into the document head
    const styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)

    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [])

  return width >= breakpoint ? <DesktopDeviceFlow /> : <MobileDeviceFlow />
}

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

  const days = ["M", "T", "W", "T", "F", "S", "S"]

  useEffect(() => {
    loadRooms()
  }, [])

  useEffect(() => {
    let interval
    if (isScanning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
        setScanColor((prevColor) => (prevColor === "red" ? "green" : "red"))
      }, 1000)
    } else if (timer === 0) {
      setIsScanning(false)
      setDeviceFound(true)
      setScanColor("green")
    }
    return () => clearInterval(interval)
  }, [isScanning, timer])

  const loadRooms = () => {
    const storedRooms = localStorage.getItem("rooms")
    setRooms(storedRooms ? JSON.parse(storedRooms) : [])
  }

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

  const addNewCategory = () => {
    if (newCategoryName && newCategoryIcon) {
      const newCategory = {
        id: newCategoryName.toLowerCase().replace(/\s+/g, "-"),
        name: newCategoryName,
        icon: newCategoryIcon,
      }
      setCustomCategories([...customCategories, newCategory])
      setNewCategoryName("")
      setNewCategoryIcon("")
    }
  }

  const saveDeviceInfo = () => {
    const deviceInfo = {
      name: deviceName,
      category: selectedCategory,
      schedule,
      room: selectedRoom || newRoom,
    }

    // Save device info
    const storedDevices = localStorage.getItem("devices")
    const devices = storedDevices ? JSON.parse(storedDevices) : []
    devices.push(deviceInfo)
    localStorage.setItem("devices", JSON.stringify(devices))

    // Save new room if created
    if (newRoom) {
      const updatedRooms = [...rooms, newRoom]
      setRooms(updatedRooms)
      localStorage.setItem("rooms", JSON.stringify(updatedRooms))
    }

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
                  <p className="device-found-message">Smart plug found! Ready to proceed.</p>
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
                {[...categories, ...customCategories].map((category) => (
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
              <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className="room-select">
                <option value="">Select a room</option>
                {rooms.map((room, index) => (
                  <option key={index} value={room}>
                    {room}
                  </option>
                ))}
              </select>
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
              disabled={!deviceName || !selectedCategory || (!selectedRoom && !newRoom)}
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
                &#8592;
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
                <span className="info-value">
                  {[...categories, ...customCategories].find((c) => c.id === selectedCategory)?.name}
                </span>
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
                {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
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

const DesktopDeviceFlow = () => {
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

  const days = ["M", "T", "W", "T", "F", "S", "S"]

  useEffect(() => {
    loadRooms()
  }, [])

  useEffect(() => {
    let interval
    if (isScanning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
        setScanColor((prevColor) => (prevColor === "red" ? "green" : "red"))
      }, 1000)
    } else if (timer === 0) {
      setIsScanning(false)
      setDeviceFound(true)
      setScanColor("green")
    }
    return () => clearInterval(interval)
  }, [isScanning, timer])

  const loadRooms = () => {
    const storedRooms = localStorage.getItem("rooms")
    setRooms(storedRooms ? JSON.parse(storedRooms) : [])
  }

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

  const addNewCategory = () => {
    if (newCategoryName && newCategoryIcon) {
      const newCategory = {
        id: newCategoryName.toLowerCase().replace(/\s+/g, "-"),
        name: newCategoryName,
        icon: newCategoryIcon,
      }
      setCustomCategories([...customCategories, newCategory])
      setNewCategoryName("")
      setNewCategoryIcon("")
    }
  }

  const saveDeviceInfo = () => {
    const deviceInfo = {
      name: deviceName,
      category: selectedCategory,
      schedule,
      room: selectedRoom || newRoom,
    }

    // Save device info
    const storedDevices = localStorage.getItem("devices")
    const devices = storedDevices ? JSON.parse(storedDevices) : []
    devices.push(deviceInfo)
    localStorage.setItem("devices", JSON.stringify(devices))

    // Save new room if created
    if (newRoom) {
      const updatedRooms = [...rooms, newRoom]
      setRooms(updatedRooms)
      localStorage.setItem("rooms", JSON.stringify(updatedRooms))
    }

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
                    <p className="device-found-message">Smart plug found! Ready to proceed.</p>
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
                  {[...categories, ...customCategories].map((category) => (
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
                <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className="room-select">
                  <option value="">Select a room</option>
                  {rooms.map((room, index) => (
                    <option key={index} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
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
                disabled={!deviceName || !selectedCategory || (!selectedRoom && !newRoom)}
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
                &#8592;
              </button>
              <h1>Configuration</h1>
            </div>
            <div className="desktop-left">
              <div className="device-info">
                <div className="info-row">
                  <label>Device Name</label>
                  <span className="info-value">{deviceName}</span>
                </div>
                <div className="info-row">
                  <label>Device Category</label>
                  <span className="info-value">
                    {[...categories, ...customCategories].find((c) => c.id === selectedCategory)?.name}
                  </span>
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
                  {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
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
            </div>
            <div className="desktop-right">
              <button className="confirm-btn" onClick={handleNext}>
                Confirm
              </button>
            </div>
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

  return (
    <div className="device-flow-container">
      <div className="device-flow-card">
        {renderStep()}
        <BottomNav isDesktop={true} />
      </div>
    </div>
  )
}

export default DeviceFlow

