"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const name = searchParams.get("name")
  const password = searchParams.get("password")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [twoFACode, setTwoFACode] = useState("")

  useEffect(() => {
    if (!email || !name || !password) {
      router.push("/register") // Redirect to register if data is missing
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          setCanResend(true)
          clearInterval(timer)
          return 0
        }
        return time - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [email, name, password, router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          password,
          userverifycode: twoFACode,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push("/login") // Redirect to login page
      } else {
        setError(data.error || "Invalid verification code")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setError("")
    setLoading(true)
    setCanResend(false)
    setTimeLeft(30)

    try {
      // Call the backend to resend the verification code
      const response = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || "Failed to resend code")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify your email</h1>
        <p className="text-sm text-gray-600 mb-6">We've sent a verification code to {email}</p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="hidden" name="email" value={email || ""} />

          <div className="space-y-2">
            <Input
              name="code"
              type="text"
              placeholder="Enter verification code"
              required
              maxLength={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-400 text-center text-2xl tracking-widest"
              value={twoFACode}
              onChange={(e) => setTwoFACode(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{" "}
            {canResend ? (
              <button
                onClick={handleResendCode}
                className="text-blue-600 hover:text-blue-500 font-semibold"
                disabled={loading}
              >
                Resend Code
              </button>
            ) : (
              <span>Resend code in {timeLeft}s</span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}