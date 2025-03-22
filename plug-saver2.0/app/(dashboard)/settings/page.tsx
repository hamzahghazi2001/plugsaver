"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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
  Mail,
  Phone,
  UserPlus,
  FileQuestion,
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
  const [householdCode, setHouseholdCode] = useState<string | null>("HOUSE1234")
  const [users, setUsers] = useState<any[]>([
    {
      user_id: 1,
      name: "Anna Mohamed",
      email: "anna@example.com",
      role: "Member",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      user_id: 2,
      name: "Ahmed Hassan",
      email: "ahmed@example.com",
      role: "Member",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])
  const [loading, setLoading] = useState(false)
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
  const [selectedMember, setSelectedMember] = useState<any | null>(null)
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

  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a URL for the selected image
    const imageUrl = URL.createObjectURL(file)

    // Update user avatar
    setUser({
      ...user,
      avatar: imageUrl,
    })

    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 1500)
  }

  // Handle updating personal info
  const handleUpdatePersonalInfo = () => {
    // In a real app, this would call an API to update the user's information
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 1500)
  }

  // Handle logout
  const handleLogout = async () => {
    // In a real app, this would call an API to log the user out
    await new Promise((resolve) => setTimeout(resolve, 500))
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

  // Handle member permissions
  const handleManageMember = (member: any) => {
    setSelectedMember(member)
    setManageMemberDialogOpen(true)
    setManageMemberPermissions({
      control: false,
      configure: false,
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

  // Profile Picture content component
  const ProfilePictureContent = ({ inDialog = true }) => (
    <>
      {inDialog ? (
        <DialogDescription className="text-center mb-4">
          Upload a new profile picture or select from our collection
        </DialogDescription>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mb-4">
          Upload a new profile picture or select from our collection
        </p>
      )}

      <div className="flex flex-col items-center gap-4 mb-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={`${user.avatar}`} />
          <AvatarFallback>{user.username[0]}</AvatarFallback>
        </Avatar>

        <Label
          htmlFor="avatar-upload"
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          <span>Upload Photo</span>
          <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </Label>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500"
            onClick={() => setUser({ ...user, avatar: `/placeholder.svg?height=80&width=80&text=Avatar${i}` })}
          >
            <img
              src={`/placeholder.svg?height=80&width=80&text=Avatar${i}`}
              alt={`Avatar ${i}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </>
  )

  // Personal Info content component
  const PersonalInfoContent = ({ inDialog = true }) => {
    // Comprehensive list of countries
    const countries = [
      "Afghanistan",
      "Albania",
      "Algeria",
      "Andorra",
      "Angola",
      "Antigua and Barbuda",
      "Argentina",
      "Armenia",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bhutan",
      "Bolivia",
      "Bosnia and Herzegovina",
      "Botswana",
      "Brazil",
      "Brunei",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Cape Verde",
      "Central African Republic",
      "Chad",
      "Chile",
      "China",
      "Colombia",
      "Comoros",
      "Congo",
      "Costa Rica",
      "Croatia",
      "Cuba",
      "Cyprus",
      "Czech Republic",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "East Timor",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Eswatini",
      "Ethiopia",
      "Fiji",
      "Finland",
      "France",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Greece",
      "Grenada",
      "Guatemala",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Honduras",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Ireland",
      "Israel",
      "Italy",
      "Ivory Coast",
      "Jamaica",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Korea, North",
      "Korea, South",
      "Kosovo",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Mauritania",
      "Mauritius",
      "Mexico",
      "Micronesia",
      "Moldova",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Morocco",
      "Mozambique",
      "Myanmar",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "North Macedonia",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Palestine",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Poland",
      "Portugal",
      "Qatar",
      "Romania",
      "Russia",
      "Rwanda",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Sweden",
      "Switzerland",
      "Syria",
      "Taiwan",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Togo",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Vatican City",
      "Venezuela",
      "Vietnam",
      "Yemen",
      "Zambia",
      "Zimbabwe",
    ]

    return (
      <>
        {inDialog ? (
          <DialogDescription className="mb-4">Update your personal information</DialogDescription>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mb-4">Update your personal information</p>
        )}

        <div className="space-y-4">
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
              className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={user.country} onValueChange={(value) => setUser({ ...user, country: value })}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
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
      </>
    )
  }

  // Data Sharing content component
  const DataSharingContent = ({ inDialog = true }) => (
    <>
      {inDialog ? (
        <DialogDescription className="mb-4">Control how your data is used and shared</DialogDescription>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mb-4">Control how your data is used and shared</p>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Usage Data</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">Share energy usage data to improve services</p>
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
            <p className="text-sm text-gray-500 dark:text-gray-400">Receive promotional offers and updates</p>
          </div>
          <Switch
            checked={settings.dataSharing.marketingEmails}
            onCheckedChange={(checked) => handleToggleChange("dataSharing", "marketingEmails", checked)}
          />
        </div>

        <div>
          <div className="pt-5 border-t" />
          <h4 className="text-sm font-medium mb-3">Account Deletion</h4>
          <Button variant="destructive" className="w-full">
            Request Account Deletion
          </Button>
        </div>
      </div>
    </>
  )

  // Security content component
  const SecurityContent = ({ inDialog = true }) => (
    <>
      {inDialog ? (
        <DialogDescription className="mb-4">Manage your security preferences and account protection</DialogDescription>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mb-4">Manage your security preferences and account protection</p>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Two-Factor Authentication</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
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
          <Label className="text-base">Password Expiry</Label>
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

        <div className="pt-5 border-t">
          <Button variant="outline" className="w-full">
            Change Password
          </Button>
        </div>
      </div>
    </>
  )

  // Notifications content component
  const NotificationsContent = ({ inDialog = true }) => (
    <>
      {inDialog ? (
        <DialogDescription className="mb-4">Customize your notification preferences</DialogDescription>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mb-4">Customize your notification preferences</p>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base">Notification Channels</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span className="text-sm">App Notifications</span>
              </div>
              <Switch
                checked={settings.notifications.appNotifications}
                onCheckedChange={(checked) => handleToggleChange("notifications", "appNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span className="text-sm">Email Notifications</span>
              </div>
              <Switch
                checked={settings.notifications.emailNotifications}
                onCheckedChange={(checked) => handleToggleChange("notifications", "emailNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span className="text-sm">SMS Notifications</span>
              </div>
              <Switch
                checked={settings.notifications.smsNotifications}
                onCheckedChange={(checked) => handleToggleChange("notifications", "smsNotifications", checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Alert Types</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Usage Alerts</span>
              <Switch
                checked={settings.notifications.usageAlerts}
                onCheckedChange={(checked) => handleToggleChange("notifications", "usageAlerts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Savings Goals</span>
              <Switch
                checked={settings.notifications.savingsGoals}
                onCheckedChange={(checked) => handleToggleChange("notifications", "savingsGoals", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Tips & Tricks</span>
              <Switch
                checked={settings.notifications.tipsAndTricks}
                onCheckedChange={(checked) => handleToggleChange("notifications", "tipsAndTricks", checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Quiet Hours</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="quiet-start" className="text-sm">
                Start Time
              </Label>
              <Input id="quiet-start" type="time" defaultValue="22:00" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="quiet-end" className="text-sm">
                End Time
              </Label>
              <Input id="quiet-end" type="time" defaultValue="07:00" />
            </div>
          </div>
        </div>
      </div>
    </>
  )

  // Members content component
  const MembersContent = ({ inDialog = true }) => {
    const loggedInUserId = 0 // Current user ID
    const isManager = user.role === "Household Manager"

    return (
      <>
        {inDialog ? (
          <DialogDescription className="mb-4">Manage household members and permissions</DialogDescription>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mb-4">Manage household members and permissions</p>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.username} (You)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
              </div>
            </div>
          </div>

          {users.length > 0 ? (
            users
              .filter((member) => member.user_id.toString() !== loggedInUserId.toString())
              .map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{member.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                    </div>
                  </div>
                  {isManager && (
                    <Button variant="ghost" size="sm" onClick={() => handleManageMember(member)}>
                      Manage
                    </Button>
                  )}
                </div>
              ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No other members found.</p>
          )}

          {isManager && (
            <Button className="w-full flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span>Invite New Member</span>
            </Button>
          )}

          {isManager && (
            <div className="space-y-2 pt-4 border-t">
              <Label className="text-base">Pending Invitations</Label>
              <div className="text-sm p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="font-medium">sarah@example.com</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sent 2 days ago</p>
                  <Button variant="link" size="sm" className="h-auto p-0">
                    Resend
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2 pt-4 border-t">
            <Label className="text-base">Household Code</Label>
            <div className="flex items-center space-x-2">
              <Input
                value={householdCode || "No household code found"}
                readOnly
                className="bg-gray-100 dark:bg-gray-800"
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (householdCode) {
                    navigator.clipboard.writeText(householdCode)
                    alert("Household code copied to clipboard!")
                  }
                }}
              >
                Copy
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Share this code to invite members to your household
            </p>
          </div>
        </div>
      </>
    )
  }

  // Member Permissions content component
  const MemberPermissionsContent = () => (
    <>
      <DialogDescription className="mb-4">Manage permissions for {selectedMember?.name || "Member"}</DialogDescription>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Control</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">Allow the user to turn on/off devices.</p>
          </div>
          <Switch
            checked={manageMemberPermissions.control}
            onCheckedChange={(checked) => setManageMemberPermissions({ ...manageMemberPermissions, control: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Configure</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">Allow the user to add, delete, and edit devices.</p>
          </div>
          <Switch
            checked={manageMemberPermissions.configure}
            onCheckedChange={(checked) =>
              setManageMemberPermissions({ ...manageMemberPermissions, configure: checked })
            }
          />
        </div>
      </div>
    </>
  )

  // Accessibility content component
  const AccessibilityContent = ({ inDialog = true }) => {
    const handleThemeChange = (value: string) => {
      if (value === "light") {
        setIsDarkMode(false)
      } else if (value === "dark") {
        setIsDarkMode(true)
      }
    }

    return (
      <>
        {inDialog ? (
          <DialogDescription className="mb-4">Customize your accessibility preferences</DialogDescription>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mb-4">Customize your accessibility preferences</p>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">High Contrast</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Increase color contrast</p>
            </div>
            <Switch
              checked={settings.accessibility.highContrast}
              onCheckedChange={(checked) => handleToggleChange("accessibility", "highContrast", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Large Text</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Increase text size</p>
            </div>
            <Switch
              checked={settings.accessibility.largeText}
              onCheckedChange={(checked) => handleToggleChange("accessibility", "largeText", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Screen Reader</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Compatible with screen readers</p>
            </div>
            <Switch
              checked={settings.accessibility.screenReader}
              onCheckedChange={(checked) => handleToggleChange("accessibility", "screenReader", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Reduce Motion</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Decrease animations and motion effects</p>
            </div>
            <Switch
              checked={settings.accessibility.reduceMotion}
              onCheckedChange={(checked) => handleToggleChange("accessibility", "reduceMotion", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>App Theme</Label>
            <RadioGroup
              defaultValue={settings.accessibility.theme}
              onValueChange={(value) => {
                setSettings({
                  ...settings,
                  accessibility: {
                    ...settings.accessibility,
                    theme: value,
                  },
                })
                handleThemeChange(value)
              }}
              className="flex gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system">System</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </>
    )
  }

  // Support content component
  const SupportContent = ({ inDialog = true }) => (
    <>
      {inDialog ? (
        <DialogDescription className="mb-4">Get help and support</DialogDescription>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mb-4">Get help and support</p>
      )}

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="support-subject">Subject</Label>
            <Select defaultValue="technical">
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="billing">Billing Question</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-message">Message</Label>
            <Textarea id="support-message" placeholder="Describe your issue..." className="min-h-[120px]" />
          </div>

          <Button className="w-full">Submit Ticket</Button>

          <div className="pt-4 space-y-3">
            <p className="text-sm font-medium">Or contact us directly:</p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <a href="mailto:support@plugsaver.com" className="text-sm text-blue-500 dark:text-blue-400">
                support@plugsaver.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <a href="tel:+97180012345" className="text-sm text-blue-500 dark:text-blue-400">
                +971 800 12345
              </a>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4 pt-4">
          <div className="space-y-3">
            {[
              {
                q: "How is my energy usage calculated?",
                a: "Your energy usage is calculated based on real-time data from your connected devices and smart meters.",
              },
              {
                q: "Can I connect devices from different manufacturers?",
                a: "Yes, Plug Saver supports a wide range of smart devices from various manufacturers.",
              },
              {
                q: "How accurate are the cost estimates?",
                a: "Our cost estimates are highly accurate as they use real-time electricity rates from your utility provider.",
              },
              {
                q: "How do I reset my password?",
                a: "You can reset your password by clicking on 'Forgot Password' on the login screen.",
              },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="font-medium text-sm">{item.q}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.a}</p>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full">
            View All FAQs
          </Button>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-4 pt-4">
          <div className="space-y-3">
            {[
              { title: "Getting Started with Plug Saver", duration: "5 min" },
              { title: "Connecting Smart Devices", duration: "8 min" },
              { title: "Understanding Your Dashboard", duration: "6 min" },
              { title: "Setting Energy-Saving Goals", duration: "4 min" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-md flex items-center justify-center text-blue-500 dark:text-blue-400">
                  <FileQuestion className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.duration} video tutorial</p>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full">
            View All Tutorials
          </Button>
        </TabsContent>
      </Tabs>
    </>
  )

  // Household content component
  const HouseholdContent = ({ inDialog = true }) => {
    const copyHouseholdCode = () => {
      if (householdCode) {
        navigator.clipboard.writeText(householdCode).then(() => {
          alert("Household code copied to clipboard!")
        })
      }
    }

    return (
      <>
        {inDialog ? (
          <DialogDescription className="mb-4">Manage your household settings</DialogDescription>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mb-4">Manage your household settings</p>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="household-name">Household Name</Label>
            <Input
              id="household-name"
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
            <Label htmlFor="household-code">Household Code</Label>
            <div className="relative">
              <Input
                id="household-code"
                value={householdCode || "No household code found"}
                readOnly
                className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed pr-10"
              />
              <button
                onClick={copyHouseholdCode}
                className="absolute inset-y-0 right-0 flex items-center px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-r-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="household-size">Household Size</Label>
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
              <SelectTrigger id="household-size">
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
            <Label htmlFor="household-rooms">Number of Rooms</Label>
            <Input
              id="household-rooms"
              type="number"
              min="1"
              value={settings.household.rooms}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  household: {
                    ...settings.household,
                    rooms: Number.parseInt(e.target.value) || 1,
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Enable device scheduling based on habits</p>
            </div>
            <Switch
              checked={settings.household.smartScheduling}
              onCheckedChange={(checked) => handleToggleChange("household", "smartScheduling", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Guest Access</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Allow temporary access for guests</p>
            </div>
            <Switch
              checked={settings.household.guestAccess}
              onCheckedChange={(checked) => handleToggleChange("household", "guestAccess", checked)}
            />
          </div>
        </div>
      </>
    )
  }

  // Dashboard content component
  const DashboardContent = ({ inDialog = true }) => (
    <>
      {inDialog ? (
        <DialogDescription className="mb-4">Customize your dashboard and widgets</DialogDescription>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mb-4">Customize your dashboard and widgets</p>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base">Dashboard Layout</Label>
          <div className="grid grid-cols-2 gap-3">
            <button className="border-2 border-blue-500 rounded-md p-2 flex flex-col items-center gap-1 bg-blue-50/10 dark:bg-blue-900/10">
              <div className="grid grid-cols-2 gap-1 w-full">
                <div className="aspect-video bg-blue-200/20 dark:bg-blue-200/10 rounded"></div>
                <div className="aspect-video bg-blue-200/20 dark:bg-blue-200/10 rounded"></div>
                <div className="aspect-video bg-blue-200/20 dark:bg-blue-200/10 rounded col-span-2"></div>
              </div>
              <span className="text-xs font-medium">Standard</span>
            </button>

            <button className="border-2 border-transparent hover:border-blue-500 rounded-md p-2 flex flex-col items-center gap-1">
              <div className="grid grid-cols-3 gap-1 w-full">
                <div className="aspect-video bg-blue-200/20 dark:bg-blue-200/10 rounded"></div>
                <div className="aspect-video bg-blue-200/20 dark:bg-blue-200/10 rounded"></div>
                <div className="aspect-video bg-blue-200/20 dark:bg-blue-200/10 rounded"></div>
                <div className="aspect-video bg-blue-200/20 dark:bg-blue-200/10 rounded col-span-3"></div>
              </div>
              <span className="text-xs font-medium">Compact</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base">Visible Widgets</Label>
          <div className="space-y-2">
            {[
              { id: "energy-usage", label: "Energy Usage", enabled: true },
              { id: "active-devices", label: "Active Devices", enabled: true },
              { id: "savings-chart", label: "Savings Chart", enabled: true },
              { id: "energy-tips", label: "Energy Saving Tips", enabled: true },
              { id: "carbon-footprint", label: "Carbon Footprint", enabled: true },
            ].map((widget) => (
              <div
                key={widget.id}
                className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
              >
                <span className="text-sm">{widget.label}</span>
                <Switch defaultChecked={widget.enabled} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Default Time Period</Label>
          <RadioGroup defaultValue="week" className="flex gap-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="day" id="period-day" />
              <Label htmlFor="period-day">Day</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="week" id="period-week" />
              <Label htmlFor="period-week">Week</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="month" id="period-month" />
              <Label htmlFor="period-month">Month</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="year" id="period-year" />
              <Label htmlFor="period-year">Year</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </>
  )

  // System content component
  const SystemContent = ({ inDialog = true }) => (
    <>
      {inDialog ? (
        <DialogDescription className="mb-4">Manage system settings</DialogDescription>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mb-4">Manage system settings</p>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base">Display</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Night Light</span>
              <Switch defaultChecked={false} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="brightness" className="text-sm">
                Screen Brightness
              </Label>
              <Input id="brightness" type="range" min="0" max="100" defaultValue="80" className="w-full" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Power Mode</Label>
          <RadioGroup defaultValue="balanced" className="space-y-2">
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <RadioGroupItem value="power-save" id="power-save" />
              <div>
                <Label htmlFor="power-save" className="font-medium">
                  Power Saver
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Conserve energy, reduce performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <RadioGroupItem value="balanced" id="balanced" />
              <div>
                <Label htmlFor="balanced" className="font-medium">
                  Balanced
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Recommended for most situations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <RadioGroupItem value="performance" id="performance" />
              <div>
                <Label htmlFor="performance" className="font-medium">
                  Performance
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Maximum capabilities, higher energy use</p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Device Shutdown</Label>
          <Select defaultValue="30">
            <SelectTrigger>
              <SelectValue placeholder="Select shutdown time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 dark:text-gray-400">Turn off devices after inactivity period</p>
        </div>
      </div>
    </>
  )

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

            {/* Dialog content */}
            {activeDialog === "profilePicture" && <ProfilePictureContent />}
            {activeDialog === "personalInfo" && <PersonalInfoContent />}
            {activeDialog === "dataSharing" && <DataSharingContent />}
            {activeDialog === "security" && <SecurityContent />}
            {activeDialog === "notifications" && <NotificationsContent />}
            {activeDialog === "members" && <MembersContent />}
            {activeDialog === "accessibility" && <AccessibilityContent />}
            {activeDialog === "support" && <SupportContent />}
            {activeDialog === "household" && <HouseholdContent />}
            {activeDialog === "dashboard" && <DashboardContent />}

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

        {/* Member Permissions Dialog */}
        <Dialog open={manageMemberDialogOpen} onOpenChange={setManageMemberDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Permissions</DialogTitle>
            </DialogHeader>
            <MemberPermissionsContent />
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
                      <Label
                        htmlFor="avatar-upload-desktop"
                        className="absolute bottom-0 right-0 cursor-pointer bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600"
                      >
                        <Camera className="h-4 w-4" />
                        <Input
                          id="avatar-upload-desktop"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                      </Label>
                    </div>
                    <div>
                      <h2 className="text-xl font-medium">{user.username}</h2>
                      <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => document.getElementById("avatar-upload-desktop")?.click()}
                      >
                        Change picture
                      </Button>
                    </div>

                    {saveSuccess && (
                      <div className="ml-auto bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 py-1 px-3 rounded-md flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">Saved</span>
                      </div>
                    )}
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
                          className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
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
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                            <SelectItem value="Germany">Germany</SelectItem>
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
                    <Button className="mt-4" onClick={handleUpdatePersonalInfo}>
                      Save changes
                    </Button>
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

              {selectedCategory === "accounts" && <MembersContent inDialog={false} />}
              {selectedCategory === "system" && <SystemContent inDialog={false} />}
              {selectedCategory === "accessibility" && <AccessibilityContent inDialog={false} />}
              {selectedCategory === "privacy" && <SecurityContent inDialog={false} />}
              {selectedCategory === "personalization" && <DashboardContent inDialog={false} />}

              {![
                "profile",
                "network",
                "energy",
                "accounts",
                "system",
                "accessibility",
                "privacy",
                "personalization",
              ].includes(selectedCategory || "") && (
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

      {/* Member Permissions Dialog */}
      <Dialog open={manageMemberDialogOpen} onOpenChange={setManageMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
          </DialogHeader>
          <MemberPermissionsContent />
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
    </div>
  )
}

