"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

// UI & Icons
import { Button } from "@/components/ui/button"
import {
  User,
  Settings,
  LogOut,
  Home,
  BarChartIcon as ChartBar,
  Lightbulb,
  User2,
  Tv,
  Computer,
  Fan,
  RefreshCw,
  Smartphone,
  Zap,
  Sofa,
  Utensils,
  Bed,
  Briefcase,
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

// -----------------------------------------------------------------
// 1) PLACEHOLDER DATA FOR BACKEND INTEGRATION
// -----------------------------------------------------------------

// Tips fetched from backend (example placeholders)
// Energy saving tips data
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

// Devices from backend (example placeholders)
const topActiveDevices = [
  { name: "Placeholder Device A", power: "0W", usage: "0 kWh", icon: Tv, active: true },
  { name: "Placeholder Device B", power: "0W", usage: "0 kWh", icon: Computer, active: false },
  { name: "Placeholder Device C", power: "0W", usage: "0 kWh", icon: Fan, active: true },
  { name: "Placeholder Device C", power: "0W", usage: "0 kWh", icon: Fan, active: true },
]

// Rooms from backend (example placeholders)
const topActiveRooms = [
  { name: "Placeholder Room 1", usage: "0 kWh", icon: Sofa, devices: 0 },
  { name: "Placeholder Room 2", usage: "0 kWh", icon: Utensils, devices: 0 },
  { name: "Placeholder Room 3", usage: "0 kWh", icon: Bed, devices: 0 },
  { name: "Placeholder Room 4", usage: "0 kWh", icon: Briefcase, devices: 0 },
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

  // Simulated “live wattage” for demonstration
  const [liveWattage, setLiveWattage] = useState(0)

  // Determine screen sizes for responsiveness
  const [isMobile, setIsMobile] = useState(true)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

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

  // Simulate live wattage (you’d replace this with real-time data from your backend)
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
    // In real scenario, you’d call your logout endpoint
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-blue-800 overflow-x-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-blue-200/20 dark:bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-[5%] w-96 h-96 bg-cyan-200/20 dark:bg-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-full h-64 bg-gradient-to-r from-purple-200/10 via-blue-200/10 to-cyan-200/10 dark:from-purple-500/5 dark:via-blue-500/5 dark:to-cyan-500/5 blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-sm bg-white/70 dark:bg-blue-900/30 border-b border-gray-200 dark:border-white/10 sticky top-0 z-20">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-10 h-10 rounded-full p-0 bg-gray-100 dark:bg-blue-800/50 border border-gray-200 dark:border-blue-700/50"
                  >
                    <img src="/placeholder.svg?height=40&width=40" alt="User" className="w-8 h-8 rounded-full" />
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
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Dashboard overview */}
          <div className="mb-8">
            {/* Current usage card - expanded to fill full width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full bg-white dark:bg-gradient-to-br dark:from-blue-800/80 dark:to-blue-900/80 rounded-2xl border border-gray-200 dark:border-blue-700/50 backdrop-blur-sm shadow-xl overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 p-2.5 rounded-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Current Usage</h2>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-100 dark:bg-blue-700/30 px-3 py-2 rounded-full self-start md:self-auto">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <p className="text-sm font-medium text-green-600 dark:text-green-300">Live {liveWattage}W</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left column - Circular progress */}
                  <div className="flex justify-center md:justify-start">
                    <div className="relative w-36 h-36 md:w-48 md:h-48">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
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
                            <stop offset="0%" className="text-blue-500" stopColor="currentColor" />
                            <stop offset="100%" className="text-cyan-500" stopColor="currentColor" />
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
                    <div className="text-center md:text-left">
                      <p className="text-sm text-gray-500 dark:text-blue-300 mb-1">Current Cost</p>
                      <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        AED {currentUsage.amount}
                      </p>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-sm text-gray-500 dark:text-blue-300 mb-1">Energy Used</p>
                      <p className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                        {currentUsage.kwh} kWh
                      </p>
                    </div>
                  </div>

                  {/* Right column - Additional stats */}
                  <div className="flex flex-col justify-center space-y-6">
                    <div className="bg-gray-50 dark:bg-blue-800/30 p-4 rounded-xl border border-gray-100 dark:border-blue-700/30">
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

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500 dark:text-blue-300">Budget Progress</span>
                        <span className="text-gray-500 dark:text-blue-300">
                          AED {currentUsage.amount} / {currentUsage.budgetGoal}
                        </span>
                      </div>
                      <div className="h-3 bg-gray-100 dark:bg-blue-950/50 rounded-full overflow-hidden">
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
              <div className="bg-gray-50 dark:bg-blue-900/40 border-t border-gray-100 dark:border-blue-800/30 p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-blue-300 mb-1">Daily Average</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      AED {(Number.parseFloat(currentUsage.amount) / 30).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-blue-300 mb-1">Projected Monthly</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      AED {((Number.parseFloat(currentUsage.amount) * 30) / new Date().getDate()).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-blue-300 mb-1">Active Devices</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {topActiveDevices.filter((d) => d.active).length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-blue-300 mb-1">Total Rooms</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{topActiveRooms.length}</p>
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
                className="bg-white dark:bg-gradient-to-br dark:from-blue-800/80 dark:to-blue-900/80 rounded-2xl p-6 border border-gray-200 dark:border-blue-700/50 backdrop-blur-sm shadow-xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Active Devices</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-blue-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-blue-700/50"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {topActiveDevices.map((device, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        device.active
                          ? "bg-blue-50 border-blue-200 dark:bg-blue-700/30 dark:border-blue-600/50"
                          : "bg-gray-50 border-gray-200 dark:bg-blue-800/30 dark:border-blue-700/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            device.active ? "bg-blue-100 dark:bg-blue-600/50" : "bg-gray-100 dark:bg-blue-800/50"
                          }`}
                        >
                          <device.icon
                            className={`w-5 h-5 ${
                              device.active ? "text-blue-500 dark:text-blue-300" : "text-gray-400 dark:text-blue-400"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{device.name}</p>
                          <p className="text-xs text-gray-500 dark:text-blue-300">{device.power}</p>
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
                className="bg-white dark:bg-gradient-to-br dark:from-blue-800/80 dark:to-blue-900/80 rounded-2xl p-6 border border-gray-200 dark:border-blue-700/50 backdrop-blur-sm shadow-xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Active Rooms</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-blue-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-blue-700/50"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {topActiveRooms.map((room, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="bg-gray-50 dark:bg-blue-800/30 p-4 rounded-lg border border-gray-200 dark:border-blue-700/30 flex flex-col items-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-blue-700/30 flex items-center justify-center mb-2">
                        <room.icon className="w-6 h-6 text-gray-500 dark:text-blue-300" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{room.name}</p>
                      <p className="text-xs text-gray-500 dark:text-blue-300">{room.usage}</p>
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
            className="bg-white dark:bg-gradient-to-br dark:from-blue-800/80 dark:to-blue-900/80 rounded-2xl p-6 border border-gray-200 dark:border-blue-700/50 backdrop-blur-sm shadow-xl mb-20 md:mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Energy Saving Tips</h2>
              <div className="flex gap-1">
                {energySavingTips.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i === currentTip ? "bg-blue-500 dark:bg-blue-400" : "bg-gray-200 dark:bg-blue-800/80"
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
              className="bg-gray-50 dark:bg-blue-700/20 rounded-xl p-4 border border-gray-200 dark:border-blue-600/30"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {energySavingTips[currentTip].title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-blue-200">{energySavingTips[currentTip].description}</p>
                </div>
                <div className="w-16 h-16 flex-shrink-0 bg-blue-50 dark:bg-gradient-to-br dark:from-blue-500/30 dark:to-cyan-500/30 rounded-lg flex items-center justify-center">
                  {React.createElement(energySavingTips[currentTip].icon, {
                    className: "w-8 h-8 text-blue-500 dark:text-cyan-300",
                  })}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-1" /> Apply Tip
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gradient-to-t dark:from-blue-950 dark:to-blue-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-blue-800/50 md:hidden z-50 shadow-lg"
      >
        <div className="flex justify-around py-3 px-4 max-w-md mx-auto">
          {[
            { icon: Home, label: "Home", active: true },
            { icon: ChartBar, label: "Live Now", active: false },
            { icon: Settings, label: "Summary", active: false },
            { icon: Lightbulb, label: "Tips", active: false },
            { icon: User2, label: "Settings", active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                active
                  ? "text-blue-500 dark:text-blue-400 scale-110"
                  : "text-gray-500 dark:text-blue-300/70 hover:text-gray-700 dark:hover:text-blue-200"
              }`}
            >
              <div className={`p-1.5 rounded-full ${active ? "bg-blue-50 dark:bg-blue-800/50" : ""}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </motion.nav>
    </div>
  )
}

