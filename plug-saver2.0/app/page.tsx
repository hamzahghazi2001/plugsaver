"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WelcomePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      style={{ background: "var(--gradient-welcome)" }}
    >
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-white">Plug Saver</h1>
          <p className="text-lg text-white">
            Empower Your Home,
            <br />
            Save More Energy!
          </p>
        </div>

        <div className="space-y-4 pt-8">
          <Button asChild className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6 text-lg rounded-full">
            <Link href="/login">Login</Link>
          </Button>

          <Button
            asChild
            variant="secondary"
            className="w-full bg-white/20 hover:bg-white/30 text-white py-6 text-lg rounded-full"
          >
            <Link href="/register">Create Account</Link>
          </Button>
        </div>

        <p className="text-sm mt-8">
          By tapping Create Account or Login, I agree to the PlugSaver{" "}
          <Link href="/terms" className="underline">
            Terms and Conditions
          </Link>
          {" & "}
          <Link href="/privacy" className="underline">
            Privacy Agreements
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

