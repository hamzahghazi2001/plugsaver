"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Zap, Droplet, Wind, DollarSign, TrendingDown, TrendingUp } from "lucide-react"
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

// At the top of the file, add this type definition
type PeriodType = "day" | "week" | "month" | "year"

// Update the data object type
const data: Record<PeriodType, { name: string; value: number }[]> = {
  day: [
    { name: "00:00", value: 300 },
    { name: "04:00", value: 200 },
    { name: "08:00", value: 400 },
    { name: "12:00", value: 600 },
    { name: "16:00", value: 800 },
    { name: "20:00", value: 500 },
    { name: "23:59", value: 400 },
  ],
  week: [
    { name: "Mon", value: 2400 },
    { name: "Tue", value: 1398 },
    { name: "Wed", value: 9800 },
    { name: "Thu", value: 3908 },
    { name: "Fri", value: 4800 },
    { name: "Sat", value: 3800 },
    { name: "Sun", value: 4300 },
  ],
  month: [
    { name: "Week 1", value: 4000 },
    { name: "Week 2", value: 3000 },
    { name: "Week 3", value: 2000 },
    { name: "Week 4", value: 2780 },
  ],
  year: [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 2000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 1890 },
    { name: "Jun", value: 2390 },
    { name: "Jul", value: 3490 },
    { name: "Aug", value: 3490 },
    { name: "Sep", value: 2490 },
    { name: "Oct", value: 1490 },
    { name: "Nov", value: 2490 },
    { name: "Dec", value: 3490 },
  ],
}

// Update the useState call to use the PeriodType
const DashboardPage = () => {
  const [period, setPeriod] = useState<PeriodType>("week")

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: "var(--gradient-dashboard)" }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
        <Button size="icon" variant="ghost">
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
              <LineChart data={data[period]}>
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
          <h2 className="font-medium mb-4">Energy Sources</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={energySourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {energySourceData.map((entry, index) => (
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
          <h2 className="font-medium mb-4">Appliance Usage</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applianceData}>
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
              <div className="text-6xl md:text-7xl font-bold text-green-400">85</div>
              <div className="text-xl md:text-2xl mt-2">Excellent</div>
              <div className="text-sm md:text-base text-gray-300 mt-1">Top 10% in your area</div>
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
              <p className="text-2xl font-bold">1,234 kWh</p>
              <p className="text-sm text-gray-300">This month</p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-green-400">
            <TrendingDown className="w-4 h-4 mr-1" />
            <span className="text-sm">5% less than last month</span>
          </div>
        </Card>

        <Card className="gradient-card p-4">
          <h3 className="font-medium mb-2">Water Usage</h3>
          <div className="flex items-center">
            <Droplet className="w-8 h-8 text-blue-400 mr-4" />
            <div>
              <p className="text-2xl font-bold">5,678 L</p>
              <p className="text-sm text-gray-300">This month</p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-red-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">2% more than last month</span>
          </div>
        </Card>

        <Card className="gradient-card p-4">
          <h3 className="font-medium mb-2">Carbon Footprint</h3>
          <div className="flex items-center">
            <Wind className="w-8 h-8 text-green-400 mr-4" />
            <div>
              <p className="text-2xl font-bold">233 kg</p>
              <p className="text-sm text-gray-300">CO2 this month</p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-green-400">
            <TrendingDown className="w-4 h-4 mr-1" />
            <span className="text-sm">10% less than last month</span>
          </div>
        </Card>

        <Card className="gradient-card p-4">
          <h3 className="font-medium mb-2">Cost Savings</h3>
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-400 mr-4" />
            <div>
              <p className="text-2xl font-bold">$87.50</p>
              <p className="text-sm text-gray-300">Saved this month</p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-green-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">15% more than last month</span>
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

const energySourceData = [
  { name: "Solar", value: 400 },
  { name: "Wind", value: 300 },
  { name: "Grid", value: 300 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const applianceData = [
  { name: "HVAC", usage: 450 },
  { name: "Lighting", usage: 200 },
  { name: "Kitchen", usage: 300 },
  { name: "Electronics", usage: 250 },
  { name: "Other", usage: 150 },
]

export default DashboardPage