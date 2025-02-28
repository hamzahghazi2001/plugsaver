import React from "react";
import "./App.css";

const DevicesPage = () => {
  return (
    <div className="devices-container">
      <header className="devices-header">
        <h1>Devices</h1>
      </header>
      
      <section className="energy-consumption">
        <div className="energy-box">
          <p>Today</p>
          <h2>12.77 kWh</h2>
        </div>
        <div className="energy-box">
          <p>This Month</p>
          <h2>383.1 kWh</h2>
        </div>
      </section>
      
      <section className="devices-list">
        <h2>Your Devices</h2>
        <div className="device-grid">
          <div className="device-card">
            <span className="device-icon">💡</span>
            <h3>Desk Lamp</h3>
            <p>Office</p>
            <div className="progress-bar"><div className="progress" style={{ width: "57%" }}></div></div>
          </div>
          
          <div className="device-card">
            <span className="device-icon">🔊</span>
            <h3>Speakers</h3>
            <p>Office</p>
            <div className="progress-bar"><div className="progress" style={{ width: "12%" }}></div></div>
          </div>
          
          <div className="device-card">
            <span className="device-icon">🖥</span>
            <h3>Desktop PC</h3>
            <p>Office</p>
            <div className="progress-bar"><div className="progress" style={{ width: "34%" }}></div></div>
          </div>
          
          <div className="add-device">
            <button>+ Add Device</button>
          </div>
        </div>
      </section>
      
      <section className="rooms">
        <h2>Your Rooms</h2>
        <div className="rooms-list">
          <button className="room-button">Office</button>
          <button className="room-button secondary">Living Room</button>
        </div>
      </section>
      
      <footer className="bottom-nav">
        <button>Home</button>
        <button className="active">Devices</button>
        <button>Dashboard</button>
        <button>Rewards</button>
        <button>Settings</button>
      </footer>
    </div>
  );
};

export default DevicesPage;
