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
    <div className="min-h-screen p-6 md:p-10" style={{ background: "var(--gradient-home)" }}>
      <header className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-200 text-white">13th Dec, 2024</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Plug Saver</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-10 h-10 rounded-full p-0">
              <img src="/placeholder-user.jpg" alt="User" className="w-10 h-10 rounded-full" />
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

      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square max-w-[280px] mx-auto mb-8"
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

        <section className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">Top Active Devices</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8" >
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

        <section className="mb-20 md:mb-6">
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

        {/* Bottom Navigation - Mobile Only */}
        <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 md:hidden">
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
    </div>
  )
}