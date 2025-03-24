"use client"
import jsQR from "jsqr"
import QrScanner from "react-qr-scanner"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Home,
  Zap,
  Plus,
  Lamp,
  Speaker,
  Tv,
  Computer,
  Fan,
  Filter,
  Trash2,
  RefrigeratorIcon,
  Settings,
  Sun,
  Moon,
} from "lucide-react"
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

// New imports for dialogs, forms, tabs and alerts

// Add this custom hook at the top of the file, after the imports but before the component definitions

// Custom hook to manage theme styles
const useThemeStyles = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDarkMode = localStorage.getItem("darkMode")
      setIsDarkMode(storedDarkMode === "true")
    }
  }, [])

  // Apply dark mode class to the document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", isDarkMode.toString())
    }
  }, [isDarkMode])

  // Define different styles for light and dark modes
  const styles = {
    // Background styles
    pageBackground: isDarkMode
      ? "radial-gradient(circle, rgba(87,119,94,1) 0%, rgba(79,74,116,1) 100%)"
      : "linear-gradient(0deg, rgba(113,211,240,1) 0%, rgba(45,122,253,1) 100%)",

    // Rest of the styles remain unchanged
    cardStyle: isDarkMode
      ? "bg-gray-800 text-gray-100 shadow-lg"
      : "gradient-card p-5 overflow-hidden relative bg-white/20 backdrop-blur-md border border-white/30 shadow-xl hover:shadow-2xl",

    // Device card styles
    deviceCardStyle: (isActive: boolean, needsRoomAssignment: boolean) => {
      const baseStyle = isDarkMode
        ? `gradient-card p-0 overflow-hidden transition-all duration-300 hover:shadow-xl group backdrop-blur-md bg-gray-800/80 text-gray-100 border border-gray-700 ${
            needsRoomAssignment ? "border-2 border-yellow-500" : ""
          }`
        : `gradient-card p-0 overflow-hidden transition-all duration-300 hover:shadow-xl group backdrop-blur-md bg-white/20 border border-white/30 ${
            needsRoomAssignment ? "border-2 border-yellow-500" : ""
          }`

      const headerStyle = isDarkMode
        ? isActive
          ? "bg-gray-700/90 backdrop-blur-md"
          : "bg-gray-800/90 backdrop-blur-md"
        : isActive
          ? "bg-blue-50/50 border-blue-200/50 backdrop-blur-md"
          : "bg-white/30 border-white/30 backdrop-blur-md"

      return { baseStyle, headerStyle }
    },

    // Room card styles
    roomCardStyle: (isSelected: boolean) =>
      isDarkMode
        ? `gradient-card p-5 text-center transition-all duration-300 hover:shadow-xl bg-gray-800 text-gray-100 border border-gray-700 ${
            isSelected ? "ring-2 ring-blue-500 bg-gradient-to-br from-blue-900/30 to-blue-800/10" : ""
          }`
        : `gradient-card p-5 text-center transition-all duration-300 hover:shadow-xl ${
            isSelected
              ? "ring-2 ring-blue-500 bg-gradient-to-br from-blue-100/50 to-blue-50/30"
              : "bg-white/30 backdrop-blur-md border border-white/30"
          }`,

    // Add device card style
    addDeviceCardStyle: isDarkMode
      ? "gradient-card p-5 h-64 cursor-pointer transition-all duration-300 border border-dashed border-white/20 hover:shadow-2xl group bg-gray-800 text-gray-100 border border-gray-700"
      : "gradient-card p-5 h-64 cursor-pointer transition-all duration-300 border border-dashed border-white/30 bg-white/20 backdrop-blur-md hover:shadow-2xl group",

    // Section container style
    sectionStyle: isDarkMode
      ? "bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
      : "bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/30",
  }

  return { isDarkMode, setIsDarkMode, styles }
}

// Add these interfaces at the top of the file, after the imports
// Change the Device interface to use React.ElementType for the icon property
interface Device {
  id: number
  name: string
  room: string | null
  icon: React.ElementType
  power: string
  isOn: boolean
  type?: string
  needsRoomAssignment?: boolean
  consumptionLimit?: number
  schedule?: {
    enabled: boolean
    startTime: string
    endTime: string
    days: string[]
  }
}

// Also update the DeviceIcon interface
interface DeviceIcon {
  icon: React.ElementType
  name: string
}

interface Room {
  room_id: number
  room_name: string
  household_code: string | null
}

interface FoundDevice {
  id: number
  name: string
  status: "Available" | "Paired"
}

// Map icon names to components
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

// Update the DevicesPage component
export default function DevicesPage() {
  // Add the theme hook at the top of the component
  const { isDarkMode, setIsDarkMode, styles } = useThemeStyles()

  const [editDeviceDialogOpen, setEditDeviceDialogOpen] = useState<boolean>(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [roomId, setRoomId] = useState<number | null>(null)
  const [deviceId, setDeviceId] = useState<number | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<FoundDevice | null>(null)
  const [currentEditingDevice, setCurrentEditingDevice] = useState<Device | null>(null)
  // Update the useState calls in DevicesPage component
  const [devices, setDevices] = useState<Device[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [householdCode, setHouseholdCode] = useState<string | null>(null) // Hardcoded for now
  const [roomName, setRoomName] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [addDeviceDialogOpen, setAddDeviceDialogOpen] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const deviceIcons: DeviceIcon[] = [
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

  const form = useForm({
    defaultValues: {
      name: "",
      type: "",
      room: "",
      icon: "Desk Lamp",
      consumptionLimit: 100,
      scheduleEnabled: false,
      startTime: "08:00",
      endTime: "22:00",
      days: [] as string[],
    },
  })

  // Add this CSS animation for subtle pulse effect
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
    @keyframes pulse-subtle {
      0% { opacity: 1; }
      50% { opacity: 0.8; }
      100% { opacity: 1; }
    }
    .animate-pulse-subtle {
      animation: pulse-subtle 2s infinite ease-in-out;
    }
  `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Add this CSS animation for slow pulse effect
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
    @keyframes pulse-slow {
      0% { opacity: 0.5; }
      50% { opacity: 0.3; }
      100% { opacity: 0.5; }
    }
    .animate-pulse-slow {
      animation: pulse-slow 4s infinite ease-in-out;
    }
  `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id")
    const storedEmail = localStorage.getItem("email")
    const storedHouseholdCode = localStorage.getItem("household_code")

    if (storedUserId) {
      setUserId(Number(storedUserId))
    } else {
      router.push("/login")
    }

    if (storedHouseholdCode) {
      setHouseholdCode(storedHouseholdCode)
    } else if (storedEmail) {
      setHouseholdCode(storedEmail)
    }
  }, [router])

  // Load rooms from localStorage on mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchRooms()
      await fetchDevices()
    }
    if (userId && householdCode) {
      fetchData()
    }
  }, [userId, householdCode])

  // Fetch rooms from the backend
  const fetchRooms = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/auth/rooms?household_code=${householdCode}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.rooms) {
        // Ensure that each room has a room_id property
        const roomsWithId = data.rooms.map((room: any) => {
          if (!room.room_id) {
            console.error("Room is missing room_id:", room)
          }
          return room
        })

        setRooms(roomsWithId)
        localStorage.setItem("plugSaver_rooms", JSON.stringify(data.rooms.map((r: Room) => r.room_name)))
      } else {
        console.error("Failed to fetch rooms:", data.message)
      }
    } catch (error) {
      console.error("Error fetching rooms:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch devices from the backend
  const fetchDevices = async () => {
    console.log("Fetching devices...")
    try {
      setIsLoading(true) // Ensure this is correctly set
      const response = await fetch(`/api/auth/devices?household_code=${householdCode}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.devices) {
        // Transform backend device data to match our frontend Device interface
        console.log("user id:", userId) // Log the fetched devices
        const transformedDevices = await Promise.all(
          data.devices.map(async (device: any) => {
            let roomName = "Unknown Room" // Default room name

            // Fetch the room name if room_id is available
            console.log(" Room ID:", device.room_id) // Log the room ID
            if (device.room_id) {
              try {
                const roomResponse = await fetch(`/api/auth/getroomname?room_id=${encodeURIComponent(device.room_id)}`)
                const roomData = await roomResponse.json()
                if (roomData.success) {
                  roomName = roomData.room_name
                }
              } catch (err) {
                console.error("Error fetching room name:", err)
              }
            }

            // Get the icon component based on the icon name or use a default
            let iconComponent: React.ElementType = Plug // Default icon
            if (typeof device.icon === "string") {
              try {
                // Parse the JSON string to get the icon name
                const iconData = JSON.parse(device.icon)
                const iconName = iconData.name // Extract the icon name

                // Find the corresponding icon component from the deviceIcons array
                const iconObj = deviceIcons.find((di) => di.name === iconName)
                if (iconObj) {
                  iconComponent = iconObj.icon // Use the found icon
                }
              } catch (error) {
                console.error("Error parsing icon JSON:", error)
              }
            }

            let activeDays = []
            if (typeof device.active_days === "string") {
              activeDays = device.active_days.split(",")
            } else if (Array.isArray(device.active_days)) {
              activeDays = device.active_days
            } else {
              activeDays = []
            }

            localStorage.setItem("device_id", device.device_id)
            console.log("Room Name:", roomName) // Log the room name

            return {
              id: device.device_id,
              name: device.device_name,
              room: roomName, // Use the fetched room name
              icon: iconComponent,
              power: device.power || "0W",
              isOn: device.isOn === "TRUE" || device.isOn === true,
              type: device.device_category,
              needsRoomAssignment: device.room_id === null || device.room_id === undefined,
              consumptionLimit: Number.parseInt(device.consumptionLimit) || 100,
              schedule: {
                enabled: device.schedule?.enabled || false,
                startTime: device.active_time_start || "08:00",
                endTime: device.active_time_end || "22:00",
                days: activeDays,
              },
            }
          }),
        )

        console.log("Transformed Devices:", transformedDevices) // Log transformed devices
        setDevices(transformedDevices)
      } else {
        console.error("Failed to fetch devices:", data.message)
      }
    } catch (error) {
      console.error("Error fetching devices:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Add a new device
  const addDevice = (newDevice: Device) => {
    setDevices([...devices, newDevice])
  }
  useEffect(() => {
    const storedDeviceId = localStorage.getItem("device_id")
    if (storedDeviceId) {
      setDeviceId(Number(storedDeviceId))
    }
  }, [])

  const [errorMessages, setErrorMessages] = useState<Record<number, string>>({})

  // Remove a device
  const removeDevice = async (deviceId: number) => {
    try {
      setIsLoading(true)

      console.log("Sending DELETE request with the following data:")
      console.log("Device ID:", deviceId)
      console.log("Household Code:", householdCode)
      console.log("User ID:", userId)

      const response = await fetch(`/api/auth/devices`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_id: deviceId,
          household_code: householdCode,
          user_id: userId,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.sucess) {
        setErrorMessages((prev) => ({
          ...prev,
          [deviceId]: data.message || "Failed to delete device.",
        }))
        return
      }

      console.log("Backend response:", data)

      if (data.success) {
        // Remove the device from our devices state
        setDevices(devices.filter((device) => device.id !== deviceId))
        setErrorMessages((prev) => {
          const newErrors = { ...prev }
          delete newErrors[deviceId] // Remove the error message for this device
          return newErrors
        })
      } else {
        console.error("Failed to remove device:", data.message)
        setError(data.message)
      }
    } catch (error) {
      console.error("Error removing device:", error)
      setErrorMessages((prev) => ({
        ...prev,
        [deviceId]: "An error occurred while deleting the device.",
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle device on/off state
  const toggleDevice = async (deviceId: number) => {
    const device = devices.find((d) => d.id === deviceId)
    if (!device) return

    const newIsOn = !device.isOn
    let newPower = device.power

    if (newIsOn) {
      // Define power ranges for different device icons (values in Watts)
      const iconPowerRanges: Record<string, [number, number]> = {
        "Desk Lamp": [5, 25],
        "Light Bulb": [3, 15],
        "Floor Lamp": [10, 30],
        "Table Lamp": [5, 25],
        TV: [50, 150],
        Radio: [10, 50],
        Speaker: [5, 20],
        Headphones: [1, 5],
        "Game Console": [70, 200],
        Monitor: [20, 60],
        "Sound System": [20, 100],
        Projector: [100, 300],
        Refrigerator: [100, 250],
        Microwave: [70, 120],
        "Coffee Maker": [80, 150],
        Toaster: [80, 150],
        "Slow Cooker": [200, 300],
        Oven: [100, 300],
        Stove: [1000, 3000],
        Blender: [300, 700],
        "Sandwich Maker": [500, 800],
        "Air Fryer": [80, 150],
        "Food Processor": [200, 500],
        Computer: [150, 300],
        Laptop: [50, 100],
        Printer: [20, 50],
        Scanner: [20, 50],
        Router: [10, 30],
        "WiFi Extender": [5, 15],
        "CPU/Server": [200, 500],
        "External Drive": [10, 30],
        Fan: [50, 100],
        "Air Purifier": [30, 80],
        Thermostat: [5, 15],
        "Air Conditioner": [700, 1000],
        Heater: [800, 2000],
        Humidifier: [30, 70],
        "Water Heater": [3000, 4500],
        "Hair Dryer": [120, 187],
        "Electric Toothbrush": [2, 5],
        "Smart Plug": [5, 15],
        "Smart Lock": [2, 5],
        Doorbell: [1, 5],
        "Security Camera": [5, 15],
        "Alarm System": [10, 30],
        "Battery Charger": [10, 30],
        "Power Tool": [100, 300],
        "Exercise Equipment": [100, 300],
      }

      // Default range if icon is not recognized
      let minPower = 10
      let maxPower = 200

      // Find the matching icon in the deviceIcons array
      const matchingIcon = deviceIcons.find((iconObj) => iconObj.icon === device.icon)
      if (matchingIcon && iconPowerRanges[matchingIcon.name]) {
        ;[minPower, maxPower] = iconPowerRanges[matchingIcon.name]
      }

      // Generate a random power value within the determined range
      newPower = `${Math.floor(Math.random() * (maxPower - minPower + 1) + minPower)}W`
    } else {
      newPower = "0W"
    }

    // Store the power value in the device's data for consistency
    const updatedDevice = { ...device, isOn: newIsOn, power: newPower }

    // Optimistically update the UI
    setDevices(devices.map((d) => (d.id === deviceId ? updatedDevice : d)))

    try {
      // Send the updated state to the backend
      const response = await fetch(`/api/auth/toggledevice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId,
          isOn: newIsOn,
          power: newPower,
          householdCode,
          userId,
        }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        // Revert the optimistic update if the request fails
        setDevices(devices.map((d) => (d.id === deviceId ? { ...d, isOn: !newIsOn, power: device.power } : d)))
        setErrorMessages((prev) => ({
          ...prev,
          [deviceId]: data.message || "Failed to toggle.",
        }))
        return
      }
    } catch (error) {
      console.error("Error toggling device:", error)
      setError("An error occurred while toggling the device")
      // Revert the optimistic update if there's an error
      setDevices(devices.map((d) => (d.id === deviceId ? { ...d, isOn: !newIsOn, power: device.power } : d)))
    }
  }

  // Add a new room
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!roomName) {
      setError("Please enter a room name")
      return
    }

    try {
      setIsLoading(true)

      console.log("Sending POST request with the following data:")
      console.log("Room Name:", roomName)
      console.log("Household Code:", householdCode)

      const response = await fetch("/api/auth/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          room_name: roomName,
          household_code: householdCode,
        }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.detail || "Failed to add room.")
        return
      }

      console.log("Backend response:", data)

      if (data.success) {
        // Add the new room to our rooms state
        const newRoom = {
          room_id: data.room_id,
          room_name: roomName,
          household_code: householdCode,
        }

        setRooms([...rooms, newRoom])

        // Update localStorage
        localStorage.setItem("plugSaver_rooms", JSON.stringify([...rooms, newRoom].map((r) => r.room_name)))
        localStorage.setItem("room_id", data.room_id)

        // Reset the input field and close the dialog
        setRoomName("")
        setIsDialogOpen(false)
      } else {
        console.error("Failed to add room:", data.message)
        setError(data.message)
      }
    } catch (error) {
      console.error("Error adding room:", error)
      setError("An error occurred while adding the room")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const storedRoomId = localStorage.getItem("room_id")
    if (storedRoomId) {
      setRoomId(Number(storedRoomId))
    }
  }, [])

  // Delete a room
  const handleDeleteRoom = async (roomId: number, roomName: string) => {
    try {
      setIsLoading(true)

      const response = await fetch(`/api/auth/rooms`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_id: roomId,
          household_code: householdCode,
          user_id: userId,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setErrorMessages((prev) => ({
          ...prev,
          [roomId]: data.detail || "Failed to delete room.",
        }))
        return
        return
      }

      if (data.success) {
        // Remove the room from our rooms state
        setRooms(rooms.filter((r) => r.room_id !== roomId))
        setErrorMessages((prev) => {
          const newErrors = { ...prev }
          delete newErrors[roomId] // Remove the error message for this room
          return newErrors
        })

        // Update localStorage
        localStorage.setItem(
          "plugSaver_rooms",
          JSON.stringify(rooms.filter((r) => r.room_id !== roomId).map((r) => r.room_name)),
        )

        // Mark devices in this room as needing reassignment
        setDevices(
          devices.map((device) =>
            device.room === roomName ? { ...device, room: null, needsRoomAssignment: true } : device,
          ),
        )

        // Reset selected room if it was the deleted one
        if (selectedRoom === roomName) {
          setSelectedRoom(null)
        }
      } else {
        console.error("Failed to delete room:", data.message)
        setError(data.message)
      }
    } catch (error) {
      console.error("Error deleting room:", error)
      setErrorMessages((prev) => ({
        ...prev,
        [roomId]: "An error occurred while deleting the device.",
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Assign a device to a room
  const assignDeviceToRoom = async (deviceId: number, roomName: string) => {
    console.log(`Attempting to assign device ${deviceId} to room ${roomName}`) // Log the request

    const device = devices.find((d) => d.id === deviceId)
    if (!device) {
      console.error(`Device ${deviceId} not found in the local state`) // Log if device not found
      return
    }

    const room = rooms.find((r) => r.room_name === roomName)
    if (!room) {
      console.error(`Room ${roomName} not found in the local state`) // Log if room not found
      return
    }

    // Optimistically update the UI
    console.log("Optimistically updating the UI...") // Log optimistic update
    setDevices(devices.map((d) => (d.id === deviceId ? { ...d, room: roomName, needsRoomAssignment: false } : d)))

    try {
      console.log("Sending request to backend to assign device to room...") // Log the API call
      const response = await fetch(`/api/auth/roomassignment/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_id: deviceId,
          room_id: room.room_id, // Use room.room_id
        }),
      })

      console.log("Received response from backend:", response) // Log the response

      if (!response.ok) {
        console.error("Backend returned an error:", response.status, response.statusText) // Log the error
        // Revert the optimistic update if the request fails
        setDevices(
          devices.map((d) =>
            d.id === deviceId ? { ...d, room: device.room, needsRoomAssignment: device.needsRoomAssignment } : d,
          ),
        )
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Backend response data:", data) // Log the response data

      if (!data.success) {
        console.error("Failed to assign device to room:", data.message) // Log the failure
        // Revert the optimistic update if the request fails
        setDevices(
          devices.map((d) =>
            d.id === deviceId ? { ...d, room: device.room, needsRoomAssignment: device.needsRoomAssignment } : d,
          ),
        )
        setError(data.message)
      } else {
        console.log("Device assigned to room successfully") // Log success
        // Re-fetch devices to ensure the UI reflects the latest state
        await fetchDevices()
      }
    } catch (error) {
      console.error("Error assigning device to room:", error) // Log any exceptions
      setError("An error occurred while assigning the device to a room")
    }
  }

  // Filter devices by selected room
  const filteredDevices = selectedRoom ? devices.filter((device) => device.room === selectedRoom) : devices

  // Calculate total energy consumption (for devices that are on)
  const totalConsumption = devices.reduce((sum, device) => {
    if (!device.isOn) return sum
    const powerValue = device.power ? Number.parseInt(device.power) : 0
    return sum + (isNaN(powerValue) ? 0 : powerValue)
  }, 0)

  // Remove the redeclarations of isDarkMode, setIsDarkMode, and styles
  // const { isDarkMode, setIsDarkMode, styles } = useThemeStyles()

  // Loading state
  if (isLoading && devices.length === 0 && rooms.length === 0) {
    return (
      <div
        className="min-h-screen p-6 md:p-10 flex items-center justify-center"
        style={{ background: "var(--gradient-devices)" }}
      >
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-xl font-medium">Loading your devices...</p>
        </div>
      </div>
    )
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: styles.pageBackground }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Devices</h1>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full backdrop-blur-md bg-white/10 border-white/20"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 transition-all duration-300"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glass-like container effect */}
        {/* <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-xl -z-10 border border-white/10 shadow-xl"></div> */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 -z-20 rounded-xl"></div>
        {/* Energy Consumption Card */}
        <Card
          className={`${styles.cardStyle} md:col-span-2 lg:col-span-3 p-5 overflow-hidden relative ${
            isDarkMode
              ? "border-blue-500/20"
              : "bg-white/40 backdrop-blur-2xl border-2 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300"
          }`}
        >
          {/* Add frost overlay for light mode only */}
          {!isDarkMode && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-blue-50/30 -z-10 pointer-events-none"></div>
          )}
          {/* Enhanced decorative background elements */}
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl animate-pulse-slow"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl"></div>
          <div className="absolute right-1/4 bottom-0 w-24 h-24 rounded-full bg-cyan-500/5 blur-xl"></div>

          {/* Add a subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='1' fillRule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
            }}
          ></div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 relative">
            <div>
            <h2 className="text-xl font-semibold">Energy Consumption</h2>
              <p className="text-sm text-black-300">Current device usage</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mr-3 shadow-inner">
                  <Lamp className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-300 uppercase tracking-wide">Live</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold">{totalConsumption}</p>
                    <span className="text-sm ml-1 text-gray-400">W</span>
                  </div>
                </div>
             
              </div>
            </div>
          </div>

          {totalConsumption > 0 ? (
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <p className="text-xs text-gray-400 font-medium">Usage Level</p>
                <div className="flex items-center gap-1">
                  <p className="text-xs font-medium text-blue-300">
                    {Math.min(Math.round(totalConsumption / 10), 100)}%
                  </p>
                  {Math.min(Math.round(totalConsumption / 10), 100) > 70 && (
                    <span className="text-xs text-yellow-300 bg-yellow-500/20 px-1.5 py-0.5 rounded-full">High</span>
                  )}
                </div>
              </div>
              <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden p-0.5 backdrop-blur-sm border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 rounded-full transition-all duration-500 ease-in-out relative"
                  style={{ width: `${Math.min(totalConsumption / 10, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse-subtle"></div>
                </div>
              </div>

              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>0W</span>
                <span>250W</span>
                <span>500W</span>
                <span>750W</span>
                <span>1000W</span>
              </div>
            </div>
          ) : (
            <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <p className="text-white-300 mb-1">No active devices detected</p>
              <p className="text-xs text-white-400">Turn on devices to monitor energy consumption</p>
            </div>
          )}
          {/* Add a tip section at the bottom
          <div className="mt-4 pt-4 border-t border-white/10 flex items-start gap-2">
            <div className="bg-blue-500/20 p-1.5 rounded-lg">
              <Lightbulb className="w-4 h-4 text-blue-300" />
            </div>
            <p className="text-xs text-gray-300">
              <span className="text-blue-300 font-medium">Energy Tip:</span> Devices in standby mode can consume up to 10% of your home's energy. Consider using smart plugs to completely turn off devices when not in use.
            </p>
          </div> */}
        </Card>
        <section className="space-y-8 md:col-span-2 lg:col-span-3">
          {/* Devices Section - Updated Layout */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <Plug className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Devices</h2>
                  <p className="text-xs text-white-400 mt-0.5">Manage and monitor your connected devices</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedRoom === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRoom(null)}
                    className={
                      selectedRoom === null
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-xl transition-all duration-300"
                        : "bg-gray-700 hover:bg-gray-600 text-white border-transparent transition-all duration-300"
                    }
                    disabled={rooms.length === 0}
                  >
                    All Rooms
                  </Button>

                  {rooms.map((room) => (
                    <Button
                      key={room.room_id}
                      variant={selectedRoom === room.room_name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedRoom(room.room_name)}
                      className={
                        selectedRoom === room.room_name
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "text-white border-white/20 hover:bg-white/10 bg-gray-800/50"
                      }
                    >
                      {room.room_name}
                    </Button>
                  ))}
                </div>

                {rooms.length > 0 && (
                  <div className="relative hidden sm:block">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform duration-300 hover:scale-110" />
                    <Input
                      placeholder="Search devices..."
                      className="pl-10 bg-white/10 border border-white/20 text-white w-[180px] h-10 rounded-md transition-all duration-300 focus:w-[240px]"
                    />
                  </div>
                )}
              </div>
            </div>
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
                      <Card className={styles.deviceCardStyle(!!isOn, !!needsRoomAssignment).baseStyle}>
                        {/* Card Header with status indicator */}
                        <div
                          className={`p-4 ${isOn ? "bg-white-500/20" : "bg-gray-700/30"} transition-colors duration-300`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  isOn ? "bg-blue-500/40" : "bg-gray-600/40"
                                }`}
                              >
                                <Icon className={`w-5 h-5 ${isOn ? "text-blue-100" : "text-white-300"}`} />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">{name}</h3>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${isOn ? "bg-green-400 animate-pulse" : "bg-gray-500"}`}
                                  ></div>
                                  <p className="text-xs text-black-300">{isOn ? "Active" : "Inactive"}</p>
                                </div>
                              </div>
                            </div>
                            <Switch
                              checked={isOn}
                              onCheckedChange={() => toggleDevice(id)}
                              className={isOn ? "bg-blue-600" : ""}
                            />
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 space-y-3">
                          {/* Room information */}
                          <div className="flex items-center gap-2 text-sm">
                            <Home className="w-4 h-4 text-gray-400" />
                            <span className="text-white-300">{room || "No Room Assigned"}</span>
                            {needsRoomAssignment && (
                              <Badge
                                variant="outline"
                                className="ml-auto bg-yellow-500/20 text-yellow-300 border-yellow-500"
                              >
                                Needs Room
                              </Badge>
                            )}
                          </div>

                          {/* Power usage */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-700/30">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm">Power Usage</span>
                            </div>
                            <span className="text-sm font-medium">{power}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex justify-end gap-1 pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentEditingDevice(devices.find((d) => d.id === id)!)
                                setEditDeviceDialogOpen(true)
                              }}
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-full w-8 h-8 p-0"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDevice(id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full w-8 h-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <br></br>
                          {errorMessages[id] && (
                            <div className="text-red-500 bg-red-50 border border-red-200 rounded-md p-2 mt-2 text-sm">
                              {errorMessages[id]}
                            </div>
                          )}

                          {needsRoomAssignment && (
                            <div className="mt-2 pt-2 border-t border-gray-700/30">
                              <Select onValueChange={(value) => assignDeviceToRoom(id, value)}>
                                <SelectTrigger className="w-full bg-yellow-500/10 border-yellow-500/30">
                                  <SelectValue placeholder="Assign to a room" />
                                </SelectTrigger>
                                <SelectContent>
                                  {rooms.map((room) => (
                                    <SelectItem key={room.room_id} value={room.room_name}>
                                      {room.room_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-8 bg-white/5 rounded-xl border border-white/10">
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
              {rooms.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: filteredDevices.length * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className={styles.addDeviceCardStyle} onClick={() => setAddDeviceDialogOpen(true)}>
                    <div className="flex flex-col items-center justify-center h-full py-8">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 shadow-inner group-hover:shadow-2xl transition-all duration-300">
                        {/* Increased rotation angle and added smoother transition */}
                        <Plus className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-transform duration-500 group-hover:rotate-180" />
                      </div>
                      <span className="font-semibold text-xl">Add New Device</span>
                      <span className="text-sm text-white-400 mt-1 text-center">
                        Connect a smart device to start saving energy
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card className="gradient-card p-4 border border-dashed border-white/20">
                    <div className="text-center py-2">
                      <span className="block text-yellow-300 mb-2">⚠️ You need to create a room first</span>
                      <span className="text-sm text-gray-300">Create a room before adding devices</span>
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
          {/* Rooms Section */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -left-20 -top-20 w-40 h-40 rounded-full bg-purple-500/5 blur-3xl"></div>
            <div className="absolute -right-20 -bottom-20 w-40 h-40 rounded-full bg-blue-500/5 blur-3xl"></div>

            <div className="flex justify-between items-center mb-6 relative">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500/30 to-purple-600/30 p-2.5 rounded-full shadow-inner">
                  <Home className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Rooms</h2>
                  <p className="text-xs text-white-400 mt-0.5">Organize your devices by room</p>
                </div>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10">
                    <Plus className="w-4 h-4 mr-1" /> Add Room
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                    <DialogDescription>Enter a name for your new room.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddRoom}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="roomName">Room Name</Label>
                        <Input
                          id="roomName"
                          value={roomName}
                          onChange={(e) => setRoomName(e.target.value)}
                          placeholder="e.g. Living Room"
                          required
                        />
                      </div>
                      {error && (
                        <div className="text-red-500 bg-red-50 border border-red-200 rounded-md p-2 text-sm">
                          {error}
                        </div>
                      )}

                      <Button type="submit" className="w-full">
                        Add Room
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mb-6">{/* Keep your existing room filter buttons */}</div>

            {rooms.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {rooms.map((room, index) => {
                  const deviceCount = devices.filter((device) => device.room === room.room_name).length
                  const activeDevices = devices.filter((device) => device.room === room.room_name && device.isOn).length
                  return (
                    <motion.div
                      key={room.room_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                    >
                      <Card className={styles.roomCardStyle(selectedRoom === room.room_name)}>
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-inner ${
                              selectedRoom === room.room_name
                                ? "bg-gradient-to-br from-blue-500/30 to-blue-600/30"
                                : "bg-gradient-to-br from-purple-500/20 to-purple-600/20"
                            }`}
                          >
                            <Home
                              className={`w-7 h-7 ${
                                selectedRoom === room.room_name ? "text-blue-300" : "text-white-300"
                              }`}
                            />
                          </div>
                          <p className="font-medium text-lg mb-1">{room.room_name}</p>
                          <div className="flex gap-2 justify-center mb-4">
                            <Badge variant="outline" className="bg-white/10 border-white/20">
                              {deviceCount} device{deviceCount !== 1 ? "s" : ""}
                            </Badge>
                            {activeDevices > 0 && (
                              <Badge className="bg-green-500/50 text-white border-green-500/70">
                                {activeDevices} active
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2 w-full justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/20 hover:bg-white/10 flex-1 flex items-center gap-1.5"
                              onClick={() => setSelectedRoom(room.room_name)}
                            >
                              <Filter className="h-3.5 w-3.5" /> Filter
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-900/20 flex-1 flex items-center gap-1.5"
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure you want to delete this room?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {deviceCount > 0 ? (
                                      <>
                                        This room has {deviceCount} device
                                        {deviceCount !== 1 ? "s" : ""} assigned to it. If you delete this room, these
                                        devices will need to be manually reassigned.
                                      </>
                                    ) : (
                                      "This action cannot be undone."
                                    )}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteRoom(room.room_id, room.room_name)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>

                        {errorMessages[room.room_id] && (
                          <div className="text-red-500 bg-red-50 border border-red-200 rounded-md p-2 mt-2 text-sm">
                            {errorMessages[room.room_id]}
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <Card className="gradient-card p-6 text-center">
                <div className="py-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                    <Home className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-xl mb-4 font-semibold">No Rooms Created Yet</p>
                  <p className="text-gray-300 mb-6">You need to create at least one room before adding devices.</p>
                  <Button className="mx-auto" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Create Your First Room
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </section>
      </div>
      <AddDeviceDialog
        open={addDeviceDialogOpen}
        setOpen={setAddDeviceDialogOpen}
        onDeviceAdded={addDevice}
        onDeviceRemoved={removeDevice}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        rooms={rooms}
      />
      <EditDeviceDialog
        open={editDeviceDialogOpen}
        setOpen={setEditDeviceDialogOpen}
        device={currentEditingDevice}
        onDeviceUpdated={(updatedDevice) => {
          setDevices(devices.map((d) => (d.id === updatedDevice.id ? updatedDevice : d)))
        }}
      />
    </div>
  )
}

// Update the AddDeviceDialog component signature
function AddDeviceDialog({
  open,
  setOpen,
  onDeviceAdded,
  onDeviceRemoved,
  isEditMode,
  setIsEditMode,
  rooms,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  onDeviceAdded: (device: Device) => void
  onDeviceRemoved: (deviceId: number) => void
  isEditMode?: boolean
  setIsEditMode?: (isEdit: boolean) => void
  rooms: Room[]
}) {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [foundDevices, setFoundDevices] = useState<FoundDevice[]>([])
  const [selectedDevice, setSelectedDevice] = useState<FoundDevice | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pairedDevices, setPairedDevices] = useState<Device[]>([])
  const [householdCode, setHouseholdCode] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [scanSuccess, setScanSuccess] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const context = canvas.getContext("2d")
        if (!context) {
          setError("Could not get canvas context")
          return
        }
        context.drawImage(img, 0, 0, img.width, img.height)
        const imageData = context.getImageData(0, 0, img.width, img.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        if (code) {
          const scannedText = code.data
          const smartPlugIdRegex = /^\d{4}$/
          if (smartPlugIdRegex.test(scannedText)) {
            setError(null)
            setScanSuccess(true)
            setSelectedDevice({
              id: Number.parseInt(scannedText, 10),
              name: `Smart Plug ${scannedText}`,
              status: "Paired",
            })
            // Delay for visual feedback before moving on
            setTimeout(() => {
              setCurrentStep(1)
            }, 1500)
          } else {
            setError("Uploaded QR code did not contain a valid 4-digit smart plug ID")
          }
        } else {
          setError("No QR code found in the uploaded image")
        }
      }
      if (e.target && typeof e.target.result === "string") {
        img.src = e.target.result
      }
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id")
    if (storedUserId) {
      setUserId(Number(storedUserId)) // Convert the string to a number
    }
  }, [])

  useEffect(() => {
    const storedHouseholdCode = localStorage.getItem("household_code")
    if (storedHouseholdCode) {
      setHouseholdCode(storedHouseholdCode)
    }
  }, [])

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      // Use a timeout to avoid UI flicker
      const timer = setTimeout(() => {
        if (!open) {
          setError(null)
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  // Check if rooms are available
  useEffect(() => {
    if (open && rooms.length === 0) {
      setError("You must create at least one room before adding a device.")
      // Don't close the dialog immediately to allow the error to be seen
    }
  }, [open, rooms])

  // Update the deviceIcons array type
  const deviceIcons: DeviceIcon[] = [
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
      icon: "Desk Lamp",
      consumptionLimit: 100,
      scheduleEnabled: false,
      startTime: "08:00",
      endTime: "22:00",
      days: [] as string[],
    },
  })

  // Simulated scanning
  const startScan = () => {
    setIsScanning(true)
    setError(null)

    // Preserve paired devices instead of clearing all devices
    const pairedDevices = foundDevices.filter((device) => device.status === "Paired")
    setFoundDevices(pairedDevices)

    const totalDevices = Math.floor(Math.random() * 5) + 5 // Random number of devices (5-9)
    let devicesAdded = 0

    const addDevice = () => {
      if (devicesAdded < totalDevices) {
        const newDevice: FoundDevice = {
          id: Math.floor(Math.random() * 10000),
          name: "Smart Plug " + Math.floor(Math.random() * 100),
          status: "Available",
        }
        setFoundDevices((prev) => [...prev, newDevice])
        devicesAdded++
        setTimeout(addDevice, Math.random() * 1000 + 500) // Add next device after 0.5-1.5 seconds
      } else {
        setIsScanning(false)
      }
    }

    setTimeout(addDevice, 1000) // Start adding devices after 1 second
  }

  // Update the selectDevice function
  const selectDevice = (device: FoundDevice) => {
    setFoundDevices((prevDevices) => prevDevices.map((d) => (d.id === device.id ? { ...d, status: "Paired" } : d)))
    setSelectedDevice(device)
    setCurrentStep(1)
  }

  // Update the removeDevice function
  const removeDevice = (deviceId: number) => {
    setPairedDevices((prevDevices) => prevDevices.filter((d) => d.id !== deviceId))
    setFoundDevices((prevDevices) => prevDevices.map((d) => (d.id === deviceId ? { ...d, status: "Available" } : d)))
    onDeviceRemoved(deviceId)
  }

  // Update the onSubmit function
  const onSubmit = async (data: any) => {
    if (!selectedDevice) {
      setError("No device selected")
      return
    }

    if (!userId) {
      setError("User ID not found. Please log in again.")
      return
    }

    // Find the selected icon object
    const selectedIconObj = deviceIcons.find((i) => i.name === data.icon) || deviceIcons[0]

    // Find the room object based on the room name
    const selectedRoom = rooms.find((r) => r.room_name === data.room)
    if (!selectedRoom) {
      setError("Selected room not found")
      return
    }

    // Prepare the device data for the API
    const deviceData = {
      //id : selectedDevice.id,
      user_id: userId, // Replace with the actual user ID
      room_id: selectedRoom.room_id,
      device_name: data.name,
      device_category: data.type,
      household_code: householdCode, // Include household_code
      active_days: data.days, // Send as an array, not a string
      active_time_start: data.startTime,
      active_time_end: data.endTime,
      icon: { name: selectedIconObj.name }, // Send as a JSON object
      power: "0W",
      isOn: false,
      consumptionLimit: data.consumptionLimit,
      schedule: {
        enabled: data.scheduleEnabled,
        startTime: data.startTime,
        endTime: data.endTime,
        days: data.days,
      },
    }

    try {
      const response = await fetch("/api/auth/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deviceData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.detail || "Failed to add device")
        return
      }

      console.log(result.device_id)

      if (result.success) {
        // Add the new device to our devices state
        const newDevice: Device = {
          id: result.device_id,
          name: data.name,
          room: data.room,
          icon: selectedIconObj.icon,
          power: "0W",
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
        localStorage.setItem("device_id", result.device_id)

        onDeviceAdded(newDevice)

        // Reset form and close dialog
        setOpen(false)
        setCurrentStep(0)
        setSelectedDevice(null)
        form.reset()
        if (setIsEditMode) setIsEditMode(false)
      } else {
        setError(result.detail || "Failed to add device")
      }
    } catch (error) {
      console.error("Error adding device:", error)
      setError("An error occurred while adding the device")
    }
  }

  const steps = [
    { title: "Discover Device", description: "Scan for nearby smart plugs or scan a QR code" },
    { title: "Device Information", description: "Name and categorize your device" },
    { title: "Energy Settings", description: "Set consumption limits and schedules" },
    { title: "Confirmation", description: "Review and complete setup" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-black">{isEditMode ? "Edit Device" : "Add New Device"}</DialogTitle>
          <DialogDescription className="text-black-300">{steps[currentStep].description}</DialogDescription>
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
                      <p className="text-black">Scanning for devices...</p>
                    </div>
                  ) : (
                    <div className="w-full space-y-2">
                      <p className="font-medium text-gray-800">
                        {isScanning
                          ? `Scanning... (${foundDevices.length} device${foundDevices.length !== 1 ? "s" : ""} found)`
                          : `Select a device to pair (${foundDevices.filter((d) => d.status === "Available").length} available):`}
                      </p>
                      {foundDevices.map((device) => (
                        <motion.div
                          key={device.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          onClick={() => device.status === "Available" && selectDevice(device)}
                          className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer ${
                            device.status === "Paired"
                              ? "border-green-500 bg-green-50/10 cursor-not-allowed"
                              : "border-blue-200 bg-blue-50/10 hover:bg-blue-100/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Plug className={device.status === "Paired" ? "text-green-500" : "text-blue-500"} />
                            <div>
                              <p className="font-medium text-black">{device.name}</p>
                              <p className="text-xs text-gray-300">ID: {device.id}</p>
                            </div>
                          </div>
                          <span
                            className={`text-sm ${device.status === "Paired" ? "text-green-500" : "text-blue-500"}`}
                          >
                            {device.status}
                          </span>
                        </motion.div>
                      ))}
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
              <TabsContent value="qr" className="space-y-4">
                <div className="flex flex-col items-center justify-center py-8">
                  <div style={{ width: "100%" }}>
                    <QrScanner
                      delay={300}
                      onScan={(result: any) => {
                        if (result) {
                          const scannedText = result.text
                          const smartPlugIdRegex = /^\d{4}$/
                          if (smartPlugIdRegex.test(scannedText)) {
                            setError(null)
                            setScanSuccess(true)
                            setSelectedDevice({
                              id: Number.parseInt(scannedText, 10),
                              name: `Smart Plug ${scannedText}`,
                              status: "Paired",
                            })
                            // Delay for visual feedback before moving on
                            setTimeout(() => {
                              setCurrentStep(1)
                            }, 1500)
                          } else {
                            setError("QR code did not contain a valid 4-digit smart plug ID")
                          }
                        }
                      }}
                      onError={(error: any) => {
                        console.error(error)
                        setError("Error accessing the camera")
                      }}
                      style={{ width: "100%" }}
                    />
                  </div>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                  {scanSuccess && <p className="text-green-500 mt-2 flex items-center">Scan successful!</p>}
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="bg-green-500 text-white hover:bg-green-600"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload QR Code
                    </Button>

                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                    />
                  </div>
                  <p className="text-center text-black mt-4">
                    Position the QR code on your smart plug within the camera view or upload an image.
                  </p>
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
                        {rooms.map((room) => (
                          <SelectItem key={room.room_id} value={room.room_name}>
                            {room.room_name}
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
                  onClick={async () => {
                    const nameValid = await form.trigger("name")
                    const typeValid = await form.trigger("type")
                    const roomValid = await form.trigger("room")
                    const iconValid = await form.trigger("icon")
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
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
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
                                    ? field.value.filter((d: string) => d !== dayLower)
                                    : [...(field.value || []), dayLower]
                                  field.onChange(updatedDays)
                                }}
                              >
                                {day.substring(0, 3)}
                              </div>
                            )
                          })}
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
                  <p className="font-medium text-gray-800">{form.watch("scheduleEnabled") ? "Enabled" : "Disabled"}</p>
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
                              .map((d: string) => d.substring(0, 3))
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
                Based on your device type, we recommend setting a consumption limit of 80 kWh/month and scheduling it to
                turn off during peak hours (6 PM - 10 PM) to maximize energy savings.
              </AlertDescription>
            </Alert>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button onClick={() => onSubmit(form.getValues())}>
                {isEditMode ? "Update Device" : "Complete Setup"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Edit Device Dialog component
function EditDeviceDialog({
  open,
  setOpen,
  device,
  onDeviceUpdated,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  device: Device | null
  onDeviceUpdated: (device: Device) => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [householdCode, setHouseholdCode] = useState<string | null>(null)

  const deviceId = device?.id

  const form = useForm({
    defaultValues: {
      consumptionLimit: device?.consumptionLimit || 100,
      scheduleEnabled: device?.schedule?.enabled || false,
      startTime: device?.schedule?.startTime || "08:00",
      endTime: device?.schedule?.endTime || "22:00",
      days: device?.schedule?.days || ([] as string[]),
    },
  })

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id")
    if (storedUserId) {
      setUserId(Number(storedUserId)) // Convert the string to a number
    }
  }, [])

  useEffect(() => {
    const storedHouseholdCode = localStorage.getItem("household_code")
    if (storedHouseholdCode) {
      setHouseholdCode(storedHouseholdCode)
    }
  }, [])

  // Update form values when device changes
  useEffect(() => {
    if (device) {
      form.reset({
        consumptionLimit: device.consumptionLimit || 100,
        scheduleEnabled: device.schedule?.enabled || false,
        startTime: device.schedule?.startTime || "08:00",
        endTime: device.schedule?.endTime || "22:00",
        days: device.schedule?.days || [],
      })
    }
  }, [device, form])

  const onSubmit = async (data: any) => {
    if (!device) return

    try {
      // Prepare the updated device data
      const updatedDevice: Device = {
        ...device,
        consumptionLimit: data.consumptionLimit,
        schedule: {
          enabled: data.scheduleEnabled,
          startTime: data.startTime,
          endTime: data.endTime,
          days: data.days,
        },
      }

      // Update the device in the backend
      const response = await fetch(`/api/auth/editdevices`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          householdCode: householdCode,
          userId: userId,
          device_id: deviceId,
          consumptionLimit: data.consumptionLimit,
          active_time_start: data.startTime,
          active_time_end: data.endTime,
          active_days: data.days,
          schedule: {
            enabled: data.scheduleEnabled,
            startTime: data.startTime,
            endTime: data.endTime,
            days: data.days,
          },
        }),
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.detail || "Failed to update device")
        return
      }

      if (result.success) {
        // Update the device in the UI
        onDeviceUpdated(updatedDevice)
        setOpen(false)
      } else {
        setError(result.message || "Failed to update device")
      }
    } catch (error) {
      console.error("Error updating device:", error)
      setError("An error occurred while updating the device")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Device Energy Settings</DialogTitle>
          <DialogDescription className="text-gray-300">
            Adjust energy consumption limits and schedule for {device?.name}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
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
                                  ? field.value.filter((d: string) => d !== dayLower)
                                  : [...(field.value || []), dayLower]
                                field.onChange(updatedDays)
                              }}
                            >
                              {day.substring(0, 3)}
                            </div>
                          )
                        })}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Alert className="bg-blue-500/10 border-blue-500 text-blue-700">
              <AlertTitle>Energy Saving Recommendation</AlertTitle>
              <AlertDescription>
                Based on your device type, we recommend setting a consumption limit of 80 kWh/month and scheduling it to
                turn off during peak hours (6 PM - 10 PM) to maximize energy savings.
              </AlertDescription>
            </Alert>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => onSubmit(form.getValues())}>Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

