"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [twoFACode, setTwoFACode] = useState("")
  const [isCodeValid, setIsCodeValid] = useState(false)
  const [email, setEmail] = useState("")
  const [householdCode, setHouseholdCode] = useState("")
  const [verifyButtonText, setVerifyButtonText] = useState("Verify")
  const [isVerifying, setIsVerifying] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    setEmail(email) // Store the email in state

    try {
      console.log("Sending login request...")
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("Response received:", response)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Invalid email or password")
      }

      const data = await response.json()
      console.log("Response data:", data)

      if (data.success) {
        setShow2FAModal(true)
        startTimer()
      } else {
        setError(data.message || "Invalid Login Credentials")
      }
    } catch (err: any) {
      console.error("Error during login:", err)
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchHouseholdCode = async (email: string) => {
    try {
      const response = await fetch(`/api/auth/gethouseholdcode?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (data.success) {
        localStorage.setItem("household_code", data.household_code)
        setHouseholdCode(data.household_code)
        console.log("Household code stored in localStorage:", data.household_code)
      } else {
        console.error("Failed to fetch household code:", data.message)
      }
    } catch (error) {
      console.error("Error fetching household code:", error)
    }
  }

  const handleVerifyClick = async () => {
    setIsVerifying(true)
    setVerifyButtonText("Verifying...")

    try {
      const response = await fetch("/api/auth/verify_login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, userverifycode: twoFACode }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("user_id", data.user_id)
        localStorage.setItem("email", email)
        console.log("User ID stored in localStorage:", data.user_id)

        // Fetch and store the household code ONLY after successful 2FA verification
        await fetchHouseholdCode(email)

        const nextUrl = searchParams.get("next") || "/home"
        router.push(nextUrl)
        router.refresh()
      } else {
        setError(data.message || "Verification failed.")
        alert("Verification failed. Please try again.")
        setVerifyButtonText("Verify")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      alert("An error occurred. Please try again.")
      setVerifyButtonText("Verify")
    } finally {
      setIsVerifying(false)
    }
  }

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(interval)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
  }

  const handleResendCode = () => {
    setTimeLeft(60)
    startTimer()
  }

  const handleCloseModal = () => {
    setShow2FAModal(false)
    setTimeLeft(60)
    setTwoFACode("")
    setIsCodeValid(false)
  }

  const handleTwoFACodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d{0,6}$/.test(value)) {
      setTwoFACode(value)
      setIsCodeValid(value.length === 6)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: "linear-gradient(to top, #4ADE80, #22D3EE, #3B82F6)",
        color: "white",
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Main Card */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Login</h1>
        <p className="text-sm text-gray-600 mb-6">Enter your email and password to login</p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-400"
            />
            <Link href="/changepassword" className="block text-right text-blue-600 hover:text-blue-500 text-sm mt-1">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "SIGN IN"}
          </Button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-500 font-semibold">
            Register
          </Link>
        </div>
      </div>

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center relative">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            >
              ×
            </button>

            <h2 className="text-xl font-bold text-blue-600 mb-2">Two-Factor Authentication</h2>
            <p className="text-sm text-gray-600 mb-4">Enter the 6 Digit Code Sent To Your Email</p>

            <Input
              type="text"
              placeholder="Enter 6 Digit Code"
              value={twoFACode}
              onChange={handleTwoFACodeChange}
              className="w-3/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-400 text-center mx-auto mb-4"
              maxLength={6}
            />

            <Button
              onClick={handleVerifyClick}
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md transition-all duration-300 mx-auto"
              disabled={!isCodeValid || isVerifying}
            >
              {verifyButtonText}
            </Button>

            <div className="text-sm text-gray-600 mt-4">
              {timeLeft > 0 ? `Request new code in ${timeLeft} seconds` : "Didn't receive the code?"}
            </div>

            {timeLeft === 0 && (
              <button onClick={handleResendCode} className="text-blue-600 hover:text-blue-500 font-semibold mt-2">
                Request New Code
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

