"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// CSS styles
const styles = `
  .device-management {
    min-height: 100vh;
    background-color: #f9fafb;
    font-family: Arial, sans-serif;
  }

  .header {
    background: linear-gradient(to right, #4facfe, #00f2fe);
    color: white;
    padding: 24px;
    border-bottom-left-radius: 32px;
    border-bottom-right-radius: 32px;
    text-align: center;
  }

  .header h1 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .header p {
    font-size: 14px;
    opacity: 0.8;
  }

  .energy-consumption {
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 16px;
    margin: -32px 16px 0;
  }

  .energy-consumption h2 {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 16px;
  }

  .energy-data {
    display: flex;
    justify-content: space-between;
  }

  .energy-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .energy-icon {
    font-size: 24px;
  }

  .energy-label {
    font-size: 12px;
    color: #6b7280;
  }

  .energy-value {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
  }

  .content {
    padding: 16px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .section-header h2 {
    font-size: 20px;
    font-weight: 600;
    color: #111827;
  }

  .add-button {
    font-size: 14px;
    color: #3b82f6;
    background: none;
    border: none;
    cursor: pointer;
  }

  .room-buttons {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 8px;
    margin-bottom: 24px;
  }

  .room-button {
    padding: 8px 24px;
    border-radius: 9999px;
    font-size: 14px;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    background-color: #f3f4f6;
    color: #4b5563;
  }

  .room-button.active {
    background-color: #4facfe;
    color: white;
  }

  .device-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .device-card {
    background-color: #f3f4f6;
    border-radius: 12px;
    padding: 16px;
    transition: background-color 0.3s;
  }

  .device-card.on {
    background-color: #4facfe;
    color: white;
  }

  .device-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .device-icon {
    font-size: 24px;
  }

  .toggle-button {
    width: 48px;
    height: 24px;
    border-radius: 12px;
    background-color: #d1d5db;
    position: relative;
    cursor: pointer;
    border: none;
  }

  .toggle-button.on {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .toggle-slider {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 0.3s;
  }

  .toggle-button.on .toggle-slider {
    transform: translateX(24px);
  }

  .device-name {
    font-size: 14px;
    font-weight: 500;
  }

  .device-room {
    font-size: 12px;
    opacity: 0.8;
  }

  .usage-bar {
    height: 6px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    margin-top: 8px;
  }

  .usage-fill {
    height: 100%;
    background-color: white;
    border-radius: 3px;
  }

  .add-device-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: border-color 0.3s;
  }

  .add-device-button:hover {
    border-color: #4facfe;
  }

  .add-icon {
    font-size: 24px;
    color: #9ca3af;
    margin-bottom: 8px;
  }

  .add-device-button span {
    font-size: 14px;
    color: #6b7280;
  }

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

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
  }

  .nav-icon {
    font-size: 24px;
    color: #6b7280;
  }

  .nav-item.active .nav-icon {
    color: #4facfe;
  }

  .nav-item span {
    font-size: 12px;
    color: #6b7280;
  }

  .nav-item.active span {
    color: #4facfe;
  }

  @media (min-width: 640px) {
    .device-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .device-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
`

// Custom hook for viewport width
const useViewport = () => {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  return width
}

// Inject styles into the document
const injectStyles = () => {
  const styleElement = document.createElement("style")
  styleElement.textContent = styles
  document.head.appendChild(styleElement)
}

export default function DeviceManagement() {
  const navigate = useNavigate()
  const width = useViewport()
  const [rooms, setRooms] = useState(["Office", "Living Room"])
  const [activeRoom, setActiveRoom] = useState("Office")
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "Desk Lamp",
      room: "Office",
      isOn: true,
      usage: 34,
      icon: "💡",
    },
    {
      id: 2,
      name: "Speakers",
      room: "Office",
      isOn: true,
      usage: 12,
      icon: "🔊",
    },
  ])

  const energyData = {
    today: {
      value: 12.77,
      unit: "kWh",
    },
    month: {
      value: 383.1,
      unit: "kWh",
    },
  }

  useEffect(() => {
    injectStyles()
  }, [])

  const toggleDevice = (deviceId) => {
    setDevices(devices.map((device) => (device.id === deviceId ? { ...device, isOn: !device.isOn } : device)))
  }

  const addRoom = () => {
    const roomName = prompt("Enter new room name:")
    if (roomName && !rooms.includes(roomName)) {
      setRooms([...rooms, roomName])
      setActiveRoom(roomName)
    }
  }

  return (
    <div className="device-management">
      <div className="header">
        <h1>Devices</h1>
        <p>Manage your connected devices</p>
      </div>

      <div className="energy-consumption">
        <h2>Energy Consumption</h2>
        <div className="energy-data">
          <div className="energy-item">
            <span className="energy-icon">⚡</span>
            <div>
              <div className="energy-label">Today</div>
              <div className="energy-value">
                {energyData.today.value} {energyData.today.unit}
              </div>
            </div>
          </div>
          <div className="energy-item">
            <span className="energy-icon">⚡</span>
            <div>
              <div className="energy-label">This Month</div>
              <div className="energy-value">
                {energyData.month.value} {energyData.month.unit}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="rooms-section">
          <div className="section-header">
            <h2>Your Rooms</h2>
            <button onClick={addRoom} className="add-button">
              + Add Room
            </button>
          </div>
          <div className="room-buttons">
            {rooms.map((room) => (
              <button
                key={room}
                className={`room-button ${activeRoom === room ? "active" : ""}`}
                onClick={() => setActiveRoom(room)}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        <div className="devices-section">
          <div className="section-header">
            <h2>Your Devices</h2>
          </div>
          <div className="device-grid">
            {devices
              .filter((device) => device.room === activeRoom)
              .map((device) => (
                <div key={device.id} className={`device-card ${device.isOn ? "on" : "off"}`}>
                  <div className="device-header">
                    <span className="device-icon">{device.icon}</span>
                    <button
                      onClick={() => toggleDevice(device.id)}
                      className={`toggle-button ${device.isOn ? "on" : "off"}`}
                    >
                      <div className="toggle-slider" />
                    </button>
                  </div>
                  <div className="device-name">{device.name}</div>
                  <div className="device-room">{device.room}</div>
                  {device.isOn && (
                    <div className="usage-bar">
                      <div className="usage-fill" style={{ width: `${device.usage}%` }} />
                    </div>
                  )}
                </div>
              ))}
            <button onClick={() => navigate("/deviceflow")} className="add-device-button">
              <span className="add-icon">➕</span>
              <span>Add Device</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bottom-nav">
        <button className="nav-item">
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </button>
        <button className="nav-item active">
          <span className="nav-icon">💡</span>
          <span>Devices</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">📊</span>
          <span>Dashboard</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">🏆</span>
          <span>Rewards</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
        </button>
      </div>
    </div>
  )
}

