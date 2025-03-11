"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ConnectivityIssuesPage() {
  const router = useRouter()
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the support ticket to your backend
    console.log("Support ticket submitted:", description)
    // Navigate to success page
    router.push("/settings/support/ticket-submitted")
  }

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
        <Link href="/settings/support" className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-white absolute left-1/2 transform -translate-x-1/2">Support</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-white">
        <h2 className="text-2xl font-medium text-center mb-8 text-orange-500">Connectivity Issues</h2>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-700">Describe Your Issue</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Maximum 150 Words"
              className="min-h-[200px] border-gray-200 rounded-xl"
              maxLength={150 * 6} // Approximate character limit for 150 words
            />
          </div>

          <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6 rounded-full">
            Submit Ticket
          </Button>
        </form>
      </div>
    </div>
  )
}

