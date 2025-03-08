"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react" // Import back button icon

export default function RoleSelectionPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<"manager" | "member" | null>(null)
  const [householdCode, setHouseholdCode] = useState("")
  const [isRoleConfirmed, setIsRoleConfirmed] = useState(false) // Track if role is confirmed

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

  const handleContinueClick = () => {
    if (selectedRole === "manager" && householdCode) {
      router.push("/dashboard") // Redirect to dashboard
    } else if (selectedRole === "member" && householdCode) {
      router.push("/dashboard") // Redirect to dashboard
    } else {
      alert("Please complete the required steps.")
    }
  }

  const handleConfirmRole = () => {
    if (selectedRole) {
      setIsRoleConfirmed(true) // Confirm the selected role
    }
  }

  const handleBackToRoleSelection = () => {
    setIsRoleConfirmed(false) // Go back to role selection
    setSelectedRole(null) // Reset selected role
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center p-4"
      style={{
        background: "linear-gradient(to top, #4ADE80, #22D3EE, #3B82F6)",
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Progress Bar Container */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          {/* Progress Step 1 */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
              ✓
            </div>
            <div className="text-sm text-gray-600 mt-2">Sign Up</div>
          </div>

          {/* Progress Step 2 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                isRoleConfirmed ? "bg-green-500" : selectedRole ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              {isRoleConfirmed ? "✓" : "2"}
            </div>
            <div className="text-sm text-gray-600 mt-2">Role</div>
          </div>

          {/* Progress Step 3 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                householdCode ? "bg-green-500" : isRoleConfirmed ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              {householdCode ? "✓" : "3"}
            </div>
            <div className="text-sm text-gray-600 mt-2">Household</div>
          </div>
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="flex-1 flex items-center justify-center w-full">
        {!isRoleConfirmed ? (
          // Role Selection Card
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Select Your Role</h1>

            {/* Role Selection Cards */}
            <div className="flex flex-col md:flex-row justify-between gap-6">
              {/* Manager Role Card */}
              <div
                className={`flex-1 p-6 rounded-lg shadow-md cursor-pointer transition-all duration-200 ${
                  selectedRole === "manager"
                    ? "bg-blue-600"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedRole("manager")}
              >
                <img
                  src="https://via.placeholder.com/150" // Replace with your external manager image URL
                  alt="Manager Role"
                  className="w-20 h-20 mx-auto mb-4 rounded-lg object-cover"
                />
                <div
                  className={`text-lg font-bold ${
                    selectedRole === "manager" ? "text-white" : "text-gray-800"
                  }`}
                >
                  Manager
                </div>
              </div>

              {/* Member Role Card */}
              <div
                className={`flex-1 p-6 rounded-lg shadow-md cursor-pointer transition-all duration-200 ${
                  selectedRole === "member"
                    ? "bg-blue-600"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedRole("member")}
              >
                <img
                  src="https://via.placeholder.com/150" // Replace with your external member image URL
                  alt="Member Role"
                  className="w-20 h-20 mx-auto mb-4 rounded-lg object-cover"
                />
                <div
                  className={`text-lg font-bold ${
                    selectedRole === "member" ? "text-white" : "text-gray-800"
                  }`}
                >
                  Member
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              className={`w-full mt-8 py-3 rounded-lg text-white font-bold transition-all duration-200 ${
                selectedRole ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleConfirmRole}
              disabled={!selectedRole}
            >
              Confirm
            </button>
          </div>
        ) : selectedRole === "manager" ? (
          // Household Manager Card
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-center relative">
            {/* Back Button */}
            <button
              className="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
              onClick={handleBackToRoleSelection}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Household</h1>

            {/* House Emoji/Image */}
            <img
              src="https://via.placeholder.com/150" // Replace with your external house image URL
              alt="House"
              className="w-20 h-20 mx-auto mb-6 rounded-lg object-cover"
            />

            {/* Generate Code Button */}
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
              onClick={generateHouseholdCode}
            >
              Generate Household Code
            </button>

            {/* Household Code and Copy Button */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <input
                type="text"
                placeholder="Household Code"
                value={householdCode}
                readOnly
                className="w-40 p-2 border border-gray-300 rounded-lg text-center"
              />
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
                onClick={copyToClipboard}
              >
                Copy
              </button>
            </div>

            {/* Continue Button */}
            <button
              className={`w-full mt-6 py-3 rounded-lg text-white font-bold transition-all duration-200 ${
                householdCode ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleContinueClick}
              disabled={!householdCode}
            >
              Continue
            </button>
          </div>
        ) : (
          // Household Member Card
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-center relative">
            {/* Back Button */}
            <button
              className="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
              onClick={handleBackToRoleSelection}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Join Household</h1>

            {/* House Emoji/Image */}
            <img
              src="https://via.placeholder.com/150" // Replace with your external house image URL
              alt="House"
              className="w-20 h-20 mx-auto mb-6 rounded-lg object-cover"
            />

            {/* Household Code Input and Paste Button */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <input
                type="text"
                placeholder="Enter Household Code"
                value={householdCode}
                onChange={(e) => setHouseholdCode(e.target.value)}
                className="w-48 p-2 border border-gray-300 rounded-lg text-center"
                maxLength={7}
              />
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
                onClick={handlePaste}
              >
                Paste
              </button>
            </div>

            {/* Continue Button */}
            <button
              className={`w-full mt-6 py-3 rounded-lg text-white font-bold transition-all duration-200 ${
                householdCode ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleContinueClick}
              disabled={!householdCode}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  )
}