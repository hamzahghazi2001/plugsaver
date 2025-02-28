"use client";
import { Monitor, PcCase, Lamp } from "lucide-react";
import { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useMediaQuery } from "react-responsive";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Bottom Navigation Component
const BottomNav = ({ isDesktop }) => (
  <nav
    style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "white",
      borderTop: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "space-around",
      padding: "15px",
      borderTopLeftRadius: "20px", // Rounded top-left corner
      borderTopRightRadius: "20px", // Rounded top-right corner
    }}
  >
    <button style={{ border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span>🏠</span>
      <span>Home</span>
    </button>
    <button style={{ border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span>💡</span>
      <span>Devices</span>
    </button>
    <button style={{ border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span>📊</span>
      <span>Dashboard</span>
    </button>
    <button style={{ border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", color: "#007bff" }}>
      <span>🏆</span>
      <span>Rewards</span>
    </button>
    <button style={{ border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span>⚙️</span>
      <span>Settings</span>
    </button>
  </nav>
);

// Chart Data
const chartData = {
  labels: ["5 PM", "6 PM", "7 PM", "8 PM"],
  datasets: [
    {
      label: "Power Consumption",
      data: [2, 4, 3, 6],
      backgroundColor: "#4ADE80",
      borderColor: "#22D3EE",
    },
  ],
};

const EnergyDashboard = () => {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [currentDate] = useState(new Date().toLocaleDateString());

  const topDevices = [
    { name: "TV", consumption: "2.09 kWh", Icon: Monitor },
    { name: "PC", consumption: "7.19 kWh", Icon: PcCase },
    { name: "Lamp", consumption: "0.62 kWh", Icon: Lamp },
  ];

  const topRooms = [
    { name: "Living Room", consumption: "9.12 kWh" },
    { name: "Office", consumption: "3.65 kWh" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.date}>{currentDate}</span>
          <div style={styles.avatar}>
            <img src="/placeholder.svg?height=40&width=40" alt="User avatar" style={styles.avatarImage} />
          </div>
        </div>

        <h1 style={styles.title}>Hello, User</h1>

        {/* Power Consumption Card */}
        <div style={styles.card}>
          <div style={styles.cardContent}>
            <h2 style={styles.cardTitle}>Today's Power Consumption</h2>
            <div style={styles.consumptionBadge}>12.77 kWh</div>
            <div style={isDesktop ? styles.desktopChartContainer : styles.mobileChartContainer}>
              {isDesktop ? (
                <div style={{ display: "flex", gap: "20px", width: "100%" }}>
                  <div style={{ flex: 1, height: "200px" }}>
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false, // Prevent overflow
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, height: "200px" }}>
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false, // Prevent overflow
                      }}
                    />
                  </div>
                </div>
              ) : (
                <Swiper
                  pagination={{ clickable: true }}
                  modules={[Pagination]}
                  style={{ width: "100%", height: "200px" }}
                >
                  <SwiperSlide>
                    <div style={{ height: "200px" }}>
                      <Line
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false, // Prevent overflow
                        }}
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div style={{ height: "200px" }}>
                      <Bar
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false, // Prevent overflow
                        }}
                      />
                    </div>
                  </SwiperSlide>
                </Swiper>
              )}
            </div>
          </div>
        </div>

        {/* Top Active Devices */}
        <h2 style={styles.sectionTitle}>Top Active Devices</h2>
        <div style={styles.devicesGrid}>
          {topDevices.map((device) => (
            <div key={device.name} style={styles.deviceCard}>
              <device.Icon style={styles.deviceIcon} />
              <span style={styles.deviceName}>{device.name}</span>
              <span style={styles.deviceConsumption}>{device.consumption}</span>
            </div>
          ))}
        </div>

        {/* Top Active Rooms */}
        <h2 style={styles.sectionTitle}>Top Active Rooms</h2>
        <div style={styles.roomsGrid}>
          {topRooms.map((room) => (
            <div key={room.name} style={styles.roomCard}>
              <h3 style={styles.roomName}>{room.name}</h3>
              <span style={styles.roomConsumption}>{room.consumption}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav isDesktop={isDesktop} />
    </div>
  );
};

const styles = {
  container: {
    height: "100vh", // Fixed height to match viewport
    overflow: "hidden", // Prevent scrolling
    background: "linear-gradient(to top, #4ADE80, #22D3EE, #3B82F6)",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    overflowY: "auto", // Allow scrolling inside content if needed
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px", // Reduced margin
  },
  date: {
    color: "white",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  title: {
    fontSize: "30px",
    fontWeight: "500",
    color: "white",
    marginBottom: "16px", // Reduced margin
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "16px", // Reduced margin
    
  },
  cardContent: {
    padding: "20px", // Reduced padding
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "500",
    marginBottom: "10px", // Reduced margin
  },
  consumptionBadge: {
    display: "inline-block",
    backgroundColor: "#9333EA",
    color: "white",
    padding: "4px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    marginBottom: "1px", // Reduced margin
  },
  desktopChartContainer: {
    marginTop: "12px", // Reduced margin
    width: "100%",
  },
  mobileChartContainer: {
    marginTop: "12px", // Reduced margin
    width: "100%",
    height: "200px", // Reduced height
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "500",
    color: "white",
    marginBottom: "18px", // Reduced margin
  },
  devicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px", // Reduced gap
    marginBottom: "16px", // Reduced margin
  },
  deviceCard: {
    background: "linear-gradient(to bottom right, #3B82F6, #34B6C1)",
    borderRadius: "12px",
    padding: "12px", // Reduced padding
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  deviceIcon: {
    color: "white",
    width: "24px",
    height: "24px",
    marginBottom: "8px", // Reduced margin
  },
  deviceName: {
    color: "white",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "4px", // Reduced margin
  },
  deviceConsumption: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "12px",
  },
  roomsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px", // Reduced gap
  },
  roomCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "12px", // Reduced padding
  },
  roomName: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#34B6C1",
    marginBottom: "4px", // Reduced margin
  },
  roomConsumption: {
    color: "#666",
  },
};

export default EnergyDashboard;