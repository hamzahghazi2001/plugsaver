"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { User, Settings, LogOut, Home, BarChartIcon as ChartBar, Lightbulb, User2, Tv, Computer, Fan, RefreshCw, Smartphone, Zap, Sofa, Utensils, Bed, Briefcase, Calendar, TrendingDown, TrendingUp, DollarSign, BarChart3, Bell, Award, Clock, Sparkles } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

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

// Top active devices data
const topActiveDevices = [
  { name: "Smart TV", power: "120W", usage: "2.09 kWh", icon: Tv, active: true },
  { name: "Desktop PC", power: "350W", usage: "7.19 kWh", icon: Computer, active: true },
  { name: "Ceiling Fan", power: "60W", usage: "0.62 kWh", icon: Fan, active: false },
]

// Top active rooms data
const topActiveRooms = [
  { name: "Living Room", usage: "9.28 kWh", icon: Sofa, devices: 5 },
  { name: "Kitchen", usage: "7.45 kWh", icon: Utensils, devices: 4 },
  { name: "Bedroom", usage: "3.12 kWh", icon: Bed, devices: 3 },
  { name: "Office", usage: "8.76 kWh", icon: Briefcase, devices: 2 },
]

// Quick actions data
const quickActions = [
  { name: "Schedule", icon: Calendar, color: "bg-blue-500/20", iconColor: "text-blue-400" },
  { name: "Reports", icon: BarChart3, color: "bg-green-500/20", iconColor: "text-green-400" },
  { name: "Alerts", icon: Bell, color: "bg-yellow-500/20", iconColor: "text-yellow-400" },
  { name: "Rewards", icon: Award, color: "bg-purple-500/20", iconColor: "text-purple-400" },
]

// Energy usage comparison data
const usageComparison = [
  { period: "Today", current: 4.2, previous: 5.1, change: -17.6 },
  { period: "This Week", current: 28.5, previous: 32.3, change: -11.8 },
  { period: "This Month", current: 98.7, previous: 105.2, change: -6.2 },
]

// Recent activity data
const recentActivity = [
  {
    event: "Smart TV turned on",
    time: "10 minutes ago",
    icon: Tv,
    color: "text-blue-400",
  },
  {
    event: "AC temperature adjusted",
    time: "25 minutes ago",
    icon: Settings,
    color: "text-green-400",
  },
  {
    event: "Kitchen lights turned off",
    time: "1 hour ago",
    icon: Lightbulb,
    color: "text-yellow-400",
  },
  {
    event: "Weekly report generated",
    time: "3 hours ago",
    icon: BarChart3,
    color: "text-purple-400",
  },
]

export default function HomePage() {
  const router = useRouter()
  const [currentUsage, setCurrentUsage] = useState({
    amount: "20.34",
    kwh: "39.8",
    budgetUsed: 65, // percentage
    budgetGoal: "100",
  })

  const [currentTip, setCurrentTip] = useState(0)
  const [liveWattage, setLiveWattage] = useState(342)
  const [isMobile, setIsMobile] = useState(true)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Check if the device is mobile, tablet, or desktop
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsDesktop(width >= 1024)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  // Simulate live energy tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveWattage((prev) => {
        const change = Math.floor(Math.random() * 20) - 10
        return Math.max(300, Math.min(400, prev + change))
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Rotate through tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % energySavingTips.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-blue-800 overflow-x-hidden">
      {/* Decorative elements */}
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
                <p className="text-xs text-gray-500 dark:text-blue-200">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Plug Saver</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-blue-800/50 px-3 py-1.5 rounded-full border border-gray-200 dark:border-blue-700/50">
               
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-10 h-10 rounded-full p-0 bg-gray-100 dark:bg-blue-800/50 border border-gray-200 dark:border-blue-700/50">
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
            <div className="flex flex-col md:flex-row gap-6">
              {/* Current usage card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full md:w-1/3 bg-white dark:bg-gradient-to-br dark:from-blue-800/80 dark:to-blue-900/80 rounded-2xl p-6 border border-gray-200 dark:border-blue-700/50 backdrop-blur-sm shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Usage</h2>
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-blue-700/30 px-2 py-1 rounded-full">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <Clock className="w-4 h-4 text-gray-500 dark:text-blue-300" />
                    <p className="text-xs text-green-600 dark:text-green-300">Live {liveWattage}W</p>
                  
                  </div>
                </div>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,0,0,0.1)" className="dark:stroke-white/10" strokeWidth="8" />
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
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentUsage.budgetUsed}%</p>
                      <p className="text-xs text-gray-500 dark:text-blue-300">of budget</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-2">
                      <p className="text-sm text-gray-500 dark:text-blue-300">Current Cost</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">AED {currentUsage.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-blue-300">Energy Used</p>
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">{currentUsage.kwh} kWh</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-blue-300">Budget Progress</span>
                    <span className="text-gray-500 dark:text-blue-300">AED {currentUsage.amount} / {currentUsage.budgetGoal}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-blue-950/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentUsage.budgetUsed}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-green-400 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
              
              {/* Energy comparison card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full md:w-1/3 bg-white dark:bg-gradient-to-br dark:from-blue-800/80 dark:to-blue-900/80 rounded-2xl p-6 border border-gray-200 dark:border-blue-700/50 backdrop-blur-sm shadow-xl"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Energy Comparison</h2>
                <div className="space-y-4">
                  {usageComparison.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-blue-300">{item.period}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-900 dark:text-white">{item.current} kWh</span>
                          <span className={item.change < 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}>
                            {item.change < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={100 - Math.abs(item.change)}
                        className="h-2 bg-gray-100 dark:bg-blue-950/50 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-cyan-500 dark:[&>div]:from-blue-400 dark:[&>div]:to-green-400"
                      />
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 dark:text-blue-400">Previous: {item.previous} kWh</span>
                        <span className={item.change < 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}>
                          {item.change > 0 ? "+" : ""}
                          {item.change}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Savings summary card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full md:w-1/3 bg-white dark:bg-gradient-to-br dark:from-blue-800/80 dark:to-blue-900/80 rounded-2xl p-6 border border-gray-200 dark:border-blue-700/50 backdrop-blur-sm shadow-xl"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Expenditure Summary</h2>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-400 dark:to-emerald-600 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600 dark:text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-blue-300">Expenditure Savings</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">AED 87.50</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    <TrendingUp className="w-4 h-4" />
                    <span>15%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500 dark:text-blue-300">Electricity</span>
                      <span className="text-gray-900 dark:text-white">AED 45.20</span>
                    </div>
                    <Progress
                      value={52}
                      className="h-2 bg-gray-100 dark:bg-blue-950/50 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-cyan-500 dark:[&>div]:from-blue-400 dark:[&>div]:to-green-400"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500 dark:text-blue-300">Water</span>
                      <span className="text-gray-900 dark:text-white">AED 22.80</span>
                    </div>
                    <Progress
                      value={26}
                      className="h-2 bg-gray-100 dark:bg-blue-950/50 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-cyan-500 dark:[&>div]:from-blue-400 dark:[&>div]:to-green-400"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500 dark:text-blue-300">Gas</span>
                      <span className="text-gray-900 dark:text-white">AED 19.50</span>
                    </div>
                    <Progress
                      value={22}
                      className="h-2 bg-gray-100 dark:bg-blue-950/50 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-cyan-500 dark:[&>div]:from-blue-400 dark:[&>div]:to-green-400"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
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
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-blue-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-blue-700/50">
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
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          device.active ? "bg-blue-100 dark:bg-blue-600/50" : "bg-gray-100 dark:bg-blue-800/50"
                        }`}>
                          <device.icon className={`w-5 h-5 ${device.active ? "text-blue-500 dark:text-blue-300" : "text-gray-400 dark:text-blue-400"}`} />
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
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-blue-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-blue-700/50">
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
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{energySavingTips[currentTip].title}</h3>
                  <p className="text-sm text-gray-600 dark:text-blue-200">{energySavingTips[currentTip].description}</p>
                </div>
                <div className="w-16 h-16 flex-shrink-0 bg-blue-50 dark:bg-gradient-to-br dark:from-blue-500/30 dark:to-cyan-500/30 rounded-lg flex items-center justify-center">
                  {React.createElement(energySavingTips[currentTip].icon, { className: "w-8 h-8 text-blue-500 dark:text-cyan-300" })}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white">
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
  );
}
