"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Zap, Lamp, Speaker, Tv, Computer, Fan, RefrigeratorIcon, Settings, Sun, Moon } from "lucide-react"

// UI & Icons
import { Button } from "@/components/ui/button"
import {
  Plug,
  Scan,
  Lightbulb,
  LampDesk,
  LampFloor,
  Radio,
  Headphones,
  Gamepad2,
  MonitorSmartphone,
  Music2,
  Projector,
  Microwave,
  Coffee,
  Utensils,
  Soup,
  MicrowaveIcon as Oven,
  CookingPotIcon as Stove,
  ComputerIcon as Blender,
  Sandwich,
  Beef,
  Salad,
  Laptop,
  Printer,
  Router,
  WifiIcon,
  Cpu,
  HardDrive,
  Wind,
  Thermometer,
  Snowflake,
  Flame,
  Droplets,
  ShowerHeadIcon as Shower,
  Scissors,
  BrushIcon as Toothbrush,
  Lock,
  BellRing,
  Camera,
  Siren,
  BatteryCharging,
  Wrench,
  Dumbbell,
  User,
  LogOut,
  RefreshCw,
  Smartphone,
  DollarSign,
  Sparkles,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// -----------------------------------------------------------------
// 1) PLACEHOLDER DATA FOR BACKEND INTEGRATION
// -----------------------------------------------------------------

// Define types for devices and rooms
type Device = {
  device_name: string
  power: string
  usage: string
  icon: string
  active: boolean
}

type Room = {
  room_name: string
  usage: string
  icon: React.ComponentType<{ className?: string }>
  devices: number
  total_power: string
}

const iconMap: Record<string, React.ElementType> = {
  "Desk Lamp": Lamp,
  "Light Bulb": Lightbulb,
  "Floor Lamp": LampFloor,
  "Table Lamp": LampDesk,
  TV: Tv,
  Radio: Radio,
  Speaker: Speaker,
  Headphones: Headphones,
  "Game Console": Gamepad2,
  Monitor: MonitorSmartphone,
  "Sound System": Music2,
  Projector: Projector,
  Refrigerator: RefrigeratorIcon,
  Microwave: Microwave,
  "Coffee Maker": Coffee,
  Toaster: Utensils,
  "Slow Cooker": Soup,
  Oven: Oven,
  Stove: Stove,
  Blender: Blender,
  "Sandwich Maker": Sandwich,
  "Air Fryer": Beef,
  "Food Processor": Salad,
  Computer: Computer,
  Laptop: Laptop,
  Printer: Printer,
  Scanner: Scan,
  Router: Router,
  "WiFi Extender": WifiIcon,
  "CPU/Server": Cpu,
  "External Drive": HardDrive,
  Fan: Fan,
  "Air Purifier": Wind,
  Thermostat: Thermometer,
  "Air Conditioner": Snowflake,
  Heater: Flame,
  Humidifier: Droplets,
  "Water Heater": Shower,
  "Hair Dryer": Scissors,
  "Electric Toothbrush": Toothbrush,
  "Smart Plug": Plug,
  "Smart Lock": Lock,
  Doorbell: BellRing,
  "Security Camera": Camera,
  "Alarm System": Siren,
  "Battery Charger": BatteryCharging,
  "Power Tool": Wrench,
  "Exercise Equipment": Dumbbell,
}
// Tips fetched from backend (example placeholders)
const energySavingTips = [
  {
    title: "Recover greywater from the washing machine",
    description: "Save water and reduce your bills by reusing washing machine water for your garden.",
    icon: Lightbulb,
  },
  {
    title: "Unplug devices when not in use",
    description: "Standby power can account for up to 10% of your electricity bill.",
    icon: Zap,
  },
  {
    title: "Use smart power strips",
    description: "Automatically cut power to devices when they're not in use.",
    icon: Smartphone,
  },
  {
    title: "Adjust your thermostat",
    description: "Each degree adjustment can save up to 5% on your cooling costs.",
    icon: Settings,
  },
]

// Comparison data (example placeholders)
const usageComparison = [
  { period: "Today", current: 0.0, previous: 0.0, change: 0 },
  { period: "This Week", current: 0.0, previous: 0.0, change: 0 },
  { period: "This Month", current: 0.0, previous: 0.0, change: 0 },
]

// Recent activity from backend (not used in this snippet, but provided as placeholders)
const recentActivity = [
  {
    event: "Placeholder event 1",
    time: "0 minutes ago",
    icon: Tv,
    color: "text-blue-400",
  },
  {
    event: "Placeholder event 2",
    time: "0 minutes ago",
    icon: Settings,
    color: "text-green-400",
  },
]

// -----------------------------------------------------------------
// 2) MAIN COMPONENT
// -----------------------------------------------------------------

export default function HomePage() {
  const router = useRouter()

  // Example usage data from backend
  const [currentUsage, setCurrentUsage] = useState({
    amount: "0.00", // e.g. "20.34"
    kwh: "0.00", // e.g. "39.8"
    budgetUsed: 0, // e.g. 65 (percentage)
    budgetGoal: "0", // e.g. "100"
  })

  // Current tip index for rotating tips
  const [currentTip, setCurrentTip] = useState(0)

  // Simulated "live wattage" for demonstration
  const [liveWattage, setLiveWattage] = useState(0)

  // Determine screen sizes for responsiveness
  const [isMobile, setIsMobile] = useState(true)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true"
    }
    return false
  })

  const [userAvatar, setUserAvatar] = useState<string>("/placeholder.svg?height=40&width=40")
  const [userName, setUserName] = useState<string>("User")

  // Load dark mode preference from localStorage on initial render
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setIsDarkMode(savedDarkMode)
    // Apply dark mode class to the document element
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // Save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString())
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  // State for top active devices and rooms
  const [topActiveDevices, setTopActiveDevices] = useState<Device[]>([])
  const [topActiveRooms, setTopActiveRooms] = useState<Room[]>([])

  // State for electricity usage and cost savings from efficiency metrics
  const [electricityUsage, setElectricityUsage] = useState<number | null>(null)
  const [costSavings, setCostSavings] = useState<number | null>(null)

  // Watch for screen-size changes
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsDesktop(width >= 1024)
    }
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Simulate live wattage (you'd replace this with real-time data from your backend)
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveWattage((prev) => {
        // Here you can simulate changes or fetch new data from your backend
        // For now, we just do a small random change
        const change = Math.floor(Math.random() * 20) - 10
        let next = prev + change
        // Constrain it between 0 and 400 for placeholder
        if (next < 0) next = 0
        if (next > 400) next = 400
        return next
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Rotate the displayed tip every 10 seconds (placeholder logic)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % energySavingTips.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  // Example logout handler
  const handleLogout = async () => {
    // In real scenario, you'd call your logout endpoint
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const userId = localStorage.getItem("user_id")
      if (!userId) return

      try {
        const response = await fetch(`/api/auth/profile_pic?user_id=${encodeURIComponent(userId)}`)
        const result = await response.json()

        if (result.success && result.avatar_url) {
          setUserAvatar(result.avatar_url)
        }

        // Also fetch user details to get the name
        const userResponse = await fetch(`/api/auth/get_user_details?user_id=${userId}`)
        const userData = await userResponse.json()

        if (userData.success && userData.user.name) {
          setUserName(userData.user.name)
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error)
      }
    }

    fetchProfilePicture()
  }, [])

  // Glass card style
  const glassCardStyle = `p-5 rounded-xl transition-all duration-300 overflow-hidden relative group
  ${
    isDarkMode
      ? "backdrop-blur-lg bg-gray-900/40 border border-gray-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
      : "backdrop-blur-lg bg-white/60 border border-white/50 shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)]"
  }`

  // Fetch top active rooms
  const fetchTopActiveRooms = async () => {
    try {
      const householdCode = localStorage.getItem("household_code")
      if (!householdCode) {
        console.error("Household code not found in local storage")
        return
      }

      const response = await fetch(`/api/auth/top_active_rooms?household_code=${householdCode}`)
      if (!response.ok) {
        throw new Error("Failed to fetch top active rooms")
      }

      const data = await response.json()
      if (data.success) {
        console.log("Top active rooms:", data.data.top_rooms)
        setTopActiveRooms(data.data.top_rooms) // Update state with fetched rooms
      } else {
        console.error("Error fetching top active rooms:", data.message)
      }
    } catch (error) {
      console.error("Error fetching top active rooms:", error)
    }
  }

  const fetchTopActiveDevices = async () => {
    try {
      const householdCode = localStorage.getItem("household_code")
      if (!householdCode) {
        console.error("Household code not found in local storage")
        return
      }

      const response = await fetch(`/api/auth/top_active_devices?household_code=${householdCode}`)
      if (!response.ok) {
        throw new Error("Failed to fetch top active devices")
      }

      const data = await response.json()
      if (data.success) {
        console.log("Top active devices:", data.data.top_devices)
        const devicesWithIcons = data.data.top_devices.map((device: Device) => ({
          ...device,
          icon: iconMap[device.icon] || Plug, // Default to Plug if icon not found
        }))
        // Update state with fetched devices (no icon mapping needed)
        setTopActiveDevices(devicesWithIcons)
      } else {
        console.error("Error fetching top active devices:", data.message)
      }
    } catch (error) {
      console.error("Error fetching top active devices:", error)
    }
  }

  const fetchEfficiencyMetrics = async () => {
    try {
      const householdCode = localStorage.getItem("household_code")
      if (!householdCode) {
        console.error("Household code not found in local storage")
        return
      }

      const response = await fetch(`/api/auth/efficiency_metrics?household_code=${householdCode}`)
      if (!response.ok) {
        throw new Error("Failed to fetch efficiency metrics")
      }

      const data = await response.json()
      if (data.success) {
        console.log("Efficiency metrics data:", data.data.data)
        setElectricityUsage(data.data.data.electricityUsage)
        setCostSavings(data.data.data.costSavings)
      } else {
        console.error("Error fetching efficiency metrics:", data.message)
      }
    } catch (error) {
      console.error("Error fetching efficiency metrics:", error)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchTopActiveRooms()
    fetchTopActiveDevices()
    fetchEfficiencyMetrics()
  }, [])

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: isDarkMode
          ? "radial-gradient(circle, rgba(87,119,94,1) 0%, rgba(79,74,116,1) 100%)"
          : "radial-gradient(circle, rgba(174,238,189,1) 0%, rgba(159,148,233,1) 100%)",
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-blue-200/20 dark:bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-[5%] w-96 h-96 bg-cyan-200/20 dark:bg-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-full h-64 bg-gradient-to-r from-purple-200/10 via-blue-200/10 to-cyan-200/10 dark:from-purple-500/5 dark:via-blue-500/5 dark:to-cyan-500/5 blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header
          className="backdrop-blur-sm border-b border-gray-200 dark:border-white/10 sticky top-0 z-20"
          style={{
            background: isDarkMode
              ? "rgba(87,119,94,0.7)"
              : "radial-gradient(circle, rgba(174,238,189,0.7) 0%, rgba(159,148,233,0.7) 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-blue-200">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Plug Saver</h1>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                size="icon"
                variant="outline"
                className="rounded-full backdrop-blur-md bg-white/10 border-white/20 mr-2"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-10 h-10 rounded-full p-0 overflow-hidden bg-transparent hover:bg-gray-100/10 dark:hover:bg-blue-800/70"
                  >
                    <Avatar className="w-full h-full border border-gray-200 dark:border-blue-700/50">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback className="bg-gray-100 dark:bg-blue-800/50 text-gray-800 dark:text-blue-100">
                        {userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <div className="max-w-7xl mx-auto px-4 py-6 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-10 left-1/3 w-40 h-40 bg-blue-200/20 rounded-full blur-2xl"></div>

          {/* Enhanced grid pattern overlay with sophisticated visual effects */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
              style={{
                backgroundImage: `
        linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
      `,
                backgroundSize: "24px 24px",
              }}
            ></div>

            {/* Diagonal lines for added texture */}
            <div
              className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
              style={{
                backgroundImage: `
        linear-gradient(45deg, rgba(99, 102, 241, 0.1) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(99, 102, 241, 0.1) 25%, transparent 25%)
      `,
                backgroundSize: "60px 60px",
              }}
            ></div>

            {/* Animated gradient overlay with improved animation */}
            <div
              className="absolute inset-0 opacity-[0.04] dark:opacity-[0.05] animate-[pulse_8s_ease-in-out_infinite]"
              style={{
                background:
                  "radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.3) 0%, transparent 40%)",
              }}
            ></div>

            {/* Subtle floating particles effect */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white dark:bg-blue-200 animate-[float_15s_ease-in-out_infinite]"
                  style={{
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 10 + 15}s`,
                    opacity: 0.4,
                  }}
                ></div>
              ))}
            </div>

            {/* Soft glow effects */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute w-[40%] h-[40%] rounded-full blur-[80px] opacity-[0.03] dark:opacity-[0.04] animate-[drift_25s_ease-in-out_infinite]"
                style={{
                  background: "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)",
                  top: "20%",
                  left: "10%",
                }}
              ></div>
              <div
                className="absolute w-[50%] h-[50%] rounded-full blur-[100px] opacity-[0.03] dark:opacity-[0.04] animate-[drift_30s_ease-in-out_infinite_reverse]"
                style={{
                  background: "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)",
                  bottom: "10%",
                  right: "15%",
                  animationDelay: "-5s",
                }}
              ></div>
            </div>
          </div>

          {/* Add keyframes for new animations to the first style tag in the document */}
          <style jsx global>{`
            @keyframes float {
              0%, 100% { transform: translateY(0) translateX(0); }
              25% { transform: translateY(-10px) translateX(5px); }
              50% { transform: translateY(5px) translateX(-5px); }
              75% { transform: translateY(-5px) translateX(10px); }
            }
            
            @keyframes drift {
              0%, 100% { transform: translateY(0) translateX(0); }
              25% { transform: translateY(-5%) translateX(2%); }
              50% { transform: translateY(3%) translateX(-3%); }
              75% { transform: translateY(-2%) translateX(5%); }
            }
          `}</style>

          {/* Dashboard overview */}
          <div className="mb-8">
            {/* Current usage card - expanded to fill full width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`w-full rounded-2xl overflow-hidden ${glassCardStyle}`}
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 p-2.5 rounded-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Current Usage</h2>
                  </div>
                  <div className="flex items-center gap-3 bg-white/30 dark:bg-gray-700/30 px-4 py-2 rounded-full self-start md:self-auto backdrop-blur-sm shadow-sm">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <p className="text-sm font-medium text-green-600 dark:text-green-300">Live {liveWattage}W</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left column - Circular progress */}
                  <div className="flex justify-center md:justify-start">
                    <div className="relative w-36 h-36 md:w-48 md:h-48">
                      <svg className="w-full h-full -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgba(0,0,0,0.1)"
                          className="dark:stroke-white/10"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="url(#circleGradient)"
                          strokeWidth="8"
                          strokeDasharray="283"
                          strokeDashoffset={283 - (283 * currentUsage.budgetUsed) / 100}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3B82F6" /> {/* blue-500 */}
                            <stop offset="100%" stopColor="#06B6D4" /> {/* cyan-500 */}
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                          {currentUsage.budgetUsed}%
                        </p>
                        <p className="text-sm md:text-base text-gray-500 dark:text-blue-300">of budget</p>
                      </div>
                    </div>
                  </div>

                  {/* Middle column - Cost and usage details */}
                  <div className="flex flex-col justify-center items-center md:items-start space-y-6">
                    <div className="text-center md:text-left bg-white/20 dark:bg-gray-800/20 p-4 rounded-xl border border-white/20 dark:border-gray-700/20 backdrop-blur-sm w-full">
                      <p className="text-sm text-gray-600 dark:text-blue-300 mb-1">Cost Savings</p>
                      <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        AED {costSavings !== null ? Math.round(costSavings) : "-"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-blue-200 mt-1">This month</p>
                    </div>
                    <div className="text-center md:text-left bg-white/20 dark:bg-gray-800/20 p-4 rounded-xl border border-white/20 dark:border-gray-700/20 backdrop-blur-sm w-full">
                      <p className="text-sm text-gray-600 dark:text-blue-300 mb-1">Electricity Usage</p>
                      <p className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                        {electricityUsage !== null ? `${electricityUsage} kWh` : "-"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-blue-200 mt-1">This month</p>
                    </div>
                  </div>

                  {/* Right column - Additional stats */}
                  <div className="flex flex-col justify-center space-y-6">
                    <div className="bg-white/30 dark:bg-gray-800/30 p-4 rounded-xl border border-white/30 dark:border-gray-700/30 backdrop-blur-sm shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-700/50">
                          <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white">Monthly Budget</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white ml-2">
                        AED {currentUsage.budgetGoal}
                      </p>
                    </div>

                    <div className="bg-white/20 dark:bg-gray-800/20 p-4 rounded-xl border border-white/20 dark:border-gray-700/20 backdrop-blur-sm">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-blue-300 font-medium">Budget Progress</span>
                        <span className="text-gray-600 dark:text-blue-300">
                          AED {currentUsage.amount} / {currentUsage.budgetGoal}
                        </span>
                      </div>
                      <div className="h-3 bg-white/30 dark:bg-blue-950/50 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${currentUsage.budgetUsed}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-green-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom stats bar */}
              <div className="bg-white/30 dark:bg-gray-900/40 border-t border-white/30 dark:border-gray-800/30 p-5 md:p-6 backdrop-blur-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div className="text-center bg-white/20 dark:bg-gray-800/20 p-3 rounded-lg border border-white/20 dark:border-gray-700/20 backdrop-blur-sm">
                    <p className="text-xs text-gray-500 dark:text-blue-300 mb-1">Daily Average</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      AED {(Number.parseFloat(currentUsage.amount) / 30).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center bg-white/20 dark:bg-gray-800/20 p-3 rounded-lg border border-white/20 dark:border-gray-700/20 backdrop-blur-sm">
                    <p className="text-xs text-gray-500 dark:text-blue-300 mb-1">Projected Monthly</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      AED {((Number.parseFloat(currentUsage.amount) * 30) / new Date().getDate()).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center bg-white/20 dark:bg-gray-800/20 p-3 rounded-lg border border-white/20 dark:border-gray-700/20 backdrop-blur-sm">
                    <p className="text-xs text-gray-500 dark:text-blue-300 mb-1">Active Devices</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {topActiveDevices?.filter((d) => d.active).length}
                    </p>
                  </div>
                  <div className="text-center bg-white/20 dark:bg-gray-800/20 p-3 rounded-lg border border-white/20 dark:border-gray-700/20 backdrop-blur-sm">
                    <p className="text-xs text-gray-500 dark:text-blue-300 mb-1">Total Rooms</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{topActiveRooms?.length || 0}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Active devices and rooms */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active devices */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className={`rounded-2xl p-6 ${glassCardStyle}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Active Devices</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-blue-300 dark:hover:text-white hover:bg-white/20 dark:hover:bg-gray-700/50"
                    onClick={fetchTopActiveDevices}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {topActiveDevices?.map((device, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        device.active
                          ? "bg-blue-50/50 border-blue-200/50 dark:bg-gray-700/30 dark:border-gray-600/50 backdrop-blur-sm"
                          : "bg-white/30 border-white/30 dark:bg-gray-800/30 dark:border-gray-700/30 backdrop-blur-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            device.active ? "bg-blue-100/70 dark:bg-blue-600/50" : "bg-white/50 dark:bg-gray-800/50"
                          }`}
                        >
                          {React.createElement(device.icon, {
                            className: `w-5 h-5 ${
                              device.active ? "text-blue-500 dark:text-blue-300" : "text-gray-400 dark:text-blue-400"
                            }`,
                          })}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{device.device_name}</p>
                          <p className="text-xs text-gray-500 dark:text-blue-300">{device.power}W</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{device.usage}</p>
                        <p className="text-xs text-gray-500 dark:text-blue-300">
                          {device.active ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Active rooms */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className={`rounded-2xl p-6 ${glassCardStyle}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Active Rooms</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-blue-300 dark:hover:text-white hover:bg-white/20 dark:hover:bg-gray-700/50"
                    onClick={fetchTopActiveRooms}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {topActiveRooms?.map((room, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="bg-white/30 dark:bg-gray-800/30 p-4 rounded-lg border border-white/30 dark:border-gray-700/30 flex flex-col items-center backdrop-blur-sm"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/50 dark:bg-blue-700/30 flex items-center justify-center mb-2">
                        {React.createElement(room.icon, { className: "w-6 h-6 text-gray-500 dark:text-blue-300" })}
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{room.room_name}</p>
                      <p className="text-xs text-gray-500 dark:text-blue-300">{room.total_power}W</p>
                      <p className="text-xs text-gray-400 dark:text-blue-400 mt-1">{room.devices} devices</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Energy saving tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className={`rounded-2xl p-6 mb-20 md:mb-8 ${glassCardStyle}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Energy Saving Tips</h2>
              <div className="flex gap-1">
                {energySavingTips.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i === currentTip ? "bg-blue-500 dark:bg-blue-400" : "bg-white/50 dark:bg-blue-800/80"
                    }`}
                  />
                ))}
              </div>
            </div>
            <motion.div
              key={currentTip}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white/30 dark:bg-gray-700/20 rounded-xl p-4 border border-white/30 dark:border-gray-600/30 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {energySavingTips[currentTip].title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-blue-200">{energySavingTips[currentTip].description}</p>
                </div>
                <div className="w-16 h-16 flex-shrink-0 bg-white/40 dark:bg-gradient-to-br dark:from-blue-500/30 dark:to-cyan-500/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  {React.createElement(energySavingTips[currentTip].icon, {
                    className: "w-8 h-8 text-blue-500 dark:text-cyan-300",
                  })}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  size="sm"
                  className="bg-blue-500/80 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4 mr-1" /> Apply Tip
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

