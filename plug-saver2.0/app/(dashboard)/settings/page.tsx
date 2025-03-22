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
  Zap,
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
                {/* Profile Section */}
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Profile
                </div>
                <button
                  className={`w-full flex items-center space-x-3 px-2 py-2 rounded-md ${
                    selectedCategory === "profilePicture"
                      ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedCategory("profilePicture")}
                >
                  <User className="h-5 w-5" />
                  <span>Profile Picture</span>
                </button>
                <button
                  className={`w-full flex items-center space-x-3 px-2 py-2 rounded-md ${
                    selectedCategory === "personalInfo"
                      ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedCategory("personalInfo")}
                >
                  <Info className="h-5 w-5" />
                  <span>Personal Information</span>
                </button>
                <button
                  className={`w-full flex items-center space-x-3 px-2 py-2 rounded-md ${
                    selectedCategory === "dataSharing"
                      ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedCategory("dataSharing")}
                >
                  <Share2 className="h-5 w-5" />
                  <span>Data Sharing Preferences</span>
                </button>

                {/* Account and App Section */}
                <div className="mt-4 px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Account and App
                </div>
                <button
                  className={`w-full flex items-center space-x-3 px-2 py-2 rounded-md ${
                    selectedCategory === "security"
                      ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedCategory("security")}
                >
                  <Shield className="h-5 w-5" />
                  <span>Security and Privacy</span>
                </button>
                <button
                  className={`w-full flex items-center space-x-3 px-2 py-2 rounded-md ${
                    selectedCategory === "notifications"
                      ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedCategory("notifications")}
                >
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </button>
                <button
                  className={`w-full flex items-center space-x-3 px-2 py-2 rounded-md ${
                    selectedCategory === "members"
                      ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedCategory("members")}
                >
                  <Users className="h-5 w-5" />
                  <span>Members</span>
                </button>
                <button
                  className={`w-full flex items-center space-x-3 px-2 py-2 rounded-md ${
                    selectedCategory === "accessibility"
                      ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedCategory("accessibility")}
                >
                  <Accessibility className="h-5 w-5" />
                  <span>Accessibility</span>
                </button>
                <button
                  className={`w-full flex items-center space-x-3 px-2 py-2 rounded-md ${
                    selectedCategory === "support"
                      ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedCategory("support")}
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Support</span>
                </button>
                <button
                  className={`w-full flex items-center space-x-3 px-2 py-2 rounded-md ${
                    selectedCategory === "household"
                      ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedCategory("household")}
                >
                  <Home className="h-5 w-5" />
                  <span>Household</span>
                </button>
                <button
                  className={`w-full flex items-center space-x-3 px-2 py-2 rounded-md ${
                    selectedCategory === "dashboard"
                      ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedCategory("dashboard")}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>

                {/* Logout */}
                <div className="mt-4 px-2">
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
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto">
            {/* Category header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-semibold dark:text-white">
                {selectedCategory === "profilePicture" && "Profile Picture"}
                {selectedCategory === "personalInfo" && "Personal Information"}
                {selectedCategory === "dataSharing" && "Data Sharing Preferences"}
                {selectedCategory === "security" && "Security and Privacy"}
                {selectedCategory === "notifications" && "Notifications"}
                {selectedCategory === "members" && "Members"}
                {selectedCategory === "accessibility" && "Accessibility"}
                {selectedCategory === "support" && "Support"}
                {selectedCategory === "household" && "Household"}
                {selectedCategory === "dashboard" && "Dashboard"}
                {![
                  "profilePicture",
                  "personalInfo",
                  "dataSharing",
                  "security",
                  "notifications",
                  "members",
                  "accessibility",
                  "support",
                  "household",
                  "dashboard",
                ].includes(selectedCategory || "") && "Settings"}
              </h1>
            </div>

            {/* Category content */}
            <div className="p-6">
              {selectedCategory === "profilePicture" && (
                <div className="space-y-6">
                  {/* Profile picture section */}
                  <div className="flex items-center space-x-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-2xl">{user.username[0]}</AvatarFallback>
                      </Avatar>
                      <button className="absolute bottom-0 right-0 bg-purple-500 text-white p-1 rounded-full">
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
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              )}

              {selectedCategory === "personalInfo" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Button className="mt-4" onClick={handleSave}>
                    Save changes
                  </Button>
                </div>
              )}

              {selectedCategory === "dataSharing" && (
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
                  <Button className="mt-4" onClick={handleSave}>
                    Save changes
                  </Button>
                </div>
              )}

              {selectedCategory === "security" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Security and Privacy</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={settings.security.twoFactorAuth}
                        onCheckedChange={(checked) => handleToggleChange("security", "twoFactorAuth", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Remember Device</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Stay logged in on this device</p>
                      </div>
                      <Switch
                        checked={settings.security.rememberDevice}
                        onCheckedChange={(checked) => handleToggleChange("security", "rememberDevice", checked)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordExpiry">Password Expiry</Label>
                      <Select
                        value={settings.security.passwordExpiry}
                        onValueChange={(value) =>
                          setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              passwordExpiry: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select password expiry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30days">30 days</SelectItem>
                          <SelectItem value="60days">60 days</SelectItem>
                          <SelectItem value="90days">90 days</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="mt-4" onClick={handleSave}>
                    Save changes
                  </Button>
                </div>
              )}

              {selectedCategory === "notifications" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Notifications</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">App Notifications</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications in the app</p>
                      </div>
                      <Switch
                        checked={settings.notifications.appNotifications}
                        onCheckedChange={(checked) => handleToggleChange("notifications", "appNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          handleToggleChange("notifications", "emailNotifications", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">SMS Notifications</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        checked={settings.notifications.smsNotifications}
                        onCheckedChange={(checked) => handleToggleChange("notifications", "smsNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Usage Alerts</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get notified about unusual energy usage
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.usageAlerts}
                        onCheckedChange={(checked) => handleToggleChange("notifications", "usageAlerts", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Savings Goals</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get notified about your savings goals
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.savingsGoals}
                        onCheckedChange={(checked) => handleToggleChange("notifications", "savingsGoals", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Tips and Tricks</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive energy-saving tips and tricks
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.tipsAndTricks}
                        onCheckedChange={(checked) => handleToggleChange("notifications", "tipsAndTricks", checked)}
                      />
                    </div>
                  </div>
                  <Button className="mt-4" onClick={handleSave}>
                    Save changes
                  </Button>
                </div>
              )}

              {selectedCategory === "members" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Household Members</h2>
                  <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.username[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.username} (You)</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Household Manager</div>
                        </div>
                      </div>
                    </div>

                    {/* Sample household members */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Jane Doe</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Member</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setManageMemberDialogOpen(true)}>
                        Manage
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">John Smith</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Member</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setManageMemberDialogOpen(true)}>
                        Manage
                      </Button>
                    </div>

                    <Button className="w-full">Add New Member</Button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-medium">Household Code</h3>
                    <div className="flex items-center space-x-2">
                      <Input value="ABC123" readOnly className="bg-gray-100 dark:bg-gray-800" />
                      <Button variant="outline">Copy</Button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Share this code with others to join your household
                    </p>
                  </div>
                </div>
              )}

              {selectedCategory === "accessibility" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Accessibility</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">High Contrast</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Increase contrast for better visibility
                        </p>
                      </div>
                      <Switch
                        checked={settings.accessibility.highContrast}
                        onCheckedChange={(checked) => handleToggleChange("accessibility", "highContrast", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Large Text</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Increase text size for better readability
                        </p>
                      </div>
                      <Switch
                        checked={settings.accessibility.largeText}
                        onCheckedChange={(checked) => handleToggleChange("accessibility", "largeText", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Screen Reader</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Optimize for screen readers</p>
                      </div>
                      <Switch
                        checked={settings.accessibility.screenReader}
                        onCheckedChange={(checked) => handleToggleChange("accessibility", "screenReader", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Reduce Motion</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Minimize animations and motion effects
                        </p>
                      </div>
                      <Switch
                        checked={settings.accessibility.reduceMotion}
                        onCheckedChange={(checked) => handleToggleChange("accessibility", "reduceMotion", checked)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={settings.accessibility.theme}
                        onValueChange={(value) =>
                          setSettings({
                            ...settings,
                            accessibility: {
                              ...settings.accessibility,
                              theme: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="mt-4" onClick={handleSave}>
                    Save changes
                  </Button>
                </div>
              )}

              {selectedCategory === "support" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Support</h2>
                  <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="space-y-2">
                      <h3 className="text-base font-medium">Contact Support</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Need help? Contact our support team.</p>
                      <Button variant="outline">Contact Support</Button>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-medium">FAQs</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Find answers to common questions.</p>
                      <Button variant="outline">View FAQs</Button>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-medium">User Guide</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Learn how to use the app.</p>
                      <Button variant="outline">View User Guide</Button>
                    </div>
                  </div>
                </div>
              )}

              {selectedCategory === "household" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Household</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="householdName">Household Name</Label>
                      <Input
                        id="householdName"
                        value={settings.household.name}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            household: {
                              ...settings.household,
                              name: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="householdSize">Household Size</Label>
                      <Select
                        value={settings.household.size}
                        onValueChange={(value) =>
                          setSettings({
                            ...settings,
                            household: {
                              ...settings.household,
                              size: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select household size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (1-2 people)</SelectItem>
                          <SelectItem value="medium">Medium (3-4 people)</SelectItem>
                          <SelectItem value="large">Large (5+ people)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rooms">Number of Rooms</Label>
                      <Input
                        id="rooms"
                        type="number"
                        value={settings.household.rooms}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            household: {
                              ...settings.household,
                              rooms: Number.parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Auto-Saving Mode</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Automatically optimize energy usage</p>
                      </div>
                      <Switch
                        checked={settings.household.autoSaving}
                        onCheckedChange={(checked) => handleToggleChange("household", "autoSaving", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Smart Scheduling</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Schedule devices based on usage patterns
                        </p>
                      </div>
                      <Switch
                        checked={settings.household.smartScheduling}
                        onCheckedChange={(checked) => handleToggleChange("household", "smartScheduling", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Guest Access</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Allow guests to control devices</p>
                      </div>
                      <Switch
                        checked={settings.household.guestAccess}
                        onCheckedChange={(checked) => handleToggleChange("household", "guestAccess", checked)}
                      />
                    </div>
                  </div>
                  <Button className="mt-4" onClick={handleSave}>
                    Save changes
                  </Button>
                </div>
              )}

              {selectedCategory === "dashboard" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Dashboard</h2>
                  <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="space-y-2">
                      <h3 className="text-base font-medium">Dashboard Layout</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Customize your dashboard layout</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                          <LayoutDashboard className="h-8 w-8 mb-2" />
                          <span>Grid</span>
                        </Button>
                        <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                          <List className="h-8 w-8 mb-2" />
                          <span>List</span>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-medium">Widget Visibility</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Choose which widgets to display on your dashboard
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Energy Usage</Label>
                          <Switch checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Device Status</Label>
                          <Switch checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Savings</Label>
                          <Switch checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Tips</Label>
                          <Switch checked={false} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Weather</Label>
                          <Switch checked={true} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button className="mt-4" onClick={handleSave}>
                    Save changes
                  </Button>
                </div>
              )}

              {/* Default content for other categories */}
              {![
                "profilePicture",
                "personalInfo",
                "dataSharing",
                "security",
                "notifications",
                "members",
                "accessibility",
                "support",
                "household",
                "dashboard",
              ].includes(selectedCategory || "") && (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Settings className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-gray-500 dark:text-gray-400">Settings content</h2>
                    <p className="text-gray-400 dark:text-gray-500 mt-2">This settings section is under development</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Main settings dashboard with grid (similar to first image)
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <div className="w-full p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <h2 className="font-medium dark:text-white">{user.username}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative mb-8 max-w-md mx-auto">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Find a setting"
                className="pl-10 h-10 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Settings grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Profile Section */}
              <motion.div
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedCategory("profilePicture")}
              >
                <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300 flex items-center justify-center mb-4">
                    <User className="h-8 w-8" />
                  </div>
                  <h2 className="text-lg font-medium mb-1">Profile</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Account, picture, personal info
                  </p>
                </div>
              </motion.div>

              {/* Security Section */}
              <motion.div
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedCategory("security")}
              >
                <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300 flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8" />
                  </div>
                  <h2 className="text-lg font-medium mb-1">Security</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Privacy, data, account security
                  </p>
                </div>
              </motion.div>

              {/* Notifications Section */}
              <motion.div
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedCategory("notifications")}
              >
                <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8" />
                  </div>
                  <h2 className="text-lg font-medium mb-1">Notifications</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Alerts, reminders, messages</p>
                </div>
              </motion.div>

              {/* Members Section */}
              <motion.div
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedCategory("members")}
              >
                <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8" />
                  </div>
                  <h2 className="text-lg font-medium mb-1">Members</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Household members, permissions</p>
                </div>
              </motion.div>

              {/* Accessibility Section */}
              <motion.div
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedCategory("accessibility")}
              >
                <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-300 flex items-center justify-center mb-4">
                    <Accessibility className="h-8 w-8" />
                  </div>
                  <h2 className="text-lg font-medium mb-1">Accessibility</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">High contrast, text size</p>
                </div>
              </motion.div>

              {/* Support Section */}
              <motion.div
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedCategory("support")}
              >
                <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-300 flex items-center justify-center mb-4">
                    <HelpCircle className="h-8 w-8" />
                  </div>
                  <h2 className="text-lg font-medium mb-1">Support</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Help, FAQs, contact us</p>
                </div>
              </motion.div>

              {/* Household Section */}
              <motion.div
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedCategory("household")}
              >
                <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300 flex items-center justify-center mb-4">
                    <Home className="h-8 w-8" />
                  </div>
                  <h2 className="text-lg font-medium mb-1">Household</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Home settings, rooms, devices</p>
                </div>
              </motion.div>

              {/* Dashboard Section */}
              <motion.div
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedCategory("dashboard")}
              >
                <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 flex items-center justify-center mb-4">
                    <LayoutDashboard className="h-8 w-8" />
                  </div>
                  <h2 className="text-lg font-medium mb-1">Dashboard</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Layout, widgets, customization</p>
                </div>
              </motion.div>
            </div>

            {/* Logout Button */}
            <div className="max-w-md mx-auto mt-8">
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
      )}

      {/* Manage Member Dialog */}
      <Dialog open={manageMemberDialogOpen} onOpenChange={setManageMemberDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Member Permissions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">Jane Doe</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Member</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Control Devices</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Allow member to control devices</p>
                </div>
                <Switch
                  checked={manageMemberPermissions.control}
                  onCheckedChange={(checked) =>
                    setManageMemberPermissions({
                      ...manageMemberPermissions,
                      control: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Configure Settings</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Allow member to configure device settings</p>
                </div>
                <Switch
                  checked={manageMemberPermissions.configure}
                  onCheckedChange={(checked) =>
                    setManageMemberPermissions({
                      ...manageMemberPermissions,
                      configure: checked,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            {saveSuccess && (
              <p className="text-green-500 dark:text-green-300 flex items-center text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-1 animate-pulse dark:text-green-300 dark:drop-shadow-[0_0_3px_rgba(134,239,172,0.5)]" />
                <span className="dark:drop-shadow-[0_0_2px_rgba(134,239,172,0.3)]">Saved successfully</span>
              </p>
            )}
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

