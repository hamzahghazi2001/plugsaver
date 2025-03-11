"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Plus, Lamp, Speaker, Tv, Computer, Fan, Filter, Trash2, RefrigeratorIcon } from "lucide-react"
import { motion } from "framer-motion"

// New imports for dialogs, forms, tabs and alerts
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useForm } from "react-hook-form"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

// Additional icons used in the AddDeviceFlow
import {
  Loader2,
  Plug,
  RotateCw,
  Search,
  Scan,
  Wifi,
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
} from "lucide-react"

export default function DevicesPage() {
  // Use original devices as default data (with added id property)
  const [devices, setDevices] = useState([
    // { id: "1", icon: Lamp, name: "Desk Lamp", room: "Office", power: "25W", isOn: false },
    // { id: "2", icon: Speaker, name: "Speakers", room: "Living Room", power: "12W", isOn: true },
    // { id: "3", icon: Tv, name: "Smart TV", room: "Living Room", power: "150W", isOn: false },
    // { id: "4", icon: Computer, name: "Desktop PC", room: "Office", power: "200W", isOn: true },
    // { id: "5", icon: Fan, name: "Ceiling Fan", room: "Bedroom", power: "60W", isOn: false },
  ])
  const [rooms, setRooms] = useState(["Office", "Living Room", "Bedroom", "Kitchen"])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load rooms from localStorage on mount
  useEffect(() => {
    const savedRooms = localStorage.getItem("plugSaver_rooms")
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms))
    } else {
      localStorage.setItem("plugSaver_rooms", JSON.stringify(rooms))
    }
  }, [])

  // Filter devices by selected room if set
  const filteredDevices = selectedRoom ? devices.filter((device) => device.room === selectedRoom) : devices

  // Toggle a device based on its id
  const toggleDevice = (deviceId) => {
    setDevices(devices.map((device) => (device.id === deviceId ? { ...device, isOn: !device.isOn } : device)))
  }

  // Calculate total energy consumption (for devices that are on)
  const totalConsumption = devices.reduce((sum, device) => sum + (device.isOn ? Number.parseInt(device.power) : 0), 0)

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: "var(--gradient-devices)" }}>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Devices</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Energy Consumption Card */}
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
                    <p className="font-bold">0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <section className="space-y-6 md:col-span-2 lg:col-span-3">
          {/* Devices Section */}
          <div>
            <h2 className="text-lg font-medium mb-4">Your Devices</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDevices.length > 0 ? (
                filteredDevices.map(({ id, icon, name, room, power, isOn, needsRoomAssignment }, index) => {
                  const Icon = icon
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        className={`gradient-card p-4 transition-all duration-300 ${isOn ? "" : "bg-white/30"} ${needsRoomAssignment ? "border-2 border-yellow-500" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Icon className={`w-6 h-6 ${isOn ? "text-blue-400" : "text-gray-400"}`} />
                            <div>
                              <div className="flex items-center">
                                <p className="font-medium">{name}</p>
                                {needsRoomAssignment && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 bg-yellow-500/20 text-yellow-300 border-yellow-500"
                                  >
                                    Needs Room
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-300">{room || "No Room Assigned"}</p>
                            </div>
                          </div>
                          <Switch checked={isOn} onCheckedChange={() => toggleDevice(id)} />
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-300">{power}</p>
                        </div>
                        {needsRoomAssignment && (
                          <div className="mt-2 pt-2 border-t border-gray-700">
                            <Select
                              onValueChange={(value) => {
                                const updatedDevices = devices.map((d) =>
                                  d.id === id ? { ...d, room: value, needsRoomAssignment: false } : d,
                                )
                                setDevices(updatedDevices)
                              }}
                            >
                              <SelectTrigger className="w-full bg-yellow-500/10 border-yellow-500/30">
                                <SelectValue placeholder="Assign to a room" />
                              </SelectTrigger>
                              <SelectContent>
                                {rooms.map((room) => (
                                  <SelectItem key={room} value={room}>
                                    {room}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-8">
                  {selectedRoom ? (
                    <>
                      <p className="text-gray-300 mb-4">No devices in {selectedRoom}.</p>
                      <p className="text-gray-400 text-sm">Add a device and assign it to this room.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-white-300 mb-4">You haven't added any devices yet.</p>
                      <p className="text-white-400 text-sm">
                        Add your first device to start monitoring energy consumption.
                      </p>
                    </>
                  )}
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: devices.length * 0.1 }}
              >
                <AddDeviceFlow onDeviceAdded={(newDevice) => setDevices([...devices, newDevice])} />
              </motion.div>
            </div>
          </div>

          {/* Rooms Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Your Rooms</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-black border-white/20 hover:bg-none/10">
                    <Plus className="w-4 h-4 mr-1" /> Add Room
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                    <DialogDescription>Enter a name for your new room.</DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.target)
                      const roomName = formData.get("roomName")
                      if (roomName && !rooms.includes(roomName)) {
                        const newRooms = [...rooms, roomName]
                        setRooms(newRooms)
                        localStorage.setItem("plugSaver_rooms", JSON.stringify(newRooms))
                        e.target.reset()
                      }
                    }}
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="roomName">Room Name</Label>
                        <Input id="roomName" name="roomName" placeholder="e.g. Living Room" required />
                      </div>
                      <Button type="submit" className="w-full">
                        Add Room
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-300">Filter by room:</span>
                <Button
                  variant={selectedRoom === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRoom(null)}
                  className={selectedRoom === null ? "" : "text-white border-white/20 hover:bg-white/10 bg-gray-800/50"}
                >
                  All
                </Button>
                {rooms.map((room) => (
                  <Button
                    key={room}
                    variant={selectedRoom === room ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRoom(room)}
                    className={
                      selectedRoom === room ? "" : "text-white border-white/20 hover:bg-white/10 bg-gray-800/50"
                    }
                  >
                    {room}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {rooms.map((room, index) => {
                const deviceCount = devices.filter((device) => device.room === room).length
                return (
                  <motion.div
                    key={room}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      className={`gradient-card p-4 text-center transition-all duration-300 hover:scale-105 ${
                        selectedRoom === room ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <p className="font-medium">{room}</p>
                        <p className="text-xs text-gray-300">
                          {deviceCount} device{deviceCount !== 1 ? "s" : ""}
                        </p>
                        <div className="flex mt-2 space-x-2">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedRoom(room)}>
                            <Filter className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete this room?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {deviceCount > 0 ? (
                                    <>
                                      This room has {deviceCount} device{deviceCount !== 1 ? "s" : ""} assigned to it.
                                      If you delete this room, these devices will need to be manually reassigned.
                                    </>
                                  ) : (
                                    "This action cannot be undone."
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    const newRooms = rooms.filter((r) => r !== room)
                                    setRooms(newRooms)
                                    localStorage.setItem("plugSaver_rooms", JSON.stringify(newRooms))
                                    const updatedDevices = devices.map((device) =>
                                      device.room === room
                                        ? { ...device, room: null, needsRoomAssignment: true }
                                        : device,
                                    )
                                    setDevices(updatedDevices)
                                    if (selectedRoom === room) {
                                      setSelectedRoom(null)
                                    }
                                  }}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

// The multi–step Add Device flow with scanning, device info and scheduling
function AddDeviceFlow({ onDeviceAdded }) {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [foundDevices, setFoundDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [error, setError] = useState(null)
  const [availableRooms, setAvailableRooms] = useState([])
  const [deviceInfo, setDeviceInfo] = useState({
    name: "",
    type: "",
    room: "",
    icon: Lamp,
    power: "0W",
    isOn: false,
    consumptionLimit: 100,
    schedule: {
      enabled: false,
      startTime: "08:00",
      endTime: "22:00",
      days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },
  })

  useEffect(() => {
    const savedRooms = localStorage.getItem("plugSaver_rooms")
    if (savedRooms) {
      setAvailableRooms(JSON.parse(savedRooms))
    } else {
      const defaultRooms = [
        "Living Room",
        "Kitchen",
        "Bedroom",
        "Office",
        "Bathroom",
        "Dining Room",
        "Garage",
        "Basement",
      ]
      setAvailableRooms(defaultRooms)
      localStorage.setItem("plugSaver_rooms", JSON.stringify(defaultRooms))
    }
  }, [open])

  const deviceIcons = [
    { icon: Lamp, name: "Desk Lamp" },
    { icon: Lightbulb, name: "Light Bulb" },
    { icon: LampFloor, name: "Floor Lamp" },
    { icon: LampDesk, name: "Table Lamp" },
    { icon: Tv, name: "TV" },
    { icon: Radio, name: "Radio" },
    { icon: Speaker, name: "Speaker" },
    { icon: Headphones, name: "Headphones" },
    { icon: Gamepad2, name: "Game Console" },
    { icon: MonitorSmartphone, name: "Monitor" },
    { icon: Music2, name: "Sound System" },
    { icon: Projector, name: "Projector" },
    { icon: RefrigeratorIcon, name: "Refrigerator" },
    { icon: Microwave, name: "Microwave" },
    { icon: Coffee, name: "Coffee Maker" },
    { icon: Utensils, name: "Toaster" },
    { icon: Soup, name: "Slow Cooker" },
    { icon: Oven, name: "Oven" },
    { icon: Stove, name: "Stove" },
    { icon: Blender, name: "Blender" },
    { icon: Sandwich, name: "Sandwich Maker" },
    { icon: Beef, name: "Air Fryer" },
    { icon: Salad, name: "Food Processor" },
    { icon: Computer, name: "Computer" },
    { icon: Laptop, name: "Laptop" },
    { icon: Printer, name: "Printer" },
    { icon: Scan, name: "Scanner" },
    { icon: Router, name: "Router" },
    { icon: WifiIcon, name: "WiFi Extender" },
    { icon: Cpu, name: "CPU/Server" },
    { icon: HardDrive, name: "External Drive" },
    { icon: Fan, name: "Fan" },
    { icon: Wind, name: "Air Purifier" },
    { icon: Thermometer, name: "Thermostat" },
    { icon: Snowflake, name: "Air Conditioner" },
    { icon: Flame, name: "Heater" },
    { icon: Droplets, name: "Humidifier" },
    { icon: Shower, name: "Water Heater" },
    { icon: Scissors, name: "Hair Dryer" },
    { icon: Toothbrush, name: "Electric Toothbrush" },
    { icon: Plug, name: "Smart Plug" },
    { icon: Lock, name: "Smart Lock" },
    { icon: BellRing, name: "Doorbell" },
    { icon: Camera, name: "Security Camera" },
    { icon: Siren, name: "Alarm System" },
    { icon: BatteryCharging, name: "Battery Charger" },
    { icon: Wrench, name: "Power Tool" },
    { icon: Dumbbell, name: "Exercise Equipment" },
  ]

  const deviceTypeOptions = [
    "Lighting",
    "Entertainment",
    "Kitchen Appliance",
    "Office Equipment",
    "Climate Control",
    "Other",
  ]

  const form = useForm({
    defaultValues: {
      name: "",
      type: "",
      room: "",
      icon: "Lamp",
      consumptionLimit: 100,
      scheduleEnabled: false,
      startTime: "08:00",
      endTime: "22:00",
      days: [],
    },
  })

  const startScan = () => {
    setIsScanning(true)
    setError(null)
    setTimeout(() => {
      const randomDevices = [
        {
          id: "SP" + Math.floor(Math.random() * 10000),
          name: "Smart Plug " + Math.floor(Math.random() * 100),
          status: "Available",
        },
        {
          id: "SP" + Math.floor(Math.random() * 10000),
          name: "Smart Plug " + Math.floor(Math.random() * 100),
          status: "Available",
        },
        {
          id: "SP" + Math.floor(Math.random() * 10000),
          name: "Smart Plug " + Math.floor(Math.random() * 100),
          status: "Already paired",
        },
      ]
      setFoundDevices(randomDevices)
      setIsScanning(false)
    }, 3000)
  }

  const selectDevice = (device) => {
    if (device.status === "Already paired") {
      setError("This device is already paired with your account.")
      return
    }
    setSelectedDevice(device)
    setCurrentStep(1)
  }

  const onSubmit = (data) => {
    const selectedIconObj = deviceIcons.find((i) => i.name === data.icon) || deviceIcons[0]
    const newDevice = {
      id: selectedDevice.id || `device_${Date.now()}`,
      name: data.name,
      room: data.room,
      icon: selectedIconObj.icon,
      power: Math.floor(Math.random() * 200) + "W",
      isOn: false,
      type: data.type,
      consumptionLimit: data.consumptionLimit,
      schedule: {
        enabled: data.scheduleEnabled,
        startTime: data.startTime,
        endTime: data.endTime,
        days: data.days,
      },
    }
    if (Math.random() < 0.1) {
      setError("Device registration failed. Please check your connection and try again.")
      return
    }
    onDeviceAdded(newDevice)
    setOpen(false)
    setCurrentStep(0)
    setSelectedDevice(null)
    form.reset()
  }

  const steps = [
    { title: "Discover Device", description: "Scan for nearby smart plugs or scan a QR code" },
    { title: "Device Information", description: "Name and categorize your device" },
    { title: "Energy Settings", description: "Set consumption limits and schedules" },
    { title: "Confirmation", description: "Review and complete setup" },
  ]

  return (
    <>
      <Card
        className="gradient-card p-4 cursor-pointer hover:bg-white/20 transition-all duration-300"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center justify-center gap-2 h-full min-h-[100px]">
          <Plus className="w-5 h-5" />
          <span>Add Device</span>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Device</DialogTitle>
            <DialogDescription className="text-gray-300">{steps[currentStep].description}</DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${index === currentStep ? "text-pink-500" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    index === currentStep
                      ? "bg-pink-500 text-white"
                      : index < currentStep
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index < currentStep ? index + 1 : index + 1}
                </div>
                <span className="text-xs text-center">{step.title}</span>
              </div>
            ))}
          </div>

          {currentStep === 0 && (
            <div className="space-y-4 text-white">
              <Tabs defaultValue="scan">
                <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                  <TabsTrigger
                    value="scan"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
                  >
                    Scan Nearby
                  </TabsTrigger>
                  <TabsTrigger
                    value="qr"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
                  >
                    Scan QR Code
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="scan" className="space-y-4">
                  <div className="flex justify-center my-4">
                    {isScanning ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-2" />
                        <p className="text-white">Scanning for devices...</p>
                      </div>
                    ) : foundDevices.length > 0 ? (
                      <div className="w-full space-y-2">
                        <p className="text-sm text-black mb-2">Select a device to pair:</p>
                        {foundDevices.map((device) => (
                          <div
                            key={device.id}
                            onClick={() => selectDevice(device)}
                            className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer ${
                              device.status === "Already paired"
                                ? "border-yellow-500 bg-yellow-50/10"
                                : "border-blue-200 bg-blue-50/10 hover:bg-blue-100/20"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Plug
                                className={device.status === "Already paired" ? "text-yellow-500" : "text-blue-500"}
                              />
                              <div>
                                <p className="font-medium text-white">{device.name}</p>
                                <p className="text-xs text-gray-300">ID: {device.id}</p>
                              </div>
                            </div>
                            <span
                              className={`text-sm ${device.status === "Already paired" ? "text-yellow-500" : "text-green-500"}`}
                            >
                              {device.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Wifi className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-black mb-4">No devices found</p>
                      </div>
                    )}
                  </div>
                  <Button onClick={startScan} disabled={isScanning} className="w-full">
                    {isScanning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning...
                      </>
                    ) : foundDevices.length > 0 ? (
                      <>
                        <RotateCw className="mr-2 h-4 w-4" /> Scan Again
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" /> Start Scanning
                      </>
                    )}
                  </Button>
                </TabsContent>
                <TabsContent value="qr">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Scan className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-center text-black mb-4">
                      Position the QR code on your smart plug within the camera view
                    </p>
                    <Button
                      onClick={() => {
                        setIsScanning(true)
                        setTimeout(() => {
                          const randomDevice = {
                            id: "SP" + Math.floor(Math.random() * 10000),
                            name: "Smart Plug " + Math.floor(Math.random() * 100),
                            status: "Available",
                          }
                          setSelectedDevice(randomDevice)
                          setIsScanning(false)
                          setCurrentStep(1)
                        }, 2000)
                      }}
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning...
                        </>
                      ) : (
                        <>
                          <Scan className="mr-2 h-4 w-4" /> Scan QR Code
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {currentStep === 1 && (
            <Form {...form}>
              <form className="space-y-4 text-gray-800">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Device name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Device Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Living Room Lamp"
                          className="text-gray-800 bg-white border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-600">Give your device a unique name</FormDescription>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  rules={{ required: "Device type is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Device Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                            <SelectValue placeholder="Select device type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {deviceTypeOptions.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="room"
                  rules={{ required: "Room is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Room</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                            <SelectValue placeholder="Select room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableRooms.map((room) => (
                            <SelectItem key={room} value={room}>
                              {room}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  rules={{ required: "Icon is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Device Icon</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 p-2 border border-gray-600 rounded-md max-h-[300px] overflow-y-auto bg-gray-800/50">
                          {deviceIcons.map((iconObj) => {
                            const IconComponent = iconObj.icon
                            return (
                              <div
                                key={iconObj.name}
                                onClick={() => field.onChange(iconObj.name)}
                                className={`p-2 rounded-md cursor-pointer flex flex-col items-center ${
                                  field.value === iconObj.name
                                    ? "bg-blue-900/70 border border-blue-400 text-white"
                                    : "bg-gray-800/70 border border-gray-700 text-gray-200 hover:bg-gray-700/70 hover:border-gray-500"
                                }`}
                              >
                                <IconComponent className="w-6 h-6 mb-1 text-white" />
                                <span className="text-xs text-center truncate w-full font-medium">{iconObj.name}</span>
                              </div>
                            )
                          })}
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-600">
                        Select the icon that best represents your device
                      </FormDescription>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(0)}>
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      const nameValid = form.trigger("name")
                      const typeValid = form.trigger("type")
                      const roomValid = form.trigger("room")
                      const iconValid = form.trigger("icon")
                      if (nameValid && typeValid && roomValid && iconValid) {
                        setCurrentStep(2)
                      }
                    }}
                  >
                    Next
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {currentStep === 2 && (
            <Form {...form}>
              <form className="space-y-4 text-gray-800">
                <FormField
                  control={form.control}
                  name="consumptionLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Energy Consumption Limit (kWh/month)</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="px-1">
                            <Slider
                              min={0}
                              max={500}
                              step={10}
                              value={[field.value]}
                              onValueChange={(values) => field.onChange(values[0])}
                              className="bg-gray-200"
                            />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-600">0 kWh</span>
                            <span className="text-sm font-medium bg-gray-700 text-white px-2 py-1 rounded-md">
                              {field.value} kWh
                            </span>
                            <span className="text-xs text-gray-600">500 kWh</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-600">
                        You'll receive alerts when this device exceeds the limit
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scheduleEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-gray-800 font-medium">Enable Scheduled Operation</FormLabel>
                        <FormDescription className="text-gray-600">
                          Automatically turn the device on and off at specific times
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("scheduleEnabled") && (
                  <div className="space-y-4 p-4 border rounded-md">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-800 font-medium">Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" className="text-gray-800 bg-white border-gray-300" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-800 font-medium">End Time</FormLabel>
                            <FormControl>
                              <Input type="time" className="text-gray-800 bg-white border-gray-300" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="days"
                      render={({ field }) => (
                        <FormItem>
                          <div className="mb-2">
                            <FormLabel className="text-gray-800 font-medium">Active Days</FormLabel>
                            <FormDescription className="text-gray-600">
                              Select days when the schedule should be active
                            </FormDescription>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                              (day) => {
                                const dayLower = day.toLowerCase()
                                return (
                                  <div
                                    key={day}
                                    className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                                      field.value?.includes(dayLower)
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200/20 text-gray-500"
                                    }`}
                                    onClick={() => {
                                      const updatedDays = field.value?.includes(dayLower)
                                        ? field.value.filter((d) => d !== dayLower)
                                        : [...(field.value || []), dayLower]
                                      field.onChange(updatedDays)
                                    }}
                                  >
                                    {day.substring(0, 3)}
                                  </div>
                                )
                              },
                            )}
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep(3)}>Next</Button>
                </div>
              </form>
            </Form>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 text-gray-800">
              <div className="border rounded-md p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Device Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium text-gray-800">{form.watch("name") || "Not set"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">Type</p>
                    <p className="font-medium text-gray-800">{form.watch("type") || "Not set"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">Room</p>
                    <p className="font-medium text-gray-800">{form.watch("room") || "Not set"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">Device ID</p>
                    <p className="font-medium text-gray-800">{selectedDevice?.id || "Unknown"}</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-3">
                <h3 className="font-medium text-gray-800">Energy Settings</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-500">Consumption Limit</p>
                    <p className="font-medium text-gray-800">{form.watch("consumptionLimit")} kWh/month</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">Scheduled Operation</p>
                    <p className="font-medium text-gray-800">
                      {form.watch("scheduleEnabled") ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  {form.watch("scheduleEnabled") && (
                    <>
                      <div className="space-y-1">
                        <p className="text-gray-500">Schedule Time</p>
                        <p className="font-medium text-gray-800">
                          {form.watch("startTime")} - {form.watch("endTime")}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-500">Active Days</p>
                        <p className="font-medium text-gray-800">
                          {form.watch("days")?.length
                            ? form
                                .watch("days")
                                .map((d) => d.substring(0, 3))
                                .join(", ")
                            : "None selected"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Alert className="bg-blue-500/10 border-blue-500 text-blue-700">
                <AlertTitle>Energy Saving Recommendation</AlertTitle>
                <AlertDescription>
                  Based on your device type, we recommend setting a consumption limit of 80 kWh/month and scheduling it
                  to turn off during peak hours (6 PM - 10 PM) to maximize energy savings.
                </AlertDescription>
              </Alert>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button onClick={() => onSubmit(form.getValues())}>Complete Setup</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

