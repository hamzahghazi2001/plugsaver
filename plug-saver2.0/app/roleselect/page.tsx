"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Camera, Users, Home, UserPlus, Crown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

// List of all countries
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
  "Czechia (Czech Republic)",
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
  "Eswatini (fmr. Swaziland)",
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
  "Myanmar (formerly Burma)",
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

export default function RoleSelectionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") // Get email from query params
  const [selectedRole, setSelectedRole] = useState<"manager" | "member" | null>(null)
  const [householdCode, setHouseholdCode] = useState("")
  const [isRoleConfirmed, setIsRoleConfirmed] = useState(false)
  const [isProfileSetup, setIsProfileSetup] = useState(false) // New state for profile setup
  const [loading, setLoading] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [user, setUser] = useState<{ avatar: string | null }>({ avatar: null })
  const [username, setUsername] = useState(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      // Try to get username from localStorage, default to "Username" if not found
      return localStorage.getItem("username") || "Username"
    }
    return "Username"
  })
  const [country, setCountry] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("") // New state for date of birth
  const [isBudgetSetup, setIsBudgetSetup] = useState(false) // New state for budget setup
  const [budget, setBudget] = useState<number>(500) // Default budget value

  // Redirect if email is missing
  useEffect(() => {
    if (!email) {
      alert("Email not found. Please complete registration.")
      router.push("/register")
    }
  }, [email, router])

  useEffect(() => {
    const fetchHouseholdCode = async () => {
      try {
        const storedHouseholdCode = localStorage.getItem("household_code")
        if (!storedHouseholdCode && email) {
          const response = await fetch(`/api/auth/get_household_code?email=${encodeURIComponent(email)}`)
          const data = await response.json()

          if (data.success) {
            localStorage.setItem("household_code", data.household_code)
            setHouseholdCode(data.household_code) // Update state
          } else {
            console.error("Failed to fetch household code:", data.message)
          }
        }
      } catch (error) {
        console.error("Error fetching household code:", error)
      }
    }

    fetchHouseholdCode()
  }, [email])

  const generateHouseholdCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code = ""
    for (let i = 0; i < 7; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    setHouseholdCode(code)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(householdCode)
    alert("Code copied to clipboard!")
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (/^[A-Za-z0-9]{7}$/.test(text)) {
        setHouseholdCode(text)
      } else {
        alert("Invalid code! Please ensure it's a 7-digit/letter code.")
      }
    } catch (err) {
      alert("Failed to read from clipboard. Please paste manually.")
    }
  }

  const handleContinueClick = async () => {
    if (!email) {
      alert("Email not found. Please try again.")
      return
    }

    if (selectedRole === "manager" && householdCode) {
      try {
        const response = await fetch("/api/auth/create_household", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, household_code: householdCode }),
        })

        const data = await response.json()

        if (data.success) {
          localStorage.setItem("household_code", householdCode)
          setIsBudgetSetup(true) // Move to budget setup instead of profile setup
        } else {
          alert(data.message || "Failed to create household.")
        }
      } catch (err) {
        alert("An error occurred. Please try again.")
      }
    } else if (selectedRole === "member" && householdCode) {
      try {
        const response = await fetch("/api/auth/join_household", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, household_code: householdCode }),
        })

        const data = await response.json()

        if (data.success) {
          localStorage.setItem("household_code", householdCode)
          setIsProfileSetup(true) // Move to profile setup
        } else {
          alert(data.message || "Failed to join household.")
        }
      } catch (err) {
        alert("An error occurred. Please try again.")
      }
    } else {
      alert("Please complete the required steps.")
    }
  }

  const handleConfirmRole = () => {
    if (selectedRole) {
      setIsRoleConfirmed(true)
    }
  }

  const handleBackToRoleSelection = () => {
    if (isProfileSetup) {
      setIsProfileSetup(false)
      if (selectedRole === "manager") {
        setIsBudgetSetup(true)
      } else {
        setIsBudgetSetup(false)
        setIsRoleConfirmed(true)
      }
    } else if (isBudgetSetup) {
      setIsBudgetSetup(false)
      setIsRoleConfirmed(true)
    } else {
      setIsRoleConfirmed(false)
      setSelectedRole(null)
    }
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

  const handleConfirmProfile = async () => {
    try {
      const response = await fetch("/api/auth/setup_profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"), // Assuming you store user_id in localStorage
          username,
          date_of_birth: dateOfBirth,
          country,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store the profile information in localStorage
        localStorage.setItem("username", username)
        localStorage.setItem("date_of_birth", dateOfBirth)
        localStorage.setItem("country", country)

        // Redirect to the next page
        router.push("/devices")
      } else {
        alert(data.message || "Failed to setup profile.")
      }
    } catch (err) {
      alert("An error occurred. Please try again.")
    }
  }

  const handleBudgetConfirm = () => {
    // Save budget to localStorage
    localStorage.setItem("household_budget", budget.toString())
    // Move to profile setup
    setIsProfileSetup(true)
  }

  const handleBudgetChange = (value: number) => {
    // Ensure the value is within range
    const newValue = Math.min(Math.max(0, value), 1000)
    setBudget(newValue)
  }

  // Add this useEffect to load user data from localStorage when component mounts
  useEffect(() => {
    // Load saved user data from localStorage if available
    const savedUsername = localStorage.getItem("username")
    const savedDateOfBirth = localStorage.getItem("date_of_birth")
    const savedCountry = localStorage.getItem("country")

    if (savedUsername) setUsername(savedUsername)
    if (savedDateOfBirth) setDateOfBirth(savedDateOfBirth)
    if (savedCountry) setCountry(savedCountry)
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center p-4 md:p-8"
      style={{
        background: "linear-gradient(to top, #4ADE80, #22D3EE, #3B82F6)",
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Progress Bar Container */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-3xl mx-auto mb-8 border border-white/20">
        <div className="flex justify-between items-center relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 -translate-y-1/2 z-0 transition-all duration-500"
            style={{
              width: isProfileSetup
                ? "100%"
                : isBudgetSetup
                  ? "80%"
                  : isRoleConfirmed
                    ? householdCode
                      ? "60%"
                      : "40%"
                    : selectedRole
                      ? "20%"
                      : "0%",
            }}
          ></div>

          {/* Progress Step 1 */}
          <div className="flex flex-col items-center z-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center text-white font-bold shadow-md">
              ✓
            </div>
            <div className="text-sm font-medium text-gray-700 mt-2">Sign Up</div>
          </div>

          {/* Progress Step 2 */}
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-all duration-300 ${
                selectedRole
                  ? "bg-gradient-to-r from-blue-400 to-blue-600"
                  : isRoleConfirmed
                    ? "bg-gradient-to-r from-green-400 to-green-500"
                    : "bg-gray-300"
              }`}
            >
              {isRoleConfirmed ? "✓" : "2"}
            </div>
            <div className="text-sm font-medium text-gray-700 mt-2">Role</div>
          </div>

          {/* Progress Step 3 */}
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-all duration-300 ${
                householdCode
                  ? "bg-gradient-to-r from-blue-400 to-blue-600"
                  : isProfileSetup
                    ? "bg-gradient-to-r from-green-400 to-green-500"
                    : "bg-gray-300"
              }`}
            >
              {isProfileSetup ? "✓" : "3"}
            </div>
            <div className="text-sm font-medium text-gray-700 mt-2">Household</div>
          </div>

          {/* Progress Step 4 - Budget (only visible for managers) */}
          {selectedRole === "manager" && (
            <div className="flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-all duration-300 ${
                  isBudgetSetup
                    ? "bg-gradient-to-r from-blue-400 to-blue-600"
                    : isProfileSetup
                      ? "bg-gradient-to-r from-green-400 to-green-500"
                      : "bg-gray-300"
                }`}
              >
                {isProfileSetup ? "✓" : "4"}
              </div>
              <div className="text-sm font-medium text-gray-700 mt-2">Budget</div>
            </div>
          )}

          {/* Progress Step 5 (or 4 for members) - Profile */}
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-all duration-300 ${
                isProfileSetup ? "bg-gradient-to-r from-blue-400 to-blue-600" : "bg-gray-300"
              }`}
            >
              {selectedRole === "manager" ? "5" : "4"}
            </div>
            <div className="text-sm font-medium text-gray-700 mt-2">Profile</div>
          </div>
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="flex-1 flex items-center justify-center w-full">
        {!isRoleConfirmed ? (
          // Role Selection Card
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-3xl text-center border border-white/20 transition-all duration-300">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Select Your Role
            </h1>

            {/* Role Selection Cards */}
            <div className="flex flex-col md:flex-row justify-between gap-8">
              {/* Manager Role Card */}
              <div
                className={`flex-1 p-8 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedRole === "manager"
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30"
                    : "bg-white hover:shadow-lg border border-gray-200"
                }`}
                onClick={() => setSelectedRole("manager")}
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-md">
                  <Crown className={`w-16 h-16 ${selectedRole === "manager" ? "text-white" : "text-blue-600"}`} />
                </div>
                <div
                  className={`text-xl font-bold mb-2 ${selectedRole === "manager" ? "text-white" : "text-gray-800"}`}
                >
                  Household Manager
                </div>
                <p className={`text-sm ${selectedRole === "manager" ? "text-white/80" : "text-gray-600"}`}>
                  Create and manage your household's energy usage
                </p>
              </div>

              {/* Member Role Card */}
              <div
                className={`flex-1 p-8 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedRole === "member"
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30"
                    : "bg-white hover:shadow-lg border border-gray-200"
                }`}
                onClick={() => setSelectedRole("member")}
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-md">
                  <UserPlus className={`w-16 h-16 ${selectedRole === "member" ? "text-white" : "text-blue-600"}`} />
                </div>
                <div className={`text-xl font-bold mb-2 ${selectedRole === "member" ? "text-white" : "text-gray-800"}`}>
                  Household Member
                </div>
                <p className={`text-sm ${selectedRole === "member" ? "text-white/80" : "text-gray-600"}`}>
                  Join an existing household with an invite code
                </p>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              className={`w-full mt-10 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 transform ${
                selectedRole
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleConfirmRole}
              disabled={!selectedRole || loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading...
                </div>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        ) : selectedRole === "manager" && !isBudgetSetup && !isProfileSetup ? (
          // Household Manager Card
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-3xl text-center relative border border-white/20 transition-all duration-300">
            {/* Back Button */}
            <button
              className="absolute top-6 left-6 text-gray-600 hover:text-gray-800 bg-white/80 p-2 rounded-full shadow-md transition-all duration-300 hover:bg-white"
              onClick={handleBackToRoleSelection}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h1 className="text-3xl font-bold text-gray-800 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Household
            </h1>

            {/* House Image */}
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-md">
              <Home className="w-20 h-20 text-blue-600" />
            </div>

            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Generate a unique household code that you can share with family members so they can join your household.
            </p>

            {/* Generate Code Button */}
            <button
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 font-medium"
              onClick={generateHouseholdCode}
            >
              Generate Household Code
            </button>

            {/* Household Code and Copy Button */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Household Code"
                  value={householdCode}
                  readOnly
                  className="w-56 p-4 border border-gray-200 rounded-xl text-center text-lg font-medium shadow-inner bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {householdCode && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                )}
              </div>
              <button
                className="px-6 py-4 bg-gray-800 text-white rounded-xl shadow-md hover:bg-gray-700 transition-all duration-300"
                onClick={copyToClipboard}
              >
                Copy
              </button>
            </div>

            {/* Continue Button */}
            <button
              className={`w-full mt-10 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 transform ${
                householdCode
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleContinueClick}
              disabled={!householdCode || loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading...
                </div>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        ) : selectedRole === "manager" && isBudgetSetup && !isProfileSetup ? (
          // Budget Setup Card
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-3xl text-center relative border border-white/20 transition-all duration-300">
            {/* Back Button */}
            <button
              className="absolute top-6 left-6 text-gray-600 hover:text-gray-800 bg-white/80 p-2 rounded-full shadow-md transition-all duration-300 hover:bg-white"
              onClick={handleBackToRoleSelection}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h1 className="text-3xl font-bold text-gray-800 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Household Spending Budget
            </h1>

            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-md">
              <div className="text-blue-600 text-4xl font-bold">AED{budget}</div>
            </div>

            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Set your monthly household energy spending budget to help track and manage your energy costs.
            </p>

            {/* Budget Input and Slider */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">AED</span>
                <Input
                  type="number"
                  min="0"
                  max="1000"
                  value={budget}
                  onChange={(e) => handleBudgetChange(Number.parseInt(e.target.value) || 0)}
                  className="text-center text-xl font-bold"
                />
              </div>

              <div className="px-4">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>AED 0</span>
                  <span>AED 500</span>
                  <span>AED 1000</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={budget}
                  onChange={(e) => handleBudgetChange(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Continue Button */}
            <button
              className="w-full mt-10 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 transform bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
              onClick={handleBudgetConfirm}
            >
              Continue
            </button>
          </div>
        ) : selectedRole === "member" && !isProfileSetup ? (
          // Household Member Card
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-3xl text-center relative border border-white/20 transition-all duration-300">
            {/* Back Button */}
            <button
              className="absolute top-6 left-6 text-gray-600 hover:text-gray-800 bg-white/80 p-2 rounded-full shadow-md transition-all duration-300 hover:bg-white"
              onClick={handleBackToRoleSelection}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h1 className="text-3xl font-bold text-gray-800 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Join Household
            </h1>

            {/* House Image */}
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-md">
              <Users className="w-20 h-20 text-blue-600" />
            </div>

            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Enter the household code shared by your household manager to join their household.
            </p>

            {/* Household Code Input and Paste Button */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Household Code"
                  value={householdCode}
                  onChange={(e) => setHouseholdCode(e.target.value.toUpperCase())}
                  className="w-56 p-4 border border-gray-200 rounded-xl text-center text-lg font-medium shadow-inner bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={7}
                />
                {householdCode && householdCode.length === 7 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                )}
              </div>
              <button
                className="px-6 py-4 bg-gray-800 text-white rounded-xl shadow-md hover:bg-gray-700 transition-all duration-300"
                onClick={handlePaste}
              >
                Paste
              </button>
            </div>

            {/* Continue Button */}
            <button
              className={`w-full mt-10 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 transform ${
                householdCode && householdCode.length === 7
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleContinueClick}
              disabled={!householdCode || householdCode.length !== 7 || loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading...
                </div>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        ) : (
          // Profile Setup Card (for both manager and member)
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-3xl text-center relative border border-white/20 transition-all duration-300">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Complete Your Profile
            </h1>

            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                  <AvatarImage src={`${user.avatar}`} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-semibold">
                    {username ? username[0].toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110"
                >
                  <Camera className="w-5 h-5" />
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>

              <p className="text-gray-600 text-sm">Upload a profile picture (optional)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Username */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 text-left">
                  Username
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                />
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                  Email
                </label>
                <Input
                  id="email"
                  value={email || ""}
                  readOnly
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 shadow-sm"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 text-left">
                  Date of Birth
                </label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Country Selection */}
              <div className="space-y-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 text-left">
                  Country
                </label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="w-full p-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {countries.map((countryName) => (
                      <SelectItem key={countryName} value={countryName}>
                        {countryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Confirm Button */}
            <Button
              className="w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 transform bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
              onClick={handleConfirmProfile}
              disabled={!username || !dateOfBirth || !country || loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading...
                </div>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

