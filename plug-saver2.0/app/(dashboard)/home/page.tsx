"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tv, Monitor, Lamp, User, Settings, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [chartData, setChartData] = useState([
    { time: "5 PM", usage: 5 },
    { time: "6 PM", usage: 8 },
    { time: "7 PM", usage: 4 },
    { time: "8 PM", usage: 15 },
  ])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: "var(--gradient-home)" }}>
      <header className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-200">13th Dec, 2024</p>
          <h1 className="text-2xl md:text-3xl font-bold">Hello, User</h1>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="gradient-card md:col-span-2 lg:col-span-3">
          <h2 className="font-medium mb-4">Today's Power Consumption</h2>
          <div className="text-2xl font-bold mb-4">12.77 kWh</div>
          <div className="h-32 md:h-64 flex items-end justify-between gap-2">
            {chartData.map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-12 md:w-24 bg-blue-400/50 rounded-t-lg transition-all duration-500 ease-in-out hover:bg-blue-400"
                  style={{ height: `${item.usage * 8}px` }}
                />
                <span className="text-xs mt-2">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <section className="space-y-6 md:col-span-2 lg:col-span-3">
          <div>
            <h2 className="text-lg font-medium mb-4">Top Active Devices</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Tv, label: "TV", usage: "2.09 kWh" },
                { icon: Monitor, label: "PC", usage: "7.19 kWh" },
                { icon: Lamp, label: "Lamp", usage: "0.62 kWh" },
              ].map(({ icon: Icon, label, usage }) => (
                <Card key={label} className="gradient-card text-center p-4 transition-all duration-300 hover:scale-105">
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-gray-300">{usage}</p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Top Active Rooms</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Living Room", usage: "9.12 kWh" },
                { name: "Office", usage: "3.65 kWh" },
                { name: "Bedroom", usage: "2.33 kWh" },
                { name: "Kitchen", usage: "1.89 kWh" },
              ].map(({ name, usage }) => (
                <Card key={name} className="gradient-card p-4 transition-all duration-300 hover:scale-105">
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-gray-300">{usage}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

