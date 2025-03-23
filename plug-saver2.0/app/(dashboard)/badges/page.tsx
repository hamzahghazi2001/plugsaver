"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Star, Zap, Flame, Leaf, Lightbulb, Gift, Globe, HomeIcon, Sun } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

// Define the type for badges
type BadgeType = {
  icon: React.ComponentType<{ className?: string }>
  name: string
  color: string
  earned: boolean
  description: string
  progress?: number
  pointThreshold: number
}

export default function BadgesPage() {
  const [userPoints, setUserPoints] = useState<number>(0)
  const [badges, setBadges] = useState<BadgeType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true"
    }
    return false
  })

  // Apply dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        const storedUserId = localStorage.getItem("user_id")
        if (storedUserId) {
          const userId = Number.parseInt(storedUserId)
          if (!isNaN(userId)) {
            try {
              const response = await fetch(`http://localhost:8000/api/auth/get_rewards?rewards_id=${userId}`)
              if (response.ok) {
                const data = await response.json()
                if (data.success && data.points !== undefined) {
                  setUserPoints(data.points)
                  generateBadges(data.points)
                } else {
                  throw new Error("Invalid data format")
                }
              } else {
                throw new Error("Failed to fetch user data")
              }
            } catch (error) {
              console.error("Error fetching user data:", error)
              // Fallback to mock data
              setUserPoints(0)
              generateBadges(0)
            }
          } else {
            throw new Error("Invalid user ID")
          }
        } else {
          throw new Error("No user ID found")
        }
      } catch (error) {
        console.error("Error:", error)
        // Fallback to mock data
        setUserPoints(0)
        generateBadges(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const generateBadges = (points: number) => {
    const badgesList: BadgeType[] = [
      {
        icon: Zap,
        name: "Beginner",
        color: "bg-blue-500/30 text-blue-300",
        earned: points >= 1000,
        description: "Earn 1000 energy points by reducing your energy consumption",
        progress: points >= 1000 ? 100 : Math.min(Math.round((points / 1000) * 100), 99),
        pointThreshold: 1000,
      },
      {
        icon: Flame,
        name: "Enthusiast",
        color: "bg-orange-500/30 text-orange-300",
        earned: points >= 2500,
        description: "Reach 2500 energy points through consistent energy-saving habits",
        progress: points >= 2500 ? 100 : Math.min(Math.round((points / 2500) * 100), 99),
        pointThreshold: 2500,
      },
      {
        icon: Leaf,
        name: "Eco Warrior",
        color: "bg-green-500/30 text-green-300",
        earned: points >= 5000,
        description: "Achieve 5000 energy points and make a significant environmental impact",
        progress: points >= 5000 ? 100 : Math.min(Math.round((points / 5000) * 100), 99),
        pointThreshold: 5000,
      },
      {
        icon: Star,
        name: "Energy Master",
        color: "bg-yellow-500/30 text-yellow-300",
        earned: points >= 7500,
        description: "Reach 7500 energy points and become a master of energy efficiency",
        progress: points >= 7500 ? 100 : Math.min(Math.round((points / 7500) * 100), 99),
        pointThreshold: 7500,
      },
      {
        icon: Trophy,
        name: "Champion",
        color: "bg-purple-500/30 text-purple-300",
        earned: points >= 10000,
        description: "Achieve the ultimate goal of 10000 energy points",
        progress: points >= 10000 ? 100 : Math.min(Math.round((points / 10000) * 100), 99),
        pointThreshold: 10000,
      },
      // Additional badges that could be earned through specific actions
      {
        icon: Lightbulb,
        name: "Bright Idea",
        color: "bg-yellow-400/30 text-yellow-300",
        earned: points >= 2000,
        description: "Suggest energy-saving tips that help others save energy",
        progress: points >= 2000 ? 100 : Math.min(Math.round((points / 2000) * 100), 99),
        pointThreshold: 2000,
      },
      {
        icon: Sun,
        name: "Solar Champion",
        color: "bg-amber-500/30 text-amber-300",
        earned: points >= 3500,
        description: "Utilize solar energy to reduce your carbon footprint",
        progress: points >= 3500 ? 100 : Math.min(Math.round((points / 3500) * 100), 99),
        pointThreshold: 3500,
      },
      {
        icon: Award,
        name: "Top Performer",
        color: "bg-blue-400/30 text-blue-300",
        earned: points >= 4500,
        description: "Rank in the top 10% of energy savers in your area",
        progress: points >= 4500 ? 100 : Math.min(Math.round((points / 4500) * 100), 99),
        pointThreshold: 4500,
      },
      {
        icon: Gift,
        name: "Energy Gifter",
        color: "bg-pink-400/30 text-pink-300",
        earned: points >= 6000,
        description: "Help others save energy through community initiatives",
        progress: points >= 6000 ? 100 : Math.min(Math.round((points / 6000) * 100), 99),
        pointThreshold: 6000,
      },
      {
        icon: Globe,
        name: "Global Impact",
        color: "bg-emerald-500/30 text-emerald-300",
        earned: points >= 8500,
        description: "Make a global impact with your energy-saving efforts",
        progress: points >= 8500 ? 100 : Math.min(Math.round((points / 8500) * 100), 99),
        pointThreshold: 8500,
      },
      {
        icon: HomeIcon,
        name: "Smart Home",
        color: "bg-indigo-500/30 text-indigo-300",
        earned: points >= 9000,
        description: "Optimize your home for maximum energy efficiency",
        progress: points >= 9000 ? 100 : Math.min(Math.round((points / 9000) * 100), 99),
        pointThreshold: 9000,
      },
    ]

    setBadges(badgesList)
  }

  return (
    <div
      className={`min-h-screen p-6 md:p-10 ${isDarkMode ? "text-white" : "text-gray-900"}`}
      style={{
        background: "rgb(63,120,251)",
        backgroundImage: "radial-gradient(circle, rgba(63,120,251,1) 0%, rgba(252,70,202,1) 97%)",
      }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          All Badges
        </h1>
        <Link
          href="/rewards"
          className={`px-4 py-2 rounded-full transition-colors ${
            isDarkMode
              ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
              : "bg-white/40 hover:bg-white/60 text-gray-800 border border-white/40"
          }`}
        >
          Back to Rewards
        </Link>
      </div>

      <Card
        className={`p-6 overflow-hidden relative rounded-xl transition-all duration-300
        ${
          isDarkMode
            ? "backdrop-blur-lg bg-gray-900/40 border border-gray-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            : "backdrop-blur-lg bg-white/60 border border-white/50 shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)]"
        }`}
      >
        {/* Decorative background elements */}
        <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-pink-500/10 blur-2xl"></div>
        <div className="absolute -left-20 -bottom-20 w-40 h-40 rounded-full bg-purple-500/10 blur-2xl"></div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                  isDarkMode ? "bg-white/10 border border-white/20" : "bg-white/40 border border-white/50"
                }`}
              >
                <Zap className="w-5 h-5 text-pink-400" />
                <span className="font-medium">Your Points: {userPoints}</span>
              </div>
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Earn badges by accumulating energy points through energy-saving actions. Each badge represents a
                milestone in your energy-saving journey.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 relative z-10">
              {badges
                .sort((a, b) => a.pointThreshold - b.pointThreshold)
                .map(({ icon: Icon, name, color, earned, description, progress, pointThreshold }, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={`flex flex-col items-center p-4 rounded-lg ${
                      earned
                        ? isDarkMode
                          ? "bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/20"
                          : "bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-white/40"
                        : isDarkMode
                          ? "bg-white/5 border border-white/10"
                          : "bg-white/30 border border-white/30"
                    } hover:bg-white/15 transition-all duration-300 relative overflow-hidden group`}
                  >
                    {!earned && progress && (
                      <div
                        className="absolute bottom-0 left-0 h-1 bg-pink-500/50"
                        style={{ width: `${progress}%` }}
                      ></div>
                    )}

                    <motion.div
                      className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mb-3 ${earned ? "animate-float" : ""}`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-8 h-8" />
                    </motion.div>

                    <p className={`text-sm font-medium text-center ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {name}
                    </p>

                    {earned ? (
                      <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-500/30">Earned</Badge>
                    ) : (
                      <div className="text-center mt-2">
                        <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
                          {userPoints}/{pointThreshold} points
                        </Badge>
                      </div>
                    )}

                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${
                        isDarkMode ? "bg-gray-900/80" : "bg-white/80"
                      } p-3`}
                    >
                      <p className={`text-xs text-center ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        {description}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

