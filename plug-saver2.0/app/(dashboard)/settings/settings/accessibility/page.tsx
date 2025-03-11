"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function AccessibilityPage() {
  const [highContrast, setHighContrast] = useState(false)

  // Update the document class when high contrast changes
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }, [highContrast])

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${highContrast ? "bg-black" : "bg-white"}`}
    >
      {/* Gradient Header */}
      <div
        className="flex items-center p-6 relative"
        style={{
          background: highContrast ? "black" : "linear-gradient(90deg, #9370DB 0%, #8A2BE2 100%)",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Link href="/settings" className={highContrast ? "text-cyan-400" : "text-white"}>
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1
          className={`text-2xl font-bold absolute left-1/2 transform -translate-x-1/2 ${
            highContrast ? "text-cyan-400" : "text-white"
          }`}
        >
          Accessibility
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {/* Accessibility Icon */}
        <div className="flex justify-center mb-12">
          <div
            className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${
              highContrast ? "border-yellow-400" : "border-black"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke={highContrast ? "#FFEB3B" : "black"}
              strokeWidth="2"
              className="w-12 h-12"
            >
              <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
              <path d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0" />
              <path d="M12 9v-4" />
              <path d="M12 19v-4" />
              <path d="M9 12h-4" />
              <path d="M19 12h-4" />
            </svg>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-6">
          {[
            { label: "Font Size", href: "/settings/accessibility/font-size" },
            { label: "Color Options", href: "/settings/accessibility/colors" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center justify-between p-3 border-b ${
                highContrast ? "border-yellow-400 text-yellow-400" : "border-gray-100 text-gray-800"
              }`}
            >
              <span>{label}</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          ))}

          {/* High Contrast Toggle */}
          <div
            className={`flex items-center justify-between p-3 border-b ${
              highContrast ? "border-yellow-400 text-yellow-400" : "border-gray-100 text-gray-800"
            }`}
          >
            <span>High Contrasts Display</span>
            <Switch
              checked={highContrast}
              onCheckedChange={setHighContrast}
              className={highContrast ? "bg-cyan-400" : ""}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

