"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  User,
  Info,
  Share2,
  Shield,
  Bell,
  Users,
  Accessibility,
  HelpCircle,
  Home,
  LayoutDashboard,
  ChevronRight,
  Camera,
  LogOut,
  CheckCircle,
  Settings,
  Search,
  ArrowLeft,
  Laptop,
  Smartphone,
  Globe,
  Palette,
  List,
  Clock,
  Lock,
  RefreshCw,
  Wifi,
  Zap,
  DollarSign,
} from "lucide-react"
import { motion } from "framer-motion"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = "https://xgcfvxwrcunwsrvwwjjx.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnY2Z2eHdyY3Vud3Nydnd3amp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5OTIzNzIsImV4cCI6MjA1MzU2ODM3Mn0.fgT2LL7dlx7VR185WABZCtK8ZdF4rpdOIy-crGpp6tU"
const supabase = createClient(supabaseUrl, supabaseKey)

// Define the settings categories with icons and descriptions
const settingsCategories = [
  {
    id: "profile",
    title: "Profile",
    icon: User,
    description: "Account, picture, personal info",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300",
  },
  {
    id: "system",
    title: "System",
    icon: Laptop,
    description: "Display, notifications, power",
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300",
  },
  {
    id: "devices",
    title: "Devices",
    icon: Smartphone,
    description: "Connected devices, sensors",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300",
  },
  {
    id: "network",
    title: "Network & Internet",
    icon: Globe,
    description: "Wi-Fi, energy data sharing",
    color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-300",
  },
  {
    id: "personalization",
    title: "Personalization",
    icon: Palette,
    description: "Theme, colors, dashboard layout",
    color: "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300",
  },
  {
    id: "apps",
    title: "Apps",
    icon: List,
    description: "Default apps, optional features",
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300",
  },
  {
    id: "accounts",
    title: "Accounts",
    icon: Users,
    description: "Household members, permissions",
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300",
  },
  {
    id: "time",
    title: "Time & Language",
    icon: Clock,
    description: "Region, date, language",
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300",
  },
  {
    id: "energy",
    title: "Energy",
    icon: Zap,
    description: "Usage, savings, goals",
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300",
  },
  {
    id: "accessibility",
    title: "Accessibility",
    icon: Accessibility,
    description: "High contrast, text size",
    color: "bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-300",
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    icon: Lock,
    description: "Data sharing, permissions",
    color: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300",
  },
  {
    id: "update",
    title: "Updates",
    icon: RefreshCw,
    description: "App updates, firmware",
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
]

export default function SettingsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // State for various settings
  const [user, setUser] = useState({
    username: "Username",
    role: "Household Manager",
    avatar: "/placeholder.svg?height=80&width=80",
    email: "user@example.com",
    country: "United Arab Emirates",
    birthdate: "1990-01-01",
    language: "English",
  })

  // State for household code
  const [householdCode, setHouseholdCode] = useState<string | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true"
    }
    return false
  })

  // Apply dark mode class to the document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("darkMode", isDarkMode.toString())
  }, [isDarkMode])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  // Add a useEffect hook to detect screen size
  useEffect(() => {
    const handleResize = () => {
      // Prevent scrolling on desktop
      if (window.innerWidth >= 1024) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = "auto"
      }
    }

    // Initial call
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      document.body.style.overflow = "auto"
    }
  }, [])

  // States for different dialog modals
  const [activeDialog, setActiveDialog] = useState<string | null>(null)
  const [activeSheet, setActiveSheet] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // State for managing member permissions dialog
  const [manageMemberDialogOpen, setManageMemberDialogOpen] = useState(false)
  const [manageMemberPermissions, setManageMemberPermissions] = useState({
    control: false,
    configure: false,
  })

  // Toggle states for various settings
  const [settings, setSettings] = useState({
    dataSharing: {
      usageData: true,
      locationData: false,
      marketingEmails: true,
    },
    security: {
      twoFactorAuth: false,
      rememberDevice: true,
      passwordExpiry: "90days",
    },
    notifications: {
      appNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      usageAlerts: true,
      savingsGoals: true,
      tipsAndTricks: true,
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      screenReader: false,
      reduceMotion: false,
      theme: "system",
    },
    household: {
      autoSaving: true,
      smartScheduling: true,
      guestAccess: false,
      name: "My Home",
      size: "medium",
      rooms: 4,
    },
  })

  // Handle opening dialogs
  const openDialog = (dialog: string) => {
    setActiveDialog(dialog)
    setSaveSuccess(false)
  }

  // Handle opening sheets (for mobile view)
  const openSheet = (sheet: string) => {
    setActiveSheet(sheet)
    setSaveSuccess(false)
  }

  // Handle saving settings
  const handleSave = () => {
    setSaveSuccess(true)
    // Would normally save to a database or API
    setTimeout(() => {
      if (activeDialog) setActiveDialog(null)
      if (activeSheet) setActiveSheet(null)
      setManageMemberDialogOpen(false)
    }, 1500)
  }

  // Handle logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  // Handle toggle changes
  const handleToggleChange = (category: string, setting: string, value: boolean) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category as keyof typeof settings],
        [setting]: value,
      },
    })
  }

  // Filter categories based on search query
  const filteredCategories = searchQuery
    ? settingsCategories.filter(
        (category) =>
          category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : settingsCategories

  // Determine if we're on mobile
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // If on mobile, use the existing mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Mobile View */}
        <div>
          {/* Header */}
          <div className="bg-gradient-to-b from-purple-500 via-purple-400 to-transparent pb-10 rounded-b-[40px]">
            <div className="max-w-md mx-auto p-6">
              <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium dark:text-white">{user.username}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Personal Information</p>
                    <p className="font-medium text-sm mt-1 dark:text-gray-300">{user.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="max-w-md mx-auto p-6 -mt-5">
            <div className="space-y-8">
              {/* Profile Section */}
              <section>
                <h2 className="text-lg font-medium text-purple-600 dark:text-purple-400 mb-2">Profile</h2>
                <div className="space-y-1 bg-gray-50 dark:bg-gray-900/30 rounded-lg overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-3 rounded-md hover:bg-purple-50/10"
                    onClick={() => openDialog("profilePicture")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center text-purple-400">
                        <User className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">Profile Picture</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    className="w-full flex items-center justify-between p-3 rounded-md hover:bg-purple-50/10"
                    onClick={() => openDialog("personalInfo")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center text-purple-400">
                        <Info className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">Personal Information</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    className="w-full flex items-center justify-between p-3 rounded-md hover:bg-purple-50/10"
                    onClick={() => openDialog("dataSharing")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center text-purple-400">
                        <Share2 className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">Data Sharing Preferences</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </section>

              {/* Account and App Section */}
              <section>
                <h2 className="text-lg font-medium text-purple-600 dark:text-purple-400 mb-2">Account and App</h2>
                <div className="space-y-1 bg-gray-50 dark:bg-gray-900/30 rounded-lg overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-3 rounded-md hover:bg-purple-50/10"
                    onClick={() => openDialog("security")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center text-purple-400">
                        <Shield className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">Security and Privacy</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    className="w-full flex items-center justify-between p-3 rounded-md hover:bg-purple-50/10"
                    onClick={() => openDialog("notifications")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center text-purple-400">
                        <Bell className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">Notifications</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    className="w-full flex items-center justify-between p-3 rounded-md hover:bg-purple-50/10"
                    onClick={() => openDialog("members")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center text-purple-400">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">Members</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    className="w-full flex items-center justify-between p-3 rounded-md hover:bg-purple-50/10"
                    onClick={() => openDialog("accessibility")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center text-purple-400">
                        <Accessibility className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">Accessibility</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    className="w-full flex items-center justify-between p-3 rounded-md hover:bg-purple-50/10"
                    onClick={() => openDialog("support")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center text-purple-400">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">Support</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    className="w-full flex items-center justify-between p-3 rounded-md hover:bg-purple-50/10"
                    onClick={() => openDialog("household")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center text-purple-400">
                        <Home className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">Household</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    className="w-full flex items-center justify-between p-3 rounded-md hover:bg-purple-50/10"
                    onClick={() => openDialog("dashboard")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center text-purple-400">
                        <LayoutDashboard className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">Dashboard</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </section>

              {/* Logout Button */}
              <Button
                variant="outline"
                className="w-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900/70 dark:text-red-400 dark:hover:bg-red-900/30"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>

        {/* Dialogs for mobile view */}
        <Dialog open={activeDialog !== null} onOpenChange={(open) => !open && setActiveDialog(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {activeDialog === "profilePicture" && "Profile Picture"}
                {activeDialog === "personalInfo" && "Personal Information"}
                {activeDialog === "dataSharing" && "Data Sharing Preferences"}
                {activeDialog === "security" && "Security and Privacy"}
                {activeDialog === "notifications" && "Notifications"}
                {activeDialog === "members" && "Members"}
                {activeDialog === "accessibility" && "Accessibility"}
                {activeDialog === "support" && "Support"}
                {activeDialog === "household" && "Household"}
                {activeDialog === "dashboard" && "Dashboard"}
              </DialogTitle>
            </DialogHeader>
            {/* Dialog content would go here */}
            <DialogFooter>
              {saveSuccess && (
                <p className="text-green-500 dark:text-green-300 flex items-center text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-1 animate-pulse dark:text-green-300 dark:drop-shadow-[0_0_3px_rgba(134,239,172,0.5)]" />
                  <span className="dark:drop-shadow-[0_0_2px_rgba(134,239,172,0.3)]">Saved successfully</span>
                </p>
              )}
              <Button onClick={handleSave}>{activeDialog === "support" ? "Close" : "Save Changes"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Desktop Windows-style layout
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {selectedCategory ? (
        // Detailed category view with sidebar (similar to second image)
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 h-full bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            {/* User info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className="mr-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <span className="font-semibold">Settings</span>
            </div>

            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.username}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Local Account</div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input placeholder="Find a setting" className="pl-8 bg-gray-200 dark:bg-gray-700 border-0" />
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-2">
              <div className="space-y-1">
                <button
                  className={`w-full flex items-center space-x-3 px-2 py-2 rounded-md ${
                    selectedCategory === "home"
                      ? "bg-blue-100 dark:bg-blue-900/50"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedCategory("home")}
                >
                  <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span>Home</span>
                </button>

                {settingsCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`w-full flex items-center space-x-3 px-2 py-2 rounded-md ${
                      selectedCategory === category.id
                        ? "bg-blue-100 dark:bg-blue-900/50"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <category.icon
                      className={`h-5 w-5 ${selectedCategory === category.id ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
                    />
                    <span>{category.title}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto">
            {/* Category header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-semibold">
                {settingsCategories.find((c) => c.id === selectedCategory)?.title || "Settings"}
              </h1>
            </div>

            {/* Category content */}
            <div className="p-6">
              {selectedCategory === "profile" && (
                <div className="space-y-6">
                  {/* Profile picture section */}
                  <div className="flex items-center space-x-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-2xl">{user.username[0]}</AvatarFallback>
                      </Avatar>
                      <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <h2 className="text-xl font-medium">{user.username}</h2>
                      <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                      <Button variant="outline" className="mt-2">
                        Change picture
                      </Button>
                    </div>
                  </div>

                  {/* Personal info section */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium">Personal Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={user.username}
                          onChange={(e) => setUser({ ...user, username: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          readOnly
                          className="bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select value={user.country} onValueChange={(value) => setUser({ ...user, country: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthdate">Birthdate</Label>
                        <Input
                          id="birthdate"
                          type="date"
                          value={user.birthdate}
                          onChange={(e) => setUser({ ...user, birthdate: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button className="mt-4">Save changes</Button>
                  </div>

                  {/* Data sharing section */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium">Data Sharing Preferences</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Usage Data</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Share energy usage data to improve services
                          </p>
                        </div>
                        <Switch
                          checked={settings.dataSharing.usageData}
                          onCheckedChange={(checked) => handleToggleChange("dataSharing", "usageData", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Location Data</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Allow access to your location data</p>
                        </div>
                        <Switch
                          checked={settings.dataSharing.locationData}
                          onCheckedChange={(checked) => handleToggleChange("dataSharing", "locationData", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Marketing Emails</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive promotional offers and updates
                          </p>
                        </div>
                        <Switch
                          checked={settings.dataSharing.marketingEmails}
                          onCheckedChange={(checked) => handleToggleChange("dataSharing", "marketingEmails", checked)}
                        />
                      </div>
                    </div>
                    <Button className="mt-4">Save changes</Button>
                  </div>
                </div>
              )}

              {selectedCategory === "network" && (
                <div className="space-y-6">
                  {/* Connected status */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg flex items-center space-x-6">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full">
                      <Wifi className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-medium">Wi-Fi (Home Network)</h2>
                      <p className="text-green-600 dark:text-green-400 flex items-center">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Connected, secured
                      </p>
                    </div>
                    <div className="ml-auto space-y-1">
                      <div className="text-sm font-medium">Properties</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Private network</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">5 GHz</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Data usage</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">127.23 GB, last 30 days</div>
                    </div>
                  </div>

                  {/* Network settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Wifi className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        <div>
                          <div className="font-medium">Wi-Fi</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Connect, manage known networks</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Switch checked={true} />
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Globe className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        <div>
                          <div className="font-medium">Energy Data Sharing</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Configure data sharing with utility providers
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Smartphone className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        <div>
                          <div className="font-medium">Mobile hotspot</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Share your internet connection</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Switch checked={false} />
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        <div>
                          <div className="font-medium">Advanced network settings</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            View all network adapters, network reset
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}

              {selectedCategory === "energy" && (
                <div className="space-y-6">
                  {/* Energy summary */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg flex items-center space-x-6">
                    <div className="bg-amber-100 dark:bg-amber-900/50 p-4 rounded-full">
                      <Zap className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-medium">Energy Usage</h2>
                      <p className="text-gray-600 dark:text-gray-400">Current month: 234.5 kWh</p>
                    </div>
                    <div className="ml-auto space-y-1">
                      <div className="text-sm font-medium">Estimated Cost</div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">AED 120.75</div>
                    </div>
                  </div>

                  {/* Energy settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <DollarSign className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        <div>
                          <div className="font-medium">Energy Budget</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Set monthly energy budget and alerts
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <RefreshCw className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        <div>
                          <div className="font-medium">Auto-Saving Mode</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Automatically optimize energy usage
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Switch
                          checked={settings.household.autoSaving}
                          onCheckedChange={(checked) => handleToggleChange("household", "autoSaving", checked)}
                        />
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Clock className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        <div>
                          <div className="font-medium">Smart Scheduling</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Schedule devices based on usage patterns
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Switch
                          checked={settings.household.smartScheduling}
                          onCheckedChange={(checked) => handleToggleChange("household", "smartScheduling", checked)}
                        />
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add more category content sections as needed */}
              {!["profile", "network", "energy"].includes(selectedCategory || "") && (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Settings className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-gray-500 dark:text-gray-400">
                      {settingsCategories.find((c) => c.id === selectedCategory)?.title || "Settings"} content
                    </h2>
                    <p className="text-gray-400 dark:text-gray-500 mt-2">This settings section is under development</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Main settings dashboard with grid (similar to first image)
        <div className="max-w-5xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <Button variant="outline" size="sm" onClick={toggleDarkMode}>
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </Button>
          </div>

          {/* Search bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Find a setting"
              className="pl-10 h-10 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Settings grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mb-4`}>
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h2 className="text-lg font-medium mb-1">{category.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{category.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

