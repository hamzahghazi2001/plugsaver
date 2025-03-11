"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ChevronRight, Search } from "lucide-react"

const supportCategories = [
  "Connectivity Issues",
  "Energy Monitoring Inaccuracies",
  "Notifications and Alerts",
  "Firmware and Updates",
  "Account and Data Issues",
  "Statistics and Reports",
  "Rewards and Incentives",
  "Others",
]

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Gradient Header */}
      <div
        className="flex items-center p-6 relative"
        style={{
          background: "linear-gradient(90deg, #FF6B6B 0%, #FFB347 100%)",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Link href="/settings" className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-white absolute left-1/2 transform -translate-x-1/2">Support</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-white">
        <h2 className="text-2xl font-medium text-center mb-6 text-orange-500">How can we help?</h2>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input placeholder="Search Support Topics" className="pl-10 border-gray-300 rounded-full" />
        </div>

        {/* Support Categories */}
        <div className="space-y-4">
          {supportCategories.map((category, index) => (
            <Link
              key={index}
              href={`/settings/support/${category.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex items-center justify-between p-3 border-b border-gray-100"
            >
              <span className="text-gray-800">{category}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

