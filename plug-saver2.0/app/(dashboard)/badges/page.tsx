"use client"

import { Card } from "@/components/ui/card"
import { Medal, DollarSign, Trophy, Ghost, Target, Zap, Leaf, Sun, Wind, Droplet, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const allBadges = [
  { icon: DollarSign, name: "Money Saver", color: "text-yellow-400", earned: true },
  { icon: Trophy, name: "Top Performer", color: "text-blue-400", earned: true },
  { icon: Target, name: "Goal Achiever", color: "text-green-400", earned: true },
  { icon: Ghost, name: "Energy Ghost", color: "text-purple-400", earned: false },
  { icon: Zap, name: "Power User", color: "text-red-400", earned: false },
  { icon: Leaf, name: "Eco Warrior", color: "text-green-500", earned: true },
  { icon: Sun, name: "Solar Champion", color: "text-yellow-500", earned: false },
  { icon: Wind, name: "Wind Enthusiast", color: "text-blue-300", earned: true },
  { icon: Droplet, name: "Water Conserver", color: "text-blue-500", earned: false },
  { icon: Lightbulb, name: "Bright Idea", color: "text-yellow-300", earned: true },
  { icon: Medal, name: "Energy Master", color: "text-pink-400", earned: false },
]

export default function BadgesPage() {
  return (
    <div className="min-h-screen p-6" style={{ background: "var(--gradient-rewards)" }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Badges</h1>
        <Link href="/rewards" className="text-white hover:text-pink-200 transition-colors">
          Back to Rewards
        </Link>
      </div>

      <Card className="gradient-card p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {allBadges.map(({ icon: Icon, name, color, earned }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`flex flex-col items-center ${earned ? "" : "opacity-50"}`}
            >
              <div className={`w-16 h-16 rounded-full bg-white/10 flex items-center justify-center ${color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <span className="text-sm mt-2 text-center font-medium">{name}</span>
              <span className="text-xs mt-1 text-center text-gray-300">{earned ? "Earned" : "Not Earned"}</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}

