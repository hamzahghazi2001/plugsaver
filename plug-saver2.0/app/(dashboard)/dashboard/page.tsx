"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Zap, Wind, DollarSign, TrendingDown, TrendingUp } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

type PeriodType = "day" | "week" | "month" | "year"

const DashboardPage = () => {
  const [period, setPeriod] = useState<PeriodType>("week")
  const [energyData, setEnergyData] = useState<Record<PeriodType, { name: string; value: number }[]> | null>(null)
  const [roomsData, setRoomsData] = useState<{ name: string; value: number }[] | null>(null)
  const [applianceData, setApplianceData] = useState<{ name: string; usage: number }[] | null>(null)

  useEffect(() => {
    // Fetch data from Supabase
    fetchData()
  }, [])

  const fetchData = async () => {
    // TODO: Implement the actual fetch logic from Supabase
    // For now, we'll just set some dummy data
    setEnergyData({
      day: [],
      week: [],
      month: [],
      year: [],
    })
    setRoomsData([])
    setApplianceData([])
  }

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: "var(--gradient-dashboard)" }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
        <Button size="icon" variant="ghost" onClick={fetchData}>
          <RefreshCw className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        {(["year", "month", "week", "day"] as const).map((p) => (
          <Button
            key={p}
            variant={period === p ? "default" : "secondary"}
            className="flex-1"
            onClick={() => setPeriod(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="gradient-card p-4">
          <h2 className="font-medium mb-4">Energy Consumption</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData ? energyData[period] : []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} name="kWh" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="gradient-card p-4">
          <h2 className="font-medium mb-4">Rooms Consumption</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomsData || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(roomsData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="gradient-card p-4">
          <h2 className="font-medium mb-4">Device Category Usage</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applianceData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="usage" fill="#82ca9d" name="kWh" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="gradient-card p-4">
          <h2 className="font-medium mb-4">Energy Efficiency Score</h2>
          <div className="flex items-center justify-center h-64 md:h-80">
            <div className="text-center">
              
             
              
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card className="gradient-card p-4">
          <h3 className="font-medium mb-2">Electricity Usage</h3>
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-yellow-400 mr-4" />
            <div>
              
            </div>
          </div>
        </Card>

        <Card className="gradient-card p-4">
          <h3 className="font-medium mb-2">Peak Power Usage</h3>
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-red-400 mr-4" />
            <div>
              
            </div>
          </div>
        </Card>

        <Card className="gradient-card p-4">
          <h3 className="font-medium mb-2">Carbon Footprint</h3>
          <div className="flex items-center">
            <Wind className="w-8 h-8 text-green-400 mr-4" />
            <div>
             
            </div>
          </div>
        </Card>

        <Card className="gradient-card p-4">
          <h3 className="font-medium mb-2">Cost Savings</h3>
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-400 mr-4" />
            <div>
              
            </div>
          </div>
        </Card>
      </div>

      <Card className="gradient-card mt-6 p-4">
        <h2 className="font-medium mb-4">Energy-Saving Tips</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Adjust your thermostat by 1°C to save up to 10% on your heating bill.</li>
          <li>Replace old appliances with energy-efficient models to reduce electricity consumption.</li>
          <li>Use natural light when possible and switch to LED bulbs for artificial lighting.</li>
          <li>Unplug electronics and appliances when not in use to avoid phantom energy drain.</li>
        </ul>
      </Card>
    </div>
  )
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default DashboardPage