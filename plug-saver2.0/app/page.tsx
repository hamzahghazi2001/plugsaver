"use client"

import { useState, useEffect } from "react"

export default function WelcomePage() {
  const [isLoading, setIsLoading] = useState({ login: false, create: false })

  useEffect(() => {
    // Reset loading state when component mounts
    setIsLoading({ login: false, create: false })
  }, [])

  const handleNavigation = (path: string) => {
    if (path === "/login") setIsLoading({ ...isLoading, login: true })
    if (path === "/register") setIsLoading({ ...isLoading, create: true })
    window.location.href = path
  }

  return (
    <div
      className="fixed inset-0 h-screen w-screen flex flex-col items-center justify-between p-4 overflow-hidden"
      style={{
        background: "linear-gradient(to top, #4ADE80, #22D3EE, #3B82F6)",
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[20rem] px-4">
        <h1 className="text-[clamp(3rem,10vw,4rem)] font-bold mb-2 tracking-tighter text-white text-center">
          Plug Saver
        </h1>
        <div className="text-[clamp(1.25rem,5vw,1.5rem)] mb-16 opacity-90 leading-[1.2] text-white text-center">
          <p>Empower Your Home,</p>
          <p>Save More Energy!</p>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-4">
          <button
            onClick={() => handleNavigation("/login")}
            disabled={isLoading.login}
            className="w-full py-3 px-6 rounded-full bg-pink-600 text-white text-[clamp(0.875rem,4vw,1rem)] font-semibold shadow hover:bg-pink-700 transition-all duration-300 disabled:bg-pink-300 disabled:cursor-not-allowed"
          >
            {isLoading.login ? "Loading..." : "Login"}
          </button>
          <button
            onClick={() => handleNavigation("/register")}
            disabled={isLoading.create}
            className="w-full py-3 px-6 rounded-full bg-white/20 text-white text-[clamp(0.875rem,4vw,1rem)] font-semibold shadow backdrop-blur-[4px] hover:bg-white/30 transition-all duration-300 disabled:bg-white/10 disabled:cursor-not-allowed"
          >
            {isLoading.create ? "Loading..." : "Create Account"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-[clamp(0.75rem,2.5vw,0.875rem)] opacity-80 text-white text-center mt-4 px-4 w-full">
        <p>
          By tapping Create Account or Login, I agree to the PlugSaver{' '}
          <a href="/terms" className="text-pink-400 underline hover:text-pink-300">
            Terms and Conditions
          </a>{' '}
          &{' '}
          <a href="/privacy" className="text-pink-400 underline hover:text-pink-300">
            Privacy Agreements
          </a>
          .
        </p>
      </div>
    </div>
  )
}