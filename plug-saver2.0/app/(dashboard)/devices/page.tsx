"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Plus, Lamp, Speaker, Tv, Computer, Fan } from "lucide-react"
import { motion } from "framer-motion"

export default function DevicesPage() {
  const [devices, setDevices] = useState([
    { icon: Lamp, name: "Desk Lamp", room: "Office", power: "25W", isOn: false },
    { icon: Speaker, name: "Speakers", room: "Living Room", power: "12W", isOn: true },
    { icon: Tv, name: "Smart TV", room: "Living Room", power: "150W", isOn: false },
    { icon: Computer, name: "Desktop PC", room: "Office", power: "200W", isOn: true },
    { icon: Fan, name: "Ceiling Fan", room: "Bedroom", power: "60W", isOn: false },
  ])

  const toggleDevice = (index: number) => {
    setDevices(devices.map((device, i) => (i === index ? { ...device, isOn: !device.isOn } : device)))
  }

  const totalConsumption = devices.reduce((sum, device) => sum + (device.isOn ? Number.parseInt(device.power) : 0), 0)

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: "var(--gradient-devices)" }}>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Devices</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="gradient-card md:col-span-2 lg:col-span-3">
          <div className="flex justify-between mb-4">
            <div>
              <h2 className="text-sm text-gray-200">Energy Consumption</h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <Lamp className="w-5 h-5 mr-2 text-yellow-400" />
                  <div>
                    <p className="text-xs text-gray-300">Today</p>
                    <p className="font-bold">{totalConsumption}W</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Tv className="w-5 h-5 mr-2 text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-300">This Month</p>
                    <p className="font-bold">383.1 kWh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <section className="space-y-6 md:col-span-2 lg:col-span-3">
          <div>
            <h2 className="text-lg font-medium mb-4">Your Devices</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {devices.map(({ icon: Icon, name, room, power, isOn }, index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={`gradient-card p-4 transition-all duration-300 ${isOn ? "bg-blue-400/20" : ""}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Icon className={`w-6 h-6 ${isOn ? "text-blue-400" : "text-gray-400"}`} />
                        <div>
                          <p className="font-medium">{name}</p>
                          <p className="text-sm text-gray-300">{room}</p>
                        </div>
                      </div>
                      <Switch checked={isOn} onCheckedChange={() => toggleDevice(index)} />
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-300">{power}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: devices.length * 0.1 }}
                className="border-2 border-dashed border-white/20 rounded-2xl p-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors duration-300"
              >
                <Plus className="w-5 h-5" />
                Add Device
              </motion.button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Your Rooms</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Office", "Living Room", "Bedroom", "Kitchen"].map((room, index) => (
                <motion.div
                  key={room}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="gradient-card p-4 text-center transition-all duration-300 hover:scale-105">
                    <p className="font-medium">{room}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

