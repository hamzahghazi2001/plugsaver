"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Zap, Wind, DollarSign, Moon, Sun, Download } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as PieChartRecharts,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { LineChartIcon, BarChart3, PieChart, Activity } from "lucide-react"

type PeriodType = "day" | "week" | "month" | "year"

const DashboardPage = () => {
  const [period, setPeriod] = useState<PeriodType>("day")
  const [energyData, setEnergyData] = useState<Record<PeriodType, { name: string; value: number }[]> | null>(null)
  const [roomsData, setRoomsData] = useState<{ name: string; value: number }[] | null>(null)
  const [applianceData, setApplianceData] = useState<{ name: string; usage: number }[] | null>(null)
  const [efficiencyScore, setEfficiencyScore] = useState<number | null>(null)
  const [electricityUsage, setElectricityUsage] = useState<number | null>(null)
  const [peakPowerUsage, setPeakPowerUsage] = useState<number | null>(null)
  const [carbonFootprint, setCarbonFootprint] = useState<number | null>(null)
  const [costSavings, setCostSavings] = useState<number | null>(null)
  let [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  // Load dark mode preference from localStorage on initial render
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    console.log("Initial dark mode value from localStorage:", savedDarkMode) // Debugging
    setIsDarkMode(savedDarkMode)
    // Apply dark mode class to the document element
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
      console.log("Applied 'dark' class to documentElement") // Debugging
    } else {
      document.documentElement.classList.remove("dark")
      isDarkMode = false
      console.log("Removed 'dark' class from documentElement") // Debugging
    }
  }, [])

  // Save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString())
    console.log("Saved dark mode to localStorage:", isDarkMode) // Debugging
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
      console.log("Applied 'dark' class to documentElement") // Debugging
    } else {
      document.documentElement.classList.remove("dark")
      isDarkMode = false
      console.log("Removed 'dark' class from documentElement") // Debugging
    }
  }, [isDarkMode])

  const fetchData = async () => {
    try {
      const householdCode = localStorage.getItem("household_code")
      console.log("Fetching data for household code:", householdCode) // Debugging

      // Fetch energy consumption data
      const energyResponse = await fetch(`/api/auth/energy_consumption?household_code=${householdCode}`)
      if (!energyResponse.ok) {
        throw new Error("Failed to fetch energy consumption data")
      }
      const energyResult = await energyResponse.json()
      console.log("Energy consumption data:", energyResult.data.data) // Debugging
      if (energyResult.success) {
        setEnergyData(energyResult.data.data) // Update energy data state
      } else {
        console.error(energyResult.message)
      }

      // Fetch rooms consumption data
      const roomsResponse = await fetch(`/api/auth/room_consumption?household_code=${householdCode}`)
      if (!roomsResponse.ok) {
        throw new Error("Failed to fetch rooms consumption data")
      }
      const roomsResult = await roomsResponse.json()
      console.log("Rooms consumption data:", roomsResult.data.data) // Debugging
      if (roomsResult.success) {
        setRoomsData(roomsResult.data.data) // Update rooms data state
      } else {
        console.error(roomsResult.message)
      }

      // Fetch device category data
      const devicecategoryResponse = await fetch(`/api/auth/device_category?household_code=${householdCode}`)
      if (!devicecategoryResponse.ok) {
        throw new Error("Failed to fetch device category data")
      }
      const devicecategoryResult = await devicecategoryResponse.json()
      console.log("Device category data:", devicecategoryResult.data.data) // Debugging
      if (devicecategoryResult.success) {
        setApplianceData(devicecategoryResult.data.data) // Update appliance data state
      } else {
        console.error(devicecategoryResult.message)
      }
      const efficiencyMetricsResponse = await fetch(`/api/auth/efficiency_metrics?household_code=${householdCode}`)
      if (!efficiencyMetricsResponse.ok) {
        throw new Error("Failed to fetch efficiency metrics")
      }
      const efficiencyMetricsResult = await efficiencyMetricsResponse.json()
      console.log("Efficiency metrics data:", efficiencyMetricsResult.data.data.efficiencyScore) // Debugging
      if (efficiencyMetricsResult.success) {
        setEfficiencyScore(efficiencyMetricsResult.data.data.efficiencyScore)
        setElectricityUsage(efficiencyMetricsResult.data.data.electricityUsage)
        setPeakPowerUsage(efficiencyMetricsResult.data.data.peakPowerUsage)
        setCarbonFootprint(efficiencyMetricsResult.data.data.carbonFootprint)
        setCostSavings(efficiencyMetricsResult.data.data.costSavings)
      } else {
        console.error(efficiencyMetricsResult.message)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  //setRoomsData([])
  //setApplianceData([])

  useEffect(() => {
    fetchData() // Fetch data immediately when the component mounts
    const interval = setInterval(fetchData, 10000) // Refetch every 10 seconds
    return () => clearInterval(interval) // Cleanup interval on component unmount
  }, [])

  //setRoomsData([])
  //setApplianceData([])
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  const handleDownload = (data: any, fileName: string) => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className={`min-h-screen p-6 md:p-10 ${isDarkMode ? "text-white" : "text-gray-900"}`}
      style={{
        background: isDarkMode
          ? "radial-gradient(circle, rgba(87,119,94,1) 0%, rgba(79,74,116,1) 100%)"
          : "radial-gradient(circle, rgba(174,238,189,1) 0%, rgba(159,148,233,1) 100%)",
      }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full backdrop-blur-md bg-white/10 border-white/20"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full backdrop-blur-md bg-white/10 border-white/20"
            onClick={fetchData}
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 backdrop-blur-md bg-white/10 p-1 rounded-lg border border-white/20">
        {(["year", "month", "week", "day"] as const).map((p) => (
          <Button
            key={p}
            variant={period === p ? "default" : "ghost"}
            className={`flex-1 rounded-md ${period === p ? "shadow-md" : ""}`}
            onClick={() => setPeriod(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 animate-in fade-in duration-700">
        <Card
          className={`p-5 rounded-xl transition-all duration-300 overflow-hidden relative group
      ${
        isDarkMode
          ? "backdrop-blur-lg bg-gray-900/40 border border-gray-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          : "backdrop-blur-lg bg-white/60 border border-white/50 shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)]"
      }
    `}
        >
          <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-300"></div>
          <div className="flex justify-between items-center mb-5 relative z-10">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${isDarkMode ? "bg-blue-500/30" : "bg-blue-500/20"}`}>
                <LineChartIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
              </div>
              <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Energy Consumption
              </h2>
            </div>
            <Button
              size="icon"
              variant="outline"
              className={`rounded-full h-8 w-8 transition-all hover:scale-105 ${
                isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-gray-200"
              }`}
              onClick={() => handleDownload(energyData?.[period], "energy_consumption.json")}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64 md:h-80 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData ? energyData[period] : []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                />
                <XAxis dataKey="name" stroke={isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"} />
                <YAxis stroke={isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"} />
                <Tooltip
                  contentStyle={
                    isDarkMode
                      ? { backgroundColor: "rgba(45,55,72,0.9)", borderColor: "rgba(74,85,104,0.5)" }
                      : { backgroundColor: "rgba(255,255,255,0.9)", borderColor: "rgba(226,232,240,0.5)" }
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="kWh"
                  dot={{ stroke: "#3B82F6", strokeWidth: 2, r: 4, fill: isDarkMode ? "#1E293B" : "white" }}
                  activeDot={{ stroke: "#3B82F6", strokeWidth: 2, r: 6, fill: isDarkMode ? "#1E293B" : "white" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          className={`p-5 rounded-xl transition-all duration-300 overflow-hidden relative group
      ${
        isDarkMode
          ? "backdrop-blur-lg bg-gray-900/40 border border-gray-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          : "backdrop-blur-lg bg-white/60 border border-white/50 shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)]"
      }
    `}
        >
          <div className="absolute -left-16 -bottom-16 w-32 h-32 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-all duration-300"></div>
          <div className="flex justify-between items-center mb-5 relative z-10">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${isDarkMode ? "bg-purple-500/30" : "bg-purple-500/20"}`}>
                <PieChart className={`w-5 h-5 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
              </div>
              <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Rooms Consumption
              </h2>
            </div>
            <Button
              size="icon"
              variant="outline"
              className={`rounded-full h-8 w-8 transition-all hover:scale-105 ${
                isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-gray-200"
              }`}
              onClick={() => handleDownload(roomsData, "rooms_consumption.json")}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64 md:h-80 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChartRecharts>
                <Pie
                  data={roomsData || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(roomsData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={
                    isDarkMode
                      ? { backgroundColor: "rgba(45,55,72,0.9)", borderColor: "rgba(74,85,104,0.5)" }
                      : { backgroundColor: "rgba(255,255,255,0.9)", borderColor: "rgba(226,232,240,0.5)" }
                  }
                />
                <Legend />
              </PieChartRecharts>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          className={`p-5 rounded-xl transition-all duration-300 overflow-hidden relative group
      ${
        isDarkMode
          ? "backdrop-blur-lg bg-gray-900/40 border border-gray-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          : "backdrop-blur-lg bg-white/60 border border-white/50 shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)]"
      }
    `}
        >
          <div className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-all duration-300"></div>
          <div className="flex justify-between items-center mb-5 relative z-10">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${isDarkMode ? "bg-green-500/30" : "bg-green-500/20"}`}>
                <BarChart3 className={`w-5 h-5 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
              </div>
              <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Device Category Usage
              </h2>
            </div>
            <Button
              size="icon"
              variant="outline"
              className={`rounded-full h-8 w-8 transition-all hover:scale-105 ${
                isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-gray-200"
              }`}
              onClick={() => handleDownload(applianceData, "device_category_usage.json")}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64 md:h-80 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applianceData || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                />
                <XAxis dataKey="name" stroke={isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"} />
                <YAxis stroke={isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"} />
                <Tooltip
                  contentStyle={
                    isDarkMode
                      ? { backgroundColor: "rgba(45,55,72,0.9)", borderColor: "rgba(74,85,104,0.5)" }
                      : { backgroundColor: "rgba(255,255,255,0.9)", borderColor: "rgba(226,232,240,0.5)" }
                  }
                />
                <Legend />
                <Bar
                  dataKey="usage"
                  fill={isDarkMode ? "#10B981" : "#059669"}
                  name="kWh"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          className={`p-5 rounded-xl transition-all duration-300 overflow-hidden relative group
      ${
        isDarkMode
          ? "backdrop-blur-lg bg-gray-900/40 border border-gray-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          : "backdrop-blur-lg bg-white/60 border border-white/50 shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)]"
      }
    `}
        >
          <div className="absolute -left-16 -top-16 w-32 h-32 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 transition-all duration-300"></div>
          <div className="flex items-center gap-2 mb-5 relative z-10">
            <div className={`p-2 rounded-lg ${isDarkMode ? "bg-amber-500/30" : "bg-amber-500/20"}`}>
              <Activity className={`w-5 h-5 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
            </div>
            <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Energy Efficiency Score
            </h2>
          </div>
          <div className="flex items-center justify-center h-64 md:h-80 relative z-10">
            <div className="relative flex items-center justify-center">
              <svg className="w-56 h-56">
                {/* Background circle */}
                <circle
                  cx="112"
                  cy="112"
                  r="80"
                  fill="none"
                  stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                  strokeWidth="12"
                />

                {/* Data loading indicator dots */}
                {efficiencyScore === null && (
                  <>
                    <circle cx="112" cy="32" r="6" fill={isDarkMode ? "#F59E0B" : "#D97706"}>
                      <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="172" cy="72" r="6" fill={isDarkMode ? "#F59E0B" : "#D97706"}>
                      <animate
                        attributeName="opacity"
                        values="1;0.3;1"
                        dur="1.5s"
                        begin="0.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="172" cy="152" r="6" fill={isDarkMode ? "#F59E0B" : "#D97706"}>
                      <animate
                        attributeName="opacity"
                        values="1;0.3;1"
                        dur="1.5s"
                        begin="0.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="112" cy="192" r="6" fill={isDarkMode ? "#F59E0B" : "#D97706"}>
                      <animate
                        attributeName="opacity"
                        values="1;0.3;1"
                        dur="1.5s"
                        begin="0.6s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="52" cy="152" r="6" fill={isDarkMode ? "#F59E0B" : "#D97706"}>
                      <animate
                        attributeName="opacity"
                        values="1;0.3;1"
                        dur="1.5s"
                        begin="0.8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="52" cy="72" r="6" fill={isDarkMode ? "#F59E0B" : "#D97706"}>
                      <animate
                        attributeName="opacity"
                        values="1;0.3;1"
                        dur="1.5s"
                        begin="1s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </>
                )}

                {/* Progress circle */}
                {efficiencyScore !== null && (
                  <circle
                    cx="112"
                    cy="112"
                    r="80"
                    fill="none"
                    stroke={isDarkMode ? "url(#gradientDark)" : "url(#gradientLight)"}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray="502"
                    strokeDashoffset={502 - (502 * (efficiencyScore || 0)) / 100}
                    transform="rotate(-90 112 112)"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="502"
                      to={502 - (502 * (efficiencyScore || 0)) / 100}
                      dur="1.5s"
                      fill="freeze"
                      calcMode="spline"
                      keySplines="0.42 0 0.58 1"
                    />
                  </circle>
                )}

                {/* Pulse effect when data updates */}
                {efficiencyScore !== null && (
                  <circle
                    cx="112"
                    cy="112"
                    r="92"
                    fill="none"
                    stroke={isDarkMode ? "rgba(245,158,11,0.3)" : "rgba(217,119,6,0.3)"}
                    strokeWidth="2"
                    opacity="0"
                  >
                    <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="1" begin="0s" />
                    <animate attributeName="r" values="80;100;80" dur="2s" repeatCount="1" begin="0s" />
                  </circle>
                )}

                <defs>
                  <linearGradient id="gradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#FBBF24" />
                  </linearGradient>
                  <linearGradient id="gradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D97706" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Score display */}
              <div className="absolute text-center w-full max-w-[120px]">
                {efficiencyScore === null ? (
                  <div className={`text-sm ${isDarkMode ? "text-white/70" : "text-gray-600"}`}>Loading data...</div>
                ) : (
                  <>
                    <div className={`text-5xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {efficiencyScore}
                    </div>
                    <div className={`text-sm ${isDarkMode ? "text-white/70" : "text-gray-600"}`}>Out of 100</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card
          className={`p-5 rounded-xl transition-all duration-300 overflow-hidden relative group
      ${
        isDarkMode
          ? "backdrop-blur-lg bg-gray-900/40 border border-gray-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          : "backdrop-blur-lg bg-white/60 border border-white/50 shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)]"
      }
    `}
        >
          <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-all duration-300"></div>
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className={`p-2 rounded-lg ${isDarkMode ? "bg-yellow-500/30" : "bg-yellow-500/20"}`}>
              <Zap className={`w-5 h-5 ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`} />
            </div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Electricity Usage
            </h3>
          </div>
          <div className="flex items-center relative z-10">
            <div className="flex-1">
              <div className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {electricityUsage} kWh
              </div>
              <div className={`text-sm ${isDarkMode ? "text-white/70" : "text-gray-600"}`}>This month</div>
              <div className={`mt-4 h-2 ${isDarkMode ? "bg-white/10" : "bg-black/10"} rounded-full overflow-hidden`}>
                <div
                  className={`h-full rounded-full ${isDarkMode ? "bg-yellow-400" : "bg-yellow-500"}`}
                  style={{ width: `${Math.min(100, (electricityUsage || 0) / 10)}%` }}
                ></div>
              </div>
              <div className={`mt-2 text-xs ${isDarkMode ? "text-white/70" : "text-gray-600"} flex justify-between`}>
                <span>0 kWh</span>
                <span>1000 kWh</span>
              </div>
            </div>
          </div>
        </Card>

        <Card
          className={`p-5 rounded-xl transition-all duration-300 overflow-hidden relative group
      ${
        isDarkMode
          ? "backdrop-blur-lg bg-gray-900/40 border border-gray-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          : "backdrop-blur-lg bg-white/60 border border-white/50 shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)]"
      }
    `}
        >
          <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-red-500/10 group-hover:bg-red-500/20 transition-all duration-300"></div>
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className={`p-2 rounded-lg ${isDarkMode ? "bg-red-500/30" : "bg-red-500/20"}`}>
              <Zap className={`w-5 h-5 ${isDarkMode ? "text-red-400" : "text-red-600"}`} />
            </div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Peak Power Usage</h3>
          </div>
          <div className="flex items-center relative z-10">
            <div className="flex-1">
              <div className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {peakPowerUsage} kW
              </div>
              <div className={`text-sm ${isDarkMode ? "text-white/70" : "text-gray-600"}`}>This month</div>
              <div className={`mt-4 h-2 ${isDarkMode ? "bg-white/10" : "bg-black/10"} rounded-full overflow-hidden`}>
                <div
                  className={`h-full rounded-full ${isDarkMode ? "bg-red-400" : "bg-red-500"}`}
                  style={{ width: `${Math.min(100, (peakPowerUsage || 0) / 1)}%` }}
                ></div>
              </div>
              <div className={`mt-2 text-xs ${isDarkMode ? "text-white/70" : "text-gray-600"} flex justify-between`}>
                <span>0 kW</span>
                <span>100 kW</span>
              </div>
            </div>
          </div>
        </Card>

        <Card
          className={`p-5 rounded-xl transition-all duration-300 overflow-hidden relative group
      ${
        isDarkMode
          ? "backdrop-blur-lg bg-gray-900/40 border border-gray-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          : "backdrop-blur-lg bg-white/60 border border-white/50 shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)]"
      }
    `}
        >
          <div className="absolute -left-16 -bottom-16 w-32 h-32 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-all duration-300"></div>
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className={`p-2 rounded-lg ${isDarkMode ? "bg-green-500/30" : "bg-green-500/20"}`}>
              <Wind className={`w-5 h-5 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
            </div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Carbon Footprint</h3>
          </div>
          <div className="flex items-center relative z-10">
            <div className="flex-1">
              <div className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {carbonFootprint} kg CO2
              </div>
              <div className={`text-sm ${isDarkMode ? "text-white/70" : "text-gray-600"}`}>This month</div>
              <div className={`mt-4 h-2 ${isDarkMode ? "bg-white/10" : "bg-black/10"} rounded-full overflow-hidden`}>
                <div
                  className={`h-full rounded-full ${isDarkMode ? "bg-green-400" : "bg-green-500"}`}
                  style={{ width: `${Math.min(100, (carbonFootprint || 0) / 5)}%` }}
                ></div>
              </div>
              <div className={`mt-2 text-xs ${isDarkMode ? "text-white/70" : "text-gray-600"} flex justify-between`}>
                <span>0 kg</span>
                <span>500 kg</span>
              </div>
            </div>
          </div>
        </Card>

        <Card
          className={`p-5 rounded-xl transition-all duration-300 overflow-hidden relative group
      ${
        isDarkMode
          ? "backdrop-blur-lg bg-gray-900/40 border border-gray-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          : "backdrop-blur-lg bg-white/60 border border-white/50 shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)]"
      }
    `}
        >
          <div className="absolute -left-16 -top-16 w-32 h-32 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-all duration-300"></div>
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className={`p-2 rounded-lg ${isDarkMode ? "bg-green-500/30" : "bg-green-500/20"}`}>
              <DollarSign className={`w-5 h-5 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
            </div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Cost Expenditure</h3>
          </div>
          <div className="flex items-center relative z-10">
            <div className="flex-1">
              <div className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>AED {costSavings}</div>
              <div className={`text-sm ${isDarkMode ? "text-white/70" : "text-gray-600"}`}>This month</div>
              <div className={`mt-4 h-2 ${isDarkMode ? "bg-white/10" : "bg-black/10"} rounded-full overflow-hidden`}>
                <div
                  className={`h-full rounded-full ${isDarkMode ? "bg-green-400" : "bg-green-500"}`}
                  style={{ width: `${Math.min(100, (costSavings || 0) / 2)}%` }}
                ></div>
              </div>
              <div className={`mt-2 text-xs ${isDarkMode ? "text-white/70" : "text-gray-600"} flex justify-between`}>
                <span>AED0</span>
                <span>AED200</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default DashboardPage

