"use client"

import Link from "next/link"
import { ArrowLeft, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const dashboardOptions = [
  { label: "Customize", href: "/settings/dashboard/customize" },
  { label: "Preferences", href: "/settings/dashboard/preferences" },
  { label: "Unit of Measurement", href: "/settings/dashboard/units" },
  { label: "Language", href: "/settings/dashboard/language" },
  { label: "Graph Display Options", href: "/settings/dashboard/graph-options" },
  { label: "Consumption Breakdown", href: "/settings/dashboard/consumption" },
  { label: "Theme", href: "/settings/dashboard/theme" },
]

export default function DashboardSettingsPage() {
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
        <h1 className="text-2xl font-bold text-white absolute left-1/2 transform -translate-x-1/2">Dashboard</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-white">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input placeholder="Search Dashboard Settings" className="pl-10 border-gray-200 rounded-full" />
        </div>

        {/* Dashboard Options */}
        <div className="space-y-4">
          {dashboardOptions.map(({ label, href }) => (
            <Link key={label} href={href} className="flex items-center justify-between p-3 border-b border-gray-100">
              <span className="text-gray-800">{label}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

