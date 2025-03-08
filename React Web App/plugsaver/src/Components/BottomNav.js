import React from "react";

const BottomNav = ({ isDesktop }) => (
  <nav className={`bottom-nav ${isDesktop ? "desktop-nav" : ""}`}>
    <button className="nav-item">
      <span className="nav-icon">🏠</span>
      <span>Home</span>
    </button>
    <button className="nav-item">
      <span className="nav-icon">💡</span>
      <span>Devices</span>
    </button>
    <button className="nav-item">
      <span className="nav-icon">📊</span>
      <span>Dashboard</span>
    </button>
    <button className="nav-item active">
      <span className="nav-icon">🏆</span>
      <span>Rewards</span>
    </button>
    <button className="nav-item">
      <span className="nav-icon">⚙️</span>
      <span>Settings</span>
    </button>
  </nav>
);

export default BottomNav;
