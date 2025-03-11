"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TicketSubmittedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Gradient Header */}
      <div
        className="p-6 relative"
        style={{
          background: "linear-gradient(90deg, #FF6B6B 0%, #FFB347 100%)",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 className="text-2xl font-bold text-white text-center">Support</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
        <div className="max-w-md text-center space-y-12">
          <h2 className="text-2xl font-medium">Your ticket has been submitted to the support team.</h2>

          <Button asChild className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6 rounded-full">
            <Link href="/settings/support">Done</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

