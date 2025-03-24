"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  UserPlus,
  Settings,
  Sun,
  Moon,
} from "lucide-react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = "https://xgcfvxwrcunwsrvwwjjx.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnY2Z2eHdyY3Vud3Nydnd3amp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5OTIzNzIsImV4cCI6MjA1MzU2ODM3Mn0.fgT2LL7dlx7VR185WABZCtK8ZdF4rpdOIy-crGpp6tU"
const supabase = createClient(supabaseUrl, supabaseKey)

export default function SettingsPage() {
  const router = useRouter()

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
  const [managerId, setManagerId] = useState<number | null>(null) // Track the manager ID
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null) // Track the selected member ID

  const loggedInUserId = Number(localStorage.getItem("user_id"))

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

  useEffect(() => {
    const fetchHouseholdUsers = async () => {
      const household_code = localStorage.getItem("household_code")
      const user_id = localStorage.getItem("user_id")

      if (!household_code || !user_id) {
        setError("Household code or user ID not found in localStorage")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/auth/get_householdusers?household_code=${household_code}`)
        const data = await response.json()

        if (data.success) {
          // Find the current user (manager or member)
          const currentUser = data.users.find((user: any) => user.user_id.toString() === user_id.toString())

          if (currentUser) {
            // Set the current user's details
            setUser((prev) => ({
              ...prev,
              username: currentUser.name || prev.username,
              email: currentUser.email || prev.email,
              country: currentUser.country || prev.country,
              birthdate: currentUser.dob || prev.birthdate,
              role: currentUser.role || prev.role,
            }))

            // Filter out the current user from the list of household members
            const otherUsers = data.users.filter((user: any) => user.user_id.toString() !== user_id.toString())

            // Set the list of all household members (excluding the current user)
            setUsers(otherUsers)

            // Find the manager ID
            const manager = data.users.find((user: any) => user.role === "manager")
            if (manager) {
              setManagerId(Number(manager.user_id)) // Set the manager ID
            }

            // Set the household code
            setHouseholdCode(household_code)
          } else {
            setError("Current user not found in household")
          }
        } else {
          setError(data.message || "Failed to fetch household users")
        }
      } catch (error) {
        console.error("Error fetching household users:", error)
        setError("An error occurred while fetching household users")
      } finally {
        setLoading(false)
      }
    }

    fetchHouseholdUsers()
  }, [])

  // Fetch username, country, email, and household code from localStorage on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      const user_id = localStorage.getItem("user_id") // Get user_id from localStorage
      if (!user_id) {
        console.error("User ID not found in localStorage")
        return
      }

      try {
        const response = await fetch(`/api/auth/get_user_details?user_id=${user_id}`)
        const data = await response.json()

        if (data.success) {
          // Update the user state with fetched details
          setUser((prev) => ({
            ...prev,
            username: data.user.name || prev.username,
            email: data.user.email || prev.email,
            country: data.user.country || prev.country,
            birthdate: data.user.dob || prev.birthdate,
          }))
        } else {
          console.error("Failed to fetch user details:", data.message)
        }
      } catch (error) {
        console.error("Error fetching user details:", error)
      }
    }

    fetchUserDetails()
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
      locationData: true,
      marketingEmails: true,
    },
    security: {
      twoFactorAuth: false,
      rememberDevice: true,
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
      theme: "system",
    },
    household: {
      autoSaving: true,
      smartScheduling: true,
      guestAccess: false,
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      alert("No file selected.")
      return
    }

    const userId = localStorage.getItem("user_id")
    if (!userId) {
      alert("User ID not found. Please log in again.")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("user_id", userId) // Ensure user_id is sent as a form field

    try {
      const response = await fetch("/api/auth/profile_pic", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      console.log("POST Response:", result)

      if (!result.success) {
        throw new Error(result.message)
      }

      // Update the local state with the new avatar URL
      setUser((prev) => ({ ...prev, avatar: result.avatar_url }))
      alert("Profile picture updated successfully!")
    } catch (error) {
      console.error("Error uploading avatar:", error)
      alert("An error occurred while uploading the avatar.")
    }
  }

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const userId = localStorage.getItem("user_id")
      if (!userId) return

      try {
        const response = await fetch(`/api/auth/profile_pic?user_id=${encodeURIComponent(userId)}`)
        const result = await response.json()

        if (result.success && result.avatar_url) {
          // Update the local state with the fetched avatar URL
          setUser((prev) => ({ ...prev, avatar: result.avatar_url }))

          // Debug: Log the fetched avatar URL
          console.log("Fetched Avatar URL:", result.avatar_url)
        } else {
          console.error("Error fetching profile picture:", result)
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error)
      }
    }

    fetchProfilePicture()
  }, [])

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

  // Get appropriate component based on screen size
  const SettingsItem = ({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) => (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center justify-between p-3 rounded-md hover:bg-purple-50/10"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 flex items-center justify-center text-purple-400">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </motion.button>
  )

  // Profile settings content
  const ProfilePictureContent = ({ inDialog = true }) => (
    <>
      {inDialog ? (
        <DialogDescription className="text-center mb-4">
          Upload a new profile picture from your device
        </DialogDescription>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mb-4">
          Upload a new profile picture from your device
        </p>
      )}

      <div className="flex flex-col items-center gap-4 mb-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={`${user.avatar}`} />
          <AvatarFallback>{user.username[0]}</AvatarFallback>
        </Avatar>

        <Label
          htmlFor="avatar-upload"
          className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          <span>Upload Photo</span>
          <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </Label>
      </div>
    </>
  )

  const PersonalInfoContent = ({ inDialog = true }) => {
    // Comprehensive list of all countries
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
      "Côte d'Ivoire",
      "Cabo Verde",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Central African Republic",
      "Chad",
      "Chile",
      "China",
      "Colombia",
      "Comoros",
      "Congo (Congo-Brazzaville)",
      "Costa Rica",
      "Croatia",
      "Cuba",
      "Cyprus",
      "Czechia",
      "Democratic Republic of the Congo",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
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
      "Holy See",
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
      "Jamaica",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
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
      "Myanmar (Burma)",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "North Korea",
      "North Macedonia",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Palestine State",
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
      "South Korea",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Sweden",
      "Switzerland",
      "Syria",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Timor-Leste",
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
      "United States of America",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
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
              className="bg-gray-100 dark:bg-gray-700 dark:text-white cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={user.country} // Use 'country' from the user state
              onValueChange={(value) => setUser({ ...user, country: value })} // Update 'country' in the user state
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {" "}
                {/* Scrollable dropdown */}
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
            <p className="text-sm text-gray-400">Share energy usage data to improve services</p>
          </div>
          <Switch
            checked={settings.dataSharing.usageData}
            onCheckedChange={(checked) => handleToggleChange("dataSharing", "usageData", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Location Data</Label>
            <p className="text-sm text-gray-400">Allow access to your location data</p>
          </div>
          <Switch
            checked={settings.dataSharing.locationData}
            onCheckedChange={(checked) => handleToggleChange("dataSharing", "locationData", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Marketing Emails</Label>
            <p className="text-sm text-gray-400">Receive promotional offers and updates</p>
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
            <p className="text-sm text-gray-400">Add an extra layer of security</p>
          </div>
          <span className="text-sm text-green-500">Enabled</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Remember Device</Label>
            <p className="text-sm text-gray-400">Stay logged in on this device</p>
          </div>
          <Switch
            checked={settings.security.rememberDevice}
            onCheckedChange={(checked) => handleToggleChange("security", "rememberDevice", checked)}
          />
        </div>

        <div className="pt-5 border-t">
  <Button 
    variant="outline" 
    className="w-full"
    onClick={() => router.push('/changepassword')}
  >
    Change Password
  </Button>
</div>
      </div>
    </>
  )

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
                <Mail className="w-4 h-4 text-purple-500" />
                <span className="text-sm">Email Notifications</span>
              </div>
              <Switch
                checked={settings.notifications.emailNotifications}
                onCheckedChange={(checked) => handleToggleChange("notifications", "emailNotifications", checked)}
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
      </div>
    </>
  )

  const MembersContent = ({
    managerId,
    householdCode,
    inDialog = true,
  }: { managerId: number | null; householdCode: string | null; inDialog?: boolean }) => {
    const loggedInUserId = localStorage.getItem("user_id") // Get the logged-in user's ID
    const isManager = user.role === "manager" // Check if the logged-in user is a manager
    //const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null); // Track the selected member ID

    const handleManageClick = (memberId: number) => {
      setSelectedMemberId(Number(memberId)) // Set the selected member ID
      setManageMemberDialogOpen(true) // Open the permissions dialog
    }

    return (
      <>
        {inDialog ? (
          <DialogDescription className="mb-4">Manage household members and permissions</DialogDescription>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mb-4">Manage household members and permissions</p>
        )}

        <div className="space-y-6">
          {/* Current User (Logged-In User) */}
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.username} (You)</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          </div>

          {/* List of Other Household Members */}
          {users.length > 0 ? (
            users
              .filter((member) => member.user_id !== loggedInUserId) // Filter out the logged-in user
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
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  {/* Show "Manage" button only if the logged-in user is a manager */}
                  {isManager && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleManageClick(member.user_id)} // Pass the member ID
                    >
                      Manage
                    </Button>
                  )}
                </div>
              ))
          ) : (
            <p className="text-sm text-gray-500">No other members found.</p>
          )}

          {/* Invite New Member Button (Only for Managers) */}
          {isManager && (
            <Button className="w-full flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span>Invite New Member</span>
            </Button>
          )}
        </div>

        {/* Member Permissions Dialog */}
        <Dialog open={manageMemberDialogOpen} onOpenChange={setManageMemberDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Permissions</DialogTitle>
            </DialogHeader>
            <MemberPermissionsContent
              memberId={selectedMemberId} // Pass the selected member ID
              managerId={managerId} // Pass the manager ID
              householdCode={householdCode} // Pass the household code
            />
          </DialogContent>
        </Dialog>
      </>
    )
  }

  const MemberPermissionsContent = ({
    memberId,
    managerId,
    householdCode,
  }: {
    memberId: number | null
    managerId: number | null
    householdCode: string | null
  }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [manageMemberPermissions, setManageMemberPermissions] = useState({
      control: true,
      configure: true,
    })

    const handleSavePermissions = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log("Saving permissions for member ID:", memberId)
        console.log("Manager ID:", managerId)
        console.log("Household Code:", householdCode)
        console.log("control:", manageMemberPermissions.control)
        console.log("configure:", manageMemberPermissions.configure)

        if (!memberId || !managerId || !householdCode) {
          throw new Error("Missing required information.")
        }

        const response = await fetch("/api/auth/update_permission", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberId,
            managerId,
            householdCode,
            canControl: manageMemberPermissions.control,
            canConfigure: manageMemberPermissions.configure,
          }),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || "Failed to update permissions.")
        }

        alert("Permissions updated successfully!")

        // Set saveSuccess to true to show the success message
        setSaveSuccess(true)

        // Reset saveSuccess after a short delay
        setTimeout(() => {
          setSaveSuccess(false)
        }, 2000) // Reset after 2 seconds

        // Close the dialog
        setManageMemberDialogOpen(false)
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred.")
      } finally {
        setLoading(false)
      }
    }

    return (
      <>
        <DialogDescription className="mb-4">Manage permissions for {memberId}</DialogDescription>

        <div className="space-y-6">
          {/* Control Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Control</Label>
              <p className="text-sm text-gray-500">Allow the user to turn on/off the device.</p>
            </div>
            <Switch
              checked={manageMemberPermissions.control}
              onCheckedChange={(checked) =>
                setManageMemberPermissions({ ...manageMemberPermissions, control: checked })
              }
            />
          </div>

          {/* Configure Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Configure</Label>
              <p className="text-sm text-gray-500">Allow the user to add, delete, and edit devices.</p>
            </div>
            <Switch
              checked={manageMemberPermissions.configure}
              onCheckedChange={(checked) =>
                setManageMemberPermissions({ ...manageMemberPermissions, configure: checked })
              }
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <DialogFooter>
            <Button onClick={handleSavePermissions} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </div>
      </>
    )
  }

  const AccessibilityContent = ({ inDialog = true }) => {
    // Handle theme change
    const handleThemeChange = (value: string) => {
      if (value === "light") {
        setIsDarkMode(false) // Disable dark mode
      } else if (value === "dark") {
        setIsDarkMode(true) // Enable dark mode
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
              <p className="text-sm text-gray-400">Increase color contrast</p>
            </div>
            <Switch
              checked={settings.accessibility.highContrast}
              onCheckedChange={(checked) => handleToggleChange("accessibility", "highContrast", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Large Text</Label>
              <p className="text-sm text-gray-400">Increase text size</p>
            </div>
            <Switch
              checked={settings.accessibility.largeText}
              onCheckedChange={(checked) => handleToggleChange("accessibility", "largeText", checked)}
            />
          </div>

       
        </div>
      </>
    )
  }

  const SupportContent = ({ inDialog = true }) => (
    <>
      {inDialog ? (
        <DialogDescription className="mb-4">Get help and support</DialogDescription>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mb-4">Get help and support</p>
      )}

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
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
              <Mail className="w-4 h-4 text-purple-500" />
              <a href="mailto:plugsaver7@gmail.com" className="text-sm text-purple-500">
                plugsaver7@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2"></div>
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
                <p className="text-xs text-gray-500 mt-1">{item.a}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  )

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
            <Label htmlFor="household-code">Household Code</Label>
            <div className="relative">
              <Input
                id="household-code"
                value={householdCode || "No household code found"}
                readOnly
                className="bg-gray-100 dark:bg-gray-700 dark:text-white cursor-not-allowed pr-10"
              />
              <button
                onClick={copyHouseholdCode}
                className="absolute inset-y-0 right-0 flex items-center px-3 bg-gray-100 hover:bg-gray-200 rounded-r-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
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

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Auto-Saving Mode</Label>
              <p className="text-sm text-gray-400">Automatically optimize energy usage</p>
            </div>
            <Switch
              checked={settings.household.autoSaving}
              onCheckedChange={(checked) => handleToggleChange("household", "autoSaving", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Smart Scheduling</Label>
              <p className="text-sm text-gray-400">Enable device scheduling based on habits</p>
            </div>
            <Switch
              checked={settings.household.smartScheduling}
              onCheckedChange={(checked) => handleToggleChange("household", "smartScheduling", checked)}
            />
          </div>
        </div>
      </>
    )
  }

  const DashboardContent = ({ inDialog = true }) => (
    <>
      {inDialog ? (
        <DialogDescription className="mb-4">Customize your dashboard and widgets</DialogDescription>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mb-4">Customize your dashboard and widgets</p>
      )}

      

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
          <RadioGroup defaultValue="day" className="flex gap-3">
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
      
    </>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Updated Header Section */}
      <div className="bg-gradient-to-b from-purple-500 via-purple-400 to-purple-100 dark:to-purple-900/30 pb-16 relative overflow-hidden min-h-[200px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Settings</h1>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full backdrop-blur-md bg-white/10 border-white/20"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 shadow-lg backdrop-blur-sm bg-opacity-95 dark:bg-opacity-90 border border-white/20 dark:border-gray-700/30 transform transition-all duration-300 hover:shadow-xl mb-6 md:mb-8 lg:mb-12">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
              <div className="relative group">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-3 md:border-4 border-purple-100 dark:border-purple-900 shadow-md">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold text-lg md:text-xl">
                    {user.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute inset-0 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => openDialog("profilePicture")}
                >
                  <Camera className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>
              <div className="text-center md:text-left mt-2 md:mt-0">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-lg md:text-2xl">{user.username}</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Personal Information</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start mt-1 md:mt-2 gap-1 md:gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {user.role}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {user.country}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Updated Settings Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 lg:-mt-24 pb-16">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-8 border border-purple-100 dark:border-purple-900/50 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-90 transform transition-all duration-300 hover:shadow-2xl overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-xl opacity-70"></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-xl opacity-70"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-gradient-to-r from-purple-50/30 via-transparent to-purple-50/30 dark:from-purple-900/10 dark:via-transparent dark:to-purple-900/10 rounded-full blur-3xl -z-10"></div>
          <div className="md:grid md:grid-cols-12 md:divide-x dark:divide-gray-700">
            {/* Sidebar for desktop */}
            <div className="hidden md:block md:col-span-3 lg:col-span-3 bg-gray-50 dark:bg-gray-900/50">
              <nav className="py-6 px-4">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-3">
                      Profile
                    </h3>
                    <div className="space-y-1">
                      <button
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
                          activeDialog === "profilePicture"
                            ? "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => openDialog("profilePicture")}
                      >
                        <User className="w-5 h-5 text-purple-500" />
                        <span>Profile Picture</span>
                      </button>
                      <button
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
                          activeDialog === "personalInfo"
                            ? "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => openDialog("personalInfo")}
                      >
                        <Info className="w-5 h-5 text-purple-500" />
                        <span>Personal Information</span>
                      </button>
                      <button
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
                          activeDialog === "dataSharing"
                            ? "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => openDialog("dataSharing")}
                      >
                        <Share2 className="w-5 h-5 text-purple-500" />
                        <span>Data Sharing</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-3">
                      Account & App
                    </h3>
                    <div className="space-y-1">
                      <button
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
                          activeDialog === "security"
                            ? "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => openDialog("security")}
                      >
                        <Shield className="w-5 h-5 text-purple-500" />
                        <span>Security</span>
                      </button>
                      <button
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
                          activeDialog === "notifications"
                            ? "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => openDialog("notifications")}
                      >
                        <Bell className="w-5 h-5 text-purple-500" />
                        <span>Notifications</span>
                      </button>
                      <button
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
                          activeDialog === "members"
                            ? "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => openDialog("members")}
                      >
                        <Users className="w-5 h-5 text-purple-500" />
                        <span>Members</span>
                      </button>
                      <button
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
                          activeDialog === "accessibility"
                            ? "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => openDialog("accessibility")}
                      >
                        <Accessibility className="w-5 h-5 text-purple-500" />
                        <span>Accessibility</span>
                      </button>
                      <button
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
                          activeDialog === "support"
                            ? "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => openDialog("support")}
                      >
                        <HelpCircle className="w-5 h-5 text-purple-500" />
                        <span>Support</span>
                      </button>
                      <button
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
                          activeDialog === "household"
                            ? "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => openDialog("household")}
                      >
                        <Home className="w-5 h-5 text-purple-500" />
                        <span>Household</span>
                      </button>
                      <button
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
                          activeDialog === "dashboard"
                            ? "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => openDialog("dashboard")}
                      >
                        <LayoutDashboard className="w-5 h-5 text-purple-500" />
                        <span>Dashboard</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-8 px-3">
                  <Button
                    variant="outline"
                    className="w-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </div>
              </nav>
            </div>

            {/* Mobile view */}
            <div className="md:hidden p-6 space-y-8">
              <section>
                <h2 className="text-lg font-medium text-purple-600 dark:text-purple-400 mb-3 flex items-center">
                  <span className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-md mr-2">
                    <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </span>
                  Profile
                </h2>
                <div className="space-y-1 bg-gray-50 dark:bg-gray-900/30 rounded-lg overflow-hidden">
                  <SettingsItem icon={User} label="Profile Picture" onClick={() => openDialog("profilePicture")} />
                  <SettingsItem icon={Info} label="Personal Information" onClick={() => openDialog("personalInfo")} />
                  <SettingsItem
                    icon={Share2}
                    label="Data Sharing Preferences"
                    onClick={() => openDialog("dataSharing")}
                  />
                </div>
              </section>
              <section>
                <h2 className="text-lg font-medium text-purple-600 dark:text-purple-400 mb-3 flex items-center">
                  <span className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-md mr-2">
                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </span>
                  Account and App
                </h2>
                <div className="space-y-1 bg-gray-50 dark:bg-gray-900/30 rounded-lg overflow-hidden">
                  <SettingsItem icon={Shield} label="Security and Privacy" onClick={() => openDialog("security")} />
                  <SettingsItem icon={Bell} label="Notifications" onClick={() => openDialog("notifications")} />
                  <SettingsItem icon={Users} label="Members" onClick={() => openDialog("members")} />
                  <SettingsItem
                    icon={Accessibility}
                    label="Accessibility"
                    onClick={() => openDialog("accessibility")}
                  />
                  <SettingsItem icon={HelpCircle} label="Support" onClick={() => openDialog("support")} />
                  <SettingsItem icon={Home} label="Household" onClick={() => openDialog("household")} />
                  <SettingsItem icon={LayoutDashboard} label="Dashboard" onClick={() => openDialog("dashboard")} />
                </div>
              </section>
              <Button
                variant="outline"
                className="w-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>

            {/* Main content area for desktop */}
            <div className="hidden md:block md:col-span-9 lg:col-span-9 p-8">
              {activeDialog === null ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                    <Settings className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Settings Dashboard</h2>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                    Select a settings category from the sidebar to customize your Plug Saver experience.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {[
                      { icon: User, label: "Profile", dialog: "profilePicture" },
                      { icon: Shield, label: "Security", dialog: "security" },
                      { icon: Bell, label: "Notifications", dialog: "notifications" },
                      { icon: Users, label: "Members", dialog: "members" },
                      { icon: Home, label: "Household", dialog: "household" },
                      { icon: LayoutDashboard, label: "Dashboard", dialog: "dashboard" },
                    ].map((item) => (
                      <button
                        key={item.dialog}
                        className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => openDialog(item.dialog)}
                      >
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3">
                          <item.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  {activeDialog === "profilePicture" && (
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Profile Picture</h2>
                      <ProfilePictureContent inDialog={false} />
                      
                    </div>
                  )}
                  {activeDialog === "personalInfo" && (
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                        Personal Information
                      </h2>
                      <PersonalInfoContent inDialog={false} />
                      <div className="mt-8 flex justify-end">
                        {saveSuccess && (
                          <p className="text-green-500 flex items-center text-sm mr-4">
                            <CheckCircle className="w-4 h-4 mr-1" /> Saved successfully
                          </p>
                        )}
                        <Button onClick={handleSave}>Save Changes</Button>
                      </div>
                    </div>
                  )}
                  {activeDialog === "dataSharing" && (
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                        Data Sharing Preferences
                      </h2>
                      <DataSharingContent inDialog={false} />
                      
                    </div>
                  )}
                  {activeDialog === "security" && (
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                        Security and Privacy
                      </h2>
                      <SecurityContent inDialog={false} />
                      
                    </div>
                  )}
                  {activeDialog === "notifications" && (
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Notifications</h2>
                      <NotificationsContent inDialog={false} />
                      <div className="mt-8 flex justify-end">
                        {saveSuccess && (
                          <p className="text-green-500 flex items-center text-sm mr-4">
                            <CheckCircle className="w-4 h-4 mr-1" /> Saved successfully
                          </p>
                        )}
                        <Button onClick={handleSave}>Save Changes</Button>
                      </div>
                    </div>
                  )}
                  {activeDialog === "members" && (
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Members</h2>
                      <MembersContent inDialog={false} managerId={managerId} householdCode={householdCode} />
                    
                    </div>
                  )}
                  {activeDialog === "accessibility" && (
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Accessibility</h2>
                      <AccessibilityContent inDialog={false} />
                      
                    </div>
                  )}
                  {activeDialog === "support" && (
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Support</h2>
                      <SupportContent inDialog={false} />
                    
                    </div>
                  )}
                  {activeDialog === "household" && (
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Household</h2>
                      <HouseholdContent inDialog={false} />
                      <div className="mt-8 flex justify-end">
                        {saveSuccess && (
                          <p className="text-green-500 flex items-center text-sm mr-4">
                            <CheckCircle className="w-4 h-4 mr-1" /> Saved successfully
                          </p>
                        )}
                        <Button onClick={handleSave}>Save Changes</Button>
                      </div>
                    </div>
                  )}
                  {activeDialog === "dashboard" && (
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Dashboard</h2>
                      <DashboardContent inDialog={false} />
                      <div className="mt-8 flex justify-end">
                        {saveSuccess && (
                          <p className="text-green-500 flex items-center text-sm mr-4">
                            <CheckCircle className="w-4 h-4 mr-1" /> Saved successfully
                          </p>
                        )}
                        <Button onClick={handleSave}>Save Changes</Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

