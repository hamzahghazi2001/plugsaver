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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

type PeriodType = "day" | "week" | "month" | "year"

const DashboardPage = () => {
  const [period, setPeriod] = useState<PeriodType>("week")
  const [energyData, setEnergyData] = useState<Record<PeriodType, { name: string; value: number }[]> | null>(null)
  const [roomsData, setRoomsData] = useState<{ name: string; value: number }[] | null>(null)
  const [applianceData, setApplianceData] = useState<{ name: string; usage: number }[] | null>(null)
  const [efficiencyScore, setEfficiencyScore] = useState<number | null>(null);
  const [electricityUsage, setElectricityUsage] = useState<number | null>(null);
  const [peakPowerUsage, setPeakPowerUsage] = useState<number | null>(null);
  const [carbonFootprint, setCarbonFootprint] = useState<number | null>(null);
  const [costSavings, setCostSavings] = useState<number | null>(null);
  let [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Load dark mode preference from localStorage on initial render
  useEffect(() => {
    let savedDarkMode = localStorage.getItem("darkMode") === "true"
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
      const householdCode = localStorage.getItem("household_code");
      console.log("Fetching data for household code:", householdCode); // Debugging
  
      // Fetch energy consumption data
      const energyResponse = await fetch(`/api/auth/energy_consumption?household_code=${householdCode}`);
      if (!energyResponse.ok) {
        throw new Error("Failed to fetch energy consumption data");
      }
      const energyResult = await energyResponse.json();
      console.log("Energy consumption data:", energyResult.data.data); // Debugging
      if (energyResult.success) {
        setEnergyData(energyResult.data.data); // Update energy data state
      } else {
        console.error(energyResult.message);
      }
  
      // Fetch rooms consumption data
      const roomsResponse = await fetch(`/api/auth/room_consumption?household_code=${householdCode}`);
      if (!roomsResponse.ok) {
        throw new Error("Failed to fetch rooms consumption data");
      }
      const roomsResult = await roomsResponse.json();
      console.log("Rooms consumption data:", roomsResult.data.data); // Debugging
      if (roomsResult.success) {
        setRoomsData(roomsResult.data.data); // Update rooms data state
      } else {
        console.error(roomsResult.message);
      }
  
      // Fetch device category data
      const devicecategoryResponse = await fetch(`/api/auth/device_category?household_code=${householdCode}`);
      if (!devicecategoryResponse.ok) {
        throw new Error("Failed to fetch device category data");
      }
      const devicecategoryResult = await devicecategoryResponse.json();
      console.log("Device category data:", devicecategoryResult.data.data); // Debugging
      if (devicecategoryResult.success) {
        setApplianceData(devicecategoryResult.data.data); // Update appliance data state
      } else {
        console.error(devicecategoryResult.message);
      }
      const efficiencyMetricsResponse = await fetch(`/api/auth/efficiency_metrics?household_code=${householdCode}`);
      if (!efficiencyMetricsResponse.ok) {
        throw new Error("Failed to fetch efficiency metrics");
      }
      const efficiencyMetricsResult = await efficiencyMetricsResponse.json();
      console.log("Efficiency metrics data:", efficiencyMetricsResult.data.data.efficiencyScore); // Debugging
      if (efficiencyMetricsResult.success) {
        setEfficiencyScore(efficiencyMetricsResult.data.data.efficiencyScore);
        setElectricityUsage(efficiencyMetricsResult.data.data.electricityUsage);
        setPeakPowerUsage(efficiencyMetricsResult.data.data.peakPowerUsage);
        setCarbonFootprint(efficiencyMetricsResult.data.data.carbonFootprint);
        setCostSavings(efficiencyMetricsResult.data.data.costSavings);
      } else {
        console.error(efficiencyMetricsResult.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  //setRoomsData([])
  //setApplianceData([])

  useEffect(() => {
    fetchData(); // Fetch data immediately when the component mounts
    const interval = setInterval(fetchData, 10000); // Refetch every 10 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

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
    <div className={`min-h-screen p-6 md:p-10 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button size="icon" variant="ghost" onClick={fetchData}>
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(["year", "month", "week", "day"] as const).map((p) => (
          <Button
            key={p}
            variant={period === p ? "default" : "secondary"}
            className="flex-1"
            onClick={() => setPeriod(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium">Energy Consumption</h2>
            <Button size="icon" variant="ghost" onClick={() => handleDownload(energyData?.[period], "energy_consumption.json")}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData ? energyData[period] : []}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#4A5568" : "#E2E8F0"} />
                <XAxis dataKey="name" stroke={isDarkMode ? "#CBD5E0" : "#718096"} />
                <YAxis stroke={isDarkMode ? "#CBD5E0" : "#718096"} />
                <Tooltip contentStyle={isDarkMode ? { backgroundColor: "#2D3748", borderColor: "#4A5568" } : {}} />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} name="kWh" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium">Rooms Consumption</h2>
            <Button size="icon" variant="ghost" onClick={() => handleDownload(roomsData, "rooms_consumption.json")}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
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
                <Tooltip contentStyle={isDarkMode ? { backgroundColor: "#2D3748", borderColor: "#4A5568" } : {}} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium">Device Category Usage</h2>
            <Button size="icon" variant="ghost" onClick={() => handleDownload(applianceData, "device_category_usage.json")}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applianceData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#4A5568" : "#E2E8F0"} />
                <XAxis dataKey="name" stroke={isDarkMode ? "#CBD5E0" : "#718096"} />
                <YAxis stroke={isDarkMode ? "#CBD5E0" : "#718096"} />
                <Tooltip contentStyle={isDarkMode ? { backgroundColor: "#2D3748", borderColor: "#4A5568" } : {}} />
                <Legend />
                <Bar dataKey="usage" fill="#82ca9d" name="kWh" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

                <Card className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h2 className="font-medium mb-4">Energy Efficiency Score</h2>
          <div className="flex items-center justify-center h-64 md:h-80">
            <div className="text-center">
              <div className="text-6xl font-bold">{efficiencyScore}</div>
              <div className="text-sm text-gray-500">Out of 100</div>
            </div>
          </div>
        </Card>

        <Card className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
            <h3 className="font-medium mb-2">Electricity Usage</h3>
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-yellow-400 mr-4" />
              <div>
                <div className="text-2xl font-bold">{electricityUsage} kWh</div>
                <div className="text-sm text-gray-500">This month</div>
              </div>
            </div>
          </Card>

          <Card className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
              <h3 className="font-medium mb-2">Peak Power Usage</h3>
              <div className="flex items-center">
                <Zap className="w-8 h-8 text-red-400 mr-4" />
                <div>
                  <div className="text-2xl font-bold">{peakPowerUsage} kW</div>
                  <div className="text-sm text-gray-500">This month</div>
                </div>
              </div>
            </Card>

            <Card className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                <h3 className="font-medium mb-2">Carbon Footprint</h3>
                <div className="flex items-center">
                  <Wind className="w-8 h-8 text-green-400 mr-4" />
                  <div>
                    <div className="text-2xl font-bold">{carbonFootprint} kg CO2</div>
                    <div className="text-sm text-gray-500">This month</div>
                  </div>
                </div>
              </Card>

            <Card className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
              <h3 className="font-medium mb-2">Cost Expenditure</h3>
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-400 mr-4" />
                <div>
                  <div className="text-2xl font-bold">{costSavings} AED </div>
                  <div className="text-sm text-gray-500">This month</div>
                </div>
              </div>
            </Card>

        <Card className={`mt-6 p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h2 className="font-medium mb-4">Energy-Saving Tips</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Adjust your thermostat by 1°C to save up to 10% on your heating bill.</li>
            <li>Replace old appliances with energy-efficient models to reduce electricity consumption.</li>
            <li>Use natural light when possible and switch to LED bulbs for artificial lighting.</li>
            <li>Unplug electronics and appliances when not in use to avoid phantom energy drain.</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default DashboardPage