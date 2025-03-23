"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DollarSign, Trophy, Ghost, Target, Zap } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

// Define the type for leaderboard data
type LeaderboardType = "household" | "local" | "global"
type LeaderboardEntry = { name: string; points: number }
type LeaderboardData = Record<LeaderboardType, LeaderboardEntry[]>

// Define the type for badges
type Badge = { icon: React.ComponentType, name: string, color: string, earned: boolean }

export default function RewardsPage() {
  const [rewards_id, setRewardsId] = useState<number | null>(null)
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>("household")
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null)
  const [badges, setBadges] = useState<Badge[] | null>(null)
  const [userPoints, setUserPoints] = useState<number>(0)

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
  
        const data = await response.json();
  
        console.log("Backend response:", data)
      } catch (error) {
        console.error("Error:", error)
      }
    }
  
    const fetchrewards = async () => {
      if (rewards_id === null) return null;
    
      try {
        const response = await fetch(`http://localhost:8000/api/auth/get_rewards?rewards_id=${rewards_id}`);
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
    
        if (!data.success) {
          console.error("Backend error:", data.message);
          return null;
        }
    
        return data;
      } catch (error) {
        console.error("Error fetching rewards:", error);
        return null;
      }
    };
  
    const putinwebsite = async () => {
      try {
        await putrewards();
        const rewards = await fetchrewards();
        console.log(rewards);
    
        if (rewards && rewards.points !== undefined) {
          setUserPoints(rewards.points);
    
          const householdData = Array.isArray(rewards.household) ? rewards.household : [];
          const localData = Array.isArray(rewards.local) ? rewards.local : [];
          const globalData = Array.isArray(rewards.global) ? rewards.global : [];
    
          setLeaderboardData({
            household: householdData,
            local: localData,
            global: globalData,
          });
        } else {
          console.error("Invalid rewards data:", rewards);
        }
      } catch (error) {
        console.error("Error in putinwebsite:", error);
      }
    };

    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      const userId = parseInt(storedUserId);
      console.log(userId)
      if (!isNaN(userId)) {
        setRewardsId(userId);
        putinwebsite();  // Pass the userId to putinwebsite
      } else {
        console.error("Invalid user ID found in local storage");
      }
    } else {
      console.error("No user ID found in local storage");
    }
  }, [rewards_id]);

  return (
    <div className="min-h-screen p-6" style={{ background: "var(--gradient-rewards)" }}>
      <h1 className="text-2xl font-bold mb-6">Rewards</h1>

      <Card className="gradient-card mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div>
            {/* 
              User's Energy Points
              Data Structure Required:
              - Number (total points)
            */}
            <p className="text-3xl font-bold">{userPoints}</p>
            <p className="text-sm text-gray-300">Energy Points</p>
          </div>
          <div className="ml-auto">
            <p className="text-sm text-right">Top Badge</p>
            <DollarSign className="w-6 h-6 ml-auto text-yellow-400" />
          </div>
        </div>

        <div className="relative mb-4 h-2 bg-gray-200 rounded-full">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "70%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between mb-4">
          {[0, 100, 250, 500].map((points, i) => (
            <div key={points} className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full ${userPoints && userPoints >= points ? "bg-pink-500" : "bg-gray-400"}`} />
              <span className="text-xs mt-1">{points}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {(["Global", "Local", "Household"] as const).map((filter) => (
            <Button
              key={filter}
              variant={leaderboardType.toLowerCase() === filter.toLowerCase() ? "default" : "secondary"}
              className="flex-1"
              onClick={() => setLeaderboardType(filter.toLowerCase() as LeaderboardType)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="gradient-card mb-6">
        <h2 className="font-medium mb-4">Leaderboard</h2>
        <div className="space-y-4">
          {leaderboardData ? (
            leaderboardData[leaderboardType].map(({ name, points }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="flex items-center gap-4 bg-white/10 rounded-lg p-3"
              >
                <span className="w-6 h-6 flex items-center justify-center bg-pink-500 rounded-full text-sm font-bold">
                  {i + 1}
                </span>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={`https://i.pravatar.cc/40?img=${i + 1}`} />
                  <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                <span className="flex-1 font-medium">{name}</span>
                <span className="text-lg font-bold">{points}</span>
              </motion.div>
            ))
          ) : (
            <p>Loading leaderboard data...</p>
          )}
        </div>
      </Card>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium">Top Badges</h2>
          <Link href="/badges" className="text-white hover:text-pink-200 transition-colors">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {badges ? (
            badges.map(({ icon: Icon, name, color, earned }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className={`flex flex-col items-center ${earned ? "" : "opacity-50"}`}
              >
                <div className={`w-12 h-12 rounded-full bg-white/10 flex items-center justify-center ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs mt-2 text-center">{name}</span>
              </motion.div>
            ))
          ) : (
            <p>Loading badges...</p>
          )}
        </div>
      </section>
    </div>
  )
}