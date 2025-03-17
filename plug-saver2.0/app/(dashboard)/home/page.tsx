"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
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
  Calendar,
  TrendingDown,
  TrendingUp,
  DollarSign,
  BarChart3,
  Bell,
  Award,
} from "lucide-react"
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
    <div className="min-h-screen p-4 md:p-8 lg:p-10" style={{ background: "var(--gradient-home)" }}>
      <header className="flex justify-between items-center mb-6 md:mb-8">
        <div>
          <p className="text-gray-200 text-white">13th Dec, 2024</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Plug Saver</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-10 h-10 rounded-full p-0">
              <img src="/placeholder.svg?height=40&width=40" alt="User" className="w-10 h-10 rounded-full" />
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
      </header>

      <div className="md:grid md:grid-cols-12 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
        {/* Left column for tablet/desktop */}
        <div className="md:col-span-5 lg:col-span-4 xl:col-span-3">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square max-w-[240px] mx-auto mb-6 md:mb-8"
          >
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              {/* SVG Circle Progress */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
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
                    <stop offset="0%" stopColor="#40e0d0" />
                    <stop offset="100%" stopColor="#4169e1" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="text-center z-10">
                <p className="text-sm text-cyan-100 mb-1">CURRENT USAGE</p>
                <p className="text-4xl font-bold mb-1 text-white">AED {currentUsage.amount}</p>
                <p className="text-sm text-cyan-100">{currentUsage.kwh} kWh</p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-xs text-green-400">Live: {liveWattage}W</p>
                </div>
              </div>
            </div>
          </motion.div>

          <Card className="gradient-card mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-medium">Budget Goal</h2>
              <span className="text-xs bg-white/10 px-2 py-1 rounded-full">This month</span>
            </div>
            <div className="relative h-2 bg-white/10 rounded-full mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentUsage.budgetUsed}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>AED {currentUsage.amount}</span>
              <span>AED {currentUsage.budgetGoal}</span>
            </div>
          </Card>

          {/* Quick Actions - Visible on all devices */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-white mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  className="gradient-card p-3 cursor-pointer hover:bg-white/20 transition-all duration-200"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center mb-2`}>
                      <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                    </div>
                    <p className="text-xs font-medium">{action.name}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity - Visible on all devices */}
          <Card className="gradient-card mb-6">
            <h2 className="text-sm font-medium mb-3">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium">{activity.event}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Middle column for desktop */}
        <div className="md:col-span-7 lg:col-span-5 xl:col-span-6">
          <section className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-white">Top Active Devices</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {topActiveDevices.map((device, index) => (
                <Card key={index} className="gradient-card p-3 text-center">
                  <div
                    className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${device.active ? "bg-blue-500/20" : "bg-gray-500/20"}`}
                  >
                    <device.icon className={`w-5 h-5 ${device.active ? "text-blue-400" : "text-gray-400"}`} />
                  </div>
                  <p className="text-xs font-medium truncate">{device.name}</p>
                  <p className="text-xs text-gray-300">{device.usage}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Top Active Rooms section */}
          <section className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-white">Top Active Rooms</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {topActiveRooms.map((room, index) => (
                <Card key={index} className="gradient-card p-3 text-center">
                  <div className="mx-auto w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                    <room.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-xs font-medium truncate">{room.name}</p>
                  <p className="text-xs text-gray-300">{room.usage}</p>
                  <p className="text-xs text-gray-400">{room.devices} devices</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-white">Energy Saving Tips</h2>
              <div className="flex gap-1">
                {energySavingTips.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i === currentTip ? "bg-blue-400" : "bg-white/20"}`} />
                ))}
              </div>
            </div>
            <motion.div
              key={currentTip}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="gradient-card">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">{energySavingTips[currentTip].title}</h3>
                    <p className="text-sm text-gray-300">{energySavingTips[currentTip].description}</p>
                  </div>
                  <div className="w-16 h-16 flex-shrink-0 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                    {React.createElement(energySavingTips[currentTip].icon, { className: "w-8 h-8 text-cyan-300" })}
                  </div>
                </div>
              </Card>
            </motion.div>
          </section>
        </div>

        {/* Right column - visible on desktop and as full width on mobile */}
        <div className={`${isDesktop || isTablet ? "hidden lg:block lg:col-span-3 xl:col-span-3" : ""}`}>
          <Card className="gradient-card mb-6">
            <h2 className="text-sm font-medium mb-4">Energy Usage Comparison</h2>
            <div className="space-y-4">
              {usageComparison.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{item.period}</span>
                    <div className="flex items-center gap-1">
                      <span>{item.current} kWh</span>
                      <span className={item.change < 0 ? "text-green-400" : "text-red-400"}>
                        {item.change < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                      </span>
                    </div>
                  </div>
                  <Progress value={100 - Math.abs(item.change)} className="h-1.5 
             [&>div]:bg-gradient-to-r 
             [&>div]:from-blue-500 
             [&>div]:to-cyan-500" />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Previous: {item.previous} kWh</span>
                    <span className={item.change < 0 ? "text-green-400" : "text-red-400"}>
                      {item.change > 0 ? "+" : ""}
                      {item.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="gradient-card mb-6">
            <h2 className="text-sm font-medium mb-4">Energy Distribution</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-xs">Living Room</span>
                </div>
                <span className="text-xs">32%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-xs">Kitchen</span>
                </div>
                <span className="text-xs">26%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-xs">Office</span>
                </div>
                <span className="text-xs">22%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  <span className="text-xs">Bedroom</span>
                </div>
                <span className="text-xs">12%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-xs">Other</span>
                </div>
                <span className="text-xs">8%</span>
              </div>
            </div>
            <div className="mt-4 h-4 bg-gray-700/30 rounded-full overflow-hidden flex">
              <div className="h-full bg-blue-400" style={{ width: "32%" }}></div>
              <div className="h-full bg-green-400" style={{ width: "26%" }}></div>
              <div className="h-full bg-yellow-400" style={{ width: "22%" }}></div>
              <div className="h-full bg-purple-400" style={{ width: "12%" }}></div>
              <div className="h-full bg-gray-400" style={{ width: "8%" }}></div>
            </div>
          </Card>

          <Card className="gradient-card mb-6">
            <h2 className="text-sm font-medium mb-4">Savings Summary</h2>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-300">Monthly Savings</p>
                  <p className="text-lg font-bold">AED 87.50</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-400 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>15%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Electricity</span>
                <span>AED 45.20</span>
              </div>
              <Progress value={52} className="h-1.5 
             [&>div]:bg-gradient-to-r 
             [&>div]:from-blue-500 
             [&>div]:to-cyan-500" />
              <div className="flex justify-between text-xs">
                <span>Water</span>
                <span>AED 22.80</span>
              </div>
              <Progress value={26} className="h-1.5 
             [&>div]:bg-gradient-to-r 
             [&>div]:from-blue-500 
             [&>div]:to-cyan-500" />
              <div className="flex justify-between text-xs">
                <span>Gas</span>
                <span>AED 19.50</span>
              </div>
              <Progress value={22} className="h-1.5 
             [&>div]:bg-gradient-to-r 
             [&>div]:from-blue-500 
             [&>div]:to-cyan-500" />
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 md:hidden z-50">
        <div className="flex justify-around py-3 px-4 max-w-md mx-auto">
          {[
            { icon: Home, label: "Home" },
            { icon: ChartBar, label: "Live Now" },
            { icon: Settings, label: "Summary" },
            { icon: Lightbulb, label: "Tips" },
            { icon: User2, label: "Settings" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} className="flex flex-col items-center gap-1">
              <Icon className="w-6 h-6" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}