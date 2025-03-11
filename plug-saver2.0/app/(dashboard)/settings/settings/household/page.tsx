"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

// This would typically come from your backend
const HOUSEHOLD_QR_CODE = "/placeholder.svg?height=200&width=200"

export default function HouseholdPage() {
  const handleShareCode = () => {
    // Implement share functionality
    console.log("Sharing household code")
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Gradient Header */}
      <div
        className="flex items-center p-6 relative"
        style={{
          background: "linear-gradient(90deg, #9370DB 0%, #8A2BE2 100%)",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Link href="/settings" className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-white absolute left-1/2 transform -translate-x-1/2">Household</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-white">
        {/* Household Options */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-4 text-purple-500">Household Options</h2>
          <div className="space-y-4">
            {[
              { label: "View Household Code", href: "/settings/household/code" },
              { label: "Household Configuration", href: "/settings/household/config" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="flex items-center justify-between p-3 border-b border-gray-100">
                <span className="text-gray-800">{label}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </section>

        {/* Members Options */}
        <section className="mb-12">
          <h2 className="text-xl font-medium mb-4 text-purple-500">Members Options</h2>
          <div className="space-y-4">
            {[
              { label: "Manage Members", href: "/settings/household/members" },
              { label: "Assign Permission", href: "/settings/household/permissions" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="flex items-center justify-between p-3 border-b border-gray-100">
                <span className="text-gray-800">{label}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </section>

        {/* QR Code Section */}
        <section className="text-center">
          <h2 className="text-xl font-medium mb-6">Household Invite QR Code</h2>
          <div className="mb-6">
            <Image
              src={HOUSEHOLD_QR_CODE || "/placeholder.svg"}
              alt="Household Invite QR Code"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
          <Button variant="link" onClick={handleShareCode} className="text-blue-500 hover:text-blue-600">
            Share Code
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </section>
      </div>
    </div>
  )
}

