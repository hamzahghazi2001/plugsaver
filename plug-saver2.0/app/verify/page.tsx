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
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (!email) {
      router.push("/register")
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
  }, [email, router])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        router.push("/login")
      } else {
        setError(data.error || "Invalid verification code")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleResendCode() {
    setError("")
    setLoading(true)
    setCanResend(false)
    setTimeLeft(30)

    try {
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
    <div className="min-h-screen flex flex-col p-6" style={{ background: "var(--gradient-welcome)" }}>
      <Link href="/register" className="text-white mb-8">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
        <p className="text-gray-200 mb-6">We've sent a verification code to {email}</p>

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
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-center text-2xl tracking-widest"
            />
          </div>

          <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white" disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-200">
            Didn't receive the code?{" "}
            {canResend ? (
              <button onClick={handleResendCode} className="text-pink-300 hover:text-pink-200" disabled={loading}>
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

