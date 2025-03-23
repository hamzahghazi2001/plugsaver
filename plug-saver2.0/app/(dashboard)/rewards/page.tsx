"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Star, Zap, Flame, Leaf, Gift, Users, Globe, HomeIcon, Moon, Sun, Wind } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

// Define the type for leaderboard data
type LeaderboardType = "household" | "local" | "global"
type LeaderboardEntry = { name: string; points: number; rank?: number; avatar?: string }
type LeaderboardData = Record<LeaderboardType, LeaderboardEntry[]>

// Define the type for badges
type BadgeType = {
  icon: React.ComponentType<{ className?: string }>
  name: string
  color: string
  earned: boolean
  description?: string
  progress?: number
  pointThreshold?: number
}

export default function RewardsPage() {
  const [rewards_id, setRewardsId] = useState<number | null>(null)
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>("household")
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null)
  const [badges, setBadges] = useState<BadgeType[] | null>(null)
  const [userPoints, setUserPoints] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })
  const [carbonFootprint, setCarbonFootprint] = useState<number | null>(null)

  // Load dark mode preference from localStorage on initial render
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setIsDarkMode(savedDarkMode)
    // Apply dark mode class to the document element
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // Save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString())
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  useEffect(() => {
    // Add CSS animation for subtle pulse effect
    const style = document.createElement("style")
    style.innerHTML = `
      @keyframes pulse-subtle {
        0% { opacity: 1; }
        50% { opacity: 0.8; }
        100% { opacity: 1; }
      }
      .animate-pulse-subtle {
        animation: pulse-subtle 2s infinite ease-in-out;
      }
      
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      .animate-float {
        animation: float 6s infinite ease-in-out;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    const putrewards = async () => {
      if (rewards_id === null) return

      try {
        const response = await fetch("http://localhost:8000/points_and_badges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rewards_id }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Backend response:", data)
      } catch (error) {
        console.error("Error:", error)
      }
    }

    const fetchrewards = async () => {
      if (rewards_id === null) return null

      try {
        const response = await fetch(`http://localhost:8000/api/auth/get_rewards?rewards_id=${rewards_id}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (!data.success) {
          console.error("Backend error:", data.message)
          return null
        }

        return data
      } catch (error) {
        console.error("Error fetching rewards:", error)
        return null
      }
    }

    const putinwebsite = async () => {
      setIsLoading(true)
      try {
        await putrewards()
        const rewards = await fetchrewards()
        console.log(rewards)

        if (rewards && rewards.points !== undefined) {
          setUserPoints(rewards.points)

          const householdData = Array.isArray(rewards.household)
            ? rewards.household.map((entry: LeaderboardEntry, i: number) => ({
                ...entry,
                rank: i + 1,
                avatar: `https://i.pravatar.cc/150?img=${i + 5}`,
              }))
            : []

          const localData = Array.isArray(rewards.local)
            ? rewards.local.map((entry: LeaderboardEntry, i: number) => ({
                ...entry,
                rank: i + 1,
                avatar: `https://i.pravatar.cc/150?img=${i + 20}`,
              }))
            : []

          const globalData = Array.isArray(rewards.global)
            ? rewards.global.map((entry: LeaderboardEntry, i: number) => ({
                ...entry,
                rank: i + 1,
                avatar: `https://i.pravatar.cc/150?img=${i + 30}`,
              }))
            : []

          setLeaderboardData({
            household: householdData,
            local: localData,
            global: globalData,
          })

          // Set default badges if none provided from backend
          setBadges([
            {
              icon: Zap,
              name: "Beginner",
              color: "bg-blue-500/30 text-blue-300",
              earned: rewards.points >= 1000,
              description: "Earn 1000 energy points",
              progress: rewards.points >= 1000 ? 100 : Math.min(Math.round((rewards.points / 1000) * 100), 99),
              pointThreshold: 1000,
            },
            {
              icon: Flame,
              name: "Enthusiast",
              color: "bg-orange-500/30 text-orange-300",
              earned: rewards.points >= 2500,
              description: "Earn 2500 energy points",
              progress: rewards.points >= 2500 ? 100 : Math.min(Math.round((rewards.points / 2500) * 100), 99),
              pointThreshold: 2500,
            },
            {
              icon: Leaf,
              name: "Eco Warrior",
              color: "bg-green-500/30 text-green-300",
              earned: rewards.points >= 5000,
              description: "Earn 5000 energy points",
              progress: rewards.points >= 5000 ? 100 : Math.min(Math.round((rewards.points / 5000) * 100), 99),
              pointThreshold: 5000,
            },
            {
              icon: Star,
              name: "Energy Master",
              color: "bg-yellow-500/30 text-yellow-300",
              earned: rewards.points >= 7500,
              description: "Earn 7500 energy points",
              progress: rewards.points >= 7500 ? 100 : Math.min(Math.round((rewards.points / 7500) * 100), 99),
              pointThreshold: 7500,
            },
            {
              icon: Trophy,
              name: "Champion",
              color: "bg-purple-500/30 text-purple-300",
              earned: rewards.points >= 10000,
              description: "Earn 10000 energy points",
              progress: rewards.points >= 10000 ? 100 : Math.min(Math.round((rewards.points / 10000) * 100), 99),
              pointThreshold: 10000,
            },
          ])
        } else {
          console.error("Invalid rewards data:", rewards)
          // Set fallback data for development/testing
          setMockData()
        }

        // Fetch carbon footprint data
        try {
          const householdCode = localStorage.getItem("household_code")
          if (householdCode) {
            const efficiencyResponse = await fetch(`/api/auth/efficiency_metrics?household_code=${householdCode}`)
            if (efficiencyResponse.ok) {
              const efficiencyData = await efficiencyResponse.json()
              if (efficiencyData.success && efficiencyData.data.data.carbonFootprint) {
                setCarbonFootprint(efficiencyData.data.data.carbonFootprint)
              }
            }
          }
        } catch (error) {
          console.error("Error fetching carbon footprint:", error)
        }
      } catch (error) {
        console.error("Error in putinwebsite:", error)
        // Set fallback data if API fails
        setMockData()
      } finally {
        setIsLoading(false)
      }
    }

    const setMockData = () => {
      setUserPoints(0)

      setLeaderboardData({
        household: [
          { name: "Sarah Johnson", points: 750, rank: 1, avatar: "https://i.pravatar.cc/150?img=5" },
          { name: "You", points: 320, rank: 2, avatar: "https://i.pravatar.cc/150?img=8" },
          { name: "Mike Peterson", points: 280, rank: 3, avatar: "https://i.pravatar.cc/150?img=12" },
          { name: "Emma Wilson", points: 210, rank: 4, avatar: "https://i.pravatar.cc/150?img=9" },
        ],
        local: [
          { name: "Alex Morgan", points: 820, rank: 1, avatar: "https://i.pravatar.cc/150?img=33" },
          { name: "Taylor Swift", points: 680, rank: 2, avatar: "https://i.pravatar.cc/150?img=29" },
          { name: "You", points: 320, rank: 5, avatar: "https://i.pravatar.cc/150?img=8" },
          { name: "Chris Evans", points: 310, rank: 6, avatar: "https://i.pravatar.cc/150?img=15" },
          { name: "Lisa Johnson", points: 290, rank: 7, avatar: "https://i.pravatar.cc/150?img=23" },
        ],
        global: [
          { name: "John Smith", points: 980, rank: 1, avatar: "https://i.pravatar.cc/150?img=3" },
          { name: "Maria Garcia", points: 870, rank: 2, avatar: "https://i.pravatar.cc/150?img=31" },
          { name: "David Lee", points: 760, rank: 3, avatar: "https://i.pravatar.cc/150?img=4" },
          { name: "You", points: 320, rank: 156, avatar: "https://i.pravatar.cc/150?img=8" },
        ],
      })

      // New badges based on point milestones
      setBadges([
        {
          icon: Zap,
          name: "Beginner",
          color: "bg-blue-500/30 text-blue-300",
          earned: userPoints >= 1000,
          description: "Earn 1000 energy points",
          progress: userPoints >= 1000 ? 100 : Math.min(Math.round((userPoints / 1000) * 100), 99),
          pointThreshold: 1000,
        },
        {
          icon: Flame,
          name: "Enthusiast",
          color: "bg-orange-500/30 text-orange-300",
          earned: userPoints >= 2500,
          description: "Earn 2500 energy points",
          progress: userPoints >= 2500 ? 100 : Math.min(Math.round((userPoints / 2500) * 100), 99),
          pointThreshold: 2500,
        },
        {
          icon: Leaf,
          name: "Eco Warrior",
          color: "bg-green-500/30 text-green-300",
          earned: userPoints >= 5000,
          description: "Earn 5000 energy points",
          progress: userPoints >= 5000 ? 100 : Math.min(Math.round((userPoints / 5000) * 100), 99),
          pointThreshold: 5000,
        },
        {
          icon: Star,
          name: "Energy Master",
          color: "bg-yellow-500/30 text-yellow-300",
          earned: userPoints >= 7500,
          description: "Earn 7500 energy points",
          progress: userPoints >= 7500 ? 100 : Math.min(Math.round((userPoints / 7500) * 100), 99),
          pointThreshold: 7500,
        },
        {
          icon: Trophy,
          name: "Champion",
          color: "bg-purple-500/30 text-purple-300",
          earned: userPoints >= 10000,
          description: "Earn 10000 energy points",
          progress: userPoints >= 10000 ? 100 : Math.min(Math.round((userPoints / 10000) * 100), 99),
          pointThreshold: 10000,
        },
      ])
      setCarbonFootprint(32)
    }

    const storedUserId = localStorage.getItem("user_id")
    if (storedUserId) {
      const userId = Number.parseInt(storedUserId)
      console.log(userId)
      if (!isNaN(userId)) {
        setRewardsId(userId)
        putinwebsite()
      } else {
        console.error("Invalid user ID found in local storage")
        setMockData()
        setIsLoading(false)
      }
    } else {
      console.error("No user ID found in local storage")
      setMockData()
      setIsLoading(false)
    }
  }, [rewards_id])

  // Calculate progress to next level
  const nextLevelThreshold = 10000
  const progressPercentage = (userPoints / nextLevelThreshold) * 100

  // Get icon for current leaderboard type
  const getLeaderboardIcon = () => {
    switch (leaderboardType) {
      case "household":
        return <HomeIcon className="w-5 h-5 text-pink-300" />
      case "local":
        return <Users className="w-5 h-5 text-blue-300" />
      case "global":
        return <Globe className="w-5 h-5 text-green-300" />
      default:
        return <Users className="w-5 h-5 text-pink-300" />
    }
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
        <h1 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? "text-gray-900" : "text-white"}`}>
          Rewards & Achievements
        </h1>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full backdrop-blur-md bg-white/10 border-white/20"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6 animate-in fade-in duration-700">
        {/* Points Card */}
        <Card
          className={`md:col-span-2 p-6 overflow-hidden relative group rounded-xl transition-all duration-300
          ${
            isDarkMode
              ? "backdrop-blur-lg bg-gray-900/40 border border-gray-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              : "backdrop-blur-lg bg-white/60 border border-white/50 shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)]"
          }`}
        >
          {/* Decorative background elements */}
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-pink-500/10 group-hover:bg-pink-500/20 blur-2xl transition-all duration-300"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 blur-2xl transition-all duration-300"></div>
          <div className="absolute right-1/4 bottom-0 w-24 h-24 rounded-full bg-pink-500/5 blur-xl"></div>

          {/* Add a subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='1' fillRule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
            }}
          ></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative">
            <div>
              <h2
                className={`text-xl font-semibold mb-1 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                <Trophy className="w-5 h-5 text-yellow-400" /> Your Energy Points
              </h2>
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Keep saving energy to earn more points and badges
              </p>
            </div>

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? "bg-white/10 border border-white/20" : "bg-white/40 border border-white/50"
              }`}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center"
              >
                <Zap className="w-5 h-5 text-pink-300" />
              </motion.div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Current Points
                </p>
                <p className="text-2xl font-bold">{isLoading ? "..." : userPoints}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mb-4">
            {[0, 2500, 5000, 7500, 10000].map((points, i) => (
              <div key={points} className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${userPoints >= points ? "bg-pink-500" : "bg-gray-400/50"}`} />
                <span className="text-xs mt-1">{points}</span>
              </div>
            ))}
          </div>

          <div className="mb-2 flex justify-between items-center">
            <p className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Progress to next level</p>
            <p className="text-xs font-medium">
              {userPoints} / {nextLevelThreshold} points
            </p>
          </div>

          <div
            className={`h-3 rounded-full overflow-hidden p-0.5 backdrop-blur-sm mb-6 ${
              isDarkMode ? "bg-gray-700/50 border border-white/5" : "bg-gray-200/70 border border-white/30"
            }`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              className="h-full bg-gradient-to-r from-pink-500 via-pink-400 to-purple-400 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse-subtle"></div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Stat cards */}
            <div
              className={`rounded-lg p-3 ${
                isDarkMode
                  ? "bg-white/10 border border-white/20 backdrop-blur-sm"
                  : "bg-white/40 border border-white/40 backdrop-blur-sm"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-full ${isDarkMode ? "bg-pink-500/20" : "bg-pink-500/10"} flex items-center justify-center`}
                >
                  <Trophy className="w-4 h-4 text-pink-300" />
                </div>
                <p className="text-sm font-medium">Rank</p>
              </div>
              <p className="text-2xl font-bold">
                {isLoading
                  ? "..."
                  : leaderboardData?.[leaderboardType].find((entry) => entry.name === "You")?.rank || "-"}
                <span className={`text-sm font-normal ml-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {leaderboardType === "household" ? "in home" : leaderboardType === "local" ? "in area" : "globally"}
                </span>
              </p>
            </div>

            <div
              className={`rounded-lg p-3 ${
                isDarkMode
                  ? "bg-white/10 border border-white/20 backdrop-blur-sm"
                  : "bg-white/40 border border-white/40 backdrop-blur-sm"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-full ${isDarkMode ? "bg-purple-500/20" : "bg-purple-500/10"} flex items-center justify-center`}
                >
                  <Award className="w-4 h-4 text-purple-300" />
                </div>
                <p className="text-sm font-medium">Badges</p>
              </div>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : badges?.filter((b) => b.earned).length || 0}
                <span className="text-lg font-normal mx-1">/</span>
                11
                <span className={`text-sm font-normal ml-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  earned
                </span>
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Unlock more badges by earning points
              </p>
            </div>

            <div
              className={`rounded-lg p-3 ${
                isDarkMode
                  ? "bg-white/10 border border-white/20 backdrop-blur-sm"
                  : "bg-white/40 border border-white/40 backdrop-blur-sm"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-full ${isDarkMode ? "bg-blue-500/20" : "bg-blue-500/10"} flex items-center justify-center`}
                >
                  <Flame className="w-4 h-4 text-blue-300" />
                </div>
                <p className="text-sm font-medium">Streak</p>
              </div>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : "-"}
                <span className={`text-sm font-normal ml-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  days
                </span>
              </p>
            </div>

            <div
              className={`rounded-lg p-3 ${
                isDarkMode
                  ? "bg-white/10 border border-white/20 backdrop-blur-sm"
                  : "bg-white/40 border border-white/40 backdrop-blur-sm"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-full ${isDarkMode ? "bg-green-500/20" : "bg-green-500/10"} flex items-center justify-center`}
                >
                  <Wind className="w-4 h-4 text-green-300" />
                </div>
                <p className="text-sm font-medium">Carbon Footprint</p>
              </div>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : carbonFootprint || "-"}
                <span className={`text-sm font-normal ml-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>kg</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Badges Preview Card */}
        <Card
          className={`p-6 overflow-hidden relative group rounded-xl transition-all duration-300
          ${
            isDarkMode
              ? "backdrop-blur-lg bg-gray-900/40 border border-gray-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              : "backdrop-blur-lg bg-white/60 border border-white/50 shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)]"
          }`}
        >
          <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 blur-2xl transition-all duration-300"></div>

          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2
              className={`text-lg font-semibold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              <Award className="w-5 h-5 text-yellow-400" /> Your Badges
            </h2>
            <Link
              href="/badges"
              className={`text-xs transition-colors px-2 py-1 rounded-full ${
                isDarkMode
                  ? "text-pink-300 hover:text-pink-200 bg-pink-500/20"
                  : "text-pink-600 hover:text-pink-700 bg-pink-500/10"
              }`}
            >
              View All
            </Link>
          </div>

          <div className="space-y-4 relative z-10">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              badges?.slice(0, 3).map((badge, i) => (
                <motion.div
                  key={badge.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isDarkMode
                      ? badge.earned
                        ? "bg-white/10 border border-white/20"
                        : "bg-white/5 border border-white/10"
                      : badge.earned
                        ? "bg-white/40 border border-white/30"
                        : "bg-white/20 border border-white/20"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${badge.color}`}>
                    {React.createElement(badge.icon as React.ComponentType<{ className?: string }>, {
                      className: "w-5 h-5",
                    })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{badge.name}</p>
                      {badge.earned && (
                        <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                          Earned
                        </Badge>
                      )}
                    </div>
                    <p className={`text-xs truncate ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {badge.description}
                    </p>
                    {!badge.earned && badge.pointThreshold !== undefined && (
                      <div>
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {userPoints}/{badge.pointThreshold} points
                        </p>
                        <div
                          className={`w-full h-1.5 rounded-full mt-1 overflow-hidden ${
                            isDarkMode ? "bg-gray-700/50" : "bg-gray-300/50"
                          }`}
                        >
                          <div
                            className="h-full bg-pink-500/50 rounded-full"
                            style={{ width: `${badge.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Leaderboard Card */}
      <Card
        className={`mb-6 p-6 overflow-hidden relative group rounded-xl transition-all duration-300
        ${
          isDarkMode
            ? "backdrop-blur-lg bg-gray-900/40 border border-gray-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            : "backdrop-blur-lg bg-white/60 border border-white/50 shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)]"
        }`}
      >
        <div className="absolute -left-20 -top-20 w-40 h-40 rounded-full bg-purple-500/5 group-hover:bg-purple-500/10 blur-3xl transition-all duration-300"></div>
        <div className="absolute -right-20 -bottom-20 w-40 h-40 rounded-full bg-pink-500/5 group-hover:bg-pink-500/10 blur-3xl transition-all duration-300"></div>

        <div className="flex items-center justify-between mb-6 relative">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-pink-500/30 to-purple-600/30 p-2.5 rounded-full shadow-inner">
              {getLeaderboardIcon()}
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Leaderboard</h2>
              <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {leaderboardType === "household"
                  ? "See how you rank in your household"
                  : leaderboardType === "local"
                    ? "Compare with others in your area"
                    : "See the top energy savers globally"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={leaderboardType === "household" ? "default" : "outline"}
              size="sm"
              onClick={() => setLeaderboardType("household")}
              className={
                leaderboardType === "household"
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md hover:shadow-xl transition-all duration-300"
                  : `${
                      isDarkMode
                        ? "bg-white/10 hover:bg-white/20 text-white border-white/20"
                        : "bg-white/40 hover:bg-white/60 text-gray-800 border-white/40"
                    } transition-all duration-300`
              }
            >
              <HomeIcon className="w-4 h-4 mr-1" /> Home
            </Button>
            <Button
              variant={leaderboardType === "local" ? "default" : "outline"}
              size="sm"
              onClick={() => setLeaderboardType("local")}
              className={
                leaderboardType === "local"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-xl transition-all duration-300"
                  : `${
                      isDarkMode
                        ? "bg-white/10 hover:bg-white/20 text-white border-white/20"
                        : "bg-white/40 hover:bg-white/60 text-gray-800 border-white/40"
                    } transition-all duration-300`
              }
            >
              <Users className="w-4 h-4 mr-1" /> Local
            </Button>
            <Button
              variant={leaderboardType === "global" ? "default" : "outline"}
              size="sm"
              onClick={() => setLeaderboardType("global")}
              className={
                leaderboardType === "global"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-xl transition-all duration-300"
                  : `${
                      isDarkMode
                        ? "bg-white/10 hover:bg-white/20 text-white border-white/20"
                        : "bg-white/40 hover:bg-white/60 text-gray-800 border-white/40"
                    } transition-all duration-300`
              }
            >
              <Globe className="w-4 h-4 mr-1" /> Global
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-3 relative z-10">
            {leaderboardData?.[leaderboardType].map(({ name, points, rank, avatar }, i) => {
              const isUser = name === "You"
              return (
                <motion.div
                  key={`${name}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-lg backdrop-blur-sm ${
                    isUser
                      ? isDarkMode
                        ? "bg-pink-500/20 border border-pink-500/30"
                        : "bg-pink-500/10 border border-pink-500/20"
                      : isDarkMode
                        ? "bg-white/10 border border-white/10 hover:bg-white/15 transition-all duration-300"
                        : "bg-white/30 border border-white/30 hover:bg-white/40 transition-all duration-300"
                  }`}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      i === 0
                        ? "bg-yellow-500/30 text-yellow-300"
                        : i === 1
                          ? "bg-gray-400/30 text-gray-300"
                          : i === 2
                            ? "bg-amber-600/30 text-amber-300"
                            : isDarkMode
                              ? "bg-white/20 text-white"
                              : "bg-white/40 text-gray-700"
                    } font-bold text-sm`}
                  >
                    {rank || i + 1}
                  </div>

                  <Avatar
                    className={`w-10 h-10 ${isDarkMode ? "border-2 border-white/20" : "border-2 border-white/50"}`}
                  >
                    <AvatarImage src={avatar} />
                    <AvatarFallback>{name[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${isUser ? "text-white" : ""}`}>{name}</p>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-pink-400" />
                      <p className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{points} points</p>
                    </div>
                  </div>

                  {i < 3 && (
                    <div className="hidden sm:flex items-center gap-1">
                      {i === 0 && <Trophy className="w-5 h-5 text-yellow-400" />}
                      {i === 1 && <Award className="w-5 h-5 text-gray-400" />}
                      {i === 2 && <Award className="w-5 h-5 text-amber-600" />}
                    </div>
                  )}

                  {isUser && (
                    <Badge
                      className={`${isDarkMode ? "bg-pink-500/30 text-white border-pink-500/50" : "bg-pink-500/20 text-pink-700 border-pink-500/30"}`}
                    >
                      You
                    </Badge>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Achievements Section */}
      <section className="animate-in fade-in duration-700 delay-300">
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            <Gift className="w-5 h-5 text-pink-400" /> Achievements
          </h2>
          <Link
            href="/badges"
            className={`text-sm transition-colors ${
              isDarkMode ? "text-pink-300 hover:text-pink-200" : "text-pink-600 hover:text-pink-700"
            }`}
          >
            View All Badges
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {isLoading
            ? Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className={`h-32 rounded-lg animate-pulse ${isDarkMode ? "bg-white/10" : "bg-white/30"}`}
                  ></div>
                ))
            : badges
                ?.sort((a, b) => (a.pointThreshold || 0) - (b.pointThreshold || 0))
                .map(({ icon: Icon, name, color, earned, progress, description, pointThreshold }, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg backdrop-blur-sm ${
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
                      <div className="text-center">
                        <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {userPoints}/{pointThreshold} points
                        </p>
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {progress}% complete
                        </p>
                      </div>
                    )}

                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${
                        isDarkMode ? "bg-white/5" : "bg-white/20"
                      }`}
                    >
                      <p className="text-xs text-center px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {description}
                      </p>
                    </div>
                  </motion.div>
                ))}
        </div>
      </section>
    </div>
  )
}

