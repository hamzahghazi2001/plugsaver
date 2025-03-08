"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [twoFACode, setTwoFACode] = useState("")
  const [isCodeValid, setIsCodeValid] = useState(false)
  const [email, setEmail] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [showReferralModal, setShowReferralModal] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const name = formData.get("name") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      // Send registration data to the backend
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          confirmpass: confirmPassword,
          name,
        }),
      });

      const data = await response.json()

      if (data.success) {
        //setShow2FAModal(true)
        //startTimer()
        router.push(`/verify?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&password=${encodeURIComponent(password)}`);
      } else {
        setError(data.error || "An error occurred")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
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

  const handleVerifyClick = async () => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          userverifycode: twoFACode,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        router.push("/roleselect"); // Redirect to role selection page
      } else {
        setError(data.error || "Verification failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleReferralSubmit = () => {
    console.log("Referral Code Submitted:", referralCode)
    setShowReferralModal(false)
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Registration</h1>
        <p className="text-sm text-gray-600 mb-6">Enter your name, email, and password to register</p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          </div>

          <div className="space-y-2">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center justify-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 border border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the Terms and Conditions
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Creating account..." : "SIGN IN"}
          </Button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-500 font-semibold">
            Login
          </Link>
        </div>

        {/* Referral Code Button */}
        <div className="mt-4">
          <Button
            onClick={() => setShowReferralModal(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-md transition-all duration-300"
          >
            Enter Referral Code
          </Button>
        </div>
      </div>

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center relative">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
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
              disabled={!isCodeValid}
            >
              Verify
            </Button>

            <div className="text-sm text-gray-600 mt-4">
              {timeLeft > 0
                ? `Request new code in ${timeLeft} seconds`
                : "Didn't receive the code?"}
            </div>

            {timeLeft === 0 && (
              <button
                onClick={handleResendCode}
                className="text-blue-600 hover:text-blue-500 font-semibold mt-2"
              >
                Request New Code
              </button>
            )}
          </div>
        </div>
      )}

      {/* Referral Code Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center relative">
            {/* Close Button */}
            <button
              onClick={() => setShowReferralModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              ×
            </button>

            <h2 className="text-xl font-bold text-green-600 mb-2">Enter Referral Code</h2>
            <p className="text-sm text-gray-600 mb-4">If you have a referral code, enter it below.</p>

            <Input
              type="text"
              placeholder="Referral Code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 placeholder:text-gray-400 mb-4"
            />

            <Button
              onClick={handleReferralSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-md transition-all duration-300"
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}